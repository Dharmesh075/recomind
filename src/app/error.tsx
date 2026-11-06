'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production or development, log error internally without showing raw stack to user
    console.error('Handled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-border p-8 shadow-xs text-center space-y-6">
        {/* Soft Circular Alert Icon */}
        <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        {/* User-Friendly Error Messaging */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary tracking-tight">
            We couldn&apos;t load your recommendations
          </h2>
          <p className="text-sm text-secondary leading-relaxed">
            An unexpected error occurred while loading this page. Please try again or return to your overview.
          </p>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 h-11 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:flex-1 h-11 bg-[#F8F9F7] text-secondary hover:text-primary border border-border text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
