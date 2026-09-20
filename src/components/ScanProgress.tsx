import React, { useEffect, useState } from 'react';
import { Camera, Search, AlertTriangle, BarChart3, Wrench, CheckCircle2, Cpu, Eye, ShieldCheck } from 'lucide-react';

interface ScanProgressProps {
  onComplete: () => void;
  imageUrl?: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  onComplete,
  imageUrl,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const steps = [
    { number: 1, title: 'Injesting spatial image telemetry', icon: Camera, tag: 'INJESTION' },
    { number: 2, title: 'Extracting geometry & object vectors', icon: Eye, tag: 'SEGMENTATION' },
    { number: 3, title: 'Running spatial vulnerability screening', icon: AlertTriangle, tag: 'INFERENCE' },
    { number: 4, title: 'Compiling safety score matrix', icon: BarChart3, tag: 'CALIBRATION' },
    { number: 5, title: 'Synthesizing actionable mitigation steps', icon: Wrench, tag: 'SYNTHESIS' },
  ];

  useEffect(() => {
    // Progress through steps smoothly
    const timers = [
      setTimeout(() => setCurrentStep(2), 700),
      setTimeout(() => setCurrentStep(3), 1500),
      setTimeout(() => setCurrentStep(4), 2300),
      setTimeout(() => setCurrentStep(5), 3100),
      setTimeout(() => {
        setIsComplete(true);
      }, 3800),
      setTimeout(() => {
        onComplete();
      }, 4600),
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div
      id="scan-progress-screen"
      className="w-full max-w-xl mx-auto py-8 px-4 flex flex-col items-center justify-center text-center"
    >
      {/* Visual Scanning Frame */}
      <div className="relative w-80 sm:w-96 h-48 rounded-2xl overflow-hidden bg-[#07080a] border border-white/[0.12] shadow-2xl mb-8">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Scanning room preview"
            className="w-full h-full object-cover opacity-60 filter contrast-125"
          />
        ) : (
          <div className="w-full h-full bg-[#0b0d11] flex items-center justify-center">
            <Camera size={36} className="text-zinc-600" />
          </div>
        )}

        {/* Laser scan line overlay in electric lime */}
        <div className="animate-scan-line-lime pointer-events-none" />

        {/* Reticle corners in soft electric lime */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#d4ff00]" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#d4ff00]" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#d4ff00]" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#d4ff00]" />

        <div className="absolute bottom-2.5 left-3 text-[9px] font-tech text-[#d4ff00] bg-[#07080a]/90 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>NEURAL VISION PIPELINE // ACTIVE</span>
        </div>
      </div>

      {/* Main Status Header */}
      {!isComplete ? (
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/[0.04] text-[#d4ff00] border border-[#d4ff00]/25 text-[10px] font-tech uppercase tracking-wider mb-1">
            <Cpu size={12} />
            <span>MULTIMODAL INFERENCE ACTIVE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Screening Spatial Environment
          </h2>
          <p className="text-xs text-zinc-400">
            Scanning optical room elements for potential visible hazards and clearance issues.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 mb-6 animate-pulse-subtle">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-tech uppercase tracking-wider mb-1">
            <CheckCircle2 size={12} />
            <span>TELEMETRY VERIFIED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Screening Complete
          </h2>
          <p className="text-xs text-zinc-400">
            Compiling interactive inspection telemetry report...
          </p>
        </div>
      )}

      {/* Steps List */}
      <div className="w-full bg-[#0e1014] border border-white/[0.08] rounded-2xl p-5 space-y-2 shadow-xl font-tech">
        {steps.map((s) => {
          const StepIcon = s.icon;
          const isDone = currentStep > s.number || isComplete;
          const isCurrent = currentStep === s.number && !isComplete;
          const isPending = currentStep < s.number;

          return (
            <div
              key={s.number}
              className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#181b22] border border-[#d4ff00]/40 text-white shadow-sm'
                  : isDone
                  ? 'bg-[#07080a] text-zinc-300 border border-white/[0.04]'
                  : 'opacity-40 text-zinc-600 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#d4ff00]/10 text-[#d4ff00]'
                      : isDone
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-zinc-800/40 text-zinc-600'
                  }`}
                >
                  <StepIcon size={14} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span>STEP 0{s.number}</span>
                    <span className="text-zinc-600">//</span>
                    <span className="text-[#d4ff00] font-bold">{s.tag}</span>
                  </div>
                  <span className="text-xs font-sans font-medium text-white block">
                    {s.title}
                  </span>
                </div>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
