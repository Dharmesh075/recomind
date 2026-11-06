import json
import sqlite3
import os
from werkzeug.security import generate_password_hash
from database import init_db_schema, db_session, DB_PATH

PRODUCTS_DATA = [
    {
        'id': 'prod-001',
        'name': 'Acoustic Minimal Noise-Canceling Headphones',
        'brand': 'Sora Audio',
        'category': 'Audio',
        'price': 4999,
        'formatted_price': '₹4,999',
        'rating': 4.9,
        'reviews_count': 342,
        'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'keywords': ['headphones', 'audio', 'wireless', 'bluetooth', 'minimal', 'noise cancelling', 'sora'],
        'tags': ['Best Seller', '98% Match', 'Audio'],
        'description': 'Engineered for uncompromising acoustic fidelity with hybrid active noise cancellation, bespoke 40mm beryllium drivers, and a featherweight ergonomic headband for all-day listening.'
    },
    {
        'id': 'prod-002',
        'name': 'Horizon Minimalist Smartwatch Series 5',
        'brand': 'Krono Labs',
        'category': 'Wearables',
        'price': 8499,
        'formatted_price': '₹8,499',
        'rating': 4.8,
        'reviews_count': 289,
        'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'keywords': ['smartwatch', 'watch', 'wearable', 'fitness', 'health', 'titanium', 'krono'],
        'tags': ['Top Match', 'Wearables'],
        'description': 'Sculpted grade-5 titanium chassis featuring an edge-to-edge sapphire AMOLED display, continuous cardiovascular biometrics, and multi-band GPS navigation.'
    },
    {
        'id': 'prod-003',
        'name': 'Everyday Canvas & Top-Grain Leather Backpack',
        'brand': 'Atelier Nord',
        'category': 'Lifestyle',
        'price': 3299,
        'formatted_price': '₹3,299',
        'rating': 4.9,
        'reviews_count': 412,
        'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'keywords': ['backpack', 'bag', 'canvas', 'leather', 'commute', 'laptop', 'nord'],
        'tags': ['Popular', 'Lifestyle'],
        'description': 'Weather-resistant 18oz waxed cotton canvas bag fitted with vegetable-tanned leather trim, magnetic fidlock buckles, and a dedicated suspended 16-inch laptop pocket.'
    },
    {
        'id': 'prod-004',
        'name': 'Artisan Ceramic Pour-Over Coffee Brewer',
        'brand': 'Kanso Studio',
        'category': 'Home & Living',
        'price': 1899,
        'formatted_price': '₹1,899',
        'rating': 4.7,
        'reviews_count': 178,
        'image_url': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'keywords': ['coffee', 'brewer', 'ceramic', 'kitchen', 'artisan', 'pour over', 'kanso'],
        'tags': ['Staff Pick', 'Home'],
        'description': 'Handcrafted stoneware dripper with internal spiral turbulence ridges, maximizing thermal stability and extraction consistency for specialty coffee lovers.'
    },
    {
        'id': 'prod-005',
        'name': 'Precision Wireless Mechanical Keyboard (75%)',
        'brand': 'Keyflow',
        'category': 'Workspace',
        'price': 5499,
        'formatted_price': '₹5,499',
        'rating': 4.9,
        'reviews_count': 520,
        'image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        'keywords': ['keyboard', 'mechanical', 'wireless', 'workspace', 'desk', 'tech', 'typing'],
        'tags': ['95% Match', 'Workspace'],
        'description': 'Gasket-mounted aluminum frame mechanical keyboard featuring factory-lubed tactile switches, PBT dye-sub keycaps, and ultra-low-latency 2.4GHz wireless connection.'
    },
    {
        'id': 'prod-006',
        'name': 'Nordic Oak & Wool Ergonomic Desk Mat',
        'brand': 'Atelier Nord',
        'category': 'Workspace',
        'price': 1699,
        'formatted_price': '₹1,699',
        'rating': 4.8,
        'reviews_count': 195,
        'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        'keywords': ['desk mat', 'wool', 'felt', 'workspace', 'desk pad', 'nordic'],
        'tags': ['Workspace', 'Eco-friendly'],
        'description': 'Premium natural merino wool felt pad laminated with anti-slip natural Portuguese cork base, providing plush wrist cushioning and tabletop protection.'
    },
    {
        'id': 'prod-007',
        'name': 'Spatial Studio Wireless Earbuds with ANC',
        'brand': 'Sora Audio',
        'category': 'Audio',
        'price': 3499,
        'formatted_price': '₹3,499',
        'rating': 4.7,
        'reviews_count': 310,
        'image_url': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        'keywords': ['earbuds', 'wireless', 'audio', 'earphones', 'anc', 'spatial', 'sora'],
        'tags': ['Audio', 'Compact'],
        'description': 'Pocket-sized true wireless earbuds with custom 11mm graphene dynamic transducers, personalized spatial audio tracking, and wireless charging case.'
    },
    {
        'id': 'prod-008',
        'name': 'Solid Cast Aluminum Laptop Stand',
        'brand': 'Form & Function',
        'category': 'Workspace',
        'price': 2199,
        'formatted_price': '₹2,199',
        'rating': 4.9,
        'reviews_count': 260,
        'image_url': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        'keywords': ['laptop stand', 'aluminum', 'ergonomic', 'workspace', 'desk'],
        'tags': ['Ergonomics', 'Workspace'],
        'description': 'Precision milled from a single billet of aircraft-grade aluminum, elevating laptop displays to optimal 15cm eye level while providing passive thermal cooling.'
    },
    {
        'id': 'prod-009',
        'name': 'Double-Walled Insulated Travel Tumbler (500ml)',
        'brand': 'Kanso Studio',
        'category': 'Home & Living',
        'price': 1299,
        'formatted_price': '₹1,299',
        'rating': 4.8,
        'reviews_count': 145,
        'image_url': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        'keywords': ['tumbler', 'mug', 'coffee', 'travel', 'insulated', 'thermos', 'kitchen'],
        'tags': ['Home', 'Travel'],
        'description': 'Double-walled vacuum insulated flask with ceramic interior coating to preserve original brew aromas without metallic aftertaste. Keeps hot for 12h, cold for 24h.'
    },
    {
        'id': 'prod-010',
        'name': 'Automatic Mechanical Field Watch 38mm',
        'brand': 'Krono Labs',
        'category': 'Wearables',
        'price': 11499,
        'formatted_price': '₹11,499',
        'rating': 4.9,
        'reviews_count': 88,
        'image_url': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        'keywords': ['watch', 'analog', 'mechanical', 'automatic', 'sapphire', 'field watch'],
        'tags': ['Classic', 'Wearables'],
        'description': 'Self-winding mechanical automatic movement with double-domed anti-reflective sapphire crystal, SuperLuminova markers, and quick-release vegetable-tanned Horween leather band.'
    },
    {
        'id': 'prod-011',
        'name': 'Japanese Matte Stoneware Teapot (650ml)',
        'brand': 'Kanso Studio',
        'category': 'Home & Living',
        'price': 2499,
        'formatted_price': '₹2,499',
        'rating': 4.8,
        'reviews_count': 94,
        'image_url': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        'keywords': ['teapot', 'tea', 'stoneware', 'ceramic', 'japan', 'kitchen'],
        'tags': ['Home & Living', 'Artisan'],
        'description': 'Hand-thrown matte kyusu teapot fitted with an integrated stainless steel micro-mesh basket, designed for loose-leaf green tea and herbal infusions.'
    },
    {
        'id': 'prod-012',
        'name': 'Minimalist Italian Vegetable-Tanned Bifold Wallet',
        'brand': 'Atelier Nord',
        'category': 'Lifestyle',
        'price': 1999,
        'formatted_price': '₹1,999',
        'rating': 4.9,
        'reviews_count': 220,
        'image_url': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        'keywords': ['wallet', 'leather', 'cardholder', 'bifold', 'minimalist', 'lifestyle'],
        'tags': ['Lifestyle', 'Leather'],
        'description': 'Full-grain Buttero vegetable-tanned leather bifold with burnished edges, hand-saddle-stitched to hold 6-8 cards and unfolded bank notes in a featherlight 8mm profile.'
    }
]

def seed_database():
    """Seed the SQLite database with products, users, interactions, and wishlist items."""
    init_db_schema()

    with db_session() as conn:
        cursor = conn.cursor()

        # 1. Insert Products
        for p in PRODUCTS_DATA:
            cursor.execute("""
            INSERT OR REPLACE INTO products (
                id, name, description, category, brand, price, formatted_price,
                rating, reviews_count, image_url, keywords, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p['id'],
                p['name'],
                p['description'],
                p['category'],
                p['brand'],
                p['price'],
                p['formatted_price'],
                p['rating'],
                p['reviews_count'],
                p['image_url'],
                json.dumps(p['keywords']),
                json.dumps(p['tags'])
            ))

        # 2. Insert Default Demo User (Password: Password123)
        demo_user_id = 'user_demo_001'
        password_hash = generate_password_hash('Password123', method='pbkdf2:sha256')
        cursor.execute("""
        INSERT OR REPLACE INTO users (id, full_name, email, password_hash)
        VALUES (?, ?, ?, ?)
        """, (demo_user_id, 'Alex Morgan', 'demo@recomind.com', password_hash))

        # Insert a secondary peer user for collaborative filtering overlap
        peer_user_id = 'user_peer_002'
        peer_hash = generate_password_hash('Password123', method='pbkdf2:sha256')
        cursor.execute("""
        INSERT OR REPLACE INTO users (id, full_name, email, password_hash)
        VALUES (?, ?, ?, ?)
        """, (peer_user_id, 'Jordan Lee', 'jordan@recomind.com', peer_hash))

        # 3. Seed Demo User Preferences
        cursor.execute("DELETE FROM user_preferences WHERE user_id = ?", (demo_user_id,))
        cursor.execute("INSERT INTO user_preferences (user_id, category) VALUES (?, ?)", (demo_user_id, 'Audio'))
        cursor.execute("INSERT INTO user_preferences (user_id, category) VALUES (?, ?)", (demo_user_id, 'Workspace'))

        # 4. Seed Demo User Wishlist
        cursor.execute("DELETE FROM wishlist WHERE user_id = ?", (demo_user_id,))
        cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (demo_user_id, 'prod-001'))
        cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (demo_user_id, 'prod-003'))

        cursor.execute("DELETE FROM wishlist WHERE user_id = ?", (peer_user_id,))
        cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (peer_user_id, 'prod-001'))
        cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (peer_user_id, 'prod-007'))

        # 5. Seed Interactions (views, clicks, wishlist)
        cursor.execute("DELETE FROM product_interactions")
        interactions = [
            (demo_user_id, 'prod-001', 'view'),
            (demo_user_id, 'prod-001', 'wishlist'),
            (demo_user_id, 'prod-002', 'view'),
            (demo_user_id, 'prod-003', 'view'),
            (demo_user_id, 'prod-003', 'wishlist'),
            (demo_user_id, 'prod-005', 'view'),
            (peer_user_id, 'prod-001', 'view'),
            (peer_user_id, 'prod-001', 'purchase'),
            (peer_user_id, 'prod-007', 'view'),
            (peer_user_id, 'prod-007', 'wishlist'),
            (peer_user_id, 'prod-005', 'view'),
            (peer_user_id, 'prod-008', 'view'),
        ]
        for uid, pid, itype in interactions:
            cursor.execute("""
            INSERT INTO product_interactions (user_id, product_id, interaction_type)
            VALUES (?, ?, ?)
            """, (uid, pid, itype))

        # 6. Seed Ratings
        cursor.execute("DELETE FROM ratings")
        ratings_data = [
            (demo_user_id, 'prod-001', 5.0),
            (demo_user_id, 'prod-003', 4.5),
            (peer_user_id, 'prod-001', 4.8),
            (peer_user_id, 'prod-007', 4.7),
            (peer_user_id, 'prod-005', 4.9),
        ]
        for uid, pid, rval in ratings_data:
            cursor.execute("""
            INSERT INTO ratings (user_id, product_id, rating_value)
            VALUES (?, ?, ?)
            """, (uid, pid, rval))

    print(f"Successfully seeded SQLite database at {DB_PATH}")
    print(f"Total products inserted: {len(PRODUCTS_DATA)}")
    print(f"Demo accounts: demo@recomind.com / Password123, jordan@recomind.com / Password123")

if __name__ == '__main__':
    seed_database()
