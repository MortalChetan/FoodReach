import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UtensilsCrossed, 
  PlusCircle, 
  Bike, 
  Building2, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Shield,
  Compass,
  Sparkles,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'ROLE_DONOR') return '/donor/dashboard';
    if (role === 'ROLE_NGO') return '/ngo/dashboard';
    if (role === 'ROLE_VOLUNTEER') return '/volunteer/dashboard';
    if (role === 'ROLE_ADMIN') return '/admin/dashboard';
    return '/explore';
  };

  const getRoleBadge = () => {
    if (!role) return null;
    const map = {
      ROLE_DONOR: { label: 'Donor Partner', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
      ROLE_NGO: { label: 'NGO Shelter', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
      ROLE_VOLUNTEER: { label: 'Rescue Rider', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
      ROLE_ADMIN: { label: 'Admin HQ', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
    };
    const current = map[role] || { label: role, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${current.bg} shadow-sm flex items-center gap-1.5`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
        {current.label}
      </span>
    );
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 dark-glass border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition transform">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl font-display tracking-tight text-white group-hover:text-emerald-400 transition flex items-center gap-1.5">
                Food<span className="gradient-text-emerald">Reach</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                  PRO
                </span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Zero Waste · Zero Hunger Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive('/explore')
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Food</span>
            </Link>

            {role === 'ROLE_DONOR' && (
              <Link
                to="/donate/new"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/donate/new')
                    ? 'text-amber-300 bg-amber-950/40 border border-amber-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Post Surplus</span>
              </Link>
            )}

            {role === 'ROLE_NGO' && (
              <Link
                to="/ngo/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/ngo/dashboard')
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Shelter Claims</span>
              </Link>
            )}

            {role === 'ROLE_VOLUNTEER' && (
              <Link
                to="/volunteer/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/volunteer/dashboard')
                    ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bike className="w-4 h-4 text-emerald-400" />
                <span>Rescue Missions</span>
              </Link>
            )}

            {role === 'ROLE_ADMIN' && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/admin/dashboard')
                    ? 'text-purple-300 bg-purple-950/40 border border-purple-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Hub</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {getRoleBadge()}
                <Link
                  to={getDashboardLink()}
                  className="text-xs font-bold text-slate-100 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-3.5 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{user?.name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-950/30 border border-transparent hover:border-red-900/50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Join Platform
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-dark-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Explore Food
          </Link>
          {role === 'ROLE_DONOR' && (
            <Link
              to="/donate/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-amber-300 hover:bg-amber-950/40"
            >
              Post Food Donation
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40"
              >
                Go to Dashboard ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl text-xs"
              >
                Join Platform
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
