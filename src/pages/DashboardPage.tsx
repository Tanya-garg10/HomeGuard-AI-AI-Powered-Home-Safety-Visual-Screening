import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ArrowRight,
  Layers,
  Activity,
} from 'lucide-react';
import { ScanResult, AppRoute } from '../types';
import { Disclaimer } from '../components/Disclaimer';

interface DashboardPageProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onNavigate: (route: AppRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  scans,
  onSelectScan,
  onNavigate,
}) => {
  // Aggregate statistics
  const totalScans = scans.length;
  const currentScore = scans.length > 0 ? scans[0].overallScore : 82;

  let totalHazardsFound = 0;
  let totalFixed = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  const categoryCounts: Record<string, number> = {
    'Electrical Safety': 0,
    'Fire Safety': 0,
    Accessibility: 0,
    'General Environment': 0,
  };

  scans.forEach((scan) => {
    scan.hazards.forEach((h) => {
      totalHazardsFound++;
      if (h.fixed) totalFixed++;
      const sev = h.severity.toLowerCase();
      if (sev === 'high') highCount++;
      else if (sev === 'medium') mediumCount++;
      else lowCount++;

      const cat = h.category || 'General Environment';
      if (categoryCounts[cat] !== undefined) {
        categoryCounts[cat]++;
      } else {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });
  });

  // Chart data: Score over time
  const scoreOverTimeData = [...scans]
    .reverse()
    .map((s) => ({
      name: s.roomName.length > 10 ? `${s.roomName.substring(0, 8)}...` : s.roomName,
      fullDate: new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: s.overallScore,
    }));

  // Chart data: Hazards by Category
  const categoryBarData = Object.keys(categoryCounts).map((cat) => ({
    name: cat.replace(' Safety', ''),
    hazards: categoryCounts[cat],
  }));

  // Chart data: Severity Distribution
  const severityPieData = [
    { name: 'High Risk', value: highCount, color: '#ef4444' },
    { name: 'Medium Risk', value: mediumCount, color: '#f59e0b' },
    { name: 'Low Risk', value: lowCount, color: '#d4ff00' },
  ].filter((d) => d.value > 0);

  return (
    <div id="dashboard-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen pb-16 bg-hud-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
              <span className="text-white font-bold uppercase tracking-wider">
                SAFETY INTELLIGENCE LEDGER
              </span>
              <span className="text-zinc-500">//</span>
              <span>HISTORICAL TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial Overview & Trends
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/scan')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] text-xs font-bold uppercase tracking-wider transition shadow-[0_0_16px_rgba(212,255,0,0.2)] flex items-center gap-1.5 cursor-pointer"
          >
            <Camera size={13} strokeWidth={2.5} />
            <span>New Room Scan</span>
          </button>
        </div>

        {/* 4 Key Metric Hero Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-tech">
          {/* 1. Current Screening Score */}
          <div className="p-5 rounded-2xl bg-[#0e1014] border border-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                Latest Safety Index
              </span>
              <ShieldCheck size={14} className="text-[#d4ff00]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">
                {currentScore}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-sans">
              Autonomous computer vision index
            </p>
          </div>

          {/* 2. Total Scans */}
          <div className="p-5 rounded-2xl bg-[#0e1014] border border-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                Rooms Monitored
              </span>
              <Camera size={14} className="text-zinc-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              {totalScans}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-sans">
              Active residential zones
            </p>
          </div>

          {/* 3. Potential Hazards Found */}
          <div className="p-5 rounded-2xl bg-[#0e1014] border border-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                Hazards Flagged
              </span>
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              {totalHazardsFound}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-sans">
              Visible spatial concerns
            </p>
          </div>

          {/* 4. Issues Addressed */}
          <div className="p-5 rounded-2xl bg-[#0e1014] border border-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                Resolved Actions
              </span>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
              {totalFixed}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-sans">
              Verified corrective fixes
            </p>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Score Over Time Chart */}
          <div className="lg:col-span-8 bg-[#0e1014] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Safety Progression Over Time
                </h3>
                <p className="text-xs text-zinc-400">
                  Progression across consecutive spatial scans
                </p>
              </div>
              <span className="text-[11px] font-tech text-[#d4ff00]">0 - 100 RANGE</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4ff00" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#d4ff00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181b22" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" domain={[40, 100]} fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0d11',
                      borderColor: '#27272a',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                    formatter={(value: any) => [`${value} / 100`, 'Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#d4ff00"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Distribution Pie Chart */}
          <div className="lg:col-span-4 bg-[#0e1014] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Severity Tiers
              </h3>
              <p className="text-xs text-zinc-400">
                Risk distribution across scanned zones
              </p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0d11',
                      borderColor: '#27272a',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-white/[0.06] font-tech">
              <div className="text-red-400">
                <span className="block font-bold">{highCount}</span>
                <span className="text-[9px] text-zinc-400 uppercase">High</span>
              </div>
              <div className="text-amber-400">
                <span className="block font-bold">{mediumCount}</span>
                <span className="text-[9px] text-zinc-400 uppercase">Medium</span>
              </div>
              <div className="text-[#d4ff00]">
                <span className="block font-bold">{lowCount}</span>
                <span className="text-[9px] text-zinc-400 uppercase">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="bg-[#0e1014] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Vulnerabilities by Category
            </h3>
            <p className="text-xs text-zinc-400">
              Concentration of flagged items across standard residential safety domains
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#181b22" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0d11',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(value: any) => [`${value} flagged`, 'Items']}
                />
                <Bar dataKey="hazards" fill="#d4ff00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room-by-room status table */}
        <div className="bg-[#0e1014] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-base font-bold text-white">
                Zone Inspection Ledger
              </h3>
              <p className="text-xs text-zinc-400">
                Click any room to open its interactive inspection report
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 font-tech">
              <thead className="bg-[#07080a] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-3 px-4">Room Zone</th>
                  <th className="py-3 px-4">Safety Index</th>
                  <th className="py-3 px-4">Observations</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {scans.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectScan(s)}
                    className="hover:bg-white/[0.02] transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-white font-sans">
                      {s.roomName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#d4ff00]">
                      {s.overallScore} / 100
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#181b22] text-zinc-300 border border-white/5">
                        {s.hazards.length} concerns
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-sans text-xs">
                      {new Date(s.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[#d4ff00] font-semibold inline-flex items-center gap-1 hover:underline">
                        <span>VIEW</span>
                        <ArrowRight size={11} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Disclaimer variant="banner" />
      </div>
    </div>
  );
};
