'use client';

import { cn } from '@/lib/utils';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  description?: string;
  className?: string;
}

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  description,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm font-mono text-brand-400">
          {typeof value === 'number' && !Number.isInteger(step)
            ? value.toFixed(2)
            : value}
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-dark-4 accent-brand-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            background: `linear-gradient(to right, rgb(76, 110, 245) 0%, rgb(76, 110, 245) ${percentage}%, rgb(48, 48, 62) ${percentage}%, rgb(48, 48, 62) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
