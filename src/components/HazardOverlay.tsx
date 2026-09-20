import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Activity,
  Crosshair,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Hazard } from '../types';

interface HazardOverlayProps {
  imageUrl: string;
  hazards: Hazard[];
  selectedHazardId?: string | null;
  onSelectHazard?: (hazardId: string) => void;
  className?: string;
  enableScanLine?: boolean;
}

export const HazardOverlay: React.FC<HazardOverlayProps> = ({
  imageUrl,
  hazards,
  selectedHazardId = null,
  onSelectHazard,
  className = '',
  enableScanLine = true,
}) => {
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [hoveredHazardId, setHoveredHazardId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [scanActive, setScanActive] = useState<boolean>(enableScanLine);
  const [showReticle, setShowReticle] = useState<boolean>(true);

  const getSeverityTheme = (severity: string, isFixed?: boolean) => {
    if (isFixed) {
      return {
        border: 'border-emerald-500/50',
        corner: 'border-emerald-400',
        bg: 'bg-emerald-500/[0.04]',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        label: 'RESOLVED',
      };
    }

    switch (severity.toLowerCase()) {
      case 'high':
        return {
          border: 'border-red-500/70',
          corner: 'border-red-400',
          bg: 'bg-red-500/[0.06]',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.35)]',
          label: 'HIGH RISK',
        };
      case 'medium':
        return {
          border: 'border-amber-400/70',
          corner: 'border-amber-400',
          bg: 'bg-amber-400/[0.06]',
          badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          label: 'MED RISK',
        };
      case 'low':
      default:
        return {
          border: 'border-[#d4ff00]/60',
          corner: 'border-[#d4ff00]',
          bg: 'bg-[#d4ff00]/[0.04]',
          badge: 'bg-[#d4ff00]/20 text-[#d4ff00] border-[#d4ff00]/30',
          glow: 'shadow-[0_0_12px_rgba(212,255,0,0.3)]',
          label: 'LOW RISK',
        };
    }
  };

  return (
    <div
      id="hazard-overlay-container"
      className={`relative flex flex-col bg-[#0b0d11] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#07080a]/95 backdrop-blur-2xl' : ''
      } ${className}`}
    >
      {/* Top HUD Telemetry Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#07080a]/90 backdrop-blur-md border-b border-white/[0.06] text-xs font-tech">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span className="text-zinc-200 uppercase tracking-wider text-[11px] font-medium">
            COMPUTER VISION INSPECTOR
          </span>
          <span className="text-zinc-500">//</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">
            {hazards.length} TARGET ZONES DETECTED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Laser Scan Toggle */}
          <button
            type="button"
            onClick={() => setScanActive(!scanActive)}
            className={`px-2 py-1 rounded-lg text-[10px] font-tech transition cursor-pointer border ${
              scanActive
                ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30'
                : 'bg-white/[0.03] text-zinc-400 border-white/[0.06]'
            }`}
          >
            {scanActive ? 'SCANNER: ON' : 'SCANNER: OFF'}
          </button>

          {/* Toggle Bounding Boxes */}
          <button
            id="toggle-detected-areas-btn"
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-tech transition cursor-pointer border ${
              showOverlays
                ? 'bg-white/[0.08] text-white border-white/20'
                : 'bg-white/[0.03] text-zinc-400 border-white/[0.06]'
            }`}
          >
            {showOverlays ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{showOverlays ? 'HUD: ON' : 'HUD: OFF'}</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            id="fullscreen-image-toggle"
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06] transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 w-full min-h-[360px] max-h-[640px] bg-black flex items-center justify-center overflow-hidden select-none">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07080a]">
            <div className="flex flex-col items-center gap-2 text-zinc-400 font-tech text-xs">
              <div className="w-6 h-6 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin" />
              <span>INGESTING ROOM TELEMETRY...</span>
            </div>
          </div>
        )}

        <img
          src={imageUrl}
          alt="Room visual scan"
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-contain max-h-[640px] transition-transform duration-500"
        />

        {/* Viewport Four Corner Optical Reticles */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/40 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/40 pointer-events-none" />

        {/* Laser Scan Line */}
        {scanActive && imageLoaded && <div className="animate-scan-line-lime" />}

        {/* Bounding Box Overlays */}
        {showOverlays &&
          imageLoaded &&
          hazards.map((hazard, index) => {
            const theme = getSeverityTheme(hazard.severity, hazard.fixed);
            const isHovered = hoveredHazardId === hazard.id;
            const isSelected = selectedHazardId === hazard.id;
            const isHighlighted = isHovered || isSelected;

            // Safe percentage positioning
            const left = Math.max(2, Math.min(92, hazard.location.x));
            const top = Math.max(4, Math.min(92, hazard.location.y));
            const width = Math.max(10, Math.min(50, hazard.location.width));
            const height = Math.max(10, Math.min(50, hazard.location.height));
            const numLabel = (index + 1).toString().padStart(2, '0');

            return (
              <div
                key={hazard.id}
                id={`hazard-box-${hazard.id}`}
                onClick={() => onSelectHazard && onSelectHazard(hazard.id)}
                onMouseEnter={() => setHoveredHazardId(hazard.id)}
                onMouseLeave={() => setHoveredHazardId(null)}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                className={`absolute cursor-pointer transition-all duration-300 border ${
                  theme.border
                } ${theme.bg} rounded-sm ${
                  isHighlighted
                    ? `scale-[1.02] z-30 ${theme.glow} ring-1 ring-white/60`
                    : 'z-20 hover:scale-[1.01]'
                } ${hazard.fixed ? 'opacity-50 border-dashed' : ''}`}
              >
                {/* 4 Corner Targeting Brackets */}
                <div className={`absolute -top-[1.5px] -left-[1.5px] w-2 h-2 border-t-2 border-l-2 ${theme.corner}`} />
                <div className={`absolute -top-[1.5px] -right-[1.5px] w-2 h-2 border-t-2 border-r-2 ${theme.corner}`} />
                <div className={`absolute -bottom-[1.5px] -left-[1.5px] w-2 h-2 border-b-2 border-l-2 ${theme.corner}`} />
                <div className={`absolute -bottom-[1.5px] -right-[1.5px] w-2 h-2 border-b-2 border-r-2 ${theme.corner}`} />

                {/* Numbered Tag Pill Header */}
                <div
                  className={`absolute -top-5 left-0 flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] font-tech border shadow-lg backdrop-blur-md bg-[#07080a]/90 whitespace-nowrap transition-transform ${
                    isHighlighted ? 'scale-105 border-white/30' : 'border-white/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hazard.fixed
                        ? 'bg-emerald-400'
                        : hazard.severity === 'high'
                        ? 'bg-red-500'
                        : hazard.severity === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-[#d4ff00]'
                    } animate-pulse-dot`}
                  />
                  <span className="font-bold text-white">{numLabel}</span>
                  <span className="text-zinc-500">//</span>
                  <span className="text-zinc-300 font-medium">
                    {hazard.title.length > 24 ? `${hazard.title.slice(0, 24)}...` : hazard.title}
                  </span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-[8px] font-semibold uppercase text-zinc-400">
                    {theme.label}
                  </span>
                </div>

                {/* Bottom Fine Coordinates & Confidence */}
                <div className="absolute -bottom-4 right-0 text-[8px] font-tech text-zinc-400 bg-black/80 px-1 rounded border border-white/5 pointer-events-none">
                  [{left.toFixed(1)}%, {top.toFixed(1)}%] • {Math.round(hazard.confidence * 100)}%
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Technical Telemetry Strip */}
      <div className="px-4 py-2 bg-[#07080a]/90 border-t border-white/[0.06] text-[10px] font-tech text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair size={11} className="text-[#d4ff00]" />
          <span>BOUNDING: VOLUMETRIC_ESTIMATE</span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline">
            Click any target marker to inspect corrective steps
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>TARGETS: {hazards.length}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">
            RESOLVED: {hazards.filter((h) => h.fixed).length}
          </span>
        </div>
      </div>
    </div>
  );
};
