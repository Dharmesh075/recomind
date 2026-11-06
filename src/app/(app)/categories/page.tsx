'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Grid } from 'lucide-react';
import { getCategories } from '@/data/products';

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
          <Grid className="w-3.5 h-3.5" />
          Product Discovery
        </div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          Explore categories
        </h1>
        <p className="text-secondary text-sm mt-1">
          Find products by the things you enjoy.
        </p>
      </div>

      {/* Spacious Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/discover?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-md hover:border-accent/40 transition-all duration-200 flex flex-col justify-between"
          >
            {/* Category Image Cover */}
            <div className="relative w-full aspect-[16/10] bg-[#F8F9F7] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider block">
                  Category
                </span>
                <h2 className="text-xl font-bold tracking-tight mt-0.5">
                  {category.name}
                </h2>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-secondary font-medium">
                {category.count} {category.count === 1 ? 'product' : 'products'} available
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                Explore products
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
