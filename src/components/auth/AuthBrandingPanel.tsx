import React from 'react';
import { ShoppingBag, Star, Heart, Sparkles, TrendingUp } from 'lucide-react';

interface AuthBrandingPanelProps {
  variant: 'login' | 'signup';
}

const content = {
  login: {
    headline: 'Discover products that fit you.',
    description:
      'Explore a smarter shopping experience with recommendations tailored to your interests.',
  },
  signup: {
    headline: 'Your next great find starts here.',
    description:
      'Create your account to explore products, build your wishlist, and discover recommendations based on your interests.',
  },
};

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  rating: string;
  matchScore: string;
  imageUrl: string;
  rotation: string;
  offset: string;
  zIndex: string;
}

function ProductDiscoveryCard({
  name,
  category,
  price,
  rating,
  matchScore,
  imageUrl,
  rotation,
  offset,
  zIndex,
}: ProductCardProps) {
  return (
    <div
      className={`absolute ${offset} ${rotation} ${zIndex} bg-white rounded-2xl shadow-xl shadow-[#20251F]/5 border border-border p-3.5 w-[210px] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-30`}
    >
      <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#F8F9F7] mb-3 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-medium text-accent flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3 h-3" />
          {matchScore}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
        <span className="font-medium uppercase tracking-wider">{category}</span>
        <span className="flex items-center gap-0.5 font-medium text-[#20251F]">
          <Star className="w-3 h-3 fill-[#A86C19] text-[#A86C19]" />
          {rating}
        </span>
      </div>

      <p className="text-[13px] font-semibold text-primary truncate leading-tight mb-1">
        {name}
      </p>
      <p className="text-[14px] text-accent font-bold">{price}</p>
    </div>
  );
}

export default function AuthBrandingPanel({ variant }: AuthBrandingPanelProps) {
  const { headline, description } = content[variant];

  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#F0F4F1] min-h-screen p-12 lg:p-14 relative overflow-hidden border-r border-border">
      {/* Background subtle decoration circle */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/5 pointer-events-none blur-2xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/10 pointer-events-none blur-3xl" />

      {/* Top: Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary tracking-tight block leading-none">
              RECOMIND
            </span>
            <span className="text-[11px] text-secondary font-medium tracking-wide">
              INTELLIGENT E-COMMERCE
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Headline + Visual Collage */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-border text-accent text-xs font-semibold w-fit mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          Hybrid Recommendation Engine
        </div>

        <h1 className="text-[34px] xl:text-[38px] leading-[1.2] font-semibold text-primary max-w-[420px] mb-4 tracking-tight">
          {headline}
        </h1>
        <p className="text-[15px] text-secondary max-w-[390px] leading-relaxed mb-10">
          {description}
        </p>

        {/* Product Cards Visual Collage */}
        <div className="relative h-[290px] w-full max-w-[460px]">
          <ProductDiscoveryCard
            name="Studio Wireless NC"
            category="Audio"
            price="$89.00"
            rating="4.9"
            matchScore="98% Match"
            imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
            rotation="-rotate-3"
            offset="top-0 left-0"
            zIndex="z-10"
          />
          <ProductDiscoveryCard
            name="Horizon Smartwatch"
            category="Wearables"
            price="$199.00"
            rating="4.8"
            matchScore="95% Match"
            imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
            rotation="rotate-3"
            offset="top-6 left-[195px]"
            zIndex="z-20"
          />
          <ProductDiscoveryCard
            name="Minimal Canvas Pack"
            category="Lifestyle"
            price="$64.00"
            rating="4.9"
            matchScore="92% Match"
            imageUrl="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80"
            rotation="-rotate-1"
            offset="top-[150px] left-[70px]"
            zIndex="z-10"
          />
        </div>
      </div>

      {/* Bottom: Trust & Feature Indicators */}
      <div className="relative z-10 flex items-center gap-6 text-secondary text-[13px] pt-4 border-t border-border/80">
        <span className="flex items-center gap-1.5 font-medium">
          <ShoppingBag className="w-4 h-4 text-accent" /> 10,000+ Products
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-4 h-4 text-accent" /> AI Personalized
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Heart className="w-4 h-4 text-accent" /> Curated Picks
        </span>
      </div>
    </div>
  );
}
