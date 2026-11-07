import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationLevel } from '../../types/scholarship';
import { 
  Search, 
  ArrowUpDown, 
  Clock, 
  Bookmark, 
  RotateCcw
} from 'lucide-react';
import { formatDeadlineNotice } from '../../utils/formatters';

export const ScholarshipDiscovery: React.FC = () => {
  const { 
    scholarships, 
    getEvaluation, 
    viewScholarshipDetails, 
    addToTracker, 
    isScholarshipTracked,
    toggleCompare, 
    comparedScholarshipIds,
    savedScholarshipIds,
    toggleSaveScholarship,
    currentUser 
  } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBasis, setSelectedBasis] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'opportunity' | 'amount' | 'deadline' | 'match'>('opportunity');
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);

  // Filter and sort logic
  const filteredScholarships = useMemo(() => {
    return scholarships
      .map(sch => {
        const evaluation = getEvaluation(sch);
        const notice = formatDeadlineNotice(sch.deadline);
        return { sch, evaluation, notice };
      })
      .filter(({ sch, evaluation, notice }) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches = 
            sch.name.toLowerCase().includes(q) ||
            sch.organization.toLowerCase().includes(q) ||
            sch.description.toLowerCase().includes(q) ||
            sch.tags.some(t => t.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Type filter
        if (selectedType !== 'All' && sch.type !== selectedType) {
          return false;
        }

        // Basis filter
        if (selectedBasis !== 'All' && sch.basis !== selectedBasis) {
          return false;
        }

        // Level filter
        if (selectedLevel !== 'All' && !sch.eligibilityRules.educationLevels.includes(selectedLevel as EducationLevel)) {
          return false;
        }

        // Amount filter
        if (selectedAmountRange !== 'All') {
          if (selectedAmountRange === '<50k' && sch.amount >= 50000) return false;
          if (selectedAmountRange === '50k-150k' && (sch.amount < 50000 || sch.amount > 150000)) return false;
          if (selectedAmountRange === '150k+' && sch.amount < 150000) return false;
        }

        // Urgency filter
        if (selectedUrgency !== 'All') {
          if (selectedUrgency === 'closing-soon' && (notice.days < 0 || notice.days > 14)) return false;
          if (selectedUrgency === 'next-30-days' && (notice.days < 0 || notice.days > 30)) return false;
        }

        // Only eligible checkbox
        if (showOnlyEligible && evaluation.status === 'Not Eligible') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'opportunity') {
          return b.evaluation.opportunityScore - a.evaluation.opportunityScore;
        }
        if (sortBy === 'amount') {
          return b.sch.amount - a.sch.amount;
        }
        if (sortBy === 'deadline') {
          return new Date(a.sch.deadline).getTime() - new Date(b.sch.deadline).getTime();
        }
        if (sortBy === 'match') {
          return b.evaluation.matchScore - a.evaluation.matchScore;
        }
        return 0;
      });
  }, [
    scholarships, 
    searchTerm, 
    selectedType, 
    selectedBasis, 
    selectedLevel, 
    selectedAmountRange, 
    selectedUrgency, 
    sortBy, 
    showOnlyEligible, 
    getEvaluation
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedBasis('All');
    setSelectedLevel('All');
    setSelectedAmountRange('All');
    setSelectedUrgency('All');
    setSortBy('opportunity');
    setShowOnlyEligible(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart Scholarship Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse {scholarships.length} verified government, private CSR, and international schemes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Matching for: <strong className="text-slate-800">{currentUser.fullName} ({currentUser.degree})</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Top search input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by scholarship name, provider (e.g. Tata, Reliance, AICTE), or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="opportunity">Opportunity Score (Smart)</option>
                <option value="match">Profile Match %</option>
                <option value="amount">Highest Amount</option>
                <option value="deadline">Nearest Deadline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Type */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Providers (Govt & CSR)</option>
            <option value="Government (Central)">Central Government</option>
            <option value="Government (State)">State Government</option>
            <option value="Private / CSR">Private / Corporate CSR</option>
            <option value="International">International Study Abroad</option>
          </select>

          {/* Basis */}
          <select
            value={selectedBasis}
            onChange={e => setSelectedBasis(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Funding Bases</option>
            <option value="Merit-Based">Merit-Based</option>
            <option value="Need-Based">Need-Based</option>
            <option value="Merit-cum-Means">Merit-cum-Means</option>
            <option value="Special / Reserved">Special / Reserved (Women/Minority)</option>
          </select>

          {/* Education Level */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Education Levels</option>
            <option value="Undergraduate">Undergraduate (UG)</option>
            <option value="Postgraduate">Postgraduate (PG)</option>
            <option value="High School">High School (11th/12th)</option>
            <option value="Diploma">Diploma Courses</option>
          </select>

          {/* Amount range */}
          <select
            value={selectedAmountRange}
            onChange={e => setSelectedAmountRange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">Any Amount</option>
            <option value="<50k">Up to ₹50,000</option>
            <option value="50k-150k">₹50,000 - ₹1,50,000</option>
            <option value="150k+">₹1,50,000 and Above</option>
          </select>

          {/* Urgency */}
          <select
            value={selectedUrgency}
            onChange={e => setSelectedUrgency(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Deadlines</option>
            <option value="closing-soon">Closing Soon (≤ 14 Days)</option>
            <option value="next-30-days">Next 30 Days</option>
          </select>

          {/* Checkbox: Show only eligible */}
          <label className="flex items-center gap-1.5 ml-auto text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyEligible}
              onChange={e => setShowOnlyEligible(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Show Only Eligible / Potential</span>
          </label>

          {(searchTerm || selectedType !== 'All' || selectedBasis !== 'All' || selectedLevel !== 'All' || selectedAmountRange !== 'All' || selectedUrgency !== 'All' || showOnlyEligible) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div 
        role="status" 
        aria-live="polite" 
        className="flex items-center justify-between text-xs text-slate-500 px-1"
      >
        <span>Showing <strong>{filteredScholarships.length}</strong> scholarships matching your criteria</span>
        <span className="hidden sm:inline">Opportunity Score formula: Compatibility (50%) + Value (30%) + Urgency (20%)</span>
      </div>

      {/* Scholarship Cards Grid */}
      {filteredScholarships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No scholarships found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No scholarships match the exact filter combinations. Try clearing some filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScholarships.map(({ sch, evaluation: ev, notice }) => {
            const isTracked = isScholarshipTracked(sch.id);
            const isCompared = comparedScholarshipIds.includes(sch.id);
            const isSaved = savedScholarshipIds.includes(sch.id);

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between p-5 group"
              >
                <div>
                  {/* Top Bar: Match Score & Urgency */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ev.status === 'Eligible'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.status === 'Potentially Eligible'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ev.matchScore}% Match • {ev.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleSaveScholarship(sch.id)}
                        className={`p-1 rounded-md transition-colors ${
                          isSaved ? 'text-amber-500 fill-amber-500' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Bookmark'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h3 
                    onClick={() => viewScholarshipDetails(sch.id)}
                    className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {sch.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 truncate font-medium">{sch.organization}</p>

                  {/* Funding Amount Box */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Funding Value</span>
                      <p className="text-sm font-extrabold text-emerald-700">{sch.amountDisplay}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Opportunity Score</span>
                      <p className="text-sm font-extrabold text-slate-800">{ev.opportunityScore} / 100</p>
                    </div>
                  </div>

                  {/* Eligibility summary */}
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {sch.eligibilitySummary}
                  </p>

                  {/* Deadline & Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {sch.type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {sch.basis}
                    </span>
                    {notice.isUrgent ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notice.text}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                        {notice.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 cursor-pointer hover:text-slate-900 mr-auto">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(sch.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Compare</span>
                  </label>

                  <button
                    onClick={() => viewScholarshipDetails(sch.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => addToTracker(sch.id, 'Interested')}
                    disabled={isTracked}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      isTracked
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isTracked ? 'Tracked ✓' : 'Add to Tracker'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
