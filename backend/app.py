import os
import sys
import json
import uuid
import hmac
import hashlib
import time
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from database import get_db_connection, db_session, init_db_schema
from recommendation_engine import HybridRecommender, ContentBasedRecommender, calculate_offline_metrics

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
# Enable CORS for the Next.js frontend. Configure additional origins with
# RECOMIND_CORS_ORIGINS (comma-separated) when deploying.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        'RECOMIND_CORS_ORIGINS',
        'http://localhost:3000,http://127.0.0.1:3000',
    ).split(',')
    if origin.strip()
]
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}}, supports_credentials=True)

SECRET_KEY = os.environ.get('RECOMIND_SECRET_KEY')
if not SECRET_KEY:
    SECRET_KEY = 'recomind-academic-secret-key-2026'
    print('WARNING: RECOMIND_SECRET_KEY is not set. Using the development key.')

# Prototype convenience: allow the X-Demo-User-Id header when no bearer token
# is present. Disable in production with RECOMIND_ALLOW_DEMO_AUTH=0.
ALLOW_DEMO_AUTH = os.environ.get('RECOMIND_ALLOW_DEMO_AUTH', '1') not in ('0', 'false', 'False')

# Initialize singletons for recommender
recommender = HybridRecommender()
content_recommender = ContentBasedRecommender()

# Ensure schema exists on startup
init_db_schema()

# -----------------------------------------------------------------------------
# Security & Token Authentication Helpers
# -----------------------------------------------------------------------------
def generate_auth_token(user_id: str) -> str:
    """Generate a signed HMAC token containing user_id and expiration timestamp."""
    expires_at = int(time.time()) + (7 * 24 * 3600) # 7 days
    payload = f"{user_id}:{expires_at}"
    signature = hmac.new(SECRET_KEY.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload}:{signature}"

def verify_auth_token(token: str):
    """Verify signed token and return user_id if valid."""
    if not token:
        return None
    try:
        parts = token.split(':')
        if len(parts) != 3:
            return None
        user_id, expires_at_str, signature = parts
        expires_at = int(expires_at_str)
        if time.time() > expires_at:
            return None # Expired
        expected = hmac.new(SECRET_KEY.encode('utf-8'), f"{user_id}:{expires_at}".encode('utf-8'), hashlib.sha256).hexdigest()
        if hmac.compare_digest(expected, signature):
            return user_id
    except Exception:
        return None
    return None

def token_required(f):
    """Decorator to enforce authenticated access and identify active user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        elif 'token' in request.args:
            token = request.args.get('token')

        user_id = verify_auth_token(token)
        if not user_id:
            # Check for demo fallback if configured for prototype testing
            demo_fallback = request.headers.get('X-Demo-User-Id') if ALLOW_DEMO_AUTH else None
            if demo_fallback:
                user_id = demo_fallback
            else:
                return jsonify({'error': 'Unauthorized. Please sign in.'}), 401

        request.current_user_id = user_id
        return f(*args, **kwargs)
    return decorated

def optional_auth(f):
    """Decorator to extract user_id if present, without blocking unauthenticated guests."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        user_id = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            user_id = verify_auth_token(token)
        if not user_id and ALLOW_DEMO_AUTH:
            user_id = request.headers.get('X-Demo-User-Id')
        request.current_user_id = user_id or 'user_demo_001'
        return f(*args, **kwargs)
    return decorated

# -----------------------------------------------------------------------------
# 1. Authentication Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    # Server-side validation
    if not full_name:
        return jsonify({'error': 'Full name is required.'}), 400
    if not email or '@' not in email or '.' not in email:
        return jsonify({'error': 'Valid email address is required.'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long.'}), 400

    user_id = f"user_{uuid.uuid4().hex[:12]}"
    password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        with db_session() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'An account with this email already exists.'}), 409

            cursor.execute("""
            INSERT INTO users (id, full_name, email, password_hash)
            VALUES (?, ?, ?, ?)
            """, (user_id, full_name, email, password_hash))
    except Exception as e:
        return jsonify({'error': 'Failed to create user account.', 'details': str(e)}), 500

    token = generate_auth_token(user_id)
    return jsonify({
        'message': 'Account created successfully.',
        'token': token,
        'user': {
            'id': user_id,
            'full_name': full_name,
            'email': email
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    token = generate_auth_token(user['id'])
    return jsonify({
        'message': 'Login successful.',
        'token': token,
        'user': {
            'id': user['id'],
            'full_name': user['full_name'],
            'email': user['email']
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    user_id = request.current_user_id
    conn = get_db_connection()
    user = conn.execute("SELECT id, full_name, email, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    if not user:
        return jsonify({'error': 'User not found.'}), 404

    return jsonify({
        'id': user['id'],
        'full_name': user['full_name'],
        'email': user['email'],
        'created_at': user['created_at']
    }), 200

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    if not email:
        return jsonify({'error': 'Email is required.'}), 400

    conn = get_db_connection()
    user = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    # Always return a clean success message to prevent user enumeration attacks
    return jsonify({
        'message': 'If an account with that email exists, password reset instructions have been sent.'
    }), 200

# -----------------------------------------------------------------------------
# 2. Products & Catalog Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    brand = request.args.get('brand')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_rating = request.args.get('min_rating', type=float)
    search_q = request.args.get('search', '').strip().lower()
    sort_by = request.args.get('sort', 'default')

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if brand and brand.lower() != 'all':
        query += " AND LOWER(brand) = LOWER(?)"
        params.append(brand)

    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)

    if min_rating is not None and min_rating > 0:
        query += " AND rating >= ?"
        params.append(min_rating)

    if search_q:
        query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(keywords) LIKE ?)"
        like_param = f"%{search_q}%"
        params.extend([like_param, like_param, like_param, like_param])

    if sort_by == 'price-asc':
        query += " ORDER BY price ASC"
    elif sort_by == 'price-desc':
        query += " ORDER BY price DESC"
    elif sort_by == 'rating':
        query += " ORDER BY rating DESC"
    else:
        query += " ORDER BY reviews_count DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    products = []
    for r in rows:
        p = dict(r)
        p['keywords'] = json.loads(p['keywords']) if p.get('keywords') else []
        p['tags'] = json.loads(p['tags']) if p.get('tags') else []
        products.append(p)

    return jsonify(products), 200

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product_detail(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'Product not found.'}), 404

    product = dict(row)
    product['keywords'] = json.loads(product['keywords']) if product.get('keywords') else []
    product['tags'] = json.loads(product['tags']) if product.get('tags') else []

    # Get similar products via TF-IDF
    similar = content_recommender.get_similar_products(product_id, top_n=4)
    product['similar_products'] = similar

    return jsonify(product), 200

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT category as name, COUNT(*) as count, MIN(image_url) as image_url
    FROM products
    GROUP BY category
    ORDER BY count DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows]), 200

@app.route('/api/brands', methods=['GET'])
def get_brands():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT brand FROM products ORDER BY brand ASC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([r['brand'] for r in rows]), 200

# -----------------------------------------------------------------------------
# 3. Wishlist Management (Per-User Persistent, Prevents Duplicates)
# -----------------------------------------------------------------------------
@app.route('/api/wishlist', methods=['GET'])
@token_required
def get_wishlist():
    user_id = request.current_user_id
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.*, w.created_at as saved_at
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        p = dict(r)
        p['keywords'] = json.loads(p['keywords']) if p.get('keywords') else []
        p['tags'] = json.loads(p['tags']) if p.get('tags') else []
        items.append(p)

    return jsonify(items), 200

@app.route('/api/wishlist', methods=['POST'])
@token_required
def add_to_wishlist():
    user_id = request.current_user_id
    data = request.get_json() or {}
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'error': 'product_id is required.'}), 400

    with db_session() as conn:
        cursor = conn.cursor()
        # Verify product exists
        cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Product does not exist.'}), 404

        # Insert or ignore duplicate per Section 34
        cursor.execute("""
        INSERT OR IGNORE INTO wishlist (user_id, product_id)
        VALUES (?, ?)
        """, (user_id, product_id))

        # Also record wishlist interaction for collaborative filtering
        cursor.execute("""
        INSERT INTO product_interactions (user_id, product_id, interaction_type)
        VALUES (?, ?, 'wishlist')
        """, (user_id, product_id))

    return jsonify({'message': 'Product added to wishlist.', 'product_id': product_id}), 201

@app.route('/api/wishlist/<product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(product_id):
    user_id = request.current_user_id
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", (user_id, product_id))

    return jsonify({'message': 'Product removed from wishlist.', 'product_id': product_id}), 200

# -----------------------------------------------------------------------------
# 4. User Shopping Preferences
# -----------------------------------------------------------------------------
@app.route('/api/preferences', methods=['GET'])
@token_required
def get_preferences():
    user_id = request.current_user_id
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT category FROM user_preferences WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([r['category'] for r in rows]), 200

@app.route('/api/preferences', methods=['POST'])
@token_required
def update_preferences():
    user_id = request.current_user_id
    data = request.get_json() or {}
    categories = data.get('categories', [])

    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM user_preferences WHERE user_id = ?", (user_id,))
        for cat in categories:
            if cat:
                cursor.execute("INSERT OR IGNORE INTO user_preferences (user_id, category) VALUES (?, ?)", (user_id, cat))

    return jsonify({'message': 'Preferences saved successfully.', 'categories': categories}), 200

# -----------------------------------------------------------------------------
# 5. Product Interactions & Recently Viewed
# -----------------------------------------------------------------------------
@app.route('/api/interactions', methods=['POST'])
@token_required
def record_interaction():
    user_id = request.current_user_id
    data = request.get_json() or {}
    product_id = data.get('product_id')
    interaction_type = data.get('interaction_type', 'view')

    if not product_id:
        return jsonify({'error': 'product_id is required.'}), 400
    if interaction_type not in ('view', 'click', 'wishlist', 'purchase'):
        return jsonify({'error': 'Invalid interaction type.'}), 400

    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO product_interactions (user_id, product_id, interaction_type)
        VALUES (?, ?, ?)
        """, (user_id, product_id, interaction_type))

    return jsonify({'message': 'Interaction recorded.'}), 201

@app.route('/api/interactions/recently-viewed', methods=['GET'])
@token_required
def get_recently_viewed():
    user_id = request.current_user_id
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.*, MAX(i.timestamp) as last_viewed
    FROM product_interactions i
    JOIN products p ON i.product_id = p.id
    WHERE i.user_id = ? AND i.interaction_type = 'view'
    GROUP BY p.id
    ORDER BY last_viewed DESC
    LIMIT 20
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        p = dict(r)
        p['keywords'] = json.loads(p['keywords']) if p.get('keywords') else []
        p['tags'] = json.loads(p['tags']) if p.get('tags') else []
        items.append(p)

    return jsonify(items), 200

@app.route('/api/interactions/clear', methods=['DELETE'])
@token_required
def clear_interactions():
    user_id = request.current_user_id
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM product_interactions WHERE user_id = ?", (user_id,))

    return jsonify({'message': 'Browsing history cleared successfully.'}), 200

# -----------------------------------------------------------------------------
# 6. Ratings
# -----------------------------------------------------------------------------
@app.route('/api/ratings', methods=['POST'])
@token_required
def record_rating():
    user_id = request.current_user_id
    data = request.get_json() or {}
    product_id = data.get('product_id')
    rating_val = data.get('rating')

    if not product_id or rating_val is None:
        return jsonify({'error': 'product_id and rating are required.'}), 400

    try:
        val = float(rating_val)
        if val < 1.0 or val > 5.0:
            return jsonify({'error': 'Rating must be between 1.0 and 5.0.'}), 400
    except ValueError:
        return jsonify({'error': 'Rating must be a numeric value.'}), 400

    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO ratings (user_id, product_id, rating_value)
        VALUES (?, ?, ?)
        """, (user_id, product_id, val))

    return jsonify({'message': 'Rating submitted successfully.', 'product_id': product_id, 'rating': val}), 200

# -----------------------------------------------------------------------------
# 7. Machine Learning Recommendation Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/recommendations', methods=['GET'])
@optional_auth
def get_recommendations():
    user_id = request.current_user_id
    top_n = request.args.get('limit', default=6, type=int)
    alpha = request.args.get('alpha', default=None, type=float)
    beta = request.args.get('beta', default=None, type=float)

    recommendations = recommender.recommend(
        user_id=user_id,
        top_n=top_n,
        alpha=alpha,
        beta=beta
    )

    return jsonify({
        'user_id': user_id,
        'alpha': alpha or 0.6,
        'beta': beta or 0.4,
        'count': len(recommendations),
        'recommendations': recommendations
    }), 200

@app.route('/api/evaluation', methods=['GET'])
def get_evaluation_metrics():
    """Returns offline recommendation benchmark metrics and model comparison."""
    metrics = calculate_offline_metrics()
    return jsonify(metrics), 200

# -----------------------------------------------------------------------------
# Health Check
# -----------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Recomind Python Backend',
        'version': '1.0.0',
        'ml_frameworks': ['scikit-learn', 'pandas', 'numpy']
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Recomind Flask API server on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=False)
