import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ArrowRight, ShieldCheck, RefreshCw, AlertTriangle, GitCompare } from 'lucide-react';
import { ScanResult } from '../types';
import { HazardOverlay } from './HazardOverlay';

interface ComparisonViewProps {
  beforeScan: ScanResult;
  afterScan: ScanResult;
  onReselectScans?: () => void;
  className?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  beforeScan,
  afterScan,
  onReselectScans,
  className = '',
}) => {
  const scoreDiff = afterScan.overallScore - beforeScan.overallScore;
  const hazardsBeforeCount = beforeScan.hazards.length;
  const hazardsAfterCount = afterScan.hazards.length;
  const issuesResolved = Math.max(0, hazardsBeforeCount - hazardsAfterCount);

  return (
    <div id="comparison-view-module" className={`space-y-6 ${className}`}>
      {/* Top Banner & Delta Metrics */}
      <div className="bg-[#111113] border border-white/[0.05] rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/[0.04] text-[#c4ff00] border border-[#c4ff00]/15 text-[10px] font-tech uppercase tracking-wider mb-3">
              <TrendingUp size={12} />
              <span>SPATIAL VERIFICATION ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
              Safety Screening Progression
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Comparing baseline screening against follow-up corrective scan.
            </p>
          </div>

          {onReselectScans && (
            <button
              type="button"
              onClick={onReselectScans}
              className="self-start md:self-auto px-4 py-2 rounded-lg bg-[#18181b] hover:bg-[#1f1f23] text-zinc-300 hover:text-white text-xs font-tech border border-white/8 transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={12} className="text-[#c4ff00]" />
              <span>Change Compared Scans</span>
            </button>
          )}
        </div>

        {/* Delta Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 font-tech">
          {/* Before Score */}
          <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-2">
              Baseline Score
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {beforeScan.overallScore} <span className="text-xs text-zinc-400">/ 100</span>
            </div>
            <span className="text-[10px] text-amber-400 block mt-2">
              {hazardsBeforeCount} active hazards
            </span>
          </div>

          {/* After Score */}
          <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-2">
              Follow-up Score
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c4ff00]">
              {afterScan.overallScore} <span className="text-xs text-zinc-400">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-2">
              {hazardsAfterCount} remaining concern{hazardsAfterCount === 1 ? '' : 's'}
            </span>
          </div>

          {/* Improvement */}
          <div className="p-5 rounded-xl bg-[#0a0a0b] border border-[#c4ff00]/15">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-2">
              Score Delta
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c4ff00]">
              {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} <span className="text-xs text-zinc-400">pts</span>
            </div>
            <span className="text-[10px] text-[#c4ff00] block mt-2">
              Safety gain verified
            </span>
          </div>

          {/* Issues Resolved */}
          <div className="p-5 rounded-xl bg-[#0a0a0b] border border-emerald-500/15">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-2">
              Hazards Resolved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {issuesResolved}
            </div>
            <span className="text-[10px] text-emerald-400 block mt-2">
              Cleared from field
            </span>
          </div>
        </div>

        {/* Comparison Summary Statement */}
        <div className="mt-6 p-4 rounded-xl bg-[#0a0a0b] border border-white/[0.05] flex items-start gap-3">
          <CheckCircle size={18} className="text-[#c4ff00] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-white">
              {scoreDiff >= 0
                ? 'Follow-up inspection verifies reduced spatial vulnerabilities and improved clearance.'
                : 'Follow-up inspection detected altered room configuration requiring additional attention.'}
            </p>
            <p className="text-[11px] text-zinc-400">
              Visual screening results provide autonomous guidance and should be verified alongside standard household equipment.
            </p>
          </div>
        </div>
      </div>

      {/* Side by Side Image Comparison Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE Stage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 font-tech">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-400/8 text-amber-400 border border-amber-400/15 uppercase tracking-wider">
                01 // BASELINE
              </span>
              <span className="text-xs text-zinc-300 font-medium font-sans">
                {beforeScan.title || beforeScan.roomName}
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              SCORE: <strong className="text-white">{beforeScan.overallScore}</strong>
            </span>
          </div>

          <HazardOverlay
            imageUrl={beforeScan.imageUrl}
            hazards={beforeScan.hazards}
          />
        </div>

        {/* AFTER Stage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 font-tech">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#c4ff00]/8 text-[#c4ff00] border border-[#c4ff00]/15 uppercase tracking-wider">
                02 // VERIFIED RESOLUTION
              </span>
              <span className="text-xs text-zinc-300 font-medium font-sans">
                {afterScan.title || afterScan.roomName}
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              SCORE: <strong className="text-[#c4ff00]">{afterScan.overallScore}</strong>
            </span>
          </div>

          <HazardOverlay
            imageUrl={afterScan.imageUrl}
            hazards={afterScan.hazards}
          />
        </div>
      </div>
    </div>
  );
};
