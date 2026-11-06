'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightLabel?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, rightLabel, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={props.id || props.name}
            className="text-sm font-medium text-primary"
          >
            {label}
          </label>
          {rightLabel && (
            <div className="text-sm">{rightLabel}</div>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            id={props.id || props.name}
            className={`
              w-full h-[50px] px-4 text-[15px] text-primary
              bg-white border rounded-lg
              placeholder:text-secondary/60
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-error ring-1 ring-error/20' : 'border-border'}
              ${isPassword ? 'pr-12' : ''}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
