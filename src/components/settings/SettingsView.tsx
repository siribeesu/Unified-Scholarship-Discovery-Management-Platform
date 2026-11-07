import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Bell, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  UserCheck,
  Check,
  ExternalLink 
} from 'lucide-react';
import { DEMO_PROFILES } from '../../data/demoProfiles';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    switchPersona, 
    resetAllData, 
    trackedApplications, 
    vaultDocuments,
    addToast 
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  const handleExportData = () => {
    const exportObject = {
      userProfile: currentUser,
      trackedApplications,
      vaultDocuments,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `grantly_student_backup_${currentUser.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      type: 'success',
      title: 'Data Export Complete',
      message: 'Your GRANTLY profile and tracker data downloaded as JSON.'
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-emerald-600" />
          <span>Platform Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Data Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize notifications, switch demo test personas, and export application backups.
        </p>
      </div>

      {/* Switch Demo Personas Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Switch Active Student Persona (For Testing)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Instantly recalculate all eligibility rules and match scores against different demographics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {DEMO_PROFILES.map((p, idx) => {
            const isCurrent = p.id === currentUser.id;
            return (
              <div
                key={p.id}
                onClick={() => switchPersona(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isCurrent 
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500 shadow-2xs' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{p.fullName}</span>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{p.degree} ({p.branch})</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>CGPA: <strong>{p.cgpa}</strong></span>
                  <span>Income: <strong>₹{(p.annualFamilyIncome/100000).toFixed(1)}L</strong></span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">{p.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Deadline & Match Alert Preferences
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select what notifications you'd like to receive on your registered email.
          </p>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">Closing Deadline Reminders (&lt; 7 Days)</p>
              <p className="text-[11px] text-slate-500">Urgent alerts before your tracked scholarship portals close.</p>
            </div>
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={e => setDeadlineReminders(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">New High-Match Scholarships Alert</p>
              <p className="text-[11px] text-slate-500">Instant notification when a verified grant matching &gt;90% of your profile is announced.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">Weekly EdTech & CSR Digest</p>
              <p className="text-[11px] text-slate-500">A weekly summary of your application pipeline status and missing document radar.</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={e => setWeeklyDigest(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            Data Backup & Reset
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Export a copy of your stored documents and application tracking pipeline.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Application Data (JSON)</span>
          </button>

          <button
            onClick={resetAllData}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
