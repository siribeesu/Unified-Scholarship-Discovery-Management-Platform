import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  FolderLock, 
  ChevronRight, 
  Award, 
  Wallet, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { formatCurrency, formatDeadlineNotice } from '../../utils/formatters';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    setCurrentView, 
    scholarships, 
    getEvaluation, 
    trackedApplications, 
    vaultDocuments, 
    viewScholarshipDetails, 
    addToTracker, 
    toggleCompare,
    comparedScholarshipIds 
  } = useApp();

  // Evaluate all scholarships for the current user
  const evaluations = scholarships.map(sch => ({
    scholarship: sch,
    eval: getEvaluation(sch)
  }));

  const eligibleCount = evaluations.filter(e => e.eval.status === 'Eligible').length;
  const potentialCount = evaluations.filter(e => e.eval.status === 'Potentially Eligible').length;
  
  // Sort by opportunity score
  const topRecommendations = [...evaluations]
    .sort((a, b) => b.eval.opportunityScore - a.eval.opportunityScore)
    .slice(0, 3);

  // Financial calculations
  // Total potential funding: all eligible + potentially eligible opportunities
  const potentialFunding = evaluations
    .filter(e => e.eval.status !== 'Not Eligible')
    .reduce((sum, e) => sum + e.scholarship.amount, 0);

  // In-progress applied funding
  const appliedFunding = trackedApplications
    .filter(t => ['Applied', 'Under Review', 'Shortlisted'].includes(t.status))
    .reduce((sum, t) => sum + t.amount, 0);

  // Awarded funding
  const awardedFunding = trackedApplications
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  // Chart data for application status pipeline
  const statusCounts = {
    Interested: trackedApplications.filter(t => t.status === 'Interested').length,
    Preparing: trackedApplications.filter(t => t.status === 'Preparing').length,
    Applied: trackedApplications.filter(t => t.status === 'Applied').length,
    'Under Review': trackedApplications.filter(t => t.status === 'Under Review').length,
    Shortlisted: trackedApplications.filter(t => t.status === 'Shortlisted').length,
    Approved: trackedApplications.filter(t => t.status === 'Approved').length,
  };

  const chartData = [
    { name: 'Interested', count: statusCounts.Interested, color: '#94a3b8' },
    { name: 'Preparing', count: statusCounts.Preparing, color: '#38bdf8' },
    { name: 'Applied', count: statusCounts.Applied, color: '#6366f1' },
    { name: 'Under Review', count: statusCounts['Under Review'], color: '#f59e0b' },
    { name: 'Shortlisted', count: statusCounts.Shortlisted, color: '#8b5cf6' },
    { name: 'Approved', count: statusCounts.Approved, color: '#10b981' }
  ];

  // Urgent deadlines: Tracked scholarships closing within 14 days
  const urgentScholarships = scholarships
    .map(sch => ({ sch, notice: formatDeadlineNotice(sch.deadline) }))
    .filter(item => item.notice.days >= 0 && item.notice.days <= 14)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Scholarship Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.fullName}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Enrolled in <strong className="text-white">{currentUser.degree} ({currentUser.branch})</strong> at {currentUser.institutionName}. We matched your profile with verified opportunities across central and CSR portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('scholarships')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Discover New Grants</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('eligibility')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all"
            >
              Run Eligibility Checker
            </button>
          </div>
        </div>
      </div>

      {/* Differentiating Feature: Financial Impact Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Financial Funding Overview
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clear distinction between potential eligibility, active applications, and awarded grants
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            Current Academic Cycle (2026-27)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Potential Funding */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Potential Funding</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {eligibleCount + potentialCount} Matched
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {formatCurrency(potentialFunding)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Available across scholarships where you satisfy minimum criteria.
            </p>
          </div>

          {/* In-Pipeline Funding */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Applications In-Progress</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                In Review
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-2">
              {formatCurrency(appliedFunding)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Currently submitted and awaiting official merit shortlists.
            </p>
          </div>

          {/* Awarded Funding */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Total Awarded / Disbursed</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                Approved
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">
              {formatCurrency(awardedFunding)}
            </p>
            <p className="text-[11px] text-emerald-800 mt-1 font-medium">
              Direct Benefit Transfer (DBT) confirmed or institutional fee credited.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setCurrentView('scholarships')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
        >
          <span className="text-xs font-semibold text-slate-500">Matching Scholarships</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">{eligibleCount}</span>
            <span className="text-xs text-slate-400">({potentialCount} potential)</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold group-hover:underline flex items-center gap-1 mt-2">
            View matches <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div 
          onClick={() => setCurrentView('scholarships')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
        >
          <span className="text-xs font-semibold text-slate-500">Total Catalog Discovered</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{scholarships.length}</p>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-2">
            Updated daily
          </span>
        </div>

        <div 
          onClick={() => setCurrentView('tracker')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
        >
          <span className="text-xs font-semibold text-slate-500">Active Applications</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{trackedApplications.length}</p>
          <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline flex items-center gap-1 mt-2">
            Open Kanban board <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div 
          onClick={() => setCurrentView('vault')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
        >
          <span className="text-xs font-semibold text-slate-500">Vault Documents</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{vaultDocuments.length}</p>
          <span className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1 mt-2">
            Manage vault <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Main Grid: Urgent Deadlines & Application Pipeline Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Application Status Chart & Top Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Pipeline Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Application Stage Pipeline
                </h3>
                <p className="text-xs text-slate-400">Distribution of your tracked scholarships</p>
              </div>
              <button
                onClick={() => setCurrentView('tracker')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Manage Board
              </button>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Recommended Opportunities based on Opportunity Score */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Top Recommended Opportunities
                </h3>
                <p className="text-xs text-slate-400">Ranked by Scholarship Opportunity Score (Eligibility + Value + Urgency)</p>
              </div>
              <button
                onClick={() => setCurrentView('scholarships')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topRecommendations.map(({ scholarship: sch, eval: ev }) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 hover:bg-white"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-xs shrink-0 mt-0.5">
                      {ev.opportunityScore}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ev.status === 'Eligible' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ev.matchScore}% Match • {ev.status}
                        </span>
                        <span className="text-[10px] text-slate-400">{sch.type}</span>
                      </div>
                      <h4 
                        onClick={() => viewScholarshipDetails(sch.id)}
                        className="text-xs font-bold text-slate-900 mt-1 truncate hover:text-emerald-700 cursor-pointer"
                      >
                        {sch.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {sch.amountDisplay} • Deadline: {sch.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => toggleCompare(sch.id)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                        comparedScholarshipIds.includes(sch.id)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Compare side-by-side"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToTracker(sch.id, 'Interested')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Urgent Deadlines & Missing Document Radar */}
        <div className="space-y-6">
          {/* Urgent Deadlines Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Deadlines Closing Soon
              </h3>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Calendar
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Scholarships closing within 14 days</p>

            <div className="space-y-3">
              {urgentScholarships.map(({ sch, notice }) => (
                <div 
                  key={sch.id}
                  onClick={() => viewScholarshipDetails(sch.id)}
                  className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 hover:bg-amber-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                    <span className="truncate max-w-[170px]">{sch.organization}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">
                      {notice.text}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{sch.name}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{sch.amountDisplay}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Document Detector Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-blue-600" />
                Missing Document Radar
              </h3>
              <button
                onClick={() => setCurrentView('vault')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800"
              >
                Vault
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Cross-checked against your target applications
            </p>

            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">College Bonafide Certificate</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Missing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Required for: <strong className="text-slate-700">AICTE Pragati</strong> and <strong className="text-slate-700">INSPIRE SHE</strong>.
              </p>
              <button
                onClick={() => setCurrentView('vault')}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors text-center"
              >
                Upload to Document Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
