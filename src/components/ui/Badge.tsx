'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-dark-4 text-gray-300',
    success: 'bg-green-900/50 text-green-400 border-green-800',
    warning: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    danger: 'bg-red-900/50 text-red-400 border-red-800',
    info: 'bg-brand-900/50 text-brand-400 border-brand-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border border-transparent',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
