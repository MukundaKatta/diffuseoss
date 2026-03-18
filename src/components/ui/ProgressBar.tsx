'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient';
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500 font-mono">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-dark-4 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variant === 'default' && 'bg-brand-500',
            variant === 'gradient' &&
              'bg-gradient-to-r from-brand-600 via-purple-500 to-pink-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
