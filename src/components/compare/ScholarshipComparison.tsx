import React from 'react';
import { useApp } from '../../context';
import { 
  Layers, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { formatDeadlineNotice, formatDatePretty } from '../../utils/formatters';

export const ScholarshipComparison: React.FC = () => {
  const { 
    comparedScholarshipIds, 
    toggleCompare, 
    clearComparison, 
    getScholarshipById, 
    getEvaluation, 
    addToTracker, 
    isScholarshipTracked,
    viewScholarshipDetails,
    setCurrentView 
  } = useApp();

  const comparedScholarships = comparedScholarshipIds
    .map(id => getScholarshipById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  if (comparedScholarships.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto mt-6 shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Scholarship Comparison Matrix</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          You haven't added any scholarships to compare yet. You can compare up to 4 scholarships side-by-side to evaluate amounts, deadlines, eligibility cutoffs, and required documents.
        </p>
        <button
          onClick={() => setCurrentView('scholarships')}
          className="mt-6 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all inline-flex items-center gap-1.5"
        >
          <span>Browse Scholarships to Compare</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing {comparedScholarships.length} of 4 maximum selected opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedScholarships.length < 4 && (
            <button
              onClick={() => setCurrentView('scholarships')}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Scholarship</span>
            </button>
          )}

          <button
            onClick={clearComparison}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Matrix</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 w-48 text-xs font-bold uppercase tracking-wider text-slate-400">
                Criteria
              </th>
              {comparedScholarships.map(sch => (
                <th key={sch.id} className="p-4 w-64 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {sch.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(sch.id)}
                      aria-label={`Remove ${sch.name} from comparison`}
                      className="text-slate-400 hover:text-slate-700 p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 
                    onClick={() => viewScholarshipDetails(sch.id)}
                    className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 hover:text-emerald-700 cursor-pointer"
                  >
                    {sch.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{sch.organization}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {/* 1. Opportunity Score */}
            <tr className="bg-emerald-50/30">
              <td className="p-4 font-bold text-slate-900">Opportunity Score</td>
              {comparedScholarships.map(sch => {
                const ev = getEvaluation(sch);
                return (
                  <td key={sch.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-emerald-700">
                        {ev.opportunityScore} / 100
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ev.status === 'Eligible' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.matchScore}% Match
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 2. Grant Funding Value */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Scholarship Value</td>
              {comparedScholarships.map(sch => (
                <td key={sch.id} className="p-4">
                  <span className="font-extrabold text-emerald-700 text-sm">{sch.amountDisplay}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sch.basis}</p>
                </td>
              ))}
            </tr>

            {/* 3. Application Deadline */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Deadline & Window</td>
              {comparedScholarships.map(sch => {
                const notice = formatDeadlineNotice(sch.deadline);
                return (
                  <td key={sch.id} className="p-4">
                    <span className="font-bold text-slate-800">{formatDatePretty(sch.deadline)}</span>
                    <p className={`text-[11px] font-medium mt-0.5 ${notice.isUrgent ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                      {notice.text}
                    </p>
                  </td>
                );
              })}
            </tr>

            {/* 4. Minimum CGPA / Percentage Cutoff */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Academic Merit Cutoff</td>
              {comparedScholarships.map(sch => (
                <td key={sch.id} className="p-4">
                  <span className="font-semibold text-slate-800">
                    Min {sch.eligibilityRules.minCgpaOrPercentage?.toFixed(1) ?? '5.0'} CGPA
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    (or {((sch.eligibilityRules.minCgpaOrPercentage ?? 5.0) * 10).toFixed(0)}% aggregate)
                  </span>
                </td>
              ))}
            </tr>

            {/* 5. Family Income Ceiling */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Family Income Limit</td>
              {comparedScholarships.map(sch => {
                const ceiling = sch.eligibilityRules.maxFamilyIncome;
                return (
                  <td key={sch.id} className="p-4">
                    <span className="font-semibold text-slate-800">
                      {ceiling ? `≤ ₹${(ceiling / 100000).toFixed(1)} LPA` : 'No Income Cap'}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* 6. Education Levels & Years */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Eligible Course Years</td>
              {comparedScholarships.map(sch => (
                <td key={sch.id} className="p-4">
                  <span className="font-semibold text-slate-800">
                    {sch.eligibilityRules.educationLevels.join(', ')}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Years: {sch.eligibilityRules.courseYear ? sch.eligibilityRules.courseYear.join(', ') : 'All Years'}
                  </span>
                </td>
              ))}
            </tr>

            {/* 7. Key Benefits */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Key Benefits</td>
              {comparedScholarships.map(sch => (
                <td key={sch.id} className="p-4 align-top">
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {sch.benefits.slice(0, 2).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 8. Required Documents */}
            <tr>
              <td className="p-4 font-bold text-slate-900">Required Documents</td>
              {comparedScholarships.map(sch => (
                <td key={sch.id} className="p-4 align-top">
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {sch.requiredDocuments.map(d => (
                      <span key={d.id} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {d.name}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* 9. Action row */}
            <tr className="bg-slate-50/50">
              <td className="p-4 font-bold text-slate-900">Take Action</td>
              {comparedScholarships.map(sch => {
                const isTracked = isScholarshipTracked(sch.id);
                return (
                  <td key={sch.id} className="p-4 space-y-2">
                    <button
                      onClick={() => addToTracker(sch.id, 'Interested')}
                      disabled={isTracked}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isTracked
                          ? 'bg-slate-200 text-slate-500 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isTracked ? 'Tracked ✓' : 'Add to Tracker'}
                    </button>
                    <button
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                    >
                      View Full Details
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
