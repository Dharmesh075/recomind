'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, Sparkles, Star } from 'lucide-react';
import { getProductById, type Product } from '@/data/products';
import { useWishlist, toggleUserWishlist } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

export default function WishlistPage() {
  const wishlistIds = useWishlist();

  const items = wishlistIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleUserWishlist(id);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5" />
            Saved Products
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Your wishlist
          </h1>
          <p className="text-secondary text-sm mt-1">
            Keep track of products you want to revisit.
          </p>
        </div>

        {items.length > 0 && (
          <span className="text-xs text-secondary self-start sm:self-auto bg-white border border-border px-3 py-1.5 rounded-lg shadow-2xs">
            <strong className="text-primary">{items.length}</strong> {items.length === 1 ? 'product' : 'products'} saved
          </span>
        )}
      </div>

      {/* Product Grid in Discover page visual style */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
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
                  {/* Match Score Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1 shadow-xs border border-border/50">
                    <Sparkles className="w-3 h-3" />
                    {product.matchScore}% Match
                  </div>

                  {/* Remove / Wishlist Heart Button */}
                  <button
                    onClick={(e) => removeItem(e, product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 text-error hover:bg-error/10 transition-colors z-10 shadow-xs group/btn cursor-pointer"
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  </button>
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
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-primary">Your wishlist is empty</h2>
          <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
            Save products you like, and they&apos;ll appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <span>Explore products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
