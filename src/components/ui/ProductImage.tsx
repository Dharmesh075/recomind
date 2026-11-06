'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

export default function ProductImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  children,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative w-full aspect-[4/5] max-h-56 rounded-xl overflow-hidden bg-[#F4F6F2] border border-border/40 select-none ${containerClassName}`}
    >
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F6F2] text-secondary p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white/80 border border-border flex items-center justify-center mb-2 shadow-2xs">
            <Package className="w-6 h-6 text-secondary/70 stroke-[1.5]" />
          </div>
          <span className="text-[11px] font-medium text-secondary/80 line-clamp-1 max-w-[85%]">
            {alt}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setHasError(true)}
          className={`object-cover transition-transform duration-300 ${className}`}
        />
      )}

      {/* Floating Badges & Action Buttons (e.g. Match Score, Wishlist Heart) */}
      {children}
    </div>
  );
}
