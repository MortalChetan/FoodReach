import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, LogIn, Sparkles, AlertCircle, Building2, Bike, Utensils, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/explore');
    } else {
      setError(res.message);
    }
  };

  const handleDemo = async (role) => {
    const res = await quickDemoLogin(role);
    if (res.success) {
      if (role === 'DONOR') navigate('/donor/dashboard');
      else if (role === 'NGO') navigate('/ngo/dashboard');
      else if (role === 'VOLUNTEER') navigate('/volunteer/dashboard');
      else navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center mx-auto shadow-neon-green font-black">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black font-display text-white">Sign in to FoodReach</h2>
          <p className="text-xs text-slate-400">Access your surplus donations, shelter claims, or volunteer missions.</p>
        </div>

        {/* 1-Click Fast Persona Login */}
        <div className="p-4 rounded-2xl dark-card border border-slate-800 space-y-2.5 text-xs bg-dark-900/90 shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>1-Click Fast Persona Sign In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('DONOR')}
              className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-left hover:border-amber-400/60 font-semibold text-slate-300 flex items-center gap-2 hover:bg-dark-850 transition"
            >
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('NGO')}
              className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-left hover:border-cyan-400/60 font-semibold text-slate-300 flex items-center gap-2 hover:bg-dark-850 transition"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>NGO Shelter</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('VOLUNTEER')}
              className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-left hover:border-emerald-400/60 font-semibold text-slate-300 flex items-center gap-2 hover:bg-dark-850 transition"
            >
              <Bike className="w-4 h-4 text-emerald-400" />
              <span>Volunteer Rider</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-left hover:border-purple-400/60 font-semibold text-slate-300 flex items-center gap-2 hover:bg-dark-850 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="dark-card rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-5 bg-dark-900/90">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-dark-950 text-white text-xs focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
