'use client';

import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
}

export default function Alert({ type, message, onDismiss }: AlertProps) {
  const styles = {
    success: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      text: 'text-success',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-error/5',
      border: 'border-error/20',
      text: 'text-error',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      text: 'text-warning',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-accent/5',
      border: 'border-accent/20',
      text: 'text-accent',
      Icon: AlertCircle,
    },
  };

  const { bg, border, text, Icon } = styles[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${bg} ${border}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${text} shrink-0 mt-0.5`} />
      <p className={`text-sm ${text} flex-1`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${text} hover:opacity-70 transition-opacity shrink-0`}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
