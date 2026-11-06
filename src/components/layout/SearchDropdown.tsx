'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { searchProducts, type Product } from '@/data/products';

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export default function SearchDropdown({
  query,
  isOpen,
  onClose,
  onSelect,
}: SearchDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const results: Product[] = trimmed ? searchProducts(trimmed).slice(0, 5) : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trimmed) return null;

  const handleViewAll = () => {
    onClose();
    onSelect();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150"
    >
      <div className="p-2 border-b border-border bg-[#F8F9F7]/70 flex items-center justify-between text-xs text-secondary px-3">
        <span>Suggested Matches</span>
        <span>{results.length} found</span>
      </div>

      {results.length > 0 ? (
        <div className="divide-y divide-border/60 max-h-[360px] overflow-y-auto">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/discover?selected=${product.id}`}
              onClick={() => {
                onClose();
                onSelect();
              }}
              className="flex items-center gap-3.5 p-3 hover:bg-[#F8F9F7] transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F8F9F7] shrink-0 border border-border/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-secondary mb-0.5">
                  <span className="font-medium uppercase tracking-wider">{product.brand}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
                <p className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-primary">
                    {product.formattedPrice}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.2 rounded">
                    <Sparkles className="w-2.5 h-2.5" />
                    {product.matchScore}% Match
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-secondary/60 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-secondary">
          <Search className="w-8 h-8 text-secondary/40 mx-auto mb-2" />
          <p className="font-medium text-primary">No products match &quot;{trimmed}&quot;</p>
          <p className="text-xs text-secondary mt-1">Try searching by category (Audio, Wearables) or brand</p>
        </div>
      )}

      {/* Footer link to full search */}
      <button
        onClick={handleViewAll}
        className="w-full p-2.5 bg-[#F8F9F7] hover:bg-gray-100 border-t border-border text-xs font-medium text-accent flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View all results for &quot;{trimmed}&quot;</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
