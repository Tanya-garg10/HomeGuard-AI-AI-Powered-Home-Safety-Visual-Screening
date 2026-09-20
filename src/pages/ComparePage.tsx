import React, { useState } from 'react';
import { GitCompare, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { ScanResult, AppRoute } from '../types';
import { ComparisonView } from '../components/ComparisonView';
import { Disclaimer } from '../components/Disclaimer';

interface ComparePageProps {
  scans: ScanResult[];
  initialBeforeId?: string;
  initialAfterId?: string;
  onNavigate: (route: AppRoute) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  scans,
  initialBeforeId,
  initialAfterId,
  onNavigate,
}) => {
  // Find default before and after scans
  const defaultBefore =
    scans.find((s) => s.id === initialBeforeId) ||
    scans.find((s) => s.id === 'scan-living-room-before') ||
    scans[1] ||
    scans[0];

  const defaultAfter =
    scans.find((s) => s.id === initialAfterId) ||
    scans.find((s) => s.id === 'scan-living-room-after') ||
    scans[0];

  const [beforeId, setBeforeId] = useState<string>(defaultBefore?.id || '');
  const [afterId, setAfterId] = useState<string>(defaultAfter?.id || '');
  const [showSelector, setShowSelector] = useState<boolean>(false);

  const beforeScan = scans.find((s) => s.id === beforeId) || defaultBefore;
  const afterScan = scans.find((s) => s.id === afterId) || defaultAfter;

  if (!beforeScan || !afterScan) {
    return (
      <div className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0b0d11] border border-white/[0.08] text-center space-y-4">
          <GitCompare size={36} className="text-[#d4ff00] mx-auto" />
          <h2 className="text-xl font-bold text-white">Need At Least Two Scans To Compare</h2>
          <p className="text-xs text-zinc-400">
            Perform or load multiple room scans to view side-by-side progression and hazard resolution.
          </p>
          <button
            onClick={() => onNavigate('/scan')}
            className="px-5 py-2.5 rounded-xl bg-[#d4ff00] text-[#07080a] text-xs font-bold uppercase tracking-wider"
          >
            Scan Room Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="compare-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen pb-16 bg-hud-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
              <span className="text-white font-bold uppercase tracking-wider">
                RESOLUTION COMPARISON
              </span>
              <span className="text-zinc-500">//</span>
              <span>SIDE-BY-SIDE VERIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Safety Progression Delta
            </h1>
          </div>

          {/* Scan Selector Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSelector(!showSelector)}
              className="px-3.5 py-2 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-300 hover:text-white text-xs font-tech border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} className="text-[#d4ff00]" />
              <span>{showSelector ? 'Hide Selector' : 'Change Compared Scans'}</span>
            </button>
          </div>
        </div>

        {/* Optional Scan Selector Drawer */}
        {showSelector && (
          <div className="p-5 rounded-2xl bg-[#0e1014] border border-white/[0.08] shadow-xl space-y-4">
            <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300">
              Select Scans To Compare
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-tech text-amber-400 font-semibold block">
                  1. Baseline (Before) Scan:
                </label>
                <select
                  id="before-scan-select"
                  value={beforeId}
                  onChange={(e) => setBeforeId(e.target.value)}
                  className="w-full bg-[#07080a] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#d4ff00]/60 font-tech"
                >
                  {scans.map((s) => (
                    <option key={`before-${s.id}`} value={s.id}>
                      {s.roomName} — Score: {s.overallScore}/100 ({s.hazards.length} hazards)
                    </option>
                  ))}
                </select>
              </div>

              {/* After selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-tech text-[#d4ff00] font-semibold block">
                  2. Resolved (After) Scan:
                </label>
                <select
                  id="after-scan-select"
                  value={afterId}
                  onChange={(e) => setAfterId(e.target.value)}
                  className="w-full bg-[#07080a] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#d4ff00]/60 font-tech"
                >
                  {scans.map((s) => (
                    <option key={`after-${s.id}`} value={s.id}>
                      {s.roomName} — Score: {s.overallScore}/100 ({s.hazards.length} hazards)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Engine View */}
        <ComparisonView
          beforeScan={beforeScan}
          afterScan={afterScan}
          onReselectScans={() => setShowSelector(true)}
        />

        {/* Disclaimer */}
        <Disclaimer variant="banner" />
      </div>
    </div>
  );
};
