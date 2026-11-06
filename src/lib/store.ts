'use client';

import { useSyncExternalStore } from 'react';
import { getProductById, PRODUCTS, type Product } from '@/data/products';
import { showToast } from '@/components/ui/Toast';

export interface HistoryRecord {
  userId: string;
  productId: string;
  timestamp: number;
}

export interface RecentlyViewedItem {
  product: Product;
  userId: string;
  timestamp: number;
  viewedAt: string;
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

export function formatRelativeTime(timestamp: number): string {
  const diff = Math.max(0, Date.now() - timestamp);
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

/* -------------------------------------------------------------
 * Wishlist Reactive Store (Per User Persistent)
 * ------------------------------------------------------------- */
function subscribeWishlist(callback: () => void) {
  window.addEventListener('recomind_wishlist_updated', callback);
  window.addEventListener('recomind_auth_change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('recomind_wishlist_updated', callback);
    window.removeEventListener('recomind_auth_change', callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedWishlistIds: string[] = ['prod-001', 'prod-003'];
let cachedWishlistRaw: string | null = null;
let cachedWishlistUser: string | null = null;

function getWishlistSnapshot(): string[] {
  if (typeof window === 'undefined') return cachedWishlistIds;
  try {
    const uid = getActiveUserId();
    const key = `recomind_wishlist_${uid}`;
    let raw = localStorage.getItem(key);

    if (!raw && uid === 'user_demo_001') {
      // Pre-seed demo user with initial favorites
      const initial = ['prod-001', 'prod-003'];
      localStorage.setItem(key, JSON.stringify(initial));
      raw = JSON.stringify(initial);
    }

    if (!raw) {
      raw = '[]';
    }

    if (raw !== cachedWishlistRaw || uid !== cachedWishlistUser) {
      cachedWishlistRaw = raw;
      cachedWishlistUser = uid;
      cachedWishlistIds = JSON.parse(raw);
    }
  } catch {
    // keep cached
  }
  return cachedWishlistIds;
}

const initialWishlistSnapshot: string[] = ['prod-001', 'prod-003'];

export function useWishlist(): string[] {
  return useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    () => initialWishlistSnapshot
  );
}

export function toggleUserWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  const uid = getActiveUserId();
  const key = `recomind_wishlist_${uid}`;
  const current = getWishlistSnapshot();
  const exists = current.includes(productId);
  const updated = exists
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event('recomind_wishlist_updated'));
  
  if (!exists) {
    showToast('Saved to your wishlist', 'wishlist');
  } else {
    showToast('Removed from wishlist', 'info');
  }

  return !exists;
}

/* -------------------------------------------------------------
 * Recently Viewed Reactive Store (Per User Persistent with Timestamps)
 * ------------------------------------------------------------- */
function subscribeRecent(callback: () => void) {
  window.addEventListener('recomind_recent_updated', callback);
  window.addEventListener('recomind_auth_change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('recomind_recent_updated', callback);
    window.removeEventListener('recomind_auth_change', callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRecentItems: RecentlyViewedItem[] = [];
let cachedRecentProducts: Product[] = [];
let cachedRecentRaw: string | null = null;
let cachedRecentUser: string | null = null;

function getRecentSnapshot(): Product[] {
  if (typeof window === 'undefined') return cachedRecentProducts;
  try {
    const uid = getActiveUserId();
    const key = `recomind_history_${uid}`;
    let raw = localStorage.getItem(key);

    if (!raw && uid === 'user_demo_001') {
      // Pre-seed demo user with realistic initial browsing history
      const now = Date.now();
      const initial: HistoryRecord[] = [
        { userId: uid, productId: 'prod-002', timestamp: now - 12 * 60 * 1000 },
        { userId: uid, productId: 'prod-004', timestamp: now - 45 * 60 * 1000 },
        { userId: uid, productId: 'prod-006', timestamp: now - 2 * 60 * 60 * 1000 },
        { userId: uid, productId: 'prod-001', timestamp: now - 24 * 60 * 60 * 1000 },
      ];
      localStorage.setItem(key, JSON.stringify(initial));
      raw = JSON.stringify(initial);
    }

    if (!raw) {
      raw = '[]';
    }

    if (raw !== cachedRecentRaw || uid !== cachedRecentUser) {
      cachedRecentRaw = raw;
      cachedRecentUser = uid;
      const records: HistoryRecord[] = JSON.parse(raw);
      cachedRecentItems = records
        .map((rec) => {
          const product = getProductById(rec.productId);
          if (!product) return null;
          return {
            product,
            userId: rec.userId,
            timestamp: rec.timestamp,
            viewedAt: formatRelativeTime(rec.timestamp),
          };
        })
        .filter((item): item is RecentlyViewedItem => item !== null);

      cachedRecentProducts = cachedRecentItems.map((item) => item.product);
    }
  } catch {
    // keep cached
  }
  return cachedRecentProducts;
}

function getRecentItemsSnapshot(): RecentlyViewedItem[] {
  getRecentSnapshot(); // Ensure cachedRecentItems is populated
  return cachedRecentItems;
}

const initialRecentProducts: Product[] = [PRODUCTS[1], PRODUCTS[3], PRODUCTS[5], PRODUCTS[0]];
const initialRecentItems: RecentlyViewedItem[] = [];

export function useRecentlyViewed(): Product[] {
  return useSyncExternalStore(
    subscribeRecent,
    getRecentSnapshot,
    () => initialRecentProducts
  );
}

export function useRecentlyViewedItems(): RecentlyViewedItem[] {
  return useSyncExternalStore(
    subscribeRecent,
    getRecentItemsSnapshot,
    () => initialRecentItems
  );
}

export function recordProductView(productId: string): void {
  if (typeof window === 'undefined') return;
  const uid = getActiveUserId();
  const key = `recomind_history_${uid}`;

  try {
    const raw = localStorage.getItem(key);
    let records: HistoryRecord[] = raw ? JSON.parse(raw) : [];

    const now = Date.now();
    // Check if the same product was viewed recently
    const existingIndex = records.findIndex((r) => r.productId === productId);

    if (existingIndex !== -1) {
      // Deduplicate: If already present, remove previous position to bump to top with fresh timestamp
      records.splice(existingIndex, 1);
    }

    records.unshift({
      userId: uid,
      productId,
      timestamp: now,
    });

    // Keep top 24 viewed products
    records = records.slice(0, 24);
    localStorage.setItem(key, JSON.stringify(records));
    window.dispatchEvent(new Event('recomind_recent_updated'));
  } catch (e) {
    console.warn('Failed to record product view', e);
  }
}

export function clearBrowsingHistory(): void {
  if (typeof window === 'undefined') return;
  const uid = getActiveUserId();
  const key = `recomind_history_${uid}`;
  localStorage.removeItem(key);
  window.dispatchEvent(new Event('recomind_recent_updated'));
}
