import unittest
import json
import os
import sys
from app import app
from database import init_db_schema, db_session
from init_db import seed_database

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

class RecomindBackendTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Seed test database
        seed_database()
        cls.client = app.test_client()

    def test_01_health_check(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('scikit-learn', data['ml_frameworks'])

    def test_02_auth_signup_and_login(self):
        # Test Signup
        new_email = f"testuser_{os.getpid()}@recomind.com"
        signup_res = self.client.post('/api/auth/signup', json={
            'full_name': 'Test Researcher',
            'email': new_email,
            'password': 'SecurePassword123'
        })
        self.assertEqual(signup_res.status_code, 201)
        data = signup_res.get_json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], new_email)

        # Test Duplicate Signup Prevention
        dup_res = self.client.post('/api/auth/signup', json={
            'full_name': 'Test Researcher',
            'email': new_email,
            'password': 'SecurePassword123'
        })
        self.assertEqual(dup_res.status_code, 409)

        # Test Login Success
        login_res = self.client.post('/api/auth/login', json={
            'email': new_email,
            'password': 'SecurePassword123'
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertIn('token', login_data)

        # Test Login Invalid Password
        bad_login = self.client.post('/api/auth/login', json={
            'email': new_email,
            'password': 'WrongPassword999'
        })
        self.assertEqual(bad_login.status_code, 401)

    def test_03_authenticated_me_endpoint(self):
        # Demo login
        login_res = self.client.post('/api/auth/login', json={
            'email': 'demo@recomind.com',
            'password': 'Password123'
        })
        token = login_res.get_json()['token']

        me_res = self.client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(me_res.status_code, 200)
        user = me_res.get_json()
        self.assertEqual(user['email'], 'demo@recomind.com')
        self.assertNotIn('password_hash', user) # Security check: never expose hash

    def test_04_product_catalog_and_filtering(self):
        # All products
        all_res = self.client.get('/api/products')
        self.assertEqual(all_res.status_code, 200)
        products = all_res.get_json()
        self.assertGreaterEqual(len(products), 12)

        # Category filter: Audio
        audio_res = self.client.get('/api/products?category=Audio')
        self.assertEqual(audio_res.status_code, 200)
        audio_prods = audio_res.get_json()
        for p in audio_prods:
            self.assertEqual(p['category'], 'Audio')

        # Price filter
        cheap_res = self.client.get('/api/products?max_price=2000')
        self.assertEqual(cheap_res.status_code, 200)
        for p in cheap_res.get_json():
            self.assertLessEqual(p['price'], 2000)

        # Single product detail with similar products
        prod_res = self.client.get('/api/products/prod-001')
        self.assertEqual(prod_res.status_code, 200)
        p_data = prod_res.get_json()
        self.assertEqual(p_data['id'], 'prod-001')
        self.assertIn('similar_products', p_data)
        self.assertGreater(len(p_data['similar_products']), 0)

    def test_05_wishlist_persistence_and_duplicate_handling(self):
        login_res = self.client.post('/api/auth/login', json={
            'email': 'demo@recomind.com',
            'password': 'Password123'
        })
        token = login_res.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}

        # Add item to wishlist
        add_res = self.client.post('/api/wishlist', json={'product_id': 'prod-005'}, headers=headers)
        self.assertEqual(add_res.status_code, 201)

        # Adding same item again must not error or duplicate
        add_dup = self.client.post('/api/wishlist', json={'product_id': 'prod-005'}, headers=headers)
        self.assertEqual(add_dup.status_code, 201)

        # Fetch wishlist
        list_res = self.client.get('/api/wishlist', headers=headers)
        self.assertEqual(list_res.status_code, 200)
        ids = [p['id'] for p in list_res.get_json()]
        self.assertIn('prod-005', ids)
        self.assertEqual(ids.count('prod-005'), 1) # Exactly 1

        # Delete from wishlist
        del_res = self.client.delete('/api/wishlist/prod-005', headers=headers)
        self.assertEqual(del_res.status_code, 200)

    def test_06_ratings_validation(self):
        login_res = self.client.post('/api/auth/login', json={
            'email': 'demo@recomind.com',
            'password': 'Password123'
        })
        token = login_res.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}

        # Valid rating
        ok_res = self.client.post('/api/ratings', json={'product_id': 'prod-002', 'rating': 4.5}, headers=headers)
        self.assertEqual(ok_res.status_code, 200)

        # Invalid rating > 5.0
        bad_res = self.client.post('/api/ratings', json={'product_id': 'prod-002', 'rating': 6.0}, headers=headers)
        self.assertEqual(bad_res.status_code, 400)

        # Invalid rating < 1.0
        bad_res2 = self.client.post('/api/ratings', json={'product_id': 'prod-002', 'rating': 0.5}, headers=headers)
        self.assertEqual(bad_res2.status_code, 400)

    def test_07_recommendations_and_evaluation(self):
        # Recommendations for demo user
        rec_res = self.client.get('/api/recommendations?limit=4&alpha=0.7&beta=0.3')
        self.assertEqual(rec_res.status_code, 200)
        data = rec_res.get_json()
        self.assertEqual(len(data['recommendations']), 4)
        for r in data['recommendations']:
            self.assertIn('hybrid_score', r)
            self.assertIn('match_score', r)
            self.assertIn('recommendation_reason', r)

        # Evaluation metrics
        eval_res = self.client.get('/api/evaluation')
        self.assertEqual(eval_res.status_code, 200)
        eval_data = eval_res.get_json()
        self.assertIn('precision_at_10', eval_data)
        self.assertIn('recall_at_10', eval_data)
        self.assertIn('map', eval_data)
        self.assertIn('rmse', eval_data)
        self.assertIn('models_comparison', eval_data)

if __name__ == '__main__':
    unittest.main()
