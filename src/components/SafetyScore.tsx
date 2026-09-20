import React from 'react';

interface SafetyScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const SafetyScore: React.FC<SafetyScoreProps> = ({
  score,
  size = 'lg',
  showSubtitle = true,
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine grade & color matching the palette:
  // Background near black, Primary accent soft electric lime (#d4ff00)
  // High risk: muted red (#ef4444), Medium risk: amber (#f59e0b), Low risk: soft electric lime (#d4ff00)
  let scoreColor = 'text-[#d4ff00]';
  let strokeColor = '#d4ff00';
  let statusText = 'Optimal Clearance';
  let statusBg = 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30';

  if (clampedScore < 60) {
    scoreColor = 'text-red-400';
    strokeColor = '#ef4444';
    statusText = 'Attention Required';
    statusBg = 'bg-red-500/10 text-red-400 border-red-500/30';
  } else if (clampedScore < 80) {
    scoreColor = 'text-amber-400';
    strokeColor = '#f59e0b';
    statusText = 'Moderate Vulnerability';
    statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  const dimensions = {
    sm: { radius: 30, strokeWidth: 5, size: 74, textSize: 'text-xl' },
    md: { radius: 50, strokeWidth: 6, size: 120, textSize: 'text-3xl' },
    lg: { radius: 72, strokeWidth: 8, size: 168, textSize: 'text-5xl' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div
      id="safety-score-display"
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke="currentColor"
            strokeWidth={dimensions.strokeWidth}
            className="text-[#181b22]"
            fill="transparent"
          />
          {/* Progress fill */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-tech">
          <span className={`font-extrabold tracking-tight ${dimensions.textSize} ${scoreColor}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center font-tech">
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${statusBg}`}
        >
          {statusText}
        </span>
        {showSubtitle && (
          <p className="text-[11px] text-zinc-400 mt-1.5 max-w-[200px] leading-tight font-sans">
            AI visual screening benchmark
          </p>
        )}
      </div>
    </div>
  );
};
