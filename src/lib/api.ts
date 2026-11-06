/**
 * Recomind Unified API Client
 * Seamlessly connects the Next.js frontend to the Python Flask + SQLite backend (http://127.0.0.1:5000)
 * with robust local fallbacks if the Python server is offline.
 */

import { PRODUCTS, getProductById, getCategories, getBrands, type Product } from '@/data/products';
import { getHybridRecommendations, getOfflineEvaluationMetrics } from '@/lib/recommendationEngine';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

/**
 * Check if the Python Flask backend is reachable.
 */
export async function checkBackendStatus(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(1200),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch products from backend or fallback to local dataset.
 */
export async function fetchCatalogProducts(params?: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category && params.category !== 'All') url.searchParams.set('category', params.category);
    if (params?.brand && params.brand !== 'All') url.searchParams.set('brand', params.brand);
    if (params?.minPrice !== undefined) url.searchParams.set('min_price', params.minPrice.toString());
    if (params?.maxPrice !== undefined) url.searchParams.set('max_price', params.maxPrice.toString());
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.sort) url.searchParams.set('sort', params.sort);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Fallback to in-app product dataset
  }

  // Local fallback filtering
  let result = [...PRODUCTS];
  if (params?.category && params.category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
  }
  if (params?.brand && params.brand !== 'All') {
    result = result.filter((p) => p.brand === params.brand);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return result;
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return getProductById(id);
}

/**
 * Fetch categories with product counts.
 */
export async function fetchCatalogCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return getCategories();
}

/**
 * Fetch distinct brands.
 */
export async function fetchCatalogBrands() {
  try {
    const res = await fetch(`${API_BASE}/brands`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return getBrands();
}

/**
 * Fetch personalized recommendations from Scikit-learn backend engine.
 */
export async function fetchPersonalizedRecommendations(options?: {
  userId?: string;
  limit?: number;
  alpha?: number;
  beta?: number;
}): Promise<Product[]> {
  const uid = options?.userId || 'user_demo_001';
  try {
    const url = new URL(`${API_BASE}/recommendations`);
    url.searchParams.set('limit', (options?.limit || 6).toString());
    if (options?.alpha !== undefined) url.searchParams.set('alpha', options.alpha.toString());
    if (options?.beta !== undefined) url.searchParams.set('beta', options.beta.toString());

    const res = await fetch(url.toString(), {
      headers: {
        'X-Demo-User-Id': uid,
      },
      signal: AbortSignal.timeout(1800),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.recommendations && Array.isArray(data.recommendations)) {
        return data.recommendations;
      }
    }
  } catch {
    // Fallback to TypeScript Hybrid Recommendation Engine
  }

  return getHybridRecommendations({
    userId: uid,
    topN: options?.limit || 6,
    alpha: options?.alpha ?? 0.6,
    beta: options?.beta ?? 0.4,
  });
}

/**
 * Fetch model evaluation benchmark metrics.
 */
export async function fetchModelEvaluationMetrics() {
  try {
    const res = await fetch(`${API_BASE}/evaluation`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to local evaluation calculation
  }
  return getOfflineEvaluationMetrics();
}

/**
 * Asynchronously sync an interaction to the Python backend without blocking the UI.
 */
export function recordInteraction(productId: string, interactionType: 'view' | 'click' | 'wishlist' | 'purchase', userId = 'user_demo_001') {
  if (typeof window === 'undefined') return;
  fetch(`${API_BASE}/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-User-Id': userId,
    },
    body: JSON.stringify({ product_id: productId, interaction_type: interactionType }),
  }).catch(() => {
    // Silently ignore if backend offline
  });
}
