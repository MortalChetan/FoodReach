import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ImpactStatsBar from '../components/ImpactStatsBar';
import DonationCard from '../components/DonationCard';
import ClaimModal from '../components/ClaimModal';
import { donationApi } from '../api/client';
import { 
  Utensils, 
  Building2, 
  Bike, 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Heart,
  ChevronRight,
  Zap,
  Play,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export default function HomePage() {
  const [featuredDonations, setFeaturedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  // Interactive Live Simulator State
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    donationApi.getAll({ status: 'AVAILABLE' })
      .then((res) => {
        if (res.success && res.data) {
          setFeaturedDonations(res.data.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpenClaim = (donation) => {
    setSelectedDonation(donation);
    setClaimModalOpen(true);
  };

  const handleClaimSuccess = () => {
    donationApi.getAll({ status: 'AVAILABLE' }).then((res) => {
      if (res.success && res.data) setFeaturedDonations(res.data.slice(0, 3));
    });
  };

  const steps = [
    {
      step: '01',
      title: 'Post Surplus Food',
      desc: 'Restaurants or caterers list excess edible food in 60s with pickup expiry window and estimated meals.',
      icon: Utensils,
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    },
    {
      step: '02',
      title: 'Instant NGO Matching',
      desc: 'Local verified shelters and soup kitchens claim meals with 1-click based on urgent hunger needs.',
      icon: Building2,
      color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    },
    {
      step: '03',
      title: 'Volunteer Rider Pickup',
      desc: 'Community couriers accept the mission, verify pickup with a 4-digit OTP, and transport food swiftly.',
      icon: Bike,
      color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    },
    {
      step: '04',
      title: 'Zero Waste Impact',
      desc: 'Surplus food reaches hungry families safely, preventing methane emissions from municipal landfills.',
      icon: Leaf,
      color: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    },
  ];

  // Interactive Simulator Data
  const simStages = [
    {
      badge: 'Step 1: Indian Donor Publishes Surplus',
      title: 'Chef Vikramaditya (Taj Palace Delhi) lists 150 servings of Shahi Paneer & Naans',
      desc: 'System calculates 150 meals portion and 168.7 kg CO₂ mitigation. Generates secure handover OTP: 4821.',
      icon: Utensils,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      badge: 'Step 2: Shelter Claims Meal with 1-Click',
      title: 'Aarav Mehta (Robin Hood Army Delhi Chapter) claims dinner for night shelter',
      desc: 'Food is reserved. Delivery dispatch task is automatically assigned to nearby volunteer rescue riders.',
      icon: Building2,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      badge: 'Step 3: Rider Dual OTP Handover',
      title: 'Volunteer Rahul Sharma arrives at Taj Palace kitchen & verifies OTP (4821)',
      desc: 'Food is marked IN-TRANSIT. Route navigation activates as Rahul transports thermal containers to Hauz Khas.',
      icon: Bike,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      badge: 'Step 4: Safe Handover & Live Impact',
      title: '150 hot nutritious meals served to community shelter residents',
      desc: 'Donation verified with Delivery OTP 9214. Platform impact counters increment in real time.',
      icon: CheckCircle2,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Impact Stats Bar */}
      <ImpactStatsBar />

      {/* 3. Interactive Rescue Lifecycle Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="dark-card rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden bg-dark-900/90 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>INTERACTIVE RESCUE SIMULATOR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Experience The Complete Food Rescue Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click the steps below to see how FoodReach connects stakeholders from kitchen to shelter:
              </p>
            </div>

            {/* Simulation Step Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {simStages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSimStep(i)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 font-mono ${
                    simStep === i
                      ? 'bg-emerald-500 text-slate-950 shadow-neon-green'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>0{i + 1}</span>
                  <span className="hidden sm:inline">Stage</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Sim Stage Display */}
          <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${simStages[simStep].color}`}>
                {simStages[simStep].badge}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                {simStages[simStep].title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {simStages[simStep].desc}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimStep((prev) => (prev + 1) % simStages.length)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-2 transition"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Available Food Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Rescue Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Available Surplus Food Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Freshly prepared surplus meals and groceries ready for rapid shelter pickup.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group font-mono"
          >
            <span>Explore All Listings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredDonations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onClaimClick={handleOpenClaim}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center dark-card rounded-3xl border border-slate-800">
            <Utensils className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No active surplus listings right now</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first donor to post surplus food!</p>
            <Link
              to="/donate/new"
              className="mt-4 inline-block px-5 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl"
            >
              Post Food Donation
            </Link>
          </div>
        )}
      </section>

      {/* 5. 4-Step Process Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Architecture</span>
          <h2 className="text-3xl font-black font-display text-white">
            How FoodReach Rescues Food
          </h2>
          <p className="text-xs text-slate-400">
            An intelligent, transparent pipeline turning edible waste into warm meals within hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl dark-card border border-slate-800 relative hover:border-emerald-500/40 transition group"
              >
                <span className="absolute top-4 right-4 text-xl font-mono font-black text-slate-700 group-hover:text-emerald-500/40 transition">
                  {s.step}
                </span>
                <div className={`w-12 h-12 rounded-xl border ${s.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-display text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Claim Modal */}
      <ClaimModal
        donation={selectedDonation}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={handleClaimSuccess}
      />
    </div>
  );
}
