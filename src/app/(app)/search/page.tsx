'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { searchProducts } from '@/data/products';
import ProductImage from '@/components/ui/ProductImage';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query);
  }, [query]);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
          <Search className="w-3.5 h-3.5" />
          Global Search Results
        </div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          {query ? `Results for "${query}"` : 'Search Products'}
        </h1>
        <p className="text-secondary text-sm mt-1">
          {results.length > 0
            ? `Found ${results.length} matching item${results.length === 1 ? '' : 's'} across product titles, brands, and categories.`
            : 'Explore recommendations or search for another term.'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => {
            const isFav = !!favorites[product.id];
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
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1 shadow-xs border border-border/50">
                      <Sparkles className="w-3 h-3" />
                      {product.matchScore}% Match
                    </div>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-red-50 text-red-500'
                          : 'bg-white/90 text-secondary hover:text-primary'
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </ProductImage>

                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Star className="w-3 h-3 fill-[#A86C19] text-[#A86C19]" />
                      {product.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
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
                    href={`/discover?selected=${product.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-primary">
            No matching products for &quot;{query}&quot;
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            Try searching for terms like &quot;Audio&quot;, &quot;Watch&quot;, &quot;Backpack&quot;, or &quot;Keyboard&quot;.
          </p>
          <div className="pt-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
