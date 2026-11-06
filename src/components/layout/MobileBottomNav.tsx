'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Search, Sparkles, Heart } from 'lucide-react';
import { useWishlist } from '@/lib/store';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const wishlistIds = useWishlist();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutGrid },
    { label: 'Discover', href: '/discover', icon: Search },
    { label: 'For You', href: '/recommendations', icon: Sparkles },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistIds.length },
  ];

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isItemActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center h-full min-w-[48px] min-h-[48px] py-1 transition-colors relative
                ${active ? 'text-accent font-semibold' : 'text-secondary hover:text-primary'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-accent' : 'text-secondary'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
