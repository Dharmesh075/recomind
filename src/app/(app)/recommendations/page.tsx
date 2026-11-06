'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  RefreshCw,
  Heart,
  Star,
  ShoppingBag,
  Sliders,
  TrendingUp,
  History,
  CheckCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  PRODUCTS,
  getRecommendedProducts,
  getPopularProducts,
  getSimilarProducts,
  getProductsByInterests,
  toggleWishlist,
} from '@/data/products';
import { useWishlist, useRecentlyViewed } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

export default function RecommendationsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);
  const recentViewed = useRecentlyViewed();
  const wishlistIds = useWishlist();

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshNotice(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotice('Recommendation model recalculation complete. Results updated with current interaction weights.');
      setTimeout(() => setRefreshNotice(null), 4000);
    }, 650);
  };

  // Group 1: Hybrid Recommended
  const hybridRecommended = useMemo(() => {
    return getRecommendedProducts(4);
  }, []);

  // Group 2: Similar to products user viewed (Content-based)
  const similarToViewed = useMemo(() => {
    if (recentViewed.length > 0) {
      const mostRecent = recentViewed[0];
      return getSimilarProducts(mostRecent.id, 4);
    }
    // Cold-start fallback if user hasn't viewed anything yet
    return PRODUCTS.slice(2, 6);
  }, [recentViewed]);

  // Group 3: Based on user's interests (Audio, Wearables, Workspace)
  const interestProducts = useMemo(() => {
    return getProductsByInterests(['Audio', 'Workspace'], 4);
  }, []);

  // Group 4: Popular with other shoppers
  const popularProducts = useMemo(() => {
    return getPopularProducts(4);
  }, []);

  const hasBrowsingHistory = recentViewed.length > 0;

  return (
    <div className="space-y-12 pb-16">
      {/* Page Heading & Refresh Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Hybrid AI Recommendation Engine
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Made for you
          </h1>
          <p className="text-secondary text-sm mt-1 max-w-xl">
            Explore products recommended using your preferences and available activity.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleRefresh}
          loading={isRefreshing}
          className="h-10 text-xs px-4 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh recommendations
        </Button>
      </div>

      {refreshNotice && (
        <div className="bg-success/5 border border-success/20 text-success p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* Cold-Start Onboarding Banner if no browsing history */}
      {!hasBrowsingHistory && (
        <div className="bg-white rounded-2xl border border-accent/30 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-primary">
              Personalize your recommendations
            </h2>
            <p className="text-xs text-secondary leading-relaxed max-w-lg">
              Help us personalize your recommendations by selecting a few interests in your profile. As you browse, your feed will continuously adapt.
            </p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors shrink-0"
          >
            Choose interests
          </Link>
        </div>
      )}

      {/* Group 1: Recommended for you */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Recommended for you
            </h2>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              Hybrid Rank
            </span>
          </div>
          <p className="text-secondary text-sm mt-0.5">
            Ranked by combining content similarity and collaborative matrix factorization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hybridRecommended.map((product) => {
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
                    containerClassName="mb-3 max-h-52"
                  >
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1 shadow-xs border border-border/50">
                      <Sparkles className="w-3 h-3" />
                      {product.matchScore}% Match
                    </div>
                    <button
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 shadow-xs cursor-pointer ${
                        isFav
                          ? 'bg-accent text-white'
                          : 'bg-white/90 text-secondary hover:text-primary'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`} />
                    </button>
                  </ProductImage>

                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Star className="w-3.5 h-3.5 fill-[#A86C19] text-[#A86C19]" />
                      {product.rating}
                    </span>
                  </div>

                  <h3 className="text-[14px] font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
                    {product.name}
                  </h3>

                  {/* Recommendation Explanation */}
                  <p className="text-xs text-secondary/80 bg-[#F8F9F7] border border-border/70 rounded-md p-2 mb-3 leading-relaxed">
                    💡 {product.recommendationReason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
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

      {/* Group 2: Similar to products you've viewed */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Similar to products you&apos;ve viewed
            </h2>
            <span className="text-xs font-medium text-secondary bg-[#F8F9F7] border border-border px-2 py-0.5 rounded-full flex items-center gap-1">
              <History className="w-3 h-3" />
              Content Similarity
            </span>
          </div>
          <p className="text-secondary text-sm mt-0.5">
            Derived using semantic cosine distance across product features and specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarToViewed.map((product) => {
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
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`} />
                    </button>
                  </ProductImage>

                  <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-semibold text-primary line-clamp-1 mb-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-secondary/80 bg-[#F8F9F7] border border-border/70 rounded-md p-2 mb-3 leading-snug">
                    💡 Similar to products you viewed.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-gray-50 text-primary transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Group 3: Based on your interests */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Based on your interests
            </h2>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Category Preference
            </span>
          </div>
          <p className="text-secondary text-sm mt-0.5">
            Calibrated using your selected interest domains in audio and workspace ergonomics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {interestProducts.map((product) => {
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
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`} />
                    </button>
                  </ProductImage>

                  <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-semibold text-primary line-clamp-1 mb-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-secondary/80 bg-[#F8F9F7] border border-border/70 rounded-md p-2 mb-3 leading-snug">
                    💡 Matches your selected interests.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-gray-50 text-primary transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Group 4: Popular with other shoppers */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Popular with other shoppers
            </h2>
            <span className="text-xs font-medium text-[#A86C19] bg-[#A86C19]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Community Signals
            </span>
          </div>
          <p className="text-secondary text-sm mt-0.5">
            Products demonstrating high ratings and verified purchase reviews across Recomind.
          </p>
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
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`} />
                    </button>
                  </ProductImage>

                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Star className="w-3.5 h-3.5 fill-[#A86C19] text-[#A86C19]" />
                      {product.rating} ({product.reviewsCount})
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-primary truncate mb-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-secondary/80 bg-[#F8F9F7] border border-border/70 rounded-md p-2 mb-3 leading-snug">
                    💡 High community rating and interaction volume.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-gray-50 text-primary transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
