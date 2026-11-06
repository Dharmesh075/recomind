'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Star,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import {
  getProductById,
  getSimilarProducts,
  addRecentlyViewed,
  toggleWishlist,
} from '@/data/products';
import { useWishlist } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';

  const product = getProductById(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const wishlistIds = useWishlist();
  const isSaved = product ? wishlistIds.includes(product.id) : false;

  // Automatically record this genuine product view in browsing history
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold text-primary">Product Not Found</h1>
        <p className="text-xs text-secondary leading-relaxed">
          The requested product ID does not exist in our catalog or may have been archived.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const similarProducts = getSimilarProducts(product.id, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Back to Catalogue Navigation */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Two-Column Product Overview: 55% Left / 45% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (55%): Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-white border border-border shadow-xs p-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl transition-all duration-300"
            />
            {/* Match Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1.5 shadow-xs border border-border/60">
              <Sparkles className="w-3.5 h-3.5" />
              {product.matchScore}% Personalized Match
            </div>
          </div>

          {/* Thumbnails (Only displayed if multiple images exist) */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    selectedImageIndex === idx
                      ? 'border-accent shadow-xs'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (45%): Product Information & Actions */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-secondary">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {product.brand}
            </span>
            <span className="bg-[#F8F9F7] px-2.5 py-1 rounded-md border border-border">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#A86C19]/10 text-[#A86C19] px-2.5 py-1 rounded-md text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#A86C19]" />
              {product.rating}
            </div>
            <span className="text-xs text-secondary">
              ({product.reviewsCount} verified community reviews)
            </span>
          </div>

          {/* Visually Prominent INR Price */}
          <div className="pt-2 pb-1 border-t border-b border-border/80">
            <span className="text-3xl font-bold text-primary block">
              {product.formattedPrice}
            </span>
            <span className="text-xs text-secondary mt-0.5 block">
              Inclusive of all taxes • Free express shipping
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-secondary leading-relaxed">
            {product.description}
          </p>

          {/* Recommendation Rationale */}
          <div className="bg-[#F8F9F7] border border-border rounded-xl p-3.5 text-xs text-secondary space-y-1">
            <span className="text-[11px] uppercase font-semibold text-accent flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recommendation Context:
            </span>
            <p className="leading-relaxed">{product.recommendationReason}</p>
          </div>

          {/* Key Product Attributes & Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-primary block">
                Specifications:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#F8F9F7] border border-border/60">
                    <span className="text-secondary block text-[11px]">{spec.name}</span>
                    <span className="font-semibold text-primary block mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="flex items-center gap-2 text-xs font-medium text-success pt-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>In Stock • Ready to dispatch in 24 hours</span>
          </div>

          {/* Wishlist Action Button */}
          <div className="pt-2">
            <button
              onClick={handleWishlistToggle}
              className={`w-full h-12 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                isSaved
                  ? 'bg-accent/10 border-2 border-accent text-accent'
                  : 'bg-accent text-white hover:bg-accent-hover'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-accent text-accent' : ''}`} />
              <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/70 text-center text-[11px] text-secondary">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-accent" />
              <span>Fast Dispatch</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-accent" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Authentic Gear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section (You might also like) */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-primary tracking-tight">
              You might also like
            </h2>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              Content-Based Similarity
            </span>
          </div>
          <p className="text-secondary text-sm mt-0.5">
            Products sharing key design elements, materials, and category tags with this item.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((sim) => (
            <div
              key={sim.id}
              className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <ProductImage
                  src={sim.imageUrl}
                  alt={sim.name}
                  className="group-hover:scale-105 transition-transform duration-300"
                  containerClassName="mb-3 max-h-48"
                >
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-semibold text-accent flex items-center gap-1 shadow-xs border border-border/50">
                    <Sparkles className="w-3 h-3" />
                    {sim.matchScore}% Match
                  </div>
                </ProductImage>

                <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">
                  {sim.brand}
                </span>
                <h3 className="text-sm font-semibold text-primary truncate mb-1">
                  {sim.name}
                </h3>
                <p className="text-xs text-secondary line-clamp-2 mb-3">
                  {sim.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-base font-bold text-primary">
                  {sim.formattedPrice}
                </span>
                <Link
                  href={`/products/${sim.id}`}
                  className="h-8 px-3.5 rounded-lg text-xs font-medium bg-[#F8F9F7] hover:bg-accent hover:text-white text-primary border border-border transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
