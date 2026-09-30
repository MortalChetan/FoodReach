import React from 'react';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedFoodType,
  setSelectedFoodType,
  selectedDietary,
  setSelectedDietary,
  onlyAvailable,
  setOnlyAvailable,
}) {
  const indianCities = [
    { label: 'All India 🇮🇳', value: '' },
    { label: 'Delhi NCR', value: 'Delhi NCR' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Jaipur', value: 'Jaipur' },
    { label: 'Kolkata', value: 'Kolkata' },
    { label: 'Ahmedabad', value: 'Ahmedabad' },
  ];

  const foodTypes = [
    { label: 'All Categories', value: '' },
    { label: 'Cooked Meals', value: 'COOKED_MEALS' },
    { label: 'Bakery & Bread', value: 'BAKERY_AND_BREAD' },
    { label: 'Fresh Produce', value: 'FRESH_PRODUCE' },
    { label: 'Packaged Food', value: 'PACKAGED_FOOD' },
    { label: 'Raw Ingredients', value: 'RAW_INGREDIENTS' },
  ];

  const dietaryTypes = [
    { label: 'All Diets', value: '' },
    { label: '🌿 Pure Veg', value: 'VEG' },
    { label: '🌱 Vegan', value: 'VEGAN' },
    { label: '🍗 Non-Veg', value: 'NON_VEG' },
  ];

  return (
    <div className="dark-card rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
      {/* Search and Availability Checkbox */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Indian dishes, thalis, banquet caterers, or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-xs bg-dark-900/90 text-white placeholder-slate-500"
          />
        </div>

        {/* Availability Toggle */}
        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none bg-dark-900/90 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
          />
          <span>Show Available Only</span>
        </label>
      </div>

      {/* Indian City Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1">
        <span className="text-amber-400 font-mono font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400" /> City:
        </span>
        {indianCities.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCity(c.value)}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition text-xs flex items-center gap-1 ${
              selectedCity === c.value
                ? 'bg-amber-400 text-slate-950 font-bold shadow-neon-amber'
                : 'bg-dark-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Categories & Dietary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80">
        {/* Food Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0">Category:</span>
          {foodTypes.map((ft) => (
            <button
              key={ft.value}
              onClick={() => setSelectedFoodType(ft.value)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition text-xs ${
                selectedFoodType === ft.value
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-dark-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0">Diet:</span>
          {dietaryTypes.map((dt) => (
            <button
              key={dt.value}
              onClick={() => setSelectedDietary(dt.value)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition text-xs ${
                selectedDietary === dt.value
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-neon-cyan'
                  : 'bg-dark-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

