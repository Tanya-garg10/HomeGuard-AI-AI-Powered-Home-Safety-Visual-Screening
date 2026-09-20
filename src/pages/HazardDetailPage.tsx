import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Camera,
  AlertCircle,
  HelpCircle,
  Wrench,
  Compass,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Hazard, ScanResult, AppRoute } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { Disclaimer } from '../components/Disclaimer';

interface HazardDetailPageProps {
  hazardId: string;
  scan: ScanResult;
  onNavigate: (route: AppRoute) => void;
  onToggleFixed: (hazardId: string) => void;
}

export const HazardDetailPage: React.FC<HazardDetailPageProps> = ({
  hazardId,
  scan,
  onNavigate,
  onToggleFixed,
}) => {
  const hazard = scan.hazards.find((h) => h.id === hazardId) || scan.hazards[0];

  if (!hazard) {
    return (
      <div className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0b0d11] border border-white/[0.08] text-center space-y-4">
          <AlertCircle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Observation Not Found</h2>
          <p className="text-xs text-zinc-400">
            This observation record may have been cleared or modified.
          </p>
          <button
            onClick={() => onNavigate('/results')}
            className="px-4 py-2 rounded-xl bg-[#d4ff00] text-[#07080a] text-xs font-bold uppercase tracking-wider"
          >
            Return to Inspection
          </button>
        </div>
      </div>
    );
  }

  const confidencePercent = Math.round((hazard.confidence || 0.85) * 100);

  return (
    <div id="hazard-detail-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen pb-16 bg-hud-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Back button */}
        <div>
          <button
            id="back-to-results-btn"
            type="button"
            onClick={() => onNavigate('/results')}
            className="inline-flex items-center gap-1.5 text-xs font-tech text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={14} className="text-[#d4ff00]" />
            <span>RETURN TO INSPECTION RESULT</span>
          </button>
        </div>

        {/* Main Detail Header Card */}
        <div className="bg-[#0e1014] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <SeverityBadge severity={hazard.severity} size="lg" />
              <span className="px-2.5 py-1 rounded bg-[#181b22] text-zinc-300 text-[10px] font-tech font-bold border border-white/10 uppercase tracking-wider">
                {hazard.category}
              </span>
            </div>

            <div className="flex items-center gap-3 font-tech">
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  SPATIAL CONFIDENCE
                </span>
                <span className="text-base font-bold text-[#d4ff00]">
                  {confidencePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Hazard Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {hazard.title}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-tech">
              ZONE: {scan.roomName} • AI COMPUTER VISION SCREENING
            </p>
          </div>

          {/* Localized Visual Snapshot */}
          <div className="relative rounded-xl overflow-hidden bg-[#07080a] border border-white/[0.08] aspect-video max-h-80 flex items-center justify-center">
            <img
              src={scan.imageUrl}
              alt="Room hazard location"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Futuristic Bounding box locator */}
            <div
              style={{
                left: `${hazard.location.x}%`,
                top: `${hazard.location.y}%`,
                width: `${hazard.location.width}%`,
                height: `${hazard.location.height}%`,
              }}
              className="absolute rounded border border-[#d4ff00] bg-[#d4ff00]/15 shadow-[0_0_20px_rgba(212,255,0,0.3)] flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping" />
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#07080a]/90 backdrop-blur text-[10px] text-[#d4ff00] font-tech border border-white/10">
              TARGET: [{Math.round(hazard.location.x)}%, {Math.round(hazard.location.y)}%]
            </div>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {/* What We Noticed */}
            <div className="p-4 rounded-xl bg-[#07080a] border border-white/[0.05] space-y-1.5">
              <div className="flex items-center gap-2 text-[#d4ff00] font-tech font-bold text-[10px] uppercase tracking-wider">
                <Sparkles size={12} />
                <span>OBSERVED CONDITION</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {hazard.description}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="p-4 rounded-xl bg-[#07080a] border border-white/[0.05] space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-tech font-bold text-[10px] uppercase tracking-wider">
                <AlertCircle size={12} />
                <span>RISK ASSESSMENT</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {hazard.whyItMatters}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-4 rounded-xl bg-[#07080a] border border-[#d4ff00]/20 space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2 text-[#d4ff00] font-tech font-bold text-[10px] uppercase tracking-wider">
                <Wrench size={12} />
                <span>RECOMMENDED MITIGATION</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {hazard.recommendation}
              </p>
            </div>

            {/* Approximate Location */}
            <div className="p-4 rounded-xl bg-[#07080a] border border-white/[0.05] space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2 text-zinc-400 font-tech font-bold text-[10px] uppercase tracking-wider">
                <Compass size={12} />
                <span>SPATIAL LOCATION MATRIX</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-tech">
                Coordinates: ({Math.round(hazard.location.x)}%, {Math.round(hazard.location.y)}%) within {scan.roomName}. Visual highlights delineate approximate boundaries calculated by the model.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06] font-tech">
            <button
              id="detail-toggle-fixed-btn"
              type="button"
              onClick={() => onToggleFixed(hazard.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                hazard.fixed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#d4ff00] text-[#07080a] hover:bg-[#bbf000] shadow-[0_0_16px_rgba(212,255,0,0.2)]'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{hazard.fixed ? 'RESOLVED ✓' : 'MARK AS RESOLVED'}</span>
            </button>

            <button
              id="detail-scan-again-btn"
              type="button"
              onClick={() => onNavigate('/scan')}
              className="px-4 py-2 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-300 hover:text-white text-xs font-bold border border-white/10 transition flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Camera size={14} className="text-[#d4ff00]" />
              <span>VERIFY WITH NEW SCAN</span>
            </button>
          </div>
        </div>

        <Disclaimer variant="inline" />
      </div>
    </div>
  );
};
