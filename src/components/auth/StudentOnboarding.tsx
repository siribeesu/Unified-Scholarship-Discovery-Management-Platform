import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationLevel, Category, ScholarshipType } from '../../types/scholarship';
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Award, 
  DollarSign, 
  Compass 
} from 'lucide-react';

export const StudentOnboarding: React.FC = () => {
  const { currentUser, registerAndOnboard, setCurrentView } = useApp();
  const [step, setStep] = useState(1);

  // Form State initialized from current user defaults
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || 'Priya Sharma',
    email: currentUser.email || 'priya.sharma@campus.edu.in',
    phone: currentUser.phone || '+91 98765 43210',
    gender: currentUser.gender || 'Female',
    educationLevel: (currentUser.educationLevel || 'Undergraduate') as EducationLevel,
    degree: currentUser.degree || 'B.Tech',
    branch: currentUser.branch || 'Computer Science',
    academicYear: currentUser.academicYear || 3,
    cgpa: currentUser.cgpa || 8.8,
    annualFamilyIncome: currentUser.annualFamilyIncome || 320000,
    category: (currentUser.category || 'OBC') as Category,
    stateDomicile: currentUser.stateDomicile || 'Maharashtra',
    institutionName: currentUser.institutionName || 'College of Engineering, Pune (COEP)',
    preferredScholarshipTypes: (currentUser.preferredScholarshipTypes || ['Government (Central)', 'Private / CSR']) as ScholarshipType[],
    interestedInInternational: currentUser.interestedInInternational ?? true,
    isFirstGenerationLearner: currentUser.isFirstGenerationLearner ?? false,
    hasDisability: currentUser.hasDisability ?? false
  });

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete
      registerAndOnboard(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('landing');
    }
  };

  const toggleScholarshipType = (type: ScholarshipType) => {
    const current = formData.preferredScholarshipTypes;
    if (current.includes(type)) {
      if (current.length > 1) {
        updateField('preferredScholarshipTypes', current.filter(t => t !== type));
      }
    } else {
      updateField('preferredScholarshipTypes', [...current, type]);
    }
  };

  // Profile strength calculation
  const calculateStrength = () => {
    let score = 25;
    if (step >= 2) score += 25;
    if (step >= 3) score += 25;
    if (step >= 4) score += 25;
    return score;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 bg-slate-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Step {step} of 4
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Student Profile Onboarding</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {step === 1 && 'Academic Program & Degree'}
              {step === 2 && 'Academic Merit & Institution'}
              {step === 3 && 'Financial & Category Profile'}
              {step === 4 && 'Scholarship Preferences'}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700">{calculateStrength()}% Ready</span>
            <div className="w-24 bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${calculateStrength()}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Step 1: Degree & Academic Level */}
        {step === 1 && (
          <div className="py-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Education Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Undergraduate', 'Postgraduate', 'PhD / Doctorate', 'High School'] as EducationLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateField('educationLevel', lvl)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.educationLevel === lvl
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Degree / Course Name</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={e => updateField('degree', e.target.value)}
                  placeholder="e.g. B.Tech, B.Sc, MBBS, M.Tech, MBA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch / Specialization</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={e => updateField('branch', e.target.value)}
                  placeholder="e.g. Computer Science, Biotechnology, Economics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Year of Study</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(yr => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => updateField('academicYear', yr)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      formData.academicYear === yr
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Merit & Institution */}
        {step === 2 && (
          <div className="py-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Cumulative GPA / Academic Score (out of 10.0)</label>
                <span className="text-sm font-extrabold text-emerald-700">{formData.cgpa.toFixed(1)} / 10.0 ({Math.round(formData.cgpa * 9.5)}%)</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={formData.cgpa}
                onChange={e => updateField('cgpa', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to verify cutoffs for merit-based scholarships such as INSPIRE, Adobe Women-in-Tech, and Reliance Foundation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Institution / College / University Name</label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={e => updateField('institutionName', e.target.value)}
                placeholder="e.g. Indian Institute of Technology, Delhi or COEP"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">State Domicile / Permanent Residence</label>
              <select
                value={formData.stateDomicile}
                onChange={e => updateField('stateDomicile', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Uttar Pradesh', 'Gujarat', 'Telangana', 'Rajasthan', 'Kerala', 'Other State'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Financial & Category */}
        {step === 3 && (
          <div className="py-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Annual Family Income</label>
                <span className="text-sm font-extrabold text-emerald-700">
                  ₹{(formData.annualFamilyIncome / 100000).toFixed(2)} Lakhs / year
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="25000"
                value={formData.annualFamilyIncome}
                onChange={e => updateField('annualFamilyIncome', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>₹50,000 (EWS)</span>
                <span>₹2.5 Lakhs (NSP Threshold)</span>
                <span>₹8 Lakhs (OBC NCL)</span>
                <span>₹20+ Lakhs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Reservation / Community Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateField('category', cat)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      formData.category === cat
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender Identification</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Female', 'Male', 'Other'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField('gender', g)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.gender === g
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Required for female-specific scholarships such as AICTE Pragati & Adobe WIT.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="py-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Preferred Scholarship Types (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['Government (Central)', 'Government (State)', 'Private / CSR', 'International'] as ScholarshipType[]).map(st => {
                  const isChecked = formData.preferredScholarshipTypes.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleScholarshipType(st)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{st}</span>
                      <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.interestedInInternational}
                  onChange={e => updateField('interestedInInternational', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Interested in Study Abroad & International Grants</p>
                  <p className="text-[11px] text-slate-400">Include fellowships like Fulbright-Nehru, DAAD Germany, and Commonwealth.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.isFirstGenerationLearner}
                  onChange={e => updateField('isFirstGenerationLearner', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">First-Generation College Learner</p>
                  <p className="text-[11px] text-slate-400">Unlocks dedicated CSR priority funding for first-in-family graduates.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
          >
            <span>{step === 4 ? 'Launch Personalized Dashboard' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
