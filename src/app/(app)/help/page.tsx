'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does Recomind generate personalized recommendations?',
    answer:
      'Recomind utilizes a hybrid recommendation pipeline combining Content-Based Filtering and Collaborative Filtering. Content-based algorithms compute cosine similarity across product attributes (categories, keywords, materials, design aesthetics), while collaborative filtering maps co-visitation patterns and user interactions into latent embedding vectors.',
  },
  {
    question: 'What does the "Match Score" percentage indicate?',
    answer:
      'The match score represents the ensemble model confidence rank, normalized from 0% to 100%. A score of 95%+ indicates high agreement between your expressed category preferences, recent viewing history, and community correlation signals.',
  },
  {
    question: 'How can I recalibrate or update my recommendations?',
    answer:
      'You can refine your recommendation feed at any time by updating your interest clusters in My Profile, or by clicking "Recalibrate Feed" in the For You section. Saving items to your Wishlist also immediately updates your affinity weights.',
  },
  {
    question: 'Is Recomind connected to real production backends?',
    answer:
      'Recomind is designed as a full-stack e-commerce recommendation system for a B.Tech Data Science capstone project. It supports production Firebase Authentication alongside a persistent local client evaluation store for seamless offline demonstrations.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          Support & Documentation
        </div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          Help & FAQs
        </h1>
        <p className="text-secondary text-sm mt-1">
          Learn how the Recomind AI engine works and how to calibrate your discovery experience.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-primary pb-3 border-b border-border">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-border/70">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-2 last:pb-2">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-secondary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-secondary leading-relaxed animate-in fade-in-50 duration-150">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Contact Card */}
      <div className="bg-[#F0F4F1] rounded-2xl border border-border/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-primary">
            Academic Project Demonstration
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Developed for B.Tech Data Science final-semester evaluation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-accent">
          <BookOpen className="w-4 h-4" />
          <span>Documentation v1.0</span>
        </div>
      </div>
    </div>
  );
}
