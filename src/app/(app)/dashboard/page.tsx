'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCategories,
  getPopularProducts,
  getRecommendedProducts,
  toggleWishlist,
} from '@/data/products';
import { useWishlist, useRecentlyViewed } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

export default function DashboardPage() {
  const { user } = useAuth();
  const recentProducts = useRecentlyViewed();
  const wishlistIds = useWishlist();

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  // Get user's actual first name
  const firstName = user?.displayName?.trim()
    ? user.displayName.trim().split(' ')[0]
    : 'there';

  const pickedProducts = getRecommendedProducts(4);
  const categories = getCategories();
  const popularProducts = getPopularProducts(4);

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Section */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-secondary text-[15px] mt-1.5">
            Find something you&apos;ll love today.
          </p>
        </div>

        {/* Contextual Recommendation Badge / Graphic */}
        <div className="flex items-center gap-3 bg-[#F8F9F7] border border-border/80 px-4 py-3 rounded-xl shrink-0 self-start md:self-auto">
          <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-primary block leading-none">
              Hybrid Recommendation Engine
            </span>
            <span className="text-[11px] text-secondary">
              Personalized based on your activity
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Recommended For You (Picked for you) */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Picked for you
            </h2>
            <p className="text-secondary text-sm mt-0.5">
              Products selected using your available preferences and activity.
            </p>
          </div>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors whitespace-nowrap"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 cards on desktop, 4th on wide screens (2xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {pickedProducts.map((product, idx) => {
            const isFav = wishlistIds.includes(product.id);
            // Hide the 4th item on standard 3-col desktop layout
            const visibilityClass = idx === 3 ? 'hidden 2xl:flex' : 'flex';

            return (
              <div
                key={product.id}
                className={`${visibilityClass} bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex-col justify-between group`}
              >
                <div>
                  {/* Product Image Container (~4:5 aspect ratio) with neutral fallback */}
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-300"
                    containerClassName="mb-3.5"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 shadow-xs cursor-pointer ${
                        isFav
                          ? 'bg-accent text-white'
                          : 'bg-white/90 text-secondary hover:text-primary'
                      }`}
                      aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`}
                      />
                    </button>
                  </ProductImage>

                  {/* Metadata: Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Star className="w-3.5 h-3.5 fill-[#A86C19] text-[#A86C19]" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-[15px] font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
                    {product.name}
                  </h3>

                  {/* Honest Recommendation Explanation */}
                  <p className="text-xs text-secondary/80 bg-[#F8F9F7] border border-border/70 rounded-md p-2 mb-3 leading-relaxed">
                    💡 {product.recommendationReason}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                  <span className="text-base font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3.5 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Browse Categories */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
            Explore categories
          </h2>
          <p className="text-secondary text-sm mt-0.5">
            Discover curated collections by category.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/discover?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-xl border border-border p-3.5 shadow-xs hover:border-accent/40 hover:shadow-sm transition-all duration-150 flex flex-col items-center text-center"
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#F8F9F7] mb-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-secondary mt-0.5">
                {cat.count} {cat.count === 1 ? 'item' : 'items'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: Popular Right Now */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
                Popular right now
              </h2>
              <span className="text-xs font-semibold text-[#A86C19] bg-[#A86C19]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Community Favorites
              </span>
            </div>
            <p className="text-secondary text-sm mt-0.5">
              Top reviewed and most requested products across shoppers.
            </p>
          </div>
          <Link
            href="/discover?sort=rating"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors whitespace-nowrap"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => {
            const isFav = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-300"
                    containerClassName="mb-3 max-h-48"
                  >
                    <button
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 shadow-xs cursor-pointer ${
                        isFav
                          ? 'bg-accent text-white'
                          : 'bg-white/90 text-secondary hover:text-primary'
                      }`}
                      aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`}
                      />
                    </button>
                  </ProductImage>

                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span className="font-medium uppercase tracking-wider">{product.category}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Star className="w-3.5 h-3.5 fill-[#A86C19] text-[#A86C19]" />
                      {product.rating} ({product.reviewsCount})
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-primary truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-secondary line-clamp-2 mb-3">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-base font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-gray-50 text-primary transition-colors flex items-center gap-1.5"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Recently Viewed (Continue exploring) */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
            Continue exploring
          </h2>
          <p className="text-secondary text-sm mt-0.5">
            Pick up where you left off from your recent browsing sessions.
          </p>
        </div>

        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full aspect-[4/5] max-h-44 rounded-xl overflow-hidden bg-[#F8F9F7] mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-semibold text-primary truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-secondary line-clamp-1 mb-2">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-[#F8F9F7] hover:bg-accent hover:text-white text-primary border border-border transition-colors flex items-center gap-1.5"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-primary">
              Your recently viewed products will appear here.
            </h3>
            <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
              Explore products in the catalogue to build your browsing history and calibrate your recommendations.
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
      </section>
    </div>
  );
}
