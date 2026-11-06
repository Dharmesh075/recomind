'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Check, X } from 'lucide-react';

interface ToastData {
  id: number;
  message: string;
  type?: 'wishlist' | 'success' | 'info';
}

export function showToast(message: string, type: 'wishlist' | 'success' | 'info' = 'success') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('recomind_show_toast', {
      detail: { message, type },
    })
  );
}

export default function Toast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{
        message: string;
        type?: 'wishlist' | 'success' | 'info';
      }>;
      if (customEvent.detail?.message) {
        setToast({
          id: Date.now(),
          message: customEvent.detail.message,
          type: customEvent.detail.type || 'success',
        });
      }
    };

    window.addEventListener('recomind_show_toast', handleToast);
    return () => {
      window.removeEventListener('recomind_show_toast', handleToast);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#20251F] text-white text-xs font-medium rounded-xl shadow-lg border border-white/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
    >
      {toast.type === 'wishlist' ? (
        <Heart className="w-3.5 h-3.5 text-accent fill-accent shrink-0" />
      ) : (
        <Check className="w-3.5 h-3.5 text-success shrink-0" />
      )}
      <span>{toast.message}</span>
      <button
        onClick={() => setToast(null)}
        className="ml-1 text-white/60 hover:text-white transition-opacity p-0.5 rounded cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
