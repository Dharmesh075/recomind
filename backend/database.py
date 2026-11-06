import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), 'recomind.db')

def get_db_connection():
    """Create a database connection with foreign key support and row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def db_session():
    """Context manager for clean database transactions."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db_schema():
    """Initialize the complete SQLite database schema according to Section 34."""
    with db_session() as conn:
        cursor = conn.cursor()

        # 1. Users table (Secure auth, unique email, never raw password)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 2. Products table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            brand TEXT NOT NULL,
            price REAL NOT NULL,
            formatted_price TEXT NOT NULL,
            rating REAL DEFAULT 0.0,
            reviews_count INTEGER DEFAULT 0,
            image_url TEXT NOT NULL,
            keywords TEXT NOT NULL, -- JSON or comma-separated
            tags TEXT NOT NULL       -- JSON or comma-separated
        );
        """)

        # 3. User Preferences table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            category TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            UNIQUE(user_id, category)
        );
        """)

        # 4. Wishlist table (Unique constraint prevents accidental duplicates)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        );
        """)

        # 5. Product Interactions table (views, clicks, wishlist additions)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            interaction_type TEXT NOT NULL CHECK(interaction_type IN ('view', 'click', 'wishlist', 'purchase')),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        );
        """)

        # 6. Ratings table (Enforced valid rating range 1.0 to 5.0)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            rating_value REAL NOT NULL CHECK(rating_value >= 1.0 AND rating_value <= 5.0),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        );
        """)

        # 7. Recommendation Results Cache (Optional per Section 34)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendation_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            recommendation_score REAL NOT NULL,
            model_version TEXT NOT NULL,
            generation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        );
        """)

        # Indexes for fast querying on foreign keys and categories
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_interactions_user ON product_interactions(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_interactions_product ON product_interactions(product_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);")

if __name__ == '__main__':
    init_db_schema()
    print("Database schema initialized successfully at:", DB_PATH)
