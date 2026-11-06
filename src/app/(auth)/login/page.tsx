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
import Divider from '@/components/ui/Divider';
import Alert from '@/components/ui/Alert';
import AuthBrandingPanel from '@/components/auth/AuthBrandingPanel';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const { error } = await signIn(data.email.trim(), data.password);
    if (error) {
      setServerError(error);
    } else {
      router.replace('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@recomind.com', { shouldValidate: true });
    setValue('password', 'Password123', { shouldValidate: true });
  };

  return (
    <>
      {/* Left: Branding */}
      <div className="w-1/2 hidden lg:block">
        <AuthBrandingPanel variant="login" />
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
            Welcome back
          </h1>
          <p className="text-secondary text-[15px] mb-8">
            Sign in to continue discovering products.
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
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              rightLabel={
                <Link
                  href="/forgot-password"
                  className="text-accent hover:text-accent-hover transition-colors font-medium text-xs"
                >
                  Forgot password?
                </Link>
              }
              {...register('password')}
            />

            <div className="pt-2">
              <Button type="submit" fullWidth loading={isSubmitting}>
                Sign In
              </Button>
            </div>
          </form>

          {/* Academic / Demo Helper */}
          <div className="mt-4 flex items-center justify-between text-xs text-secondary/80 bg-white border border-border/80 px-3 py-2 rounded-lg">
            <span>Demo: demo@recomind.com / Password123</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-accent font-medium hover:underline ml-2 shrink-0"
            >
              Autofill
            </button>
          </div>

          <div className="mt-8">
            <Divider text="New to Recomind?" />
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-accent hover:text-accent-hover font-medium text-[15px] transition-colors"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-10 text-center text-xs text-secondary/70">
            By continuing, you agree to our{' '}
            <Link
              href="/terms"
              className="underline hover:text-primary transition-colors"
              target="_blank"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline hover:text-primary transition-colors"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
