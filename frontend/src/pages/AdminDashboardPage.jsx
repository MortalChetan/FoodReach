import React, { useEffect, useState } from 'react';
import { donationApi, statsApi, userApi } from '../api/client';
import { 
  ShieldCheck, 
  Utensils, 
  Building2, 
  Bike, 
  Leaf, 
  Users,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [allDonations, setAllDonations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statsApi.getImpact(),
      donationApi.getAll({}),
      userApi.getByRole().catch(() => ({ success: true, data: [] })),
    ])
      .then(([statsRes, donRes, userRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (donRes.success) setAllDonations(donRes.data);
        if (userRes.success) setPartners(userRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Central Administration
          </span>
          <h1 className="text-3xl font-black text-white font-display mt-2">
            FoodReach Operations Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time platform oversight of surplus food, partner shelters, and rescue routes.</p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-dark-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Platform Services: 100% Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Meals Saved</span>
            <p className="text-2xl font-black text-amber-400 font-display mt-1">~{stats.totalMealsRescued?.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">CO₂ Mitigated</span>
            <p className="text-2xl font-black text-emerald-400 font-display mt-1">{stats.co2EmissionsSavedKg} kg</p>
          </div>
          <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Registered Donors</span>
            <p className="text-2xl font-black text-cyan-400 font-display mt-1">{stats.totalDonors}</p>
          </div>
          <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verified NGOs</span>
            <p className="text-2xl font-black text-purple-400 font-display mt-1">{stats.totalNgos}</p>
          </div>
        </div>
      )}

      {/* All Platform Donations Table */}
      <div className="dark-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl bg-dark-900/90">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base font-display text-white">All Platform Food Rescue Missions ({allDonations.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 text-slate-400 font-mono font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Listing Title</th>
                <th className="px-6 py-3">Donor</th>
                <th className="px-6 py-3">Claimed Shelter</th>
                <th className="px-6 py-3">Quantity / Portions</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Pickup OTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {allDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-850/60">
                  <td className="px-6 py-4 font-bold text-white">{d.title}</td>
                  <td className="px-6 py-4">{d.donorOrganization || d.donorName}</td>
                  <td className="px-6 py-4">{d.claimedByNgoName || <span className="text-slate-500 italic">Unclaimed</span>}</td>
                  <td className="px-6 py-4 font-mono">{d.quantity} {d.unit} (~{d.estimatedMeals} meals)</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      d.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      d.status === 'CLAIMED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      d.status === 'IN_TRANSIT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-400">{d.pickupOtp || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
