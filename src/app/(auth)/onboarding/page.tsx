'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Headphones,
  Laptop,
  Coffee,
  ShoppingBag,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCategories } from '@/data/products';
import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updatePreferences } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Audio',
    'Workspace',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if onboarding is already completed for this user
  useEffect(() => {
    if (user?.uid) {
      const isDone = localStorage.getItem(`recomind_onboarding_completed_${user.uid}`);
      if (isDone === 'true') {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);

  const categoryMeta: Record<
    string,
    { icon: React.ElementType; desc: string; sample: string }
  > = {
    Audio: {
      icon: Headphones,
      desc: 'Noise-cancelling headphones, spatial earbuds & DAC audio gear.',
      sample: 'Sony, Sora, Sennheiser',
    },
    Workspace: {
      icon: Laptop,
      desc: 'Mechanical keyboards, ergonomic desk pads & aluminum stands.',
      sample: 'Keychron, Atelier Nord',
    },
    'Home & Living': {
      icon: Coffee,
      desc: 'Pour-over carafes, insulated tumblers & ceramic diffusers.',
      sample: 'Kanso Studio, Fellow',
    },
    Lifestyle: {
      icon: ShoppingBag,
      desc: 'Waxed canvas weekender bags, organizers & minimalist EDC.',
      sample: 'Bellroy, Craft & Carry',
    },
  };

  const categories = getCategories();

  const handleToggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const completeOnboarding = (catsToSave: string[]) => {
    setIsSubmitting(true);
    if (user?.uid) {
      localStorage.setItem(`recomind_onboarding_completed_${user.uid}`, 'true');
    }
    updatePreferences(catsToSave);
    setTimeout(() => {
      router.replace('/dashboard');
    }, 400);
  };

  const handleContinue = () => {
    completeOnboarding(selectedCategories);
  };

  const handleSkip = () => {
    completeOnboarding(['Audio', 'Workspace']); // fallback default
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 sm:p-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-sm space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-white shadow-xs mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Let&apos;s personalize your experience
          </h1>
          <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
            Choose a few categories you&apos;re interested in. You can change these preferences at any time.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name);
            const meta = categoryMeta[cat.name] || {
              icon: ShoppingBag,
              desc: `${cat.count} curated products`,
              sample: 'Popular Gear',
            };
            const Icon = meta.icon;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleToggleCategory(cat.name)}
                className={`
                  p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group
                  ${
                    isSelected
                      ? 'bg-[#F0F4F1] border-accent ring-1 ring-accent/30 shadow-xs'
                      : 'bg-white border-border hover:border-gray-300 hover:bg-gray-50/50'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-accent text-white'
                        : 'bg-[#F8F9F7] text-secondary group-hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-accent text-white'
                        : 'border-2 border-border bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-base font-semibold ${
                      isSelected ? 'text-primary' : 'text-primary'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    {meta.desc}
                  </p>
                  <span className="text-[11px] text-secondary/80 font-medium block mt-2">
                    Features: {meta.sample}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer order-2 sm:order-1"
          >
            Skip for now
          </button>

          <Button
            type="button"
            onClick={handleContinue}
            loading={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 text-sm font-semibold order-1 sm:order-2 flex items-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
