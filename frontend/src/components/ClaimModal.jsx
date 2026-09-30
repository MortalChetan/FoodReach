import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { claimApi } from '../api/client';
import { X, Heart, Building2, Users, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClaimModal({ donation, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated, role, quickDemoLogin } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState(donation?.estimatedMeals || 50);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  if (!isOpen || !donation) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await claimApi.claimDonation({
        donationId: donation.id,
        estimatedBeneficiaries: parseInt(beneficiaries, 10),
        notes,
      });

      if (res.success) {
        setClaimedSuccess(true);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (_) {}

        setTimeout(() => {
          onSuccess && onSuccess(res.data);
          onClose();
          setClaimedSuccess(false);
        }, 1800);
      } else {
        setError(res.message || 'Could not claim donation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing claim request');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToNgo = async () => {
    await quickDemoLogin('NGO');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="dark-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-700/80 relative bg-dark-900/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {claimedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto animate-bounce shadow-neon-green">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black font-display text-white">Food Rescued Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              A delivery mission has been automatically dispatched to volunteer rescue riders in the area.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-white">Claim Surplus Food</h3>
                <p className="text-xs text-slate-400">For NGOs, Shelters & Community Kitchens</p>
              </div>
            </div>

            {/* Donation Summary Card */}
            <div className="bg-dark-850 p-3.5 rounded-2xl border border-slate-800 mb-5 flex items-center gap-3.5">
              <img
                src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                alt={donation.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-white truncate">{donation.title}</h4>
                <p className="text-slate-400">{donation.donorOrganization} · {donation.quantity} {donation.unit}</p>
                <p className="text-emerald-400 font-semibold font-mono mt-0.5">~{donation.estimatedMeals} meal portions for shelter</p>
              </div>
            </div>

            {/* If not logged in as NGO, show prompt to log in or 1-click switch */}
            {role !== 'ROLE_NGO' && role !== 'ROLE_ADMIN' ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    Only registered NGOs, Soup Kitchens, or Shelters can claim surplus food for community safety.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchToNgo}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition shadow-sm"
                >
                  Quick Login as NGO (Hope Haven Shelter)
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaim} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Claiming Organization
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.organizationName || user?.name || 'NGO Partner'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-dark-950 text-slate-400 text-xs font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Estimated Beneficiaries (People to feed)
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={beneficiaries}
                      onChange={(e) => setBeneficiaries(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Distribution Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Evening dinner service at Main Hall, refrigerated storage available."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-slate-950" />
                    <span>{loading ? 'Processing...' : 'Confirm Food Claim'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
