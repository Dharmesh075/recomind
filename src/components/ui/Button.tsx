'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  fullWidth?: boolean;
}

export default function Button({
  children,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'h-[50px] min-h-[44px] px-6 rounded-lg text-[15px] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover shadow-xs hover:shadow',
    secondary:
      'bg-white text-primary border border-border hover:bg-gray-50 active:bg-gray-100 shadow-2xs',
    ghost:
      'bg-transparent text-accent hover:bg-accent/5 active:bg-accent/10',
    text:
      'bg-transparent text-secondary hover:text-accent underline-offset-4 hover:underline px-2 h-auto min-h-[44px]',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {loading ? 'Please wait...' : children}
    </button>
  );
}
