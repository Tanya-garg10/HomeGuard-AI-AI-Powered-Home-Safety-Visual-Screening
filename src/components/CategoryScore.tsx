import React from 'react';
import { Zap, Flame, Footprints, ShieldCheck } from 'lucide-react';
import { SafetyCategories } from '../types';

interface CategoryScoreProps {
  categories: SafetyCategories;
  className?: string;
}

export const CategoryScore: React.FC<CategoryScoreProps> = ({
  categories,
  className = '',
}) => {
  const items = [
    {
      key: 'electrical',
      label: 'Electrical Safety',
      score: categories?.electrical ?? 70,
      icon: Zap,
      color: 'text-amber-400',
      barColor: 'bg-amber-400',
      description: 'Cord clutter, outlet load, wiring',
    },
    {
      key: 'fire',
      label: 'Fire Safety',
      score: categories?.fire ?? 85,
      icon: Flame,
      color: 'text-rose-400',
      barColor: 'bg-rose-500',
      description: 'Combustibles, heaters, appliance perimeter',
    },
    {
      key: 'accessibility',
      label: 'Accessibility',
      score: categories?.accessibility ?? 80,
      icon: Footprints,
      color: 'text-sky-400',
      barColor: 'bg-sky-400',
      description: 'Clear walkways, egress paths, trip points',
    },
    {
      key: 'environment',
      label: 'General Environment',
      score: categories?.environment ?? 85,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-400',
      description: 'Floor slip resistance, stability, lighting',
    },
  ];

  return (
    <div
      id="category-scores-card"
      className={`bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 sm:p-5 backdrop-blur ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-100">
            Safety Categories Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            AI-generated visual screening indicator
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">Normalized 0-100</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const score = Math.max(0, Math.min(100, item.score));

          return (
            <div
              key={item.key}
              id={`category-${item.key}`}
              className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md bg-slate-800/80 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {item.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-bold text-slate-100 font-mono">
                    {score}
                  </span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-1">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${item.barColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-400 truncate mt-1">
                {item.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
