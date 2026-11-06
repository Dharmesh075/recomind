import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-primary py-12 px-6 sm:px-12 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recomind
          </Link>
          <div className="flex items-center gap-2 font-bold text-accent">
            <Sparkles className="w-4 h-4" />
            RECOMIND
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-border pb-6">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider bg-accent/5 px-3 py-1 rounded-full mb-3">
              <Lock className="w-3.5 h-3.5" />
              Privacy & Data Protection
            </div>
            <h1 className="text-3xl font-semibold text-primary">Privacy Policy</h1>
            <p className="text-secondary text-sm mt-2">
              Last updated: October 2026 • Recomind E-Commerce Recommendation System
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">1. Information We Collect</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We collect information necessary to personalize your shopping experience, including:
            </p>
            <ul className="list-disc pl-5 text-secondary text-sm space-y-1">
              <li>Account information (Name, Email address)</li>
              <li>Authentication credentials (securely encrypted / hashed)</li>
              <li>Product interaction signals (views, favorites, search history, clicks)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">2. How We Use Recommendation Data</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Interaction signals are used solely to train and evaluate the Recomind hybrid recommendation pipeline (Content-Based Filtering + Collaborative Filtering). We do not sell or monetize personal browsing history to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">3. Data Security & Storage</h2>
            <p className="text-secondary text-sm leading-relaxed">
              All user records are protected using industry-standard hashing protocols (SHA-256 / Firebase Security Rules). You have full control to clear your interaction history or delete your account at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
