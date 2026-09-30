import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deliveryApi } from '../api/client';
import { 
  Bike, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VolunteerDashboardPage() {
  const { user, role, quickDemoLogin } = useAuth();
  const [pendingTasks, setPendingTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'my'

  // Verification modal / input state
  const [otpInput, setOtpInput] = useState({});
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [pendingRes, myRes] = await Promise.all([
        deliveryApi.getPending(),
        deliveryApi.getMyTasks().catch(() => ({ success: true, data: [] })),
      ]);

      if (pendingRes.success && pendingRes.data) setPendingTasks(pendingRes.data);
      if (myRes.success && myRes.data) setMyTasks(myRes.data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAccept = async (taskId) => {
    setActionError('');
    try {
      const res = await deliveryApi.accept(taskId);
      if (res.success) {
        setActionSuccess('Rescue Mission accepted! Head to the donor location.');
        fetchTasks();
        setActiveTab('my');
      } else {
        setActionError(res.message || 'Could not accept task');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error accepting delivery mission');
    }
  };

  const handleVerifyPickup = async (taskId) => {
    setActionError('');
    const code = otpInput[taskId];
    if (!code) {
      setActionError('Please enter the 4-digit pickup OTP provided by the donor');
      return;
    }

    try {
      const res = await deliveryApi.updateStatus(taskId, {
        status: 'PICKED_UP',
        otp: code,
      });

      if (res.success) {
        setActionSuccess('Pickup verified! Transporting food to NGO shelter.');
        fetchTasks();
      } else {
        setActionError(res.message || 'Invalid OTP');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Invalid OTP code from donor');
    }
  };

  const handleCompleteDelivery = async (taskId) => {
    setActionError('');
    try {
      const res = await deliveryApi.updateStatus(taskId, {
        status: 'DELIVERED',
        proofNotes: 'Delivered securely to NGO shelter staff',
      });

      if (res.success) {
        setActionSuccess('Food Rescue mission successfully completed!');
        try {
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
        } catch (_) {}
        fetchTasks();
      } else {
        setActionError(res.message || 'Could not complete delivery');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error completing delivery');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Volunteer Rescue Dispatch
          </span>
          <h1 className="text-3xl font-black text-white font-display mt-2">
            Welcome, Rider {user?.name || 'Volunteer'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Accept food rescue missions and perform real-time OTP handovers.</p>
        </div>

        {/* Role prompt if not volunteer */}
        {role !== 'ROLE_VOLUNTEER' && role !== 'ROLE_ADMIN' && (
          <button
            onClick={() => quickDemoLogin('VOLUNTEER')}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-neon-green transition"
          >
            Quick Login as Volunteer Rider (Alex)
          </button>
        )}
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 font-bold shadow-neon-green">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 font-mono ${
            activeTab === 'pending'
              ? 'bg-emerald-500 text-slate-950 shadow-neon-green'
              : 'text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700'
          }`}
        >
          <span>Available Missions</span>
          <span className="bg-slate-950/30 px-1.5 py-0.5 rounded-full text-[10px]">{pendingTasks.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 font-mono ${
            activeTab === 'my'
              ? 'bg-emerald-500 text-slate-950 shadow-neon-green'
              : 'text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700'
          }`}
        >
          <span>My Active Tasks</span>
          <span className="bg-slate-700 text-white px-1.5 py-0.5 rounded-full text-[10px]">{myTasks.length}</span>
        </button>
      </div>

      {/* Tab 1: Available Missions */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingTasks.map((t) => (
                <div key={t.id} className="dark-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 bg-dark-900/90 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      {t.foodType?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {t.quantity} {t.unit}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-white">{t.donationTitle}</h3>

                  <div className="space-y-2.5 text-xs text-slate-300 border-y border-slate-800 py-3.5 bg-dark-950/50 p-3 rounded-2xl">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold shrink-0 text-[10px] font-mono">A</div>
                      <div>
                        <span className="font-bold text-white">Pickup: </span>
                        <span className="text-slate-400">{t.donorName} · {t.pickupAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold shrink-0 text-[10px] font-mono">B</div>
                      <div>
                        <span className="font-bold text-white">Dropoff: </span>
                        <span className="text-slate-400">{t.ngoName} · {t.dropoffAddress}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(t.id)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Bike className="w-4 h-4 stroke-[2.5]" />
                    <span>Accept Rescue Mission</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center dark-card rounded-3xl border border-slate-800">
              <Bike className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No pending delivery missions right now</h3>
              <p className="text-xs text-slate-500 mt-1">Check back once an NGO claims a surplus food listing!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Tasks */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {myTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTasks.map((t) => (
                <div key={t.id} className="dark-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 bg-dark-900/90">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{t.donationTitle}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      t.status === 'ACCEPTED_BY_VOLUNTEER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      t.status === 'PICKED_UP' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      t.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-slate-800'
                    }`}>
                      {t.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="space-y-2 text-xs text-slate-300 bg-dark-950 p-3.5 rounded-2xl border border-slate-800">
                    <p><span className="font-bold text-white">Pickup from:</span> {t.donorName} ({t.donorPhone || 'At front desk'})</p>
                    <p><span className="font-bold text-white">Address:</span> {t.pickupAddress}</p>
                    <hr className="border-slate-800 my-2" />
                    <p><span className="font-bold text-white">Deliver to:</span> {t.ngoName} ({t.ngoPhone || 'NGO contact'})</p>
                    <p><span className="font-bold text-white">Drop Address:</span> {t.dropoffAddress}</p>
                  </div>

                  {/* Step 1: OTP Entry */}
                  {t.status === 'ACCEPTED_BY_VOLUNTEER' && (
                    <div className="space-y-2.5 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                      <label className="block text-xs font-bold text-amber-300 font-mono">
                        Step 1: Enter Donor's 4-digit Pickup OTP
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength="6"
                          placeholder="e.g. 4821"
                          value={otpInput[t.id] || ''}
                          onChange={(e) => setOtpInput({ ...otpInput, [t.id]: e.target.value })}
                          className="flex-1 px-3 py-2.5 rounded-xl border border-amber-500/40 bg-dark-950 text-white text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleVerifyPickup(t.id)}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition"
                        >
                          Verify Pickup
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Dropoff Confirmation */}
                  {t.status === 'PICKED_UP' && (
                    <div className="space-y-2.5 bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/30">
                      <p className="text-xs font-bold text-cyan-300">
                        Step 2: Food is In-Transit to NGO shelter.
                      </p>
                      <button
                        onClick={() => handleCompleteDelivery(t.id)}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow-neon-green transition flex items-center justify-center gap-2 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Confirm Handover & Complete Mission</span>
                      </button>
                    </div>
                  )}

                  {t.status === 'DELIVERED' && (
                    <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-neon-green">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Mission Completed! Thank you for rescuing food.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center dark-card rounded-3xl border border-slate-800 text-xs text-slate-400">
              No active rescue tasks assigned to you right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
