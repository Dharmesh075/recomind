'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SearchDropdown from './SearchDropdown';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

const breadcrumbMap: Record<string, { parent: string; title: string }> = {
  '/': { parent: 'Home', title: 'Overview' },
  '/dashboard': { parent: 'Home', title: 'Overview' },
  '/discover': { parent: 'Home', title: 'Discover' },
  '/recommendations': { parent: 'Home', title: 'Made for You' },
  '/for-you': { parent: 'Home', title: 'Made for You' },
  '/categories': { parent: 'Home', title: 'Categories' },
  '/wishlist': { parent: 'Home', title: 'Wishlist' },
  '/recently-viewed': { parent: 'Home', title: 'Recently Viewed' },
  '/profile': { parent: 'Home', title: 'My Profile' },
  '/settings': { parent: 'Home', title: 'Settings' },
  '/help': { parent: 'Home', title: 'Help' },
  '/search': { parent: 'Home', title: 'Search Results' },
};

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Compute breadcrumb based on active pathname
  let currentCrumb = breadcrumbMap[pathname];
  if (!currentCrumb) {
    if (pathname.startsWith('/products/')) {
      currentCrumb = { parent: 'Discover', title: 'Product Details' };
    } else {
      currentCrumb = {
        parent: 'Home',
        title: pathname.replace('/', '').replace(/-/g, ' ') || 'Overview',
      };
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-sm border-b border-border px-6 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & subtle breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-secondary hover:text-primary rounded-lg hover:bg-[#F8F9F7] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-sm text-secondary truncate">
          <Link href="/" className="hover:text-primary transition-colors">
            {currentCrumb.parent}
          </Link>
          <span className="text-secondary/50">/</span>
          <span className="font-semibold text-primary capitalize">
            {currentCrumb.title}
          </span>
        </nav>
      </div>

      {/* Center: Global Search Field */}
      <div className="flex-1 max-w-[560px] mx-auto relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-secondary/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setIsSearchOpen(true);
            }}
            placeholder="Search products, brands, or categories..."
            className="w-full h-[46px] pl-10 pr-4 text-[14px] text-primary bg-[#F8F9F7] border border-border rounded-xl placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all duration-150"
          />
        </form>

        {/* Live Search Dropdown */}
        <SearchDropdown
          query={searchQuery}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={() => setIsSearchOpen(false)}
        />
      </div>

      {/* Right: Account Access & Profile Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-transparent hover:border-border hover:bg-[#F8F9F7] transition-colors"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
            {user?.displayName ? (
              getInitials(user.displayName)
            ) : (
              <UserIcon className="w-4 h-4 text-accent" />
            )}
          </div>

          {/* User Display Name */}
          <div className="hidden md:block text-left">
            <span className="text-sm font-semibold text-primary block leading-none truncate max-w-[140px]">
              {user?.displayName || 'My Account'}
            </span>
            <span className="text-[11px] text-secondary">Shopper</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-secondary transition-transform duration-200 ${
              isProfileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Profile Popover Menu */}
        <ProfileDropdown
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </header>
  );
}
