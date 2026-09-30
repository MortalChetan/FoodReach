import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, UserPlus, AlertCircle, Building2, Bike, Utensils } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_DONOR',
    organizationName: '',
    phone: '',
    address: '',
    city: 'San Francisco',
  });

  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      navigate('/explore');
    } else {
      setError(res.message);
    }
  };

  const roleOptions = [
    { value: 'ROLE_DONOR', label: 'Food Donor', desc: 'Restaurant, Caterer, Store', icon: Utensils, color: 'text-amber-400' },
    { value: 'ROLE_NGO', label: 'NGO Shelter', desc: 'Soup Kitchen, Charity', icon: Building2, color: 'text-cyan-400' },
    { value: 'ROLE_VOLUNTEER', label: 'Volunteer Rider', desc: 'Rescue Courier', icon: Bike, color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center mx-auto shadow-neon-green font-black">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black font-display text-white">Join FoodReach</h2>
          <p className="text-xs text-slate-400">Become part of the zero-waste surplus food rescue movement.</p>
        </div>

        {/* Register Form */}
        <div className="dark-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 bg-dark-900/90">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">I am joining as a:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.role === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, role: opt.value })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/50 text-white ring-2 ring-emerald-500/30 shadow-neon-green'
                          : 'border-slate-800 hover:border-slate-700 bg-dark-950 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${opt.color}`} />
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Org */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Organization / Business Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Green Bakery, Hope Shelter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Creating Account...' : 'Create FoodReach Account'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
