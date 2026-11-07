import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, Category, EducationLevel } from '../../types/scholarship';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { evaluateEligibility } from '../../utils/eligibilityEngine';
import { formatDeadlineNotice } from '../../utils/formatters';

export const EligibilityChecker: React.FC = () => {
  const { 
    currentUser, 
    scholarships, 
    viewScholarshipDetails, 
    addToTracker, 
    isScholarshipTracked,
    toggleCompare,
    comparedScholarshipIds 
  } = useApp();

  // What-If Simulator state (initialized to current profile)
  const [simProfile, setSimProfile] = useState<StudentProfile>({ ...currentUser });
  const [activeFilter, setActiveFilter] = useState<'all' | 'eligible' | 'potential' | 'not-eligible'>('all');
  const [expandedSchId, setExpandedSchId] = useState<string | null>(null);

  // Recalculate evaluations on simulated profile
  const results = scholarships.map(sch => ({
    sch,
    evaluation: evaluateEligibility(sch, simProfile),
    notice: formatDeadlineNotice(sch.deadline)
  }));

  const eligibleList = results.filter(r => r.evaluation.status === 'Eligible');
  const potentialList = results.filter(r => r.evaluation.status === 'Potentially Eligible');
  const notEligibleList = results.filter(r => r.evaluation.status === 'Not Eligible');

  const filteredResults = results.filter(r => {
    if (activeFilter === 'eligible') return r.evaluation.status === 'Eligible';
    if (activeFilter === 'potential') return r.evaluation.status === 'Potentially Eligible';
    if (activeFilter === 'not-eligible') return r.evaluation.status === 'Not Eligible';
    return true;
  });

  const resetSimulator = () => {
    setSimProfile({ ...currentUser });
  };

  const hasModifications = 
    simProfile.cgpa !== currentUser.cgpa ||
    simProfile.annualFamilyIncome !== currentUser.annualFamilyIncome ||
    simProfile.educationLevel !== currentUser.educationLevel ||
    simProfile.category !== currentUser.category ||
    simProfile.gender !== currentUser.gender;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rule-Based Matching & What-If Simulator</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Smart Eligibility Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Evaluate exact qualifications and missing prerequisites. Use the What-If Simulator below to test how improving your CGPA or updating income brackets unlocks new grants.
        </p>
      </div>

      {/* What-If Simulator Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">What-If Profile Simulator</h3>
            {hasModifications && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Simulated Mode
              </span>
            )}
          </div>
          {hasModifications && (
            <button
              onClick={resetSimulator}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Profile Defaults</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 text-xs">
          {/* CGPA Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="sim-cgpa-slider" className="font-bold text-slate-700">CGPA Score</label>
              <span className="font-extrabold text-emerald-700">{simProfile.cgpa.toFixed(1)} / 10.0</span>
            </div>
            <input
              id="sim-cgpa-slider"
              type="range"
              min="4.0"
              max="10.0"
              step="0.1"
              value={simProfile.cgpa}
              aria-label="Simulated CGPA score out of 10.0"
              aria-valuemin={4.0}
              aria-valuemax={10.0}
              aria-valuenow={simProfile.cgpa}
              aria-valuetext={`${simProfile.cgpa.toFixed(1)} out of 10.0`}
              onChange={e => setSimProfile({ ...simProfile, cgpa: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Income Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="sim-income-slider" className="font-bold text-slate-700">Annual Family Income</label>
              <span className="font-extrabold text-emerald-700">₹{(simProfile.annualFamilyIncome / 100000).toFixed(1)} LPA</span>
            </div>
            <input
              id="sim-income-slider"
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={simProfile.annualFamilyIncome}
              aria-label="Simulated annual family income in Indian Rupees"
              aria-valuemin={50000}
              aria-valuemax={2000000}
              aria-valuenow={simProfile.annualFamilyIncome}
              aria-valuetext={`₹${(simProfile.annualFamilyIncome / 100000).toFixed(1)} Lakhs per annum`}
              onChange={e => setSimProfile({ ...simProfile, annualFamilyIncome: parseInt(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Category / Quota</label>
            <select
              value={simProfile.category}
              onChange={e => setSimProfile({ ...simProfile, category: e.target.value as Category })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Study Level</label>
            <select
              value={simProfile.educationLevel}
              onChange={e => setSimProfile({ ...simProfile, educationLevel: e.target.value as EducationLevel })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {['Undergraduate', 'Postgraduate', 'High School', 'Diploma'].map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Scholarships ({results.length})
        </button>

        <button
          onClick={() => setActiveFilter('eligible')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFilter === 'eligible'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Eligible ({eligibleList.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('potential')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFilter === 'potential'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Potentially Eligible ({potentialList.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('not-eligible')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFilter === 'not-eligible'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Not Eligible ({notEligibleList.length})</span>
        </button>
      </div>

      {/* Scholarship Results List */}
      <div className="space-y-4">
        {filteredResults.map(({ sch, evaluation: ev, notice }) => {
          const isExpanded = expandedSchId === sch.id;
          const isTracked = isScholarshipTracked(sch.id);
          const isCompared = comparedScholarshipIds.includes(sch.id);

          return (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all"
            >
              {/* Header card summary */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Gauge circle or pill */}
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-extrabold shrink-0 ${
                    ev.status === 'Eligible'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ev.status === 'Potentially Eligible'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className="text-sm font-black">{ev.matchScore}%</span>
                    <span className="text-[8px] uppercase -mt-1 font-bold">Match</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ev.status === 'Eligible'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.status === 'Potentially Eligible'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ev.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{sch.organization}</span>
                    </div>

                    <h3 
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="text-sm font-bold text-slate-900 mt-1 hover:text-emerald-700 cursor-pointer"
                    >
                      {sch.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {sch.amountDisplay} • Deadline: {sch.deadline} ({notice.text})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => toggleCompare(sch.id)}
                    className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                      isCompared
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Compare"
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => addToTracker(sch.id, 'Interested')}
                    disabled={isTracked}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                      isTracked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isTracked ? 'Tracked ✓' : 'Add to Tracker'}
                  </button>

                  <button
                    onClick={() => setExpandedSchId(isExpanded ? null : sch.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Expand Rule Breakdown"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Explanatory breakdown expanded */}
              {isExpanded && (
                <div className="bg-slate-50/80 px-5 py-4 border-t border-slate-200 space-y-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Rule Engine Explanation: </strong>
                    {ev.recommendationNote}
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ev.checks.map((chk, i) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {chk.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{chk.criterion}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{chk.reason}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Your Value: <span className="font-bold text-slate-700">{chk.studentValue}</span> • Required: {chk.requiredValue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Calculated using rule weights across Academic, Financial & Demographic conditions.
                    </span>
                    <button
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>View full criteria & official link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
