import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import DonationCard from '../components/DonationCard';
import ClaimModal from '../components/ClaimModal';
import { donationApi } from '../api/client';
import { Sparkles, UtensilsCrossed, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ExplorePage() {
  const { role } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  // Claim modal
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const fetchDonations = () => {
    setLoading(true);
    const params = {};
    if (selectedFoodType) params.foodType = selectedFoodType;
    if (selectedDietary) params.dietaryType = selectedDietary;
    if (selectedCity) params.city = selectedCity;
    if (onlyAvailable) params.status = 'AVAILABLE';

    donationApi.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setDonations(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedCity, selectedFoodType, selectedDietary, onlyAvailable]);

  const filteredDonations = donations.filter((d) => {
    if (selectedCity && d.city && !d.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.donorOrganization?.toLowerCase().includes(q) ||
      d.donorName?.toLowerCase().includes(q) ||
      d.city?.toLowerCase().includes(q)
    );
  });

  const handleOpenClaim = (donation) => {
    setSelectedDonation(donation);
    setClaimModalOpen(true);
  };

  const handleClaimSuccess = () => {
    fetchDonations();
  };

  const totalMealsCount = filteredDonations.reduce((acc, curr) => acc + (curr.estimatedMeals || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
            <span>🇮🇳 INDIA SURPLUS RESCUE NETWORK</span>
          </div>
          <h1 className="text-3xl font-black text-white font-display">
            Explore Surplus Food Across India
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover edible surplus meals from top hotels, banquets, and corporate food courts in Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, and Pune.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-emerald-300">
            🥘 <span className="font-extrabold text-emerald-400">{totalMealsCount.toLocaleString()}</span> meals ready for rescue
          </div>

          <Link
            to="/donate/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post Donation</span>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedFoodType={selectedFoodType}
        setSelectedFoodType={setSelectedFoodType}
        selectedDietary={selectedDietary}
        setSelectedDietary={setSelectedDietary}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
      />

      {/* Grid of Listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-slate-800/40 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onClaimClick={handleOpenClaim}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center dark-card rounded-3xl border border-slate-800">
          <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No surplus food listings match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try changing your search term or clearing food category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFoodType('');
              setSelectedDietary('');
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition border border-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      )}

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
