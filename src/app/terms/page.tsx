import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
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
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal & Compliance
            </div>
            <h1 className="text-3xl font-semibold text-primary">Terms of Service</h1>
            <p className="text-secondary text-sm mt-2">
              Last updated: October 2026 • Recomind E-Commerce Recommendation System
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">1. Acceptance of Terms</h2>
            <p className="text-secondary text-sm leading-relaxed">
              By accessing and using Recomind (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Recomind is developed as an intelligent e-commerce demonstration platform providing personalized product recommendations through machine learning algorithms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">2. User Accounts & Security</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or security breach.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">3. Personalized Recommendations</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Recomind utilizes hybrid recommendation methodologies—combining content-based filtering, collaborative filtering, and implicit interaction feedback—to generate product suggestions. Recommendations are generated algorithmically and are tailored to enhance discovery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">4. Data Science Academic Project Notice</h2>
            <p className="text-secondary text-sm leading-relaxed">
              This system is deployed as part of a B.Tech Data Science project demonstration and research portfolio. Product listings, ratings, and demonstration accounts are presented for evaluation and prototyping purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
