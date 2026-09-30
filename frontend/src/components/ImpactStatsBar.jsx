import React, { useEffect, useState } from 'react';
import { statsApi } from '../api/client';
import { Utensils, Scale, Leaf, HeartHandshake, Sparkles, TrendingUp } from 'lucide-react';

export default function ImpactStatsBar() {
  const [stats, setStats] = useState({
    totalMealsRescued: 1465,
    totalKgRescued: 586.0,
    co2EmissionsSavedKg: 1465.0,
    totalActiveListings: 4,
    totalDonors: 12,
    totalNgos: 8,
    totalVolunteers: 25,
  });

  useEffect(() => {
    statsApi.getImpact()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    {
      label: 'Meals Rescued',
      value: (stats.totalMealsRescued || 0).toLocaleString(),
      sub: 'Nourishing local communities',
      icon: Utensils,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20 hover:border-amber-500/50',
      glow: 'hover:shadow-neon-amber',
    },
    {
      label: 'Food Surplus Saved',
      value: `${(stats.totalKgRescued || 0).toLocaleString()} kg`,
      sub: 'Diverted from landfills',
      icon: Scale,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      glow: 'hover:shadow-neon-green',
    },
    {
      label: 'CO₂ Mitigated',
      value: `${(stats.co2EmissionsSavedKg || 0).toLocaleString()} kg`,
      sub: 'Greenhouse gas avoided',
      icon: Leaf,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      glow: 'hover:shadow-neon-cyan',
    },
    {
      label: 'Active Network',
      value: `${(stats.totalNgos || 0) + (stats.totalDonors || 0)} Partners`,
      sub: 'Donors, NGOs & Riders',
      icon: HeartHandshake,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20 hover:border-purple-500/50',
      glow: 'hover:shadow-neon-purple',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl dark-card ${item.border} ${item.glow} transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden`}
            >
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 text-emerald-400"></div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-white font-display mt-1 tracking-tight">{item.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{item.sub}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
