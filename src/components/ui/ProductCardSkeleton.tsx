import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-border p-4 shadow-xs flex flex-col justify-between animate-pulse"
      aria-hidden="true"
    >
      <div>
        {/* 4:5 Aspect Ratio Image Container */}
        <div className="relative w-full aspect-[4/5] max-h-56 rounded-xl bg-gray-200/70 mb-3.5 overflow-hidden">
          {/* Match Score Badge Placeholder */}
          <div className="absolute top-2.5 left-2.5 h-6 w-20 bg-white/80 rounded-full" />
          {/* Wishlist Button Placeholder */}
          <div className="absolute top-2.5 right-2.5 h-8 w-8 bg-white/80 rounded-full" />
        </div>

        {/* Brand & Rating Meta Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-16 bg-gray-200/70 rounded" />
          <div className="h-3 w-12 bg-gray-200/70 rounded" />
        </div>

        {/* Product Title */}
        <div className="space-y-1.5 mb-3">
          <div className="h-4 bg-gray-200/70 rounded w-5/6" />
          <div className="h-4 bg-gray-200/70 rounded w-3/5" />
        </div>

        {/* Short Description */}
        <div className="space-y-1 mb-4">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
      </div>

      {/* Prominent Price & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
        <div className="h-5 w-20 bg-gray-200/70 rounded" />
        <div className="h-8 w-28 bg-gray-200/70 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;
