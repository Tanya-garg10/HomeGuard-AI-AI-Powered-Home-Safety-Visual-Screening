import React, { useState } from 'react';
import {
  Camera,
  ArrowRight,
  Sparkles,
  Zap,
  Footprints,
  Flame,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Shield,
  Eye,
  Sliders,
  Crosshair,
  Maximize2,
  Activity,
  Terminal,
} from 'lucide-react';
import { AppRoute } from '../types';
import { SAMPLE_ROOM_IMAGES } from '../data/sampleScans';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onLaunchDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'living' | 'workspace' | 'kitchen'>('living');
  const [showScanLine, setShowScanLine] = useState<boolean>(true);
  const [hoveredDetection, setHoveredDetection] = useState<string | null>(null);

  const heroRooms = {
    living: {
      name: 'RESIDENTIAL LIVING QUARTERS',
      code: 'ZONE_01 // LR-482',
      image: SAMPLE_ROOM_IMAGES.livingRoomBefore,
      score: 68,
      detections: [
        {
          id: 'det-1',
          number: '01',
          label: 'OVERDRAW RISK',
          sub: 'Daisy-chained multi-outlet strip',
          severity: 'medium',
          coords: { x: 58, y: 65, w: 22, h: 20 },
          point: '[58.2°E, 65.4°N]',
        },
        {
          id: 'det-2',
          number: '02',
          label: 'PROTRUSION HAZARD',
          sub: 'Unsecured runner border in pathway',
          severity: 'high',
          coords: { x: 26, y: 72, w: 26, h: 22 },
          point: '[26.4°E, 72.1°N]',
        },
        {
          id: 'det-3',
          number: '03',
          label: 'NOMINAL EGRESS',
          sub: 'Primary passage zone verified clear',
          severity: 'low',
          coords: { x: 12, y: 34, w: 24, h: 32 },
          point: '[12.8°E, 34.0°N]',
        },
      ],
    },
    workspace: {
      name: 'EXECUTIVE HOME WORKSPACE',
      code: 'ZONE_02 // HW-109',
      image: SAMPLE_ROOM_IMAGES.homeOffice,
      score: 74,
      detections: [
        {
          id: 'det-4',
          number: '01',
          label: 'THERMAL CONCENTRATION',
          sub: 'Ventilation blocked under desk riser',
          severity: 'medium',
          coords: { x: 44, y: 62, w: 20, h: 18 },
          point: '[44.1°E, 62.9°N]',
        },
        {
          id: 'det-5',
          number: '02',
          label: 'CLEAR PATHWAY',
          sub: 'Chair perimeter clearance adequate',
          severity: 'low',
          coords: { x: 18, y: 48, w: 28, h: 28 },
          point: '[18.3°E, 48.2°N]',
        },
      ],
    },
    kitchen: {
      name: 'PREPARATION & CULINARY SUITE',
      code: 'ZONE_03 // KT-230',
      image: SAMPLE_ROOM_IMAGES.kitchen,
      score: 62,
      detections: [
        {
          id: 'det-6',
          number: '01',
          label: 'PROXIMITY HAZARD',
          sub: 'Flammable textile near induction edge',
          severity: 'high',
          coords: { x: 52, y: 46, w: 18, h: 18 },
          point: '[52.0°E, 46.1°N]',
        },
        {
          id: 'det-7',
          number: '02',
          label: 'MOISTURE INTERSECTION',
          sub: 'Uninsulated cord along sink backplane',
          severity: 'high',
          coords: { x: 30, y: 56, w: 20, h: 18 },
          point: '[30.2°E, 56.7°N]',
        },
      ],
    },
  };

  const currentHero = heroRooms[activeTab];

  return (
    <div className="w-full bg-[#0a0a0b] text-[#fafafa] min-h-screen relative overflow-hidden bg-hud-grid bg-radial-gradient selection:bg-[#c4ff00] selection:text-black">
      {/* Editorial Decorative Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#c4ff00]/[0.02] blur-[160px] pointer-events-none rounded-full" />

      {/* Hero Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16">
        {/* Editorial Top Technical Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-12 text-xs font-tech text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c4ff00] shadow-[0_0_12px_#c4ff00]" />
            <span className="tracking-widest uppercase">
              HOMEGUARD // VISION RUNTIME 2.5
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[11px] text-zinc-400">
            <span>RESIDENTIAL CV SCREENING</span>
            <span className="text-zinc-600">|</span>
            <span>MODEL: GEMINI-2.5-VISION</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-medium">LATENCY: 1.2s</span>
          </div>
        </div>

        {/* Big Bold Minimal Typography Heading */}
        <div className="mb-16 max-w-5xl">
          <div className="text-[11px] font-tech text-[#c4ff00] tracking-widest uppercase mb-4 flex items-center gap-2">
            <span>[ SYSTEM INITIATED ]</span>
            <span className="w-8 h-[1px] bg-[#c4ff00]/30" />
            <span>CONTINUOUS HAZARD IDENTIFICATION</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-[#fafafa] leading-[0.92] mb-6">
            YOUR SPACE.
            <br />
            <span className="text-zinc-500">UNDERSTOOD.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mb-10">
            Autonomous computer vision designed for residential safety.
            Screening visible trip lines, overloaded conductors, and thermal risks
            before they turn into preventable incidents.
          </p>

          {/* Minimal Action Triggers */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-scan-btn"
              type="button"
              onClick={() => onNavigate('/scan')}
              className="px-7 py-3.5 rounded-xl bg-[#c4ff00] hover:bg-[#b0e600] text-[#0a0a0b] font-bold text-xs tracking-wider uppercase transition shadow-[0_0_32px_rgba(196,255,0,0.25)] flex items-center gap-2.5 cursor-pointer"
            >
              <Camera size={15} strokeWidth={2.5} />
              <span>Scan Your Space</span>
              <ArrowRight size={14} />
            </button>

            <button
              id="hero-interactive-demo-btn"
              type="button"
              onClick={onLaunchDemo}
              className="px-6 py-3.5 rounded-xl bg-[#111113] hover:bg-[#18181b] text-[#fafafa] border border-white/[0.08] hover:border-white/12 font-medium text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer"
            >
              <Terminal size={14} className="text-[#c4ff00]" />
              <span>Launch Live Inspection</span>
            </button>

            {/* Quick Room Preset Switchers */}
            <div className="hidden lg:flex items-center ml-auto bg-[#111113] p-1.5 rounded-xl border border-white/[0.05] text-[11px] font-tech text-zinc-400">
              <span className="px-2 text-zinc-400 uppercase text-[10px]">Viewport:</span>
              <button
                type="button"
                onClick={() => setActiveTab('living')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'living' ? 'bg-[#18181b] text-white border border-white/8' : 'hover:text-white'
                }`}
              >
                01 Living
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workspace')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'workspace' ? 'bg-[#18181b] text-white border border-white/8' : 'hover:text-white'
                }`}
              >
                02 Office
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kitchen')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'kitchen' ? 'bg-[#18181b] text-white border border-white/8' : 'hover:text-white'
                }`}
              >
                03 Kitchen
              </button>
            </div>
          </div>
        </div>

        {/* 65% VISUAL / 35% INFORMATION HERO WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: 65% Cinematic Viewport */}
          <div className="lg:col-span-8 bg-[#111113] rounded-2xl border border-white/[0.06] overflow-hidden relative shadow-2xl flex flex-col justify-between group">
            {/* Viewport Header Bar */}
            <div className="p-4 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-white/[0.05] flex items-center justify-between text-xs font-tech z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-zinc-200 font-medium">LIVE VISION STREAM</span>
                <span className="text-zinc-500 font-normal">//</span>
                <span className="text-zinc-400 hidden sm:inline">{currentHero.code}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowScanLine(!showScanLine)}
                  className={`px-2.5 py-1 rounded border text-[10px] transition cursor-pointer ${
                    showScanLine
                      ? 'border-[#c4ff00]/30 text-[#c4ff00] bg-[#c4ff00]/8'
                      : 'border-white/8 text-zinc-400'
                  }`}
                >
                  {showScanLine ? 'SCANNER: ACTIVE' : 'SCANNER: PAUSED'}
                </button>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Activity size={12} className="text-[#c4ff00]" />
                  <span>60 FPS</span>
                </div>
              </div>
            </div>

            {/* Main Cinematic Image with Subtle Computer Vision HUD Overlays */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[520px] bg-black overflow-hidden flex items-center justify-center">
              <img
                src={currentHero.image}
                alt={currentHero.name}
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.01]"
              />

              {/* Viewport Four Corner Reticles */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none" />

              {/* Subtly Animated Laser Scan Line */}
              {showScanLine && <div className="animate-scan-line-lime" />}

              {/* Subtle Center Grid Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#d4ff00] rounded-full" />
                </div>
              </div>

              {/* Computer Vision Detection Overlays */}
              {currentHero.detections.map((det) => {
                const isHovered = hoveredDetection === det.id;
                const isHigh = det.severity === 'high';
                const isMed = det.severity === 'medium';
                const isLow = det.severity === 'low';

                const borderCol = isHigh
                  ? 'border-red-500/70'
                  : isMed
                  ? 'border-amber-400/70'
                  : 'border-[#c4ff00]/70';

                const bgCol = isHigh
                  ? 'bg-red-500/[0.06]'
                  : isMed
                  ? 'bg-amber-400/[0.06]'
                  : 'bg-[#c4ff00]/[0.04]';

                const textCol = isHigh
                  ? 'text-red-400'
                  : isMed
                  ? 'text-amber-400'
                  : 'text-[#c4ff00]';

                return (
                  <div
                    key={det.id}
                    onMouseEnter={() => setHoveredDetection(det.id)}
                    onMouseLeave={() => setHoveredDetection(null)}
                    style={{
                      left: `${det.coords.x}%`,
                      top: `${det.coords.y}%`,
                      width: `${det.coords.w}%`,
                      height: `${det.coords.h}%`,
                    }}
                    className={`absolute border ${borderCol} ${bgCol} transition-all duration-300 rounded-sm cursor-pointer z-10 ${
                      isHovered ? 'ring-2 ring-white/40 scale-[1.02]' : ''
                    }`}
                  >
                    {/* Targeting Corner Brackets */}
                    <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${borderCol}`} />
                    <div className={`absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 ${borderCol}`} />
                    <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 ${borderCol}`} />
                    <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${borderCol}`} />

                    {/* Top Marker Badge */}
                    <div className="absolute -top-5 left-0 flex items-center gap-1 bg-[#0a0a0b]/95 border border-white/8 px-2 py-0.5 rounded text-[9px] font-tech text-white whitespace-nowrap shadow-md">
                      <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-red-500' : isMed ? 'bg-amber-400' : 'bg-[#c4ff00]'} animate-pulse-dot`} />
                      <span className="font-bold">{det.number}</span>
                      <span className="text-zinc-500">//</span>
                      <span className={textCol}>{det.label}</span>
                    </div>

                    {/* Bottom Fine Coordinates */}
                    <div className="absolute -bottom-4 right-0 text-[8px] font-tech text-zinc-500 bg-black/80 px-1.5 rounded pointer-events-none">
                      {det.point}
                    </div>
                  </div>
                );
              })}

              {/* Bottom Subtle Overlay Telemetry */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-tech text-zinc-400 bg-[#0a0a0b]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/[0.04] pointer-events-none">
                <div className="flex items-center gap-2">
                  <Crosshair size={11} className="text-[#c4ff00]" />
                  <span>{currentHero.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>DETECTED: {currentHero.detections.length} NODES</span>
                  <span className="text-zinc-300">CONFIDENCE: 98.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: 35% Floating Inspection Module */}
          <div className="lg:col-span-4 bg-[#111113] rounded-2xl border border-white/[0.06] p-6 flex flex-col justify-between shadow-xl">
            {/* Module Top Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-5">
                <span className="text-[11px] font-tech text-zinc-400 tracking-wider uppercase">
                  INSPECTION MODULE
                </span>
                <span className="text-[10px] font-tech px-2.5 py-1 rounded bg-[#18181b] text-[#c4ff00] border border-[#c4ff00]/15">
                  REAL-TIME TELEMETRY
                </span>
              </div>

              {/* Room Safety Index Metric */}
              <div className="mb-7 p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.05]">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-tech">
                    Room Safety Index
                  </span>
                  <span className="text-xs font-tech text-amber-400">Action Recommended</span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-extrabold tracking-tight text-white font-tech">
                    {currentHero.score}
                  </span>
                  <span className="text-sm font-tech text-zinc-400">/ 100</span>
                </div>

                {/* Minimalist Linear Meter */}
                <div className="w-full h-1.5 bg-[#18181b] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${currentHero.score}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-[#c4ff00] rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Detected Hazards Inspection Queue */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-tech text-zinc-400 uppercase tracking-wider block mb-3">
                  Active Bounding Queue ({currentHero.detections.length}):
                </span>

                {currentHero.detections.map((det) => {
                  const isHovered = hoveredDetection === det.id;
                  const isHigh = det.severity === 'high';
                  const isMed = det.severity === 'medium';

                  return (
                    <div
                      key={det.id}
                      onMouseEnter={() => setHoveredDetection(det.id)}
                      onMouseLeave={() => setHoveredDetection(null)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-[#18181b] border-white/12'
                          : 'bg-[#0a0a0b]/50 border-white/[0.03] hover:border-white/6'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-[#18181b] border border-white/8 flex items-center justify-center text-[9px] font-tech font-bold text-white">
                            {det.number}
                          </span>
                          <span className="text-xs font-semibold text-zinc-200">
                            {det.label}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-tech uppercase px-2 py-0.5 rounded ${
                            isHigh
                              ? 'bg-red-500/8 text-red-400 border border-red-500/15'
                              : isMed
                              ? 'bg-amber-400/8 text-amber-400 border border-amber-400/15'
                              : 'bg-[#c4ff00]/8 text-[#c4ff00] border border-[#c4ff00]/15'
                          }`}
                        >
                          {det.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug pl-7">
                        {det.sub}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Module Bottom Actions */}
            <div className="pt-5 border-t border-white/[0.05] space-y-2">
              <button
                type="button"
                onClick={onLaunchDemo}
                className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold tracking-wide border border-white/8 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Full Diagnosis & Corrective Actions</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* THREE EDITORIAL PRINCIPLES (Clean, Flat, Refined Spacing) */}
        <div className="mt-24 pt-16 border-t border-white/[0.05]">
          <div className="text-[11px] font-tech text-[#c4ff00] tracking-widest uppercase mb-3">
            [ ARCHITECTURE & PROTOCOL ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-12">
            ENGINEERED TO REMOVE THE GUESSWORK.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Principle 01 */}
            <div className="p-7 rounded-2xl bg-[#111113] border border-white/[0.05] flex flex-col justify-between">
              <div>
                <span className="text-xs font-tech text-[#c4ff00] block mb-4 font-semibold">
                  01 // CAPTURE
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  Instant Computer Vision Ingestion
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Capture directly through your webcam or mobile browser. Zero specialized LiDAR hardware or physical sensors required.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[11px] font-tech text-zinc-400">
                <Crosshair size={12} className="text-[#c4ff00]" />
                <span>USER & REAR FACING PIPELINES</span>
              </div>
            </div>

            {/* Principle 02 */}
            <div className="p-7 rounded-2xl bg-[#111113] border border-white/[0.05] flex flex-col justify-between">
              <div>
                <span className="text-xs font-tech text-[#c4ff00] block mb-4 font-semibold">
                  02 // ISOLATE
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  Subtle Spatial Bounding & Risk Triage
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every detected item is contextualized with geometric bounding brackets, severity ratings (High, Medium, Low), and clear rationale.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[11px] font-tech text-zinc-400">
                <Sliders size={12} className="text-[#c4ff00]" />
                <span>MULTIMODAL RISK HEURISTICS</span>
              </div>
            </div>

            {/* Principle 03 */}
            <div className="p-7 rounded-2xl bg-[#111113] border border-white/[0.05] flex flex-col justify-between">
              <div>
                <span className="text-xs font-tech text-[#c4ff00] block mb-4 font-semibold">
                  03 // VERIFY
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  Side-by-Side Resolution Verification
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Execute the recommended corrective actions and capture a follow-up image to verify safety improvements and log before/after proof.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[11px] font-tech text-zinc-400">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>INTERACTIVE COMPARISON SLIDER</span>
              </div>
            </div>
          </div>
        </div>

        {/* DOMAIN COVERAGE STRIP (Editorial Horizontal Row) */}
        <div className="mt-20 p-8 rounded-2xl bg-[#111113] border border-white/[0.05]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-5 border-b border-white/[0.05]">
            <div>
              <span className="text-[10px] font-tech text-[#c4ff00] tracking-widest uppercase">
                INSPECTION DOMAINS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                Visible Household Vulnerabilities Covered
              </h3>
            </div>
            <span className="text-xs font-tech text-zinc-400 mt-3 sm:mt-0">
              4 CORE SAFETY CATEGORIES
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-amber-500/8 text-amber-400 border border-amber-500/15 flex items-center justify-center mb-4">
                <Zap size={17} />
              </div>
              <span className="text-xs font-bold text-white block mb-2">
                Electrical Safety
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Daisy-chained power strips, pinched cords, loose floor junctions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-red-500/8 text-red-400 border border-red-500/15 flex items-center justify-center mb-4">
                <Flame size={17} />
              </div>
              <span className="text-xs font-bold text-white block mb-2">
                Fire & Thermal
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Combustibles near heaters, obstructed stove surfaces, high-draw plugs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-[#c4ff00]/8 text-[#c4ff00] border border-[#c4ff00]/15 flex items-center justify-center mb-4">
                <Footprints size={17} />
              </div>
              <span className="text-xs font-bold text-white block mb-2">
                Passage & Trips
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Unsecured rug edges, floor level transitions, blocked door corridors.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0a0b] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/8 text-indigo-400 border border-indigo-500/15 flex items-center justify-center mb-4">
                <Layers size={17} />
              </div>
              <span className="text-xs font-bold text-white block mb-2">
                Structural Placement
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Top-heavy shelving, tipping hazards, unanchored edge balances.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-20 text-center py-16 px-6 rounded-2xl bg-gradient-to-b from-[#111113] to-[#0a0a0b] border border-white/[0.05] relative overflow-hidden">
          <div className="max-w-xl mx-auto relative z-10">
            <span className="text-[11px] font-tech text-[#c4ff00] uppercase tracking-widest block mb-3">
              READY FOR DEPLOYMENT
            </span>
            <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-5">
              Begin Visual Inspection
            </h3>
            <p className="text-sm text-zinc-400 mb-10 leading-relaxed">
              Open your camera or upload any room photo to immediately identify visible household hazards with autonomous precision.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/scan')}
                className="px-8 py-4 rounded-xl bg-[#c4ff00] hover:bg-[#b0e600] text-[#0a0a0b] font-bold text-xs tracking-wider uppercase transition shadow-[0_0_32px_rgba(196,255,0,0.25)] cursor-pointer"
              >
                Scan Now
              </button>
              <button
                type="button"
                onClick={onLaunchDemo}
                className="px-7 py-4 rounded-xl bg-[#18181b] hover:bg-[#1f1f23] text-white border border-white/8 font-medium text-xs tracking-wider uppercase transition cursor-pointer"
              >
                Explore Sample Findings
              </button>
            </div>
          </div>
        </div>

        {/* Footer Technical Bar */}
        <div className="mt-20 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tech text-zinc-400">
          <div>
            <span>HOMEGUARD AI // SAFETY COMPUTER VISION</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ZERO DATA RESALE</span>
            <span className="text-zinc-600">•</span>
            <span>CLIENT-FIRST RUNTIME</span>
            <span className="text-zinc-600">•</span>
            <span>ISO RESIDENTIAL GUIDELINES ALIGNED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
