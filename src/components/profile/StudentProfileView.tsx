import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, Category, EducationLevel, ScholarshipType } from '../../types/scholarship';
import { 
  UserCircle, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Building, 
  Wallet, 
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff 
} from 'lucide-react';
import { sanitizeInput, maskSensitiveId } from '../../utils/security';

export const StudentProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [profile, setProfile] = useState<StudentProfile>({ ...currentUser });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = {
      ...profile,
      fullName: sanitizeInput(profile.fullName),
      email: sanitizeInput(profile.email),
      phone: sanitizeInput(profile.phone),
      degree: sanitizeInput(profile.degree),
      branch: sanitizeInput(profile.branch),
      institutionName: sanitizeInput(profile.institutionName),
      stateDomicile: sanitizeInput(profile.stateDomicile)
    };
    updateProfile(sanitized);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Academic Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your credentials up to date to maintain accurate eligibility matching.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Strength Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{profile.fullName}</h3>
              <p className="text-xs text-slate-500">{profile.degree} in {profile.branch} • {profile.institutionName}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mt-1 inline-block">
                Category: {profile.category} • State: {profile.stateDomicile}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700">95% Profile Strength</span>
            <div className="w-32 bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full w-[95%]" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Verified for central schemes</p>
          </div>
        </div>

        {/* Section 1: Basic & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-emerald-600" />
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Contact</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            Academic Details & Merit Score
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Education Level</label>
              <select
                value={profile.educationLevel}
                onChange={e => setProfile({ ...profile, educationLevel: e.target.value as EducationLevel })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {['Undergraduate', 'Postgraduate', 'High School', 'PhD / Doctorate', 'Diploma'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Degree Title</label>
              <input
                type="text"
                value={profile.degree}
                onChange={e => setProfile({ ...profile, degree: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Branch / Major</label>
              <input
                type="text"
                value={profile.branch}
                onChange={e => setProfile({ ...profile, branch: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">CGPA / Grade (10 pt scale)</label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="10.0"
                value={profile.cgpa}
                onChange={e => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">College / University Name</label>
              <input
                type="text"
                value={profile.institutionName}
                onChange={e => setProfile({ ...profile, institutionName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">State Domicile</label>
              <input
                type="text"
                value={profile.stateDomicile}
                onChange={e => setProfile({ ...profile, stateDomicile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Socio-Economic Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            Financial & Socio-Economic Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Annual Family Income (in INR)
              </label>
              <input
                type="number"
                step="10000"
                value={profile.annualFamilyIncome}
                onChange={e => setProfile({ ...profile, annualFamilyIncome: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                ₹{(profile.annualFamilyIncome / 100000).toFixed(2)} Lakhs per annum
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category / Quota</label>
              <select
                value={profile.category}
                onChange={e => setProfile({ ...profile, category: e.target.value as Category })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
