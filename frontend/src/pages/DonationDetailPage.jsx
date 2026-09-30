import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { donationApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ClaimModal from '../components/ClaimModal';
import { 
  Clock, 
  MapPin, 
  Utensils, 
  Scale, 
  Leaf, 
  ShieldCheck, 
  Heart, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  KeyRound
} from 'lucide-react';

export default function DonationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const fetchDetail = () => {
    setLoading(true);
    donationApi.getById(id)
      .then((res) => {
        if (res.success && res.data) {
          setDonation(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-96 bg-slate-800/50 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Donation Listing Not Found</h2>
        <p className="text-xs text-slate-400">The requested surplus listing may have been rescued or expired.</p>
        <Link to="/explore" className="inline-block px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold text-xs">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isDonorOwner = user?.id === donation.donorId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all surplus food listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Media & Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
            <img
              src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'}
              alt={donation.title}
              className="w-full h-80 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-emerald-500 text-slate-950 font-black font-mono text-xs px-3 py-1.5 rounded-xl shadow-md uppercase">
                {donation.status}
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="dark-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h2 className="text-2xl font-black font-display text-white">{donation.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{donation.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-500 block uppercase font-mono font-bold text-[10px]">Category</span>
                <span className="font-bold text-white mt-0.5 block">{donation.foodType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-500 block uppercase font-mono font-bold text-[10px]">Dietary</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{donation.dietaryType}</span>
              </div>
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-500 block uppercase font-mono font-bold text-[10px]">CO₂ Mitigated</span>
                <span className="font-bold text-cyan-400 mt-0.5 block">{donation.co2SavedKg} kg CO₂</span>
              </div>
            </div>

            {/* Allergens & Storage */}
            <div className="space-y-2 pt-2 text-xs">
              {donation.allergens && (
                <div className="flex items-start gap-2.5 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Allergen Notice: </span>
                    <span>{donation.allergens}</span>
                  </div>
                </div>
              )}
              {donation.storageInstructions && (
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-200">
                  <span className="font-bold">Handling Instructions: </span>
                  <span>{donation.storageInstructions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Pickup, Donor & Action Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="dark-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5 bg-dark-900/90">
            <div>
              <span className="text-xs text-slate-400 uppercase font-mono font-bold">Surplus Quantity</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-display text-white">{donation.quantity} {donation.unit}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
                  ~{donation.estimatedMeals} meals
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300 border-t border-slate-800">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Expiry Window:</span>
                  <span className="font-mono text-slate-400">{new Date(donation.expiresAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Pickup Location:</span>
                  <span className="text-slate-400">{donation.pickupAddress}, {donation.city}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Donor Organization:</span>
                  <span className="text-slate-400">{donation.donorOrganization} ({donation.donorName})</span>
                </div>
              </div>
            </div>

            {/* If donor is viewing their own listing, show pickup verification OTP */}
            {isDonorOwner && donation.pickupOtp && (
              <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs space-y-1.5 shadow-neon-green">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono uppercase">
                  <KeyRound className="w-4 h-4" />
                  <span>Donor Handover OTP:</span>
                </div>
                <div className="text-3xl font-black font-mono tracking-widest text-white">
                  {donation.pickupOtp}
                </div>
                <p className="text-[11px] text-emerald-400/80">Provide this 4-digit code to the rescue rider upon pickup.</p>
              </div>
            )}

            {/* Claim Action */}
            {donation.status === 'AVAILABLE' ? (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Claim For NGO / Shelter</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-800 text-slate-300 text-center text-xs font-mono font-semibold border border-slate-700">
                Status: {donation.status} {donation.claimedByNgoName && `(Claimed by ${donation.claimedByNgoName})`}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClaimModal
        donation={donation}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={fetchDetail}
      />
    </div>
  );
}
