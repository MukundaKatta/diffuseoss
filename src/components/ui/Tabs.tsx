'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: 'pills' | 'underline';
}

export default function Tabs({
  tabs,
  defaultTab,
  className,
  variant = 'pills',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'flex gap-1',
          variant === 'pills' && 'bg-dark-3 p-1 rounded-lg',
          variant === 'underline' && 'border-b border-dark-4'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-150',
              variant === 'pills' && [
                'rounded-md',
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-4',
              ],
              variant === 'underline' && [
                'border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-dark-5',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
