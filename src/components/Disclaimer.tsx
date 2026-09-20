import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  variant = 'banner',
  className = '',
}) => {
  if (variant === 'inline') {
    return (
      <div
        id="homeguard-disclaimer-inline"
        className={`flex items-start gap-2.5 text-xs text-zinc-400 bg-[#0b0d11] p-3 rounded-xl border border-white/[0.06] ${className}`}
      >
        <Info size={13} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="font-sans">
          <strong className="text-zinc-200 font-semibold font-tech">INFORMATIONAL SCREENING: </strong>
          HomeGuard AI provides computer-vision screening for visible household conditions. It is not a certified municipal or engineering safety inspection.
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        id="homeguard-disclaimer-card"
        className={`bg-[#0b0d11] border border-white/[0.08] rounded-2xl p-4 sm:p-5 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
            <ShieldAlert size={16} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-tech uppercase tracking-wider text-amber-400 font-bold">
                AUDIT NOTICE
              </span>
              <span className="text-zinc-600">//</span>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Safety & Visual Screening Framework
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              HomeGuard AI provides real-time optical screening for visible household conditions and potential hazards. It does not replace physical structural testing, certified licensed inspections, or local building code certifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div
      id="homeguard-disclaimer-banner"
      className={`bg-[#0b0d11] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 text-xs text-zinc-300 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <ShieldAlert size={15} className="text-amber-400 shrink-0" />
        <p className="leading-snug font-sans">
          <strong className="text-white font-tech uppercase tracking-wide mr-1.5 font-bold">
            INFORMATIONAL NOTICE:
          </strong>
          HomeGuard AI provides computer-vision screening for visible household hazards. Screening does not guarantee detection of non-visible or latent risks.
        </p>
      </div>
    </div>
  );
};
