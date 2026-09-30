import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Utensils, 
  Bike, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2,
  Zap,
  Activity,
  MapPin
} from 'lucide-react';

export default function HeroSection() {
  const { quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('radar');

  return (
    <section className="relative overflow-hidden pt-12 pb-24 bg-mesh-dark bg-grid-pattern border-b border-slate-800/80">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-neon-green">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time AI & Volunteer Powered Food Rescue</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.12]">
              Rescue Surplus Food. <br />
              <span className="gradient-text-emerald">Nourish Communities.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              FoodReach connects restaurants, bakeries, supermarkets, and event caterers with local shelters, soup kitchens, and volunteer riders — ensuring nutritious food feeds people, not landfills.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 60-Sec Surplus Posting
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Instant Shelter Claim
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> 4-Digit OTP Verification
              </span>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 text-sm"
              >
                <span>Browse Available Food</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                to="/donate/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition transform hover:-translate-y-0.5 text-sm shadow-md"
              >
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Post Surplus Food</span>
              </Link>

              <Link
                to="/volunteer/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 transition text-sm"
              >
                <Bike className="w-4 h-4 text-emerald-400" />
                <span>Volunteer Rider</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Radar Stream Card */}
          <div className="lg:col-span-5 relative">
            <div className="dark-card rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
              {/* Radar pulse effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>

              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    LIVE RESCUE RADAR
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400">DELHI NCR · MUMBAI · BLR</span>
              </div>

              {/* Live Mission Items */}
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-dark-900/90 border border-slate-800 hover:border-emerald-500/40 transition flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80"
                    alt="Royal Shahi Paneer & Naan"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">Royal Banquet Shahi Paneer</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        AVAILABLE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Taj Palace (Chanakyapuri, Delhi) · 150 meals</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-amber-400 font-semibold font-mono">
                      <Clock className="w-3 h-3" />
                      <span>5 hrs pickup window · FSSAI Verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-dark-900/90 border border-slate-800 hover:border-cyan-500/40 transition flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80"
                    alt="Khichdi distribution"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">Lentil Khichdi Meal Boxes</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        IN TRANSIT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Taj Banquets → Robin Hood Army Shelter</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                      <Bike className="w-3 h-3" />
                      <span>Rider Rahul on route · OTP #6284 Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <span className="text-emerald-400">🌱</span> 2,840 kg CO₂ mitigated in India
                </span>
                <Link to="/explore" className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <span>Explore All Cities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
