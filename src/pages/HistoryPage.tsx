import React from 'react';
import {
  Calendar,
  Camera,
  GitCompare,
  ArrowRight,
  Trash2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ScanResult, AppRoute } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { Disclaimer } from '../components/Disclaimer';

interface HistoryPageProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onCompareScans: (scanA: ScanResult, scanB: ScanResult) => void;
  onDeleteScan: (id: string) => void;
  onResetDefaults: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  scans,
  onSelectScan,
  onCompareScans,
  onDeleteScan,
  onResetDefaults,
  onNavigate,
}) => {
  const getHighestSeverity = (scan: ScanResult) => {
    if (scan.hazards.some((h) => h.severity.toLowerCase() === 'high')) return 'high';
    if (scan.hazards.some((h) => h.severity.toLowerCase() === 'medium')) return 'medium';
    return 'low';
  };

  return (
    <div id="history-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen pb-16 bg-hud-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
              <span className="text-white font-bold uppercase tracking-wider">
                INSPECTION ARCHIVE
              </span>
              <span className="text-zinc-500">//</span>
              <span>HISTORICAL SPATIAL SCANS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial Scan History
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-[#0e1014] hover:bg-[#181b22] text-zinc-400 hover:text-white text-xs font-tech border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
              title="Reload realistic sample scans"
            >
              <RotateCcw size={12} className="text-[#d4ff00]" />
              <span>Reset Demo Data</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/scan')}
              className="px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] text-xs font-bold uppercase tracking-wider transition shadow-[0_0_16px_rgba(212,255,0,0.2)] flex items-center gap-1.5 cursor-pointer"
            >
              <Camera size={13} strokeWidth={2.5} />
              <span>New Scan</span>
            </button>
          </div>
        </div>

        {/* Scans Grid */}
        {scans.length === 0 ? (
          <div className="p-12 text-center bg-[#0b0d11] rounded-2xl border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#181b22] flex items-center justify-center mx-auto text-[#d4ff00]">
              <Camera size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">No scans recorded yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Capture or upload your first room photograph to initialize visual screening and safety tracking.
            </p>
            <button
              onClick={() => onNavigate('/scan')}
              className="px-4 py-2 rounded-xl bg-[#d4ff00] text-[#07080a] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Start First Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scans.map((scan, idx) => {
              const highestSev = getHighestSeverity(scan);
              const nextScan = scans[idx + 1] || scans[0];

              return (
                <div
                  key={scan.id}
                  id={`history-card-${scan.id}`}
                  className="group rounded-2xl bg-[#0e1014] border border-white/[0.08] hover:border-white/20 transition overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  {/* Thumbnail Image */}
                  <div
                    onClick={() => onSelectScan(scan)}
                    className="relative aspect-video w-full bg-[#07080a] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={scan.imageUrl}
                      alt={scan.roomName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1014] via-transparent to-transparent" />

                    {/* Overall Score Badge Overlay */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#07080a]/90 backdrop-blur border border-white/10 text-xs font-tech text-white flex items-center gap-1">
                      <span className="text-[#d4ff00] font-bold text-sm">{scan.overallScore}</span>
                      <span className="text-[10px] text-zinc-500 font-normal">/100</span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-base font-bold leading-tight drop-shadow-md">
                        {scan.roomName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-300 drop-shadow font-tech mt-0.5">
                        <Calendar size={11} className="text-[#d4ff00]" />
                        <span>
                          {new Date(scan.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-tech">
                        <span className="text-zinc-400">FLAGGED OBSERVATIONS:</span>
                        <span className="font-bold text-white">
                          {scan.hazards.length} detected
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-tech">
                        <span className="text-zinc-400">HIGHEST SEVERITY:</span>
                        <SeverityBadge severity={highestSev} size="sm" />
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 pt-1 border-t border-white/[0.05] font-sans">
                        {scan.summary}
                      </p>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 font-tech">
                      <button
                        type="button"
                        onClick={() => onSelectScan(scan)}
                        className="text-xs font-bold text-[#d4ff00] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        <span>INSPECT</span>
                        <ArrowRight size={11} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {scans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onCompareScans(nextScan, scan)}
                            className="p-1.5 rounded-lg bg-[#181b22] hover:bg-[#20252e] text-zinc-300 hover:text-white transition cursor-pointer text-[11px] flex items-center gap-1 px-2 border border-white/5"
                            title="Compare with another scan"
                          >
                            <GitCompare size={12} className="text-[#d4ff00]" />
                            <span>Compare</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteScan(scan.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition cursor-pointer border border-transparent hover:border-red-500/20"
                          title="Delete scan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Disclaimer variant="banner" />
      </div>
    </div>
  );
};
