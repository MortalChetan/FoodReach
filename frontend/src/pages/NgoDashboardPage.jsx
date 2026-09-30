import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { claimApi, donationApi } from '../api/client';
import { 
  Building2, 
  Heart, 
  Utensils, 
  MapPin, 
  Clock, 
  Bike, 
  CheckCircle2, 
  Search, 
  Sparkles,
  Phone
} from 'lucide-react';

export default function NgoDashboardPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [availableFeed, setAvailableFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNgoData = async () => {
    setLoading(true);
    try {
      const [claimsRes, availRes] = await Promise.all([
        claimApi.getMyClaims(),
        donationApi.getAll({ status: 'AVAILABLE' }),
      ]);

      if (claimsRes.success && claimsRes.data) setClaims(claimsRes.data);
      if (availRes.success && availRes.data) setAvailableFeed(availRes.data.slice(0, 3));
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoData();
  }, []);

  const totalBeneficiaries = claims.reduce((acc, curr) => acc + (curr.estimatedBeneficiaries || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            NGO Relief Command
          </span>
          <h1 className="text-3xl font-black text-white font-display mt-2">
            {user?.organizationName || user?.name || 'NGO Partner'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage shelter food claims and track incoming volunteer dispatches.</p>
        </div>

        <Link
          to="/explore"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Browse Available Surplus</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">People Nourished</span>
            <p className="text-2xl font-black text-white font-display">~{totalBeneficiaries.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Total Claims Made</span>
            <p className="text-2xl font-black text-emerald-400 font-display">{claims.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Fresh Food Available</span>
            <p className="text-2xl font-black text-amber-300 font-display">{availableFeed.length} listings</p>
          </div>
        </div>
      </div>

      {/* Claimed Rescue Items */}
      <div className="dark-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl bg-dark-900/90">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base font-display text-white">Your Active & Completed Food Claims</h3>
          <span className="text-xs font-mono text-slate-400 font-medium">{claims.length} claims</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse"></div>
          </div>
        ) : claims.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {claims.map((c) => (
              <div key={c.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-850/60 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{c.donationTitle}</h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.status || 'CONFIRMED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Beneficiaries: ~{c.estimatedBeneficiaries} people · Claimed {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  {c.notes && (
                    <p className="text-xs text-slate-300 italic bg-dark-950 p-2 rounded-lg border border-slate-800 mt-1">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/donations/${c.donationId}`}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    View Donation Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>Your NGO hasn't claimed any surplus food yet.</p>
            <Link to="/explore" className="mt-2 inline-block text-cyan-400 font-bold hover:underline">
              Explore available surplus food →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
