import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Leaf, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-neon-green">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-white font-display">
                Food<span className="gradient-text-emerald">Reach</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering communities by rescuing surplus food from restaurants, bakeries, and catered events to serve local shelters, soup kitchens, and families in need.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/50 p-2.5 rounded-xl">
              <Leaf className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>100% committed to zero edible waste and lower greenhouse emissions.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/explore" className="hover:text-emerald-400 transition">Explore Surplus Food</Link></li>
              <li><Link to="/donate/new" className="hover:text-amber-400 transition">Donor Surplus Portal</Link></li>
              <li><Link to="/ngo/dashboard" className="hover:text-cyan-400 transition">NGO & Shelter Network</Link></li>
              <li><Link to="/volunteer/dashboard" className="hover:text-emerald-400 transition">Volunteer Rescue Riders</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs mb-4 tracking-wider uppercase">Tech Stack</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Spring Boot 3.4.x (Java 21 LTS)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>MongoDB NoSQL Database</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Spring Security 6 + Stateless JWT</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>React 18/19 + Vite + Tailwind</li>
            </ul>
          </div>

          {/* Food Safety & Trust */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs mb-4 tracking-wider uppercase">Safety & Trust</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>FSSAI & Hygiene Verified</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Real-Time Temperature Logs</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Tamper-Evident Packaging</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Strict Expiry Windows (&lt;4h)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FoodReach Platform. Built with Spring Boot, MongoDB & React.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by compassion & technology to eliminate hunger</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
