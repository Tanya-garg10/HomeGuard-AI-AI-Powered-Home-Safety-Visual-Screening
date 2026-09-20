import React from 'react';
import { ArrowRight, CheckCircle, Clock, ShieldQuestion, Wrench } from 'lucide-react';
import { Hazard } from '../types';
import { SeverityBadge } from './SeverityBadge';

interface HazardCardProps {
  hazard: Hazard;
  index: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onToggleFixed?: (id: string) => void;
  className?: string;
}

export const HazardCard: React.FC<HazardCardProps> = ({
  hazard,
  index,
  isSelected = false,
  onSelect,
  onViewDetails,
  onToggleFixed,
  className = '',
}) => {
  const confidencePercent = Math.round((hazard.confidence || 0.8) * 100);

  return (
    <div
      id={`hazard-card-${hazard.id}`}
      onClick={() => onSelect && onSelect(hazard.id)}
      className={`group relative rounded-xl transition-all duration-200 p-4 sm:p-5 border cursor-pointer ${
        hazard.fixed
          ? 'bg-[#0b0d11]/60 border-white/[0.04] opacity-70'
          : isSelected
          ? 'bg-[#11141a] border-[#d4ff00]/70 shadow-[0_0_24px_rgba(212,255,0,0.15)] ring-1 ring-[#d4ff00]/40'
          : 'bg-[#0e1014] border-white/[0.08] hover:border-white/20 hover:bg-[#11141a]'
      } ${className}`}
    >
      {/* Top row: Number, Severity Badge, Category, Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-[#181b22] text-[#d4ff00] border border-white/10 font-tech font-bold text-[10px] flex items-center justify-center">
            {index + 1}
          </span>
          <SeverityBadge severity={hazard.severity} size="sm" />
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#181b22] text-zinc-300 border border-white/10 font-tech">
            {hazard.category}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-tech">
          <span>CONF:</span>
          <span className="text-[#d4ff00] font-bold">{confidencePercent}%</span>
        </div>
      </div>

      {/* Hazard Title */}
      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#d4ff00] transition-colors mb-1">
        {hazard.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
        {hazard.description}
      </p>

      {/* Recommendation Snippet Box */}
      <div className="p-3 rounded-lg bg-[#07080a] border border-white/[0.06] mb-3.5 flex items-start gap-2.5">
        <Wrench size={13} className="text-[#d4ff00] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="text-[10px] uppercase font-tech text-zinc-400 font-bold block mb-0.5">
            CORRECTIVE ACTION
          </span>
          <p className="text-zinc-300 leading-normal font-sans">
            {hazard.recommendation}
          </p>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
        {/* Toggle Fixed */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFixed && onToggleFixed(hazard.id);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-tech text-[11px] transition cursor-pointer ${
            hazard.fixed
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'bg-[#181b22] text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <CheckCircle size={12} className={hazard.fixed ? 'text-emerald-400' : 'text-zinc-500'} />
          <span>{hazard.fixed ? 'RESOLVED' : 'MARK RESOLVED'}</span>
        </button>

        {/* View Details CTA */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails && onViewDetails(hazard.id);
          }}
          className="flex items-center gap-1 text-[#d4ff00] hover:underline font-tech font-bold text-[11px] px-1 py-1 transition group-hover:translate-x-0.5"
        >
          <span>TELEMETRY</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};
