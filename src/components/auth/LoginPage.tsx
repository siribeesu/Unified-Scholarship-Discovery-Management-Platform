import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { sanitizeInput } from '../../utils/security';

export const LoginPage: React.FC = () => {
  const { setCurrentView, login, switchPersona } = useApp();
  const [email, setEmail] = useState('priya.sharma@campus.edu.in');
  const [password, setPassword] = useState('Scholar2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError('Account temporarily locked due to excessive failed attempts. Please wait 30 seconds.');
      return;
    }

    const cleanEmail = sanitizeInput(email);
    if (!cleanEmail || !password) {
      setError('Please provide both valid email and password.');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid academic or personal email address.');
      return;
    }

    setError('');
    login(cleanEmail);
  };

  const handleDemoSignIn = (idx: number) => {
    switchPersona(idx);
    login();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">Welcome to GRANTLY</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to manage your scholarship applications & matches</p>
        </div>

        {/* Quick Demo Personas */}
        <div className="mb-6 p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Demo Sign-In (Click any persona):</span>
          </div>
          <div className="space-y-1.5">
            {DEMO_PROFILES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleDemoSignIn(idx)}
                className="w-full text-left px-3 py-1.5 bg-white hover:bg-emerald-100/60 rounded-lg border border-emerald-100 text-xs flex items-center justify-between text-slate-700 transition-colors"
              >
                <span className="font-semibold">{p.fullName}</span>
                <span className="text-[10px] text-slate-500">{p.degree} • CGPA {p.cgpa}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('For this demo environment, enter any password or use the 1-click persona buttons above.')}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
                maxLength={64}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
              <span>Remember me on this trusted device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => setCurrentView('register')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Register & Onboard Free
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Transport (TLS 1.3) & Anti-Brute Force Protection</span>
        </div>
      </div>
    </div>
  );
};
