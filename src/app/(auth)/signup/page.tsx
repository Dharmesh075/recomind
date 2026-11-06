'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Alert from '@/components/ui/Alert';
import AuthBrandingPanel from '@/components/auth/AuthBrandingPanel';
import { useAuth } from '@/contexts/AuthContext';

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    terms: z
      .boolean()
      .refine((val) => val === true, 'You must accept the Terms of Service'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: 'onChange',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    const { error } = await signUp(
      data.email.trim(),
      data.password,
      data.fullName.trim()
    );
    if (error) {
      setServerError(error);
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <>
      {/* Left: Branding */}
      <div className="w-1/2 hidden lg:block">
        <AuthBrandingPanel variant="signup" />
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-background min-h-screen">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">
              RECOMIND
            </span>
          </div>

          <h1 className="text-[28px] font-semibold text-primary mb-2">
            Create your account
          </h1>
          <p className="text-secondary text-[15px] mb-8">
            Join Recomind and make product discovery more personal.
          </p>

          {serverError && (
            <div className="mb-6">
              <Alert
                type="error"
                message={serverError}
                onDismiss={() => setServerError(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Checkbox
              label={
                <span>
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-accent hover:text-accent-hover underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-accent hover:text-accent-hover underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              }
              error={errors.terms?.message}
              {...register('terms')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                loading={isSubmitting}
                disabled={!isValid}
              >
                Create Account
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-[15px] text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-accent hover:text-accent-hover font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
