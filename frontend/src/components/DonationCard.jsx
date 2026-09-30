import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Utensils, Scale, ArrowRight, Heart, Sparkles } from 'lucide-react';

export default function DonationCard({ donation, onClaimClick }) {
  const {
    id,
    title,
    description,
    foodType,
    dietaryType,
    quantity,
    unit,
    estimatedMeals,
    donorOrganization,
    donorName,
    city,
    pickupAddress,
    expiresAt,
    status,
    imageUrl,
    co2SavedKg,
  } = donation;

  // Dietary badge
  const getDietaryBadge = () => {
    if (dietaryType === 'VEG') {
      return <span className="bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">🌿 VEG</span>;
    } else if (dietaryType === 'VEGAN') {
      return <span className="bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-teal-500/30">🌱 VEGAN</span>;
    } else if (dietaryType === 'NON_VEG') {
      return <span className="bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-amber-500/30">🍗 NON-VEG</span>;
    }
    return <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">{dietaryType}</span>;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">AVAILABLE</span>;
      case 'CLAIMED':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md">CLAIMED</span>;
      case 'IN_TRANSIT':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md">IN TRANSIT</span>;
      case 'DELIVERED':
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md">DELIVERED</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md">{status}</span>;
    }
  };

  // Expiry time display helper
  const formatExpiry = (iso) => {
    if (!iso) return 'Flexible';
    try {
      const expDate = new Date(iso);
      const diffHrs = Math.round((expDate - new Date()) / (1000 * 60 * 60));
      if (diffHrs <= 0) return 'Expired';
      if (diffHrs < 24) return `${diffHrs}h remaining`;
      const days = Math.round(diffHrs / 24);
      return `${days}d remaining`;
    } catch {
      return 'Expires soon';
    }
  };

  return (
    <div className="dark-card rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col group dark-card-interactive shadow-lg">
      {/* Image & Badges */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/40"></div>

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {getStatusBadge()}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {getDietaryBadge()}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-dark-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {formatExpiry(expiresAt)}
          </span>
          {co2SavedKg && (
            <span className="text-emerald-400 font-mono font-bold text-[11px]">
              🌱 -{co2SavedKg}kg CO₂
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
              {foodType?.replace(/_/g, ' ') || 'Food Surplus'}
            </span>
            <span className="font-medium text-slate-400 text-xs">{city || 'San Francisco'}</span>
          </div>

          <h3 className="font-bold text-base text-white font-display line-clamp-1 group-hover:text-emerald-400 transition">
            {title}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {description || 'Nutritious surplus ready for rapid community shelter distribution.'}
          </p>

          {/* Quantity & Meals Highlights */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 bg-dark-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Quantity</span>
                <span className="font-bold text-white font-mono">{quantity} {unit || 'servings'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 border-l border-slate-800 pl-2">
              <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Meals</span>
                <span className="font-bold text-amber-300 font-mono">~{estimatedMeals || quantity} Portions</span>
              </div>
            </div>
          </div>

          {/* Donor details */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{donorOrganization || donorName || 'Donor'} · {pickupAddress}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <Link
            to={`/donations/${id}`}
            className="text-xs font-semibold text-slate-300 hover:text-white py-2 px-3 rounded-xl hover:bg-slate-800/80 transition"
          >
            View Details
          </Link>

          {status === 'AVAILABLE' && (
            <button
              onClick={() => onClaimClick && onClaimClick(donation)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-md shadow-emerald-500/20 transition transform active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Claim for Shelter</span>
            </button>
          )}

          {status !== 'AVAILABLE' && (
            <span className="text-xs font-mono font-medium text-slate-500 italic">
              {status === 'CLAIMED' ? 'Rescue Dispatched' : status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
