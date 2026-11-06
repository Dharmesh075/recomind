import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-border p-8 shadow-xs text-center space-y-6">
        {/* Soft Circular Icon */}
        <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>

        {/* 404 Messaging */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-secondary">
            404 Error
          </span>
          <h1 className="text-2xl font-semibold text-primary tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:flex-1 h-11 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Link>
          <Link
            href="/discover"
            className="w-full sm:flex-1 h-11 bg-[#F8F9F7] text-secondary hover:text-primary border border-border text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Discover
          </Link>
        </div>
      </div>
    </div>
  );
}
