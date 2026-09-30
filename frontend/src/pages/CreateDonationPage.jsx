import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationApi } from '../api/client';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  Scale, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Leaf,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreateDonationPage() {
  const { user, role, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  // Expiry default: 6 hours from now
  const getDefaultExpiry = () => {
    const d = new Date(Date.now() + 6 * 3600 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'COOKED_MEALS',
    dietaryType: 'VEG',
    quantity: '100',
    unit: 'servings',
    expiresAt: getDefaultExpiry(),
    pickupAddress: user?.address || '2 Sardar Patel Marg, Chanakyapuri',
    city: user?.city || 'Delhi NCR',
    allergens: 'Contains Dairy (Paneer, Ghee), Gluten (Naan)',
    storageInstructions: 'Packaged in food-grade insulated thermal containers. Keep warm.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Indian Quick Preset Samples
  const presets = [
    {
      label: '🍲 North Indian Royal Banquet',
      title: 'Royal Awadhi Shahi Paneer, Dal Makhani & Butter Naans',
      description: 'Five-star banquet dinner surplus. Freshly prepared, hygienically sealed in food-grade aluminum foil containers.',
      foodType: 'COOKED_MEALS',
      dietaryType: 'VEG',
      quantity: '120',
      unit: 'servings',
      allergens: 'Contains Dairy (Paneer, Butter), Gluten (Naan)',
      storageInstructions: 'Keep hot in thermal carriers (>60°C).',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: '🍚 Hyderabadi Dum Biryani',
      title: 'Hyderabadi Dum Biryani Feast & Mirchi Ka Salan Handi',
      description: 'Sealed copper handi surplus biryani from corporate evening conference with raita and salan.',
      foodType: 'COOKED_MEALS',
      dietaryType: 'NON_VEG',
      quantity: '100',
      unit: 'servings',
      allergens: 'Contains Spices, Chicken, Dairy',
      storageInstructions: 'Keep warm above 65°C.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: '🥞 South Indian Tiffin Feast',
      title: 'South Indian Tiffin - 150 Steamed Idlis, Medu Vada & Sambar',
      description: 'Nutritious breakfast and evening tiffin surplus from central kitchen. Packed in sanitized containers.',
      foodType: 'COOKED_MEALS',
      dietaryType: 'VEG',
      quantity: '150',
      unit: 'items',
      allergens: 'Lentils, Coconut',
      storageInstructions: 'Keep in warm insulated containers.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: '🥭 Farm Fresh Fruits Crates',
      title: 'Organic Alfonso Mangoes, Oranges & Vegetable Crates',
      description: 'Fresh farm produce crates from supply chain surplus. 100% fresh, rich in vitamins for shelter kitchens.',
      foodType: 'FRESH_PRODUCE',
      dietaryType: 'VEGAN',
      quantity: '50',
      unit: 'kg',
      allergens: 'None',
      storageInstructions: 'Store in cool ventilated space.',
      imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: '🥐 Halwai Sweets & Bakery',
      title: 'Halwai Sweets, Motichoor Laddoos & Samosa Snack Boxes',
      description: 'Festive sweets and tea snack boxes packaged in tamper-proof containers.',
      foodType: 'BAKERY_AND_BREAD',
      dietaryType: 'VEG',
      quantity: '80',
      unit: 'items',
      allergens: 'Dairy, Gluten, Nuts',
      storageInstructions: 'Store in cool dry place.',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const applyPreset = (p) => {
    setFormData((prev) => ({
      ...prev,
      ...p,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estimatedMeals = Math.round(
    parseFloat(formData.quantity || 0) * (formData.unit === 'kg' ? 2.5 : 1)
  );
  const estimatedCo2 = Math.round((estimatedMeals * 0.45 * 2.5) * 10) / 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        expiresAt: new Date(formData.expiresAt).toISOString(),
      };

      const res = await donationApi.create(payload);
      if (res.success) {
        setSuccess(true);
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        setTimeout(() => {
          navigate('/donor/dashboard');
        }, 1500);
      } else {
        setError(res.message || 'Failed to post donation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-black text-white font-display">Post Surplus Food Donation</h1>
        <p className="text-xs text-slate-400">
          List edible surplus food from your kitchen or store to rescue meals in minutes.
        </p>
      </div>

      {/* Role Notice if not donor */}
      {role !== 'ROLE_DONOR' && role !== 'ROLE_ADMIN' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>You are currently not logged in as a Donor. Switch persona to test publishing:</span>
          </div>
          <button
            onClick={() => quickDemoLogin('DONOR')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shrink-0 shadow-sm transition"
          >
            Quick Login as Donor
          </button>
        </div>
      )}

      {/* Preset Autofill */}
      <div className="mb-6 p-4 rounded-2xl dark-card border border-slate-800">
        <div className="flex items-center gap-2 mb-2.5 text-xs font-mono font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Quick Demo Presets (Click to autofill sample meal data):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-7 dark-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 bg-dark-900/90">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-bold shadow-neon-green">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Surplus Food Posted Successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Meal / Food Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Executive Buffet Surplus - Rice, Stew & Fresh Salad"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description & Packaging *
              </label>
              <textarea
                required
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the items, containers, and preparation hygiene..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              ></textarea>
            </div>

            {/* Category & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Food Category *
                </label>
                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                >
                  <option value="COOKED_MEALS">Cooked Meals</option>
                  <option value="BAKERY_AND_BREAD">Bakery & Bread</option>
                  <option value="FRESH_PRODUCE">Fresh Produce</option>
                  <option value="PACKAGED_FOOD">Packaged / Canned</option>
                  <option value="RAW_INGREDIENTS">Raw Ingredients</option>
                  <option value="BEVERAGES_AND_DAIRY">Dairy & Beverages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Dietary Classification *
                </label>
                <select
                  name="dietaryType"
                  value={formData.dietaryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                >
                  <option value="VEG">Vegetarian (Veg)</option>
                  <option value="VEGAN">100% Plant Vegan</option>
                  <option value="NON_VEG">Non-Vegetarian</option>
                  <option value="HALAL">Halal Certified</option>
                  <option value="JAIN">Jain Compliant</option>
                </select>
              </div>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Unit Measurement *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                >
                  <option value="servings">Servings / Portions</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="items">Items / Units</option>
                  <option value="boxes">Boxes / Trays</option>
                </select>
              </div>
            </div>

            {/* Expiry & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Pickup Expiry Window *
                </label>
                <input
                  type="datetime-local"
                  required
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  City (India) *
                </label>
                <input
                  type="text"
                  required
                  list="indian-city-list"
                  name="city"
                  placeholder="e.g. Delhi NCR, Mumbai, Bengaluru..."
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
                <datalist id="indian-city-list">
                  <option value="Delhi NCR" />
                  <option value="Mumbai" />
                  <option value="Bengaluru" />
                  <option value="Hyderabad" />
                  <option value="Chennai" />
                  <option value="Pune" />
                  <option value="Jaipur" />
                  <option value="Kolkata" />
                  <option value="Ahmedabad" />
                  <option value="Lucknow" />
                  <option value="Chandigarh" />
                </datalist>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                required
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Full address where volunteer/NGO driver should arrive"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            {/* Allergens & Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Allergens (Optional)
                </label>
                <input
                  type="text"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleChange}
                  placeholder="e.g. Contains Nuts, Wheat"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Storage Handling (Optional)
                </label>
                <input
                  type="text"
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Keep warm, Fragile"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Utensils className="w-5 h-5" />
                <span>{loading ? 'Publishing Surplus Listing...' : 'Publish Surplus Food for Rescue'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation & Preview Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="dark-card rounded-3xl p-6 border border-slate-800 bg-dark-900/90 shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Live Rescue Calculations</span>
            </h3>

            <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimated Portions:</span>
                <span className="text-xl font-black font-display text-emerald-400 font-mono">~{estimatedMeals} Meals</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CO₂ Emissions Prevented:</span>
                <span className="text-xl font-black font-display text-cyan-400 font-mono">🌱 {estimatedCo2} kg</span>
              </div>
            </div>

            {/* Live Visual Card Preview */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-2">Live Listing Card Preview</span>
              <div className="rounded-2xl border border-slate-800 bg-dark-850 overflow-hidden text-xs">
                <div className="h-32 bg-slate-900 relative">
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded font-mono">
                    AVAILABLE
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-white truncate text-sm">{formData.title || 'Untitled Surplus Meal'}</h4>
                  <p className="text-[11px] text-slate-400">{formData.quantity} {formData.unit} (~{estimatedMeals} meals)</p>
                  <p className="text-[10px] text-emerald-400 font-mono">🌱 -{estimatedCo2}kg CO₂</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
