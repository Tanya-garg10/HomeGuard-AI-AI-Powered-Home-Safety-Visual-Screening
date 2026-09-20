import React, { useState } from 'react';
import { Shield, Sparkles, Menu, X, LayoutDashboard, History, GitCompare, Camera, Home, Terminal } from 'lucide-react';
import { AppRoute } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLaunchDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onLaunchDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', route: '/' as AppRoute, icon: Home },
    { label: 'Inspection', route: '/results' as AppRoute, icon: Terminal },
    { label: 'Scan', route: '/scan' as AppRoute, icon: Camera },
    { label: 'Dashboard', route: '/dashboard' as AppRoute, icon: LayoutDashboard },
    { label: 'Archive', route: '/history' as AppRoute, icon: History },
    { label: 'Compare', route: '/compare' as AppRoute, icon: GitCompare },
  ];

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-[#07080a]/85 backdrop-blur-xl border-b border-white/[0.07]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Minimalist Geometric Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#111317] border border-white/10 flex items-center justify-center relative group-hover:border-[#d4ff00]/40 transition-colors">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#d4ff00] shadow-[0_0_10px_rgba(212,255,0,0.5)] transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-widest text-[#f4f4f5] uppercase font-tech">
                  HOMEGUARD
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white/[0.06] text-[#d4ff00] border border-[#d4ff00]/25 font-tech tracking-wider">
                  CV.25
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-medium tracking-wider text-zinc-400 uppercase font-tech">
                Autonomous Safety Vision
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-[#0e1014] p-1 rounded-xl border border-white/[0.06]">
            {navItems.map((item) => {
              const isActive =
                item.route === '/'
                  ? currentRoute === '/'
                  : currentRoute.startsWith(item.route);

              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#181b22] text-white border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <item.icon size={13} className={isActive ? 'text-[#d4ff00]' : 'text-zinc-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Right Telemetry & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Fine Technical System Telemetry */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0e1014] border border-white/[0.06] text-[10px] font-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse shadow-[0_0_6px_rgba(212,255,0,0.8)]" />
              <span className="text-zinc-300">CV.FEED // NOMINAL</span>
            </div>

            <button
              id="nav-try-demo-btn"
              type="button"
              onClick={onLaunchDemo}
              className="px-3 py-1.5 rounded-lg bg-[#111317] hover:bg-[#181b22] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-[#d4ff00]" />
              <span>Demo Viewport</span>
            </button>

            <button
              id="nav-scan-now-btn"
              type="button"
              onClick={() => handleNav('/scan')}
              className="px-3.5 py-1.5 rounded-lg bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] text-xs font-bold transition shadow-[0_0_20px_rgba(212,255,0,0.25)] flex items-center gap-1.5 cursor-pointer"
            >
              <Camera size={13} strokeWidth={2.5} />
              <span>New Scan</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onLaunchDemo}
              className="px-2.5 py-1 rounded-lg bg-[#111317] text-[#d4ff00] text-xs font-mono border border-white/10 cursor-pointer"
            >
              Demo
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#111317] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-[#07080a] border-b border-white/10">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => handleNav(item.route)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-200 hover:bg-[#111317] flex items-center gap-2.5"
            >
              <item.icon size={15} className="text-[#d4ff00]" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/scan')}
              className="w-full py-2.5 rounded-lg bg-[#d4ff00] text-[#07080a] font-bold text-center text-xs"
            >
              Scan Your Room
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
