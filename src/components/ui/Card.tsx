'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  padding?: boolean;
}

export default function Card({
  title,
  subtitle,
  children,
  className,
  headerAction,
  padding = true,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-2 border border-dark-4 rounded-xl overflow-hidden',
        className
      )}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-dark-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={cn(padding && 'p-5')}>{children}</div>
    </div>
  );
}
