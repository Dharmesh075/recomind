'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Heart, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  if (!isOpen) return null;

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.replace('/login');
  };

  const menuItems = [
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-border shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
    >
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-border/80">
        <p className="text-sm font-semibold text-primary truncate">
          {user?.displayName || 'User'}
        </p>
        <p className="text-xs text-secondary truncate mt-0.5">
          {user?.email || 'user@example.com'}
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3" />
          <span>Active Recommendation Profile</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-[#F8F9F7] hover:text-accent transition-colors"
            >
              <Icon className="w-4 h-4 text-secondary group-hover:text-accent" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="border-t border-border/80 pt-1">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-error" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
