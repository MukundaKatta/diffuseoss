'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface EducationalTooltipProps {
  title: string;
  explanation: string;
  formula?: string;
  learnMoreUrl?: string;
  children: React.ReactNode;
  className?: string;
}

export default function EducationalTooltip({
  title,
  explanation,
  formula,
  learnMoreUrl,
  children,
  className,
}: EducationalTooltipProps) {
  const { educationalMode } = useAppStore();
  const [expanded, setExpanded] = useState(false);

  if (!educationalMode) return <>{children}</>;

  return (
    <div className={cn('relative group', className)}>
      <div className="relative">
        {children}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white rounded-full
            text-xs font-bold flex items-center justify-center hover:bg-green-500
            transition-colors shadow-lg z-10"
        >
          ?
        </button>
      </div>
      {expanded && (
        <div className="absolute z-50 top-full left-0 mt-2 w-80 bg-dark-2 border border-green-800/50
          rounded-xl shadow-xl p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-green-400">{title}</h4>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{explanation}</p>
          {formula && (
            <div className="bg-dark-3 rounded-lg p-3 border border-dark-5">
              <p className="text-xs font-mono text-brand-300">{formula}</p>
            </div>
          )}
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              Learn more
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
