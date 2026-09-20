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
  // Background near black, Primary accent electric lime (#c4ff00)
  // High risk: muted red (#ef4444), Medium risk: amber (#f59e0b), Low risk: electric lime (#c4ff00)
  let scoreColor = 'text-[#c4ff00]';
  let strokeColor = '#c4ff00';
  let statusText = 'Optimal Clearance';
  let statusBg = 'bg-[#c4ff00]/8 text-[#c4ff00] border-[#c4ff00]/15';

  if (clampedScore < 60) {
    scoreColor = 'text-red-400';
    strokeColor = '#ef4444';
    statusText = 'Attention Required';
    statusBg = 'bg-red-500/8 text-red-400 border-red-500/15';
  } else if (clampedScore < 80) {
    scoreColor = 'text-amber-400';
    strokeColor = '#f59e0b';
    statusText = 'Moderate Vulnerability';
    statusBg = 'bg-amber-500/8 text-amber-400 border-amber-500/15';
  }

  const dimensions = {
    sm: { radius: 32, strokeWidth: 4, size: 80, textSize: 'text-2xl' },
    md: { radius: 52, strokeWidth: 5, size: 128, textSize: 'text-4xl' },
    lg: { radius: 76, strokeWidth: 6, size: 176, textSize: 'text-6xl' },
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
            className="text-[#18181b]"
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
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center font-tech">
        <span
          className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold border ${statusBg}`}
        >
          {statusText}
        </span>
        {showSubtitle && (
          <p className="text-[11px] text-zinc-400 mt-2 max-w-[220px] leading-tight font-sans">
            AI visual screening benchmark
          </p>
        )}
      </div>
    </div>
  );
};
