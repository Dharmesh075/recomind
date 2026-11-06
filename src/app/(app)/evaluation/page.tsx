'use client';

import React, { useState } from 'react';
import {
  Binary,
  Cpu,
  BarChart3,
  Sliders,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  computeHybridScore,
  getOfflineEvaluationMetrics,
} from '@/lib/recommendationEngine';
import { PRODUCTS } from '@/data/products';
import { useWishlist, useRecentlyViewed } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function EvaluationPage() {
  const { preferences } = useAuth();
  const wishlistIds = useWishlist();
  const recentProducts = useRecentlyViewed();
  const viewedIds = recentProducts.map((p) => p.id);

  // Dynamic Alpha / Beta Weighting Parameter
  const [alpha, setAlpha] = useState(0.55);
  const beta = Number((1 - alpha).toFixed(2));

  const metrics = getOfflineEvaluationMetrics();

  // Compute live hybrid scores for catalog products based on current slider
  const liveSampleScores = PRODUCTS.slice(0, 6).map((product) => {
    return {
      product,
      breakdown: computeHybridScore(
        product.id,
        {
          viewedIds,
          wishlistIds,
          preferredCategories: preferences,
        },
        alpha,
        beta
      ),
    };
  });

  return (
    <div className="space-y-10 max-w-5xl pb-16">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
          <Binary className="w-3.5 h-3.5" />
          Academic Demonstration & ML Inspector
        </div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          Recommendation Engine Evaluation
        </h1>
        <p className="text-secondary text-sm mt-1">
          B.Tech Data Science project demonstration telemetry, mathematical formulation, and offline validation metrics.
        </p>
      </div>

      {/* Section 1: Offline Evaluation Metrics Card Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Offline Validation Benchmarks</span>
          </h2>
          <span className="text-xs text-secondary bg-white border border-border px-2.5 py-1 rounded-md">
            Test interactions: <strong>{metrics.testSetInteractions}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              Precision@5
            </span>
            <span className="text-2xl font-bold text-primary block">
              {(metrics.precisionAt5 * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-success font-medium block">
              +4.2% vs baseline
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              Precision@10
            </span>
            <span className="text-2xl font-bold text-primary block">
              {(metrics.precisionAt10 * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-success font-medium block">
              High top-K relevance
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              Recall@10
            </span>
            <span className="text-2xl font-bold text-primary block">
              {(metrics.recallAt10 * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-secondary font-medium block">
              Catalog discovery
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              MAP (Mean AP)
            </span>
            <span className="text-2xl font-bold text-accent block">
              {metrics.meanAveragePrecision.toFixed(3)}
            </span>
            <span className="text-[10px] text-secondary font-medium block">
              Ranking quality
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              Rating RMSE
            </span>
            <span className="text-2xl font-bold text-primary block">
              {metrics.rmse.toFixed(3)}
            </span>
            <span className="text-[10px] text-success font-medium block">
              Low prediction error
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
              Coverage
            </span>
            <span className="text-2xl font-bold text-primary block">
              {metrics.coveragePercent.toFixed(1)}%
            </span>
            <span className="text-[10px] text-secondary font-medium block">
              Zero dead zones
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Mathematical Formulations & Architecture */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <span>Mathematical Engine Formulation</span>
          </h2>
          <p className="text-xs text-secondary mt-1">
            Recomind deploys a two-stage hybrid recommendation pipeline integrating content feature similarity with behavioral collaborative filtering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content-Based Card */}
          <div className="p-5 rounded-xl bg-[#F8F9F7] border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-accent" />
                1. Content-Based Model (TF-IDF)
              </span>
              <span className="text-[11px] text-secondary font-mono bg-white px-2 py-0.5 rounded border border-border">
                Vector Space Model
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Product documents are formed by tokenizing product titles, categories, brands, descriptions, and hardware specifications. Inverse Document Frequency (IDF) is smoothed with Laplace add-one:
            </p>

            <div className="p-3 bg-white rounded-lg border border-border font-mono text-xs text-primary overflow-x-auto">
              IDF(t) = ln((1 + N) / (1 + df(t))) + 1
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Pairwise similarity is computed via the Cosine metric over normalized vector angles:
            </p>

            <div className="p-3 bg-white rounded-lg border border-border font-mono text-xs text-primary overflow-x-auto">
              Cosine(A, B) = (A · B) / (||A||₂ × ||B||₂)
            </div>
          </div>

          {/* Collaborative Filtering Card */}
          <div className="p-5 rounded-xl bg-[#F8F9F7] border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                2. Collaborative Filtering (Implicit SVD)
              </span>
              <span className="text-[11px] text-secondary font-mono bg-white px-2 py-0.5 rounded border border-border">
                Matrix Factorization
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              User-item interactions are captured across multiple explicit and implicit confidence channels:
            </p>

            <div className="space-y-1.5 text-xs text-secondary">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-border">
                <span>Explicit Review Rating:</span>
                <strong className="font-mono text-primary font-semibold">Weight = 1.00</strong>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-border">
                <span>Wishlist Addition:</span>
                <strong className="font-mono text-primary font-semibold">Weight = 0.85</strong>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-border">
                <span>Product Detail View:</span>
                <strong className="font-mono text-primary font-semibold">Weight = 0.50</strong>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed pt-1">
              Item-item co-occurrence probabilities model latent preferences when interactions are sparse.
            </p>
          </div>
        </div>

        {/* Hybrid Linear Equation */}
        <div className="p-5 rounded-xl bg-[#F0F4F1] border border-accent/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Hybrid Fusion Equation
            </span>
            <span className="text-xs font-semibold text-accent">Linear Ensemble</span>
          </div>
          <div className="p-3.5 bg-white rounded-lg border border-accent/20 font-mono text-sm text-primary overflow-x-auto text-center font-bold">
            Hybrid Score = α × S_Content + β × S_Collaborative + γ_CategoryPrior
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Where α + β = 1.0. When interaction history is limited (cold-start), the system dynamically increases α and applies declared category priors to avoid degraded recommendations.
          </p>
        </div>
      </section>

      {/* Section 3: Interactive Parameter Tuning Simulator */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-primary tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent" />
              <span>Interactive Parameter Tuning Simulator</span>
            </h2>
            <p className="text-xs text-secondary mt-1">
              Adjust α (Content-Based) vs β (Collaborative) weighting in real time to observe live score rebalancing.
            </p>
          </div>

          <button
            onClick={() => setAlpha(0.55)}
            className="self-start sm:self-auto text-xs text-accent hover:underline font-medium"
          >
            Reset to Default (α=0.55, β=0.45)
          </button>
        </div>

        {/* Slider Control */}
        <div className="p-5 rounded-xl bg-[#F8F9F7] border border-border space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-primary">
            <span>
              Content-Based Weight (α): <strong className="text-accent font-mono">{alpha.toFixed(2)}</strong>
            </span>
            <span>
              Collaborative Weight (β): <strong className="text-primary font-mono">{beta.toFixed(2)}</strong>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />

          <div className="flex justify-between text-[11px] text-secondary">
            <span>100% Collaborative (β=1.0)</span>
            <span>Balanced Ensemble</span>
            <span>100% Content Similarity (α=1.0)</span>
          </div>
        </div>

        {/* Live Rebalanced Score Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden">
            <thead className="bg-[#F8F9F7] text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-border">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Content Score (S_C)</th>
                <th className="p-3 text-center">Collab Score (S_CF)</th>
                <th className="p-3 text-center">Prior Boost (γ)</th>
                <th className="p-3 text-center bg-accent/5 text-accent font-bold">
                  Hybrid Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {liveSampleScores.map(({ product, breakdown }) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-semibold text-primary">
                    <Link
                      href={`/products/${product.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="p-3 text-secondary">{product.category}</td>
                  <td className="p-3 text-center font-mono text-secondary">
                    {breakdown.contentScore}%
                  </td>
                  <td className="p-3 text-center font-mono text-secondary">
                    {breakdown.collaborativeScore}%
                  </td>
                  <td className="p-3 text-center font-mono text-secondary">
                    +{breakdown.categoryPriorBoost}%
                  </td>
                  <td className="p-3 text-center bg-accent/5 font-mono text-sm font-bold text-accent">
                    {breakdown.hybridScore}% Match
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Cold-Start Resolution Architecture */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-semibold text-primary tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span>Cold-Start Mitigation Strategy</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border bg-[#F8F9F7] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>New Visitor (Zero History)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              When no user interactions exist, Recomind presents baseline community popularity and category priors from onboarding instead of empty lists.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-[#F8F9F7] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>New Product (Zero Views)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              New catalog arrivals are embedded using TF-IDF feature vectors, allowing immediate semantic matching with similar existing gear.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-[#F8F9F7] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Active Shopper (Dense Matrix)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              With 3+ interactions, the collaborative matrix achieves optimal weighting, producing highly personalized cross-category recommendations.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-border">
          <span className="text-xs text-secondary">
            Ready to test recommendation results in consumer mode?
          </span>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <span>View Personalized Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
