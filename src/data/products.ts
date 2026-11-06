export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  formattedPrice: string;
  rating: number;
  reviewsCount: number;
  matchScore: number;
  recommendationReason: string;
  keywords: string[];
  imageUrl: string;
  images: string[];
  description: string;
  specs: ProductSpec[];
  tags: string[];
  trending?: boolean;
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Acoustic Minimal Noise-Canceling Headphones',
    brand: 'Sora Audio',
    category: 'Audio',
    price: 4999,
    formattedPrice: '₹4,999',
    rating: 4.9,
    reviewsCount: 342,
    matchScore: 98,
    recommendationReason: 'Recommended because you explored high-fidelity audio products.',
    keywords: ['headphones', 'audio', 'wireless', 'bluetooth', 'minimal', 'noise cancelling', 'sora'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Engineered for uncompromising acoustic fidelity with hybrid active noise cancellation, bespoke 40mm beryllium drivers, and a featherweight ergonomic headband for all-day listening.',
    specs: [
      { name: 'Driver Size', value: '40mm Custom Dynamic' },
      { name: 'Battery Life', value: 'Up to 38 hours (ANC on)' },
      { name: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm AUX' },
      { name: 'Weight', value: '245 grams' },
      { name: 'Warranty', value: '2 Year International' },
    ],
    tags: ['Best Seller', '98% Match', 'Audio'],
    trending: true,
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Horizon Minimalist Smartwatch Series 5',
    brand: 'Krono Labs',
    category: 'Wearables',
    price: 8499,
    formattedPrice: '₹8,499',
    rating: 4.8,
    reviewsCount: 289,
    matchScore: 96,
    recommendationReason: 'Trending among shoppers with matching wellness and tech interests.',
    keywords: ['smartwatch', 'watch', 'wearable', 'fitness', 'health', 'titanium', 'krono'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Sculpted grade-5 titanium chassis featuring an edge-to-edge sapphire AMOLED display, continuous cardiovascular biometrics, and multi-band GPS navigation.',
    specs: [
      { name: 'Case Material', value: 'Grade-5 Titanium & Ceramic' },
      { name: 'Display', value: '1.43" Always-on AMOLED' },
      { name: 'Water Resistance', value: '5 ATM (50 meters)' },
      { name: 'Battery Life', value: '7 days typical usage' },
    ],
    tags: ['Top Match', 'Wearables'],
    trending: true,
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Everyday Canvas & Top-Grain Leather Backpack',
    brand: 'Atelier Nord',
    category: 'Lifestyle',
    price: 3299,
    formattedPrice: '₹3,299',
    rating: 4.9,
    reviewsCount: 412,
    matchScore: 94,
    recommendationReason: 'Recommended based on related minimalist commute and travel essentials.',
    keywords: ['backpack', 'bag', 'canvas', 'leather', 'commute', 'laptop', 'nord'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Weather-resistant 18oz waxed cotton canvas bag fitted with vegetable-tanned leather trim, magnetic fidlock buckles, and a dedicated suspended 16-inch laptop pocket.',
    specs: [
      { name: 'Volume Capacity', value: '22 Liters' },
      { name: 'Laptop Sleeve', value: 'Fits up to 16" MacBook Pro' },
      { name: 'Material', value: 'Waxed Canvas & Tuscan Leather' },
      { name: 'Dimensions', value: '46 x 31 x 15 cm' },
    ],
    tags: ['Popular', 'Lifestyle'],
    trending: true,
    inStock: true,
  },
  {
    id: 'prod-004',
    name: 'Artisan Ceramic Pour-Over Coffee Brewer',
    brand: 'Kanso Studio',
    category: 'Home & Living',
    price: 1899,
    formattedPrice: '₹1,899',
    rating: 4.7,
    reviewsCount: 178,
    matchScore: 91,
    recommendationReason: 'Matches your selected interest in artisan home goods.',
    keywords: ['coffee', 'brewer', 'ceramic', 'kitchen', 'artisan', 'pour over', 'kanso'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Handcrafted stoneware dripper with internal spiral turbulence ridges, maximizing thermal stability and extraction consistency for specialty coffee lovers.',
    specs: [
      { name: 'Material', value: 'High-fire Stoneware Ceramic' },
      { name: 'Capacity', value: '1–4 Cups (Size 02)' },
      { name: 'Care', value: 'Dishwasher Safe' },
      { name: 'Origin', value: 'Kyoto, Japan' },
    ],
    tags: ['Staff Pick', 'Home'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-005',
    name: 'Precision Wireless Mechanical Keyboard (75%)',
    brand: 'Keyflow',
    category: 'Workspace',
    price: 5499,
    formattedPrice: '₹5,499',
    rating: 4.9,
    reviewsCount: 520,
    matchScore: 95,
    recommendationReason: 'Similar to products you viewed in desk and ergonomic hardware.',
    keywords: ['keyboard', 'mechanical', 'wireless', 'workspace', 'desk', 'tech', 'typing'],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Gasket-mounted aluminum frame mechanical keyboard featuring factory-lubed tactile switches, PBT dye-sub keycaps, and ultra-low-latency 2.4GHz wireless connection.',
    specs: [
      { name: 'Layout', value: '75% (84 Keys)' },
      { name: 'Switch Type', value: 'Hot-swappable Custom Tactile' },
      { name: 'Battery', value: '4000mAh (Up to 200 hours)' },
      { name: 'Chassis', value: 'CNC Anodized Aluminum' },
    ],
    tags: ['95% Match', 'Workspace'],
    trending: true,
    inStock: true,
  },
  {
    id: 'prod-006',
    name: 'Nordic Oak & Wool Ergonomic Desk Mat',
    brand: 'Atelier Nord',
    category: 'Workspace',
    price: 1699,
    formattedPrice: '₹1,699',
    rating: 4.8,
    reviewsCount: 195,
    matchScore: 90,
    recommendationReason: 'Recommended based on related workspace accessories.',
    keywords: ['desk mat', 'wool', 'felt', 'workspace', 'desk pad', 'nordic'],
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Premium natural merino wool felt pad laminated with anti-slip natural Portuguese cork base, providing plush wrist cushioning and tabletop protection.',
    specs: [
      { name: 'Dimensions', value: '900 x 400 x 4 mm' },
      { name: 'Top Layer', value: '100% Merino Wool Felt' },
      { name: 'Base', value: 'Natural Biodegradable Cork' },
    ],
    tags: ['Workspace', 'Eco-friendly'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-007',
    name: 'Spatial Studio Wireless Earbuds with ANC',
    brand: 'Sora Audio',
    category: 'Audio',
    price: 3499,
    formattedPrice: '₹3,499',
    rating: 4.7,
    reviewsCount: 310,
    matchScore: 93,
    recommendationReason: 'Similar to high-fidelity audio gear in your profile.',
    keywords: ['earbuds', 'wireless', 'audio', 'earphones', 'anc', 'spatial', 'sora'],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Pocket-sized true wireless earbuds with custom 11mm graphene dynamic transducers, personalized spatial audio tracking, and wireless charging case.',
    specs: [
      { name: 'Noise Cancellation', value: 'Adaptive Hybrid ANC (-42dB)' },
      { name: 'Playtime', value: '8 hours (32 hours with case)' },
      { name: 'Water Rating', value: 'IPX5 Sweat & Water Resistant' },
    ],
    tags: ['Audio', 'Compact'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-008',
    name: 'Solid Cast Aluminum Laptop Stand',
    brand: 'Form & Function',
    category: 'Workspace',
    price: 2199,
    formattedPrice: '₹2,199',
    rating: 4.9,
    reviewsCount: 260,
    matchScore: 89,
    recommendationReason: 'Collaborative filtering match: 84% of keyboard shoppers also explored this stand.',
    keywords: ['laptop stand', 'aluminum', 'ergonomic', 'workspace', 'desk'],
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Precision milled from a single billet of aircraft-grade aluminum, elevating laptop displays to optimal 15cm eye level while providing passive thermal cooling.',
    specs: [
      { name: 'Compatibility', value: '11" to 17" Laptops & MacBooks' },
      { name: 'Material', value: 'Sandblasted Anodized Aluminum' },
      { name: 'Cable Management', value: 'Integrated Rear Pass-through' },
    ],
    tags: ['Ergonomics', 'Workspace'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-009',
    name: 'Double-Walled Insulated Travel Tumbler (500ml)',
    brand: 'Kanso Studio',
    category: 'Home & Living',
    price: 1299,
    formattedPrice: '₹1,299',
    rating: 4.8,
    reviewsCount: 145,
    matchScore: 88,
    recommendationReason: 'Frequently paired with artisan coffee drippers and morning routines.',
    keywords: ['tumbler', 'mug', 'coffee', 'travel', 'insulated', 'thermos', 'kitchen'],
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Double-walled vacuum insulated flask with ceramic interior coating to preserve original brew aromas without metallic aftertaste. Keeps hot for 12h, cold for 24h.',
    specs: [
      { name: 'Capacity', value: '500 ml (17 fl oz)' },
      { name: 'Interior', value: 'True-taste Ceramic Coating' },
      { name: 'Lid', value: 'Leak-proof Splash Guard' },
    ],
    tags: ['Home', 'Travel'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-010',
    name: 'Automatic Mechanical Field Watch 38mm',
    brand: 'Krono Labs',
    category: 'Wearables',
    price: 11499,
    formattedPrice: '₹11,499',
    rating: 4.9,
    reviewsCount: 88,
    matchScore: 87,
    recommendationReason: 'Matches your interest in classic horology and durable EDC designs.',
    keywords: ['watch', 'analog', 'mechanical', 'automatic', 'sapphire', 'field watch'],
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Self-winding mechanical automatic movement with double-domed anti-reflective sapphire crystal, SuperLuminova markers, and quick-release vegetable-tanned Horween leather band.',
    specs: [
      { name: 'Movement', value: 'Miyota 9039 Automatic (28,800 bph)' },
      { name: 'Power Reserve', value: '42 Hours' },
      { name: 'Case Diameter', value: '38 mm' },
      { name: 'Water Resistance', value: '100 meters (10 ATM)' },
    ],
    tags: ['Classic', 'Wearables'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-011',
    name: 'Japanese Matte Stoneware Teapot (650ml)',
    brand: 'Kanso Studio',
    category: 'Home & Living',
    price: 2499,
    formattedPrice: '₹2,499',
    rating: 4.8,
    reviewsCount: 94,
    matchScore: 86,
    recommendationReason: 'Content-based match on Japanese minimalist dining and stoneware crafts.',
    keywords: ['teapot', 'tea', 'stoneware', 'ceramic', 'japan', 'kitchen'],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Hand-thrown matte kyusu teapot fitted with an integrated stainless steel micro-mesh basket, designed for loose-leaf green tea and herbal infusions.',
    specs: [
      { name: 'Capacity', value: '650 ml' },
      { name: 'Glaze', value: 'Lead-free Matte Reactive Glaze' },
      { name: 'Infuser', value: 'Laser-perforated 304 Stainless Steel' },
    ],
    tags: ['Home & Living', 'Artisan'],
    trending: false,
    inStock: true,
  },
  {
    id: 'prod-012',
    name: 'Minimalist Italian Vegetable-Tanned Bifold Wallet',
    brand: 'Atelier Nord',
    category: 'Lifestyle',
    price: 1999,
    formattedPrice: '₹1,999',
    rating: 4.9,
    reviewsCount: 220,
    matchScore: 91,
    recommendationReason: 'Frequently explored alongside Atelier Nord backpacks.',
    keywords: ['wallet', 'leather', 'cardholder', 'bifold', 'minimalist', 'lifestyle'],
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Full-grain Buttero vegetable-tanned leather bifold with burnished edges, hand-saddle-stitched to hold 6-8 cards and unfolded bank notes in a featherlight 8mm profile.',
    specs: [
      { name: 'Leather', value: 'Conceria Walpier Buttero (Italy)' },
      { name: 'Capacity', value: 'Up to 8 cards + Cash slot' },
      { name: 'Thickness', value: '8 mm (Empty)' },
    ],
    tags: ['Lifestyle', 'Leather'],
    trending: false,
    inStock: true,
  },
];

/* -------------------------------------------------------------
 * Recommendation & Search Helpers
 * ------------------------------------------------------------- */

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  return PRODUCTS.filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.keywords.some((k) => k.toLowerCase().includes(q)) ||
      product.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function getCategories(): { name: string; count: number; imageUrl: string }[] {
  const categoriesMap = new Map<string, { count: number; imageUrl: string }>();

  PRODUCTS.forEach((p) => {
    const existing = categoriesMap.get(p.category);
    if (existing) {
      existing.count += 1;
    } else {
      categoriesMap.set(p.category, { count: 1, imageUrl: p.imageUrl });
    }
  });

  return Array.from(categoriesMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    imageUrl: data.imageUrl,
  }));
}

export function getBrands(): string[] {
  const brandSet = new Set<string>();
  PRODUCTS.forEach((p) => brandSet.add(p.brand));
  return Array.from(brandSet);
}

export function getSimilarProducts(productId: string, limit = 4): Product[] {
  const target = getProductById(productId);
  if (!target) return PRODUCTS.slice(0, limit);

  // Content-based similarity scoring based on shared category, tags, and keywords
  const scored = PRODUCTS.filter((p) => p.id !== productId).map((candidate) => {
    let score = 0;
    if (candidate.category === target.category) score += 5;
    if (candidate.brand === target.brand) score += 3;

    const commonKeywords = candidate.keywords.filter((k) => target.keywords.includes(k));
    score += commonKeywords.length * 2;

    const commonTags = candidate.tags.filter((t) => target.tags.includes(t));
    score += commonTags.length * 1.5;

    return { product: candidate, similarity: score };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, limit).map((s) => s.product);
}

export function getPopularProducts(limit = 4): Product[] {
  return [...PRODUCTS].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, limit);
}

export function getRecommendedProducts(limit = 4): Product[] {
  return [...PRODUCTS].sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

export function getTrendingProducts(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.trending).slice(0, limit);
}

export function getProductsByInterests(interests: string[], limit = 4): Product[] {
  if (!interests.length) return getPopularProducts(limit);
  const normalized = interests.map((i) => i.toLowerCase());

  const matched = PRODUCTS.filter((p) =>
    normalized.some((i) => p.category.toLowerCase().includes(i) || p.keywords.some((k) => k.includes(i)))
  );

  return matched.length ? matched.slice(0, limit) : getPopularProducts(limit);
}

function getActiveUserId(): string {
  if (typeof window === 'undefined') return 'user_demo_001';
  try {
    const raw = localStorage.getItem('recomind_active_session_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.uid) return parsed.uid;
    }
  } catch {
    // fallback
  }
  return 'user_demo_001';
}

export function getWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const uid = getActiveUserId();
    const key = `recomind_wishlist_${uid}`;
    const raw = localStorage.getItem(key);
    if (!raw && uid === 'user_demo_001') {
      return ['prod-001', 'prod-003'];
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  const uid = getActiveUserId();
  const key = `recomind_wishlist_${uid}`;
  const current = getWishlistIds();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];

  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event('recomind_wishlist_updated'));
  window.dispatchEvent(
    new CustomEvent('recomind_show_toast', {
      detail: {
        message: !exists ? 'Added to your wishlist' : 'Removed from wishlist',
        type: !exists ? 'wishlist' : 'info',
      },
    })
  );
  return !exists;
}

export function isWishlisted(productId: string): boolean {
  return getWishlistIds().includes(productId);
}

export function getRecentlyViewed(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const uid = getActiveUserId();
    const key = `recomind_history_${uid}`;
    const raw = localStorage.getItem(key);
    if (!raw && uid === 'user_demo_001') {
      return [PRODUCTS[1], PRODUCTS[3], PRODUCTS[5], PRODUCTS[0]];
    }
    if (!raw) return [];
    const records = JSON.parse(raw);
    const ids: string[] = records.map((r: { productId: string } | string) =>
      typeof r === 'string' ? r : r.productId
    );
    return ids
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined);
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const uid = getActiveUserId();
    const key = `recomind_history_${uid}`;
    const raw = localStorage.getItem(key);
    let records: { userId: string; productId: string; timestamp: number }[] = raw
      ? JSON.parse(raw)
      : [];

    records = records.filter((r) => r.productId !== productId);
    records.unshift({
      userId: uid,
      productId,
      timestamp: Date.now(),
    });

    records = records.slice(0, 24);
    localStorage.setItem(key, JSON.stringify(records));
    window.dispatchEvent(new Event('recomind_recent_updated'));
  } catch {
    // Ignore storage issues
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  const uid = getActiveUserId();
  const key = `recomind_history_${uid}`;
  localStorage.removeItem(key);
  window.dispatchEvent(new Event('recomind_recent_updated'));
}
