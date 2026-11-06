'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  ShoppingBag,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';
import {
  PRODUCTS,
  getCategories,
  getBrands,
  toggleWishlist,
} from '@/data/products';
import { useWishlist } from '@/lib/store';
import ProductImage from '@/components/ui/ProductImage';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);

  if (categoryParam !== prevCategoryParam) {
    setPrevCategoryParam(categoryParam);
    setSelectedCategory(categoryParam);
  }

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating'>('match');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const wishlistIds = useWishlist();

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const categories = useMemo(() => {
    return ['All', ...getCategories().map((c) => c.name)];
  }, []);

  const brands = useMemo(() => {
    return ['All', ...getBrands()];
  }, []);

  const isFilterActive =
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    priceRange !== 'all' ||
    minRating > 0 ||
    searchFilter.trim().length > 0;

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange('all');
    setMinRating(0);
    setSearchFilter('');
    setSortBy('match');
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Price range filter
    if (priceRange === 'under-2000') {
      result = result.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-5000') {
      result = result.filter((p) => p.price >= 2000 && p.price <= 5000);
    } else if (priceRange === 'above-5000') {
      result = result.filter((p) => p.price > 5000);
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Text search query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'match') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, selectedBrand, priceRange, minRating, searchFilter, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Discover products
          </h1>
          <p className="text-secondary text-sm mt-1">
            Explore products across your favourite categories.
          </p>
        </div>

        {/* Mobile Filters Toggle Button */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-xs font-medium text-primary shadow-xs self-start"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span>Filters</span>
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-accent" />
          )}
        </button>
      </div>

      {/* Horizontal Desktop Filter Controls */}
      <div className="hidden lg:block bg-white rounded-2xl border border-border p-5 shadow-xs space-y-4">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors
                  ${
                    isSelected
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-[#F8F9F7] text-secondary hover:text-primary hover:bg-gray-100 border border-border/80'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Search, Brand, Price, Rating, Sort & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 pl-8 pr-3 text-xs bg-[#F8F9F7] border border-border rounded-lg placeholder:text-secondary/60 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-9 px-3 text-xs bg-[#F8F9F7] border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
              aria-label="Filter by brand"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Brands' : b}
                </option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="h-9 px-3 text-xs bg-[#F8F9F7] border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
              aria-label="Filter by price range"
            >
              <option value="all">All Prices</option>
              <option value="under-2000">Under ₹2,000</option>
              <option value="2000-5000">₹2,000 – ₹5,000</option>
              <option value="above-5000">Above ₹5,000</option>
            </select>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-9 px-3 text-xs bg-[#F8F9F7] border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
              aria-label="Filter by minimum rating"
            >
              <option value={0}>All Ratings</option>
              <option value={4.8}>4.8+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>

            {/* Clear Filters Action */}
            {isFilterActive && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-error hover:underline px-2 py-1 rounded"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs text-secondary font-medium whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'match' | 'price-asc' | 'price-desc' | 'rating')
              }
              className="h-9 px-3 text-xs font-medium bg-[#F8F9F7] border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
            >
              <option value="match">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-secondary px-1">
        <span>
          <strong className="text-primary font-semibold">{filteredProducts.length}</strong>{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'} found
        </span>
        {selectedCategory !== 'All' && (
          <span className="font-medium text-accent bg-accent/5 px-2.5 py-0.5 rounded-full border border-accent/20">
            Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Product Grid: 3 cols at ~1200px, 4 on extra wide, 2 on tablet, 1-2 on mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFav = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container (~4:5 aspect ratio) with neutral placeholder fallback */}
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

                  {/* Short Description */}
                  <p className="text-xs text-secondary line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Prominent Price & Action */}
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
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto space-y-3">
          <Filter className="w-10 h-10 text-secondary/40 mx-auto mb-2" />
          <h2 className="text-lg font-semibold text-primary">No products found</h2>
          <p className="text-xs text-secondary leading-relaxed">
            Try a different search or adjust your filters to see more results.
          </p>
          <div className="pt-2">
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative z-10 bg-white w-[300px] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-semibold text-primary">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-secondary hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-secondary block mb-2">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        selectedCategory.toLowerCase() === c.toLowerCase()
                          ? 'bg-accent text-white border-accent'
                          : 'bg-[#F8F9F7] text-secondary border-border'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-medium text-secondary block mb-1.5">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-[#F8F9F7] border border-border rounded-lg text-primary"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b === 'All' ? 'All Brands' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-medium text-secondary block mb-1.5">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-[#F8F9F7] border border-border rounded-lg text-primary"
                >
                  <option value="all">All Prices</option>
                  <option value="under-2000">Under ₹2,000</option>
                  <option value="2000-5000">₹2,000 – ₹5,000</option>
                  <option value="above-5000">Above ₹5,000</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-2">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full h-10 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover"
              >
                Apply Filters
              </button>
              {isFilterActive && (
                <button
                  onClick={clearAllFilters}
                  className="w-full h-10 bg-[#F8F9F7] text-secondary text-xs font-semibold rounded-lg hover:text-error"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
