import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationApi } from '../api/client';
import { 
  PlusCircle, 
  Utensils, 
  Clock, 
  KeyRound, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Leaf,
  AlertCircle
} from 'lucide-react';

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = () => {
    setLoading(true);
    donationApi.getMyDonations()
      .then((res) => {
        if (res.success && res.data) {
          setMyDonations(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const totalMeals = myDonations.reduce((acc, curr) => acc + (curr.estimatedMeals || 0), 0);
  const totalCo2 = Math.round(myDonations.reduce((acc, curr) => acc + (curr.co2SavedKg || 0), 0) * 10) / 10;
  const activeCount = myDonations.filter((d) => d.status === 'AVAILABLE' || d.status === 'CLAIMED' || d.status === 'IN_TRANSIT').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Donor Control Center
          </span>
          <h1 className="text-3xl font-black text-white font-display mt-2">
            Welcome, {user?.organizationName || user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage surplus food postings and hand over food securely with OTPs.</p>
        </div>

        <Link
          to="/donate/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Donation</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Meals Provided</span>
            <p className="text-2xl font-black text-white font-display">~{totalMeals.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">CO₂ Footprint Reduced</span>
            <p className="text-2xl font-black text-emerald-400 font-display">{totalCo2} kg</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl dark-card border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Active Rescues</span>
            <p className="text-2xl font-black text-cyan-300 font-display">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="dark-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl bg-dark-900/90">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base font-display text-white">Your Posted Surplus Food</h3>
          <span className="text-xs font-mono text-slate-400 font-medium">{myDonations.length} total postings</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse"></div>
            <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse"></div>
          </div>
        ) : myDonations.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {myDonations.map((d) => (
              <div key={d.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-850/60 transition">
                <div className="flex items-center gap-4">
                  <img
                    src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                    alt={d.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{d.title}</h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        d.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        d.status === 'CLAIMED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        d.status === 'IN_TRANSIT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {d.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {d.quantity} {d.unit} (~{d.estimatedMeals} meals) · Posted {new Date(d.createdAt).toLocaleDateString()}
                    </p>

                    {d.claimedByNgoName && (
                      <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                        Claimed by: {d.claimedByNgoName} {d.assignedVolunteerName && `· Rider: ${d.assignedVolunteerName}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Handover OTP and Actions */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  {d.pickupOtp && d.status !== 'DELIVERED' && (
                    <div className="bg-emerald-950/70 border border-emerald-500/40 p-2.5 rounded-xl text-center shadow-neon-green">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Pickup OTP</span>
                      <span className="text-base font-black font-mono tracking-widest text-white">{d.pickupOtp}</span>
                    </div>
                  )}

                  <Link
                    to={`/donations/${d.id}`}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Utensils className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>You haven't posted any surplus food yet.</p>
            <Link to="/donate/new" className="mt-2 inline-block text-emerald-400 font-bold hover:underline">
              Create your first donation →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
