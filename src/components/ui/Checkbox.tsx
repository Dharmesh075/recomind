'use client';

import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            <div
              className={`
                w-5 h-5 rounded border-2 transition-all duration-200
                flex items-center justify-center
                peer-checked:bg-accent peer-checked:border-accent
                peer-focus-visible:ring-2 peer-focus-visible:ring-accent/20
                group-hover:border-accent/50
                ${error ? 'border-error' : 'border-border'}
                ${className}
              `}
            >
              <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-sm text-secondary leading-snug">{label}</span>
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
