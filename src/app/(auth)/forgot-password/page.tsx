'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';

const resetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetFormData) => {
    await resetPassword(data.email.trim());
    setSubmittedEmail(data.email.trim());
    setSubmitted(true);
  };

  return (
    <div className="w-full flex items-center justify-center p-8 sm:p-12 bg-background min-h-screen">
      <div className="w-full max-w-[420px]">
        {/* Top brand icon */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          <div className="flex items-center gap-1.5 text-accent font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            RECOMIND
          </div>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-[28px] font-semibold text-primary mb-2">
              Reset your password
            </h1>
            <p className="text-secondary text-[15px] mb-8 leading-relaxed">
              Enter the email address associated with your account. We&apos;ll
              guide you through resetting your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="pt-2">
                <Button type="submit" fullWidth loading={isSubmitting}>
                  Send reset link
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-[28px] font-semibold text-primary mb-2">
              Check your email
            </h1>
            <p className="text-secondary text-[15px] mb-6 leading-relaxed">
              If an account exists for{' '}
              <span className="font-medium text-primary">{submittedEmail}</span>,
              we have sent instructions to reset your password.
            </p>
            <div className="mb-6">
              <Alert
                type="success"
                message="Password reset request sent. Check your inbox and spam folders."
              />
            </div>
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
              <Link
                href="/login"
                className="block text-center text-accent hover:text-accent-hover font-medium text-[15px] transition-colors py-2"
              >
                Return to login
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-secondary/70">
          Recomind Intelligent E-Commerce System
        </div>
      </div>
    </div>
  );
}
