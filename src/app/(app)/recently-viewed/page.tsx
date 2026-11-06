'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Trash2,
  ArrowRight,
  Star,
  History,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { useRecentlyViewedItems, clearBrowsingHistory } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

export default function RecentlyViewedPage() {
  const historyItems = useRecentlyViewedItems();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmClear = () => {
    clearBrowsingHistory();
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            Implicit Browsing Signals
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Recently viewed
          </h1>
          <p className="text-secondary text-sm mt-1">
            Pick up where you left off.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-error bg-white border border-border px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs hover:border-error/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog Modal */}
      {isConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-border max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="text-secondary hover:text-primary p-1 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary">
                Clear browsing history?
              </h2>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                This will remove all {historyItems.length} recorded product views from your active account profile. Your implicit recommendation signals will be reset to default.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-secondary hover:text-primary bg-[#F8F9F7] rounded-lg border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-4 py-2 text-xs font-semibold text-white bg-error hover:bg-error/90 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {historyItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {historyItems.map(({ product, viewedAt, timestamp }) => (
            <div
              key={`${product.id}-${timestamp}`}
              className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* 4:5 Aspect Ratio Image Container with neutral placeholder fallback */}
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  className="group-hover:scale-105 transition-transform duration-300"
                  containerClassName="mb-3.5"
                >
                  {/* Relative Timestamp Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-secondary flex items-center gap-1 shadow-xs border border-border/50">
                    <History className="w-3 h-3 text-accent" />
                    <span>Viewed {viewedAt}</span>
                  </div>

                  {/* Match Score Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-semibold text-accent flex items-center gap-1 shadow-xs border border-border/50">
                    <Sparkles className="w-3 h-3" />
                    {product.matchScore}%
                  </div>
                </ProductImage>

                {/* Metadata: Brand & Rating */}
                <div className="flex items-center justify-between text-xs text-secondary mb-1">
                  <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Star className="w-3.5 h-3.5 fill-[#A86C19] text-[#A86C19]" />
                    {product.rating} ({product.reviewsCount})
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="text-[15px] font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-secondary line-clamp-2 mb-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & View Action */}
              <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                <span className="text-base font-bold text-primary">
                  {product.formattedPrice}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-gray-50 text-primary transition-colors flex items-center gap-1"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-primary">No browsing history yet</h2>
          <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
            Products you view will be recorded here so you can easily return to items you inspected.
          </p>
          <div className="pt-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <span>Return to Discover</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
