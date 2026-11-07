import React, { useState } from 'react';
import { useApp } from '../../context';
import { GraduationCap, ArrowRight, User, Mail, Lock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sanitizeInput, validatePasswordStrength } from '../../utils/security';

export const RegisterPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');

  const passwordEval = validatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(fullName);
    const cleanEmail = sanitizeInput(email);

    if (!cleanName || !cleanEmail || !password) {
      setError('All fields are required.');
      return;
    }

    if (passwordEval.score < 2) {
      setError('Please choose a stronger password before proceeding.');
      return;
    }

    if (!agree) {
      setError('Please agree to the student platform data security policy.');
      return;
    }

    setError('');
    // Transition straight to onboarding wizard with prefilled details
    setCurrentView('onboarding');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">Create Student Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Unlock rule-based scholarship matches & smart document tracking
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
                maxLength={70}
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters with numbers"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
                maxLength={64}
              />
            </div>

            {/* Password strength meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Security Strength:</span>
                  <span className={`font-bold ${
                    passwordEval.strength === 'Strong' ? 'text-emerald-700' :
                    passwordEval.strength === 'Good' ? 'text-blue-700' :
                    passwordEval.strength === 'Fair' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {passwordEval.strength}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className={`h-full flex-1 transition-all ${
                        idx <= passwordEval.score
                          ? passwordEval.score >= 3 ? 'bg-emerald-500' : passwordEval.score === 2 ? 'bg-amber-500' : 'bg-rose-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {passwordEval.feedback.length > 0 && (
                  <p className="text-[10px] text-slate-400">
                    Suggestion: {passwordEval.feedback[0]}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Next: 4-Step Academic Profile Setup</span>
            </div>
            <p>You'll configure your degree, CGPA, and income to calculate accurate scholarship eligibility.</p>
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>I agree to the GRANTLY Student Privacy Policy & Fair Data Terms.</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue to Student Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <button
            onClick={() => setCurrentView('login')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Sign In Here
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Third-Party Tracking • GDPR & DPDP Aligned</span>
        </div>
      </div>
    </div>
  );
};
