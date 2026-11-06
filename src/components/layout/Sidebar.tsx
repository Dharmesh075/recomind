'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Search,
  Sparkles,
  Grid,
  Heart,
  Clock,
  User,
  Settings,
  HelpCircle,
  Binary,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const menuItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { label: 'Discover', href: '/discover', icon: Search },
  { label: 'For You', href: '/recommendations', icon: Sparkles },
  { label: 'Categories', href: '/categories', icon: Grid },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Recently Viewed', href: '/recently-viewed', icon: Clock },
];

const academicItems: NavItem[] = [
  { label: 'Model Evaluation', href: '/evaluation', icon: Binary },
];

const accountItems: NavItem[] = [
  { label: 'My Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help', href: '/help', icon: HelpCircle },
];

export default function Sidebar({
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderNavLinks = (items: NavItem[]) => {
    return (
      <ul className="space-y-1">
        {items.map((item) => {
          const active = isItemActive(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={`
                  group relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150
                  ${
                    active
                      ? 'bg-[#F0F4F1] text-primary font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-[#F8F9F7]'
                  }
                `}
              >
                {/* Left vertical active bar */}
                {active && (
                  <span
                    className="absolute -left-3 inset-y-1.5 w-1 bg-accent rounded-r"
                    aria-hidden="true"
                  />
                )}

                <Icon
                  className={`
                    w-4 h-4 shrink-0 transition-colors
                    ${active ? 'text-accent' : 'text-secondary group-hover:text-primary'}
                  `}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border w-[250px]">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-border/80 shrink-0">
        <Link href="/" className="flex items-center gap-2.5" onClick={onMobileClose}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-primary tracking-tight leading-none block">
              RECOMIND
            </span>
            <span className="text-[10px] text-secondary font-medium tracking-wide">
              RECOMMENDATION SYSTEM
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* MENU Section */}
        <div>
          <span className="px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-2">
            MENU
          </span>
          {renderNavLinks(menuItems)}
        </div>

        {/* Subtle Divider */}
        <hr className="border-border/80 my-4" />

        {/* ACADEMIC Section */}
        <div>
          <span className="px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-2">
            ACADEMIC DEMO
          </span>
          {renderNavLinks(academicItems)}
        </div>

        {/* Subtle Divider */}
        <hr className="border-border/80 my-4" />

        {/* ACCOUNT Section */}
        <div>
          <span className="px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-2">
            ACCOUNT
          </span>
          {renderNavLinks(accountItems)}
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-border/80 bg-[#F8F9F7]/50 shrink-0">
        <div className="text-[11px] text-secondary flex items-center justify-between">
          <span>Recomind Engine v1.0</span>
          <span className="inline-flex items-center gap-1 text-accent font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-[250px] shrink-0 sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative z-10 w-[250px] max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
