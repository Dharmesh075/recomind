'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Toast from '@/components/ui/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Sticky Top Header */}
        <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable Main Content Area with safe bottom padding for mobile bar */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 sm:p-8 lg:p-10 pb-24 md:pb-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation (< md) */}
        <MobileBottomNav />

        {/* Wishlist & Notification Toasts */}
        <Toast />
      </div>
    </div>
  );
}
