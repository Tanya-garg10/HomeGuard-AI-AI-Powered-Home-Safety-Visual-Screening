import React, { useState, useEffect } from 'react';
import {
  Camera,
  GitCompare,
  CheckCircle2,
  Share2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Zap,
  Footprints,
  Layers,
  Sparkles,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react';
import { ScanResult, HazardSeverity, AppRoute } from '../types';
import { HazardOverlay } from '../components/HazardOverlay';
import { Disclaimer } from '../components/Disclaimer';

interface ResultsPageProps {
  scan: ScanResult;
  onNavigate: (route: AppRoute) => void;
  onViewHazard: (hazardId: string) => void;
  onToggleHazardFixed: (hazardId: string) => void;
  onSaveScan?: () => void;
  isSaved?: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  scan,
  onNavigate,
  onViewHazard,
  onToggleHazardFixed,
  onSaveScan,
  isSaved = true,
}) => {
  // Default selected hazard is the first hazard or first high-risk
  const [selectedHazardId, setSelectedHazardId] = useState<string | null>(
    scan.hazards.length > 0 ? scan.hazards[0].id : null
  );
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inspection' | 'categories' | 'summary'>('inspection');

  // Sync selected hazard if scan changes
  useEffect(() => {
    if (scan.hazards.length > 0 && !scan.hazards.some((h) => h.id === selectedHazardId)) {
      setSelectedHazardId(scan.hazards[0].id);
    }
  }, [scan.id]);

  const selectedHazard =
    scan.hazards.find((h) => h.id === selectedHazardId) || scan.hazards[0] || null;

  const selectedIndex = selectedHazard
    ? scan.hazards.findIndex((h) => h.id === selectedHazard.id)
    : 0;

  const highRiskCount = scan.hazards.filter((h) => h.severity.toLowerCase() === 'high').length;
  const medRiskCount = scan.hazards.filter((h) => h.severity.toLowerCase() === 'medium').length;
  const fixedCount = scan.hazards.filter((h) => h.fixed).length;

  const handleShareOrCopy = () => {
    navigator.clipboard?.writeText(
      `HomeGuard AI Safety Screening Report: ${scan.roomName} scored ${scan.overallScore}/100 with ${scan.hazards.length} visible observations.`
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'electrical safety':
      case 'electrical':
        return <Zap size={14} className="text-amber-400" />;
      case 'fire & thermal':
      case 'fire':
        return <Flame size={14} className="text-red-400" />;
      case 'accessibility':
      case 'trips':
        return <Footprints size={14} className="text-[#d4ff00]" />;
      default:
        return <Layers size={14} className="text-indigo-400" />;
    }
  };

  return (
    <div id="results-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen pb-16 bg-hud-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Top Minimal Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
              <span className="text-white font-bold uppercase tracking-wider">
                {scan.roomName || 'ROOM'}
              </span>
              <span className="text-zinc-500">//</span>
              <span>
                {new Date(scan.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-zinc-500">//</span>
              <span className="text-[#d4ff00]">ID: {scan.id.slice(-8)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Spatial Safety Screening
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleShareOrCopy}
              className="px-3 py-1.5 rounded-lg bg-[#111317] hover:bg-[#181b22] text-zinc-300 text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={13} />
              <span>{copiedNotification ? 'Report Copied' : 'Share'}</span>
            </button>

            <button
              id="compare-scan-btn"
              type="button"
              onClick={() => onNavigate('/compare')}
              className="px-3 py-1.5 rounded-lg bg-[#111317] hover:bg-[#181b22] text-zinc-300 text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5 cursor-pointer"
            >
              <GitCompare size={13} className="text-[#d4ff00]" />
              <span>Compare</span>
            </button>

            <button
              id="rescan-btn"
              type="button"
              onClick={() => onNavigate('/scan')}
              className="px-3.5 py-1.5 rounded-lg bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] text-xs font-bold transition shadow-[0_0_16px_rgba(212,255,0,0.2)] flex items-center gap-1.5 cursor-pointer"
            >
              <Camera size={13} strokeWidth={2.5} />
              <span>Rescan Room</span>
            </button>
          </div>
        </div>

        {/* 65% VISUAL / 35% INFORMATION CORE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: 65% Cinematic Room Hero Visual with CV Overlays */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <HazardOverlay
              imageUrl={scan.imageUrl}
              hazards={scan.hazards}
              selectedHazardId={selectedHazardId}
              onSelectHazard={(id) => {
                setSelectedHazardId(id);
              }}
              className="w-full"
            />

            {/* Target Selector Strip Under Image */}
            <div className="p-3 bg-[#0b0d11] rounded-xl border border-white/[0.07] flex items-center justify-between gap-2 overflow-x-auto text-xs font-tech">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 pl-1">
                TARGETS ({scan.hazards.length}):
              </span>

              <div className="flex items-center gap-2 overflow-x-auto">
                {scan.hazards.map((h, idx) => {
                  const isSelected = h.id === selectedHazardId;
                  const isHigh = h.severity.toLowerCase() === 'high';
                  const isMed = h.severity.toLowerCase() === 'medium';
                  const isFixed = h.fixed;

                  const dotColor = isFixed
                    ? 'bg-emerald-400'
                    : isHigh
                    ? 'bg-red-500'
                    : isMed
                    ? 'bg-amber-400'
                    : 'bg-[#d4ff00]';

                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHazardId(h.id)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-tech transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? 'bg-[#181b22] text-white border-white/30 shadow-sm'
                          : 'bg-[#07080a]/60 text-zinc-400 border-white/[0.05] hover:border-white/15'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      <span>{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="max-w-[120px] truncate hidden sm:inline">
                        {h.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: 35% Floating Inspection Module */}
          <div className="lg:col-span-4 bg-[#0e1014] rounded-2xl border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between shadow-2xl space-y-6">
            {/* Top Score Telemetry Card */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <span className="text-[10px] font-tech text-zinc-400 tracking-wider uppercase">
                  SAFETY TELEMETRY
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/10">
                    {scan.overallScore >= 80 ? 'NOMINAL' : 'ACTION REQUIRED'}
                  </span>
                </div>
              </div>

              {/* Room Safety Index */}
              <div className="p-4 rounded-xl bg-[#07080a] border border-white/[0.06] mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-tech text-zinc-400 uppercase">
                    Safety Score
                  </span>
                  <span className="text-[11px] font-tech text-zinc-400">
                    {fixedCount}/{scan.hazards.length} Resolved
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-extrabold text-white font-tech tracking-tight">
                    {scan.overallScore}
                  </span>
                  <span className="text-xs font-tech text-zinc-400">/ 100</span>
                </div>

                {/* Linear Meter */}
                <div className="w-full h-1.5 bg-[#181b22] rounded-full overflow-hidden mb-3">
                  <div
                    style={{ width: `${scan.overallScore}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      scan.overallScore >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-[#d4ff00]'
                        : scan.overallScore >= 60
                        ? 'bg-gradient-to-r from-amber-500 to-[#d4ff00]'
                        : 'bg-gradient-to-r from-red-500 to-amber-500'
                    }`}
                  />
                </div>

                {/* Mini Stat Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-tech pt-2 border-t border-white/[0.04]">
                  <div className="p-1.5 rounded bg-[#111317]">
                    <span className="text-zinc-400 block text-[9px]">TOTAL</span>
                    <span className="font-bold text-white">{scan.hazards.length}</span>
                  </div>
                  <div className="p-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    <span className="block text-[9px]">HIGH RISK</span>
                    <span className="font-bold">{highRiskCount}</span>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="block text-[9px]">RESOLVED</span>
                    <span className="font-bold">{fixedCount}</span>
                  </div>
                </div>
              </div>

              {/* Active Hazard Inspection Details */}
              {selectedHazard ? (
                <div className="space-y-4">
                  {/* Hazard Header */}
                  <div className="p-4 rounded-xl bg-[#0b0d11] border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#181b22] border border-white/10 text-[10px] font-tech font-bold text-white flex items-center justify-center">
                          {(selectedIndex + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-tech text-zinc-400 uppercase">
                          {selectedHazard.category}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-tech uppercase px-2 py-0.5 rounded border ${
                          selectedHazard.fixed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : selectedHazard.severity.toLowerCase() === 'high'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : selectedHazard.severity.toLowerCase() === 'medium'
                            ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                            : 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/20'
                        }`}
                      >
                        {selectedHazard.fixed ? 'RESOLVED' : `${selectedHazard.severity} RISK`}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {selectedHazard.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedHazard.description}
                    </p>

                    {/* Why this matters (Explainable AI) */}
                    {selectedHazard.whyItMatters && (
                      <div className="p-3 rounded-lg bg-[#07080a] border border-white/[0.04] text-[11px] text-zinc-300">
                        <span className="text-[10px] font-tech text-[#d4ff00] block mb-1 uppercase font-semibold">
                          [ RISK MECHANISM ]
                        </span>
                        <p className="leading-relaxed text-zinc-400">
                          {selectedHazard.whyItMatters}
                        </p>
                      </div>
                    )}

                    {/* Corrective Action Protocol */}
                    <div className="p-3 rounded-lg bg-[#07080a] border border-white/[0.04]">
                      <span className="text-[10px] font-tech text-zinc-400 block mb-1 uppercase">
                        CORRECTIVE PROTOCOL:
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed font-medium mb-3">
                        {selectedHazard.recommendation}
                      </p>

                      {/* Interactive Resolution Toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleHazardFixed(selectedHazard.id)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-tech font-semibold transition flex items-center justify-center gap-2 cursor-pointer border ${
                          selectedHazard.fixed
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/[0.05] hover:bg-white/[0.08] text-white border-white/10'
                        }`}
                      >
                        <CheckCircle2 size={14} className={selectedHazard.fixed ? 'text-emerald-400' : 'text-zinc-400'} />
                        <span>
                          {selectedHazard.fixed ? 'Marked as Resolved' : 'Mark Action Completed'}
                        </span>
                      </button>
                    </div>

                    {/* Full Detail Modal / Page Link */}
                    <button
                      type="button"
                      onClick={() => onViewHazard(selectedHazard.id)}
                      className="w-full py-1.5 text-center text-[11px] font-tech text-zinc-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open Complete Technical Dossier</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-400 font-tech text-xs">
                  NO HAZARDS DETECTED
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('/scan')}
                className="w-full py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] text-xs font-bold uppercase tracking-wider transition shadow-[0_0_16px_rgba(212,255,0,0.2)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera size={14} strokeWidth={2.5} />
                <span>Verify Fixes (Rescan)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Safety Disclaimer */}
        <Disclaimer variant="card" />
      </div>
    </div>
  );
};
