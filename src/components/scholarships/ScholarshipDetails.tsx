import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Bookmark, 
  Layers, 
  Calendar, 
  FolderLock, 
  Share2, 
  ShieldCheck, 
  Info, 
  Award,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDeadlineNotice, formatDatePretty } from '../../utils/formatters';

export const ScholarshipDetails: React.FC = () => {
  const { 
    selectedScholarshipId, 
    setCurrentView, 
    getScholarshipById, 
    getEvaluation, 
    checkScholarshipMissingDocs,
    addToTracker, 
    isScholarshipTracked,
    toggleCompare, 
    comparedScholarshipIds,
    savedScholarshipIds, 
    toggleSaveScholarship,
    currentUser,
    viewScholarshipDetails,
    scholarships 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'eligibility' | 'documents' | 'benefits' | 'how-to-apply'>('eligibility');
  const [showScoreModal, setShowScoreModal] = useState(false);

  const sch = selectedScholarshipId ? getScholarshipById(selectedScholarshipId) : undefined;

  if (!sch) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
        <h3 className="text-base font-bold text-slate-800">Scholarship Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested scholarship could not be located.
        </p>
        <button
          onClick={() => setCurrentView('scholarships')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Back to Discovery
        </button>
      </div>
    );
  }

  const evaluation = getEvaluation(sch);
  const docStatus = checkScholarshipMissingDocs(sch);
  const notice = formatDeadlineNotice(sch.deadline);
  const isTracked = isScholarshipTracked(sch.id);
  const isSaved = savedScholarshipIds.includes(sch.id);
  const isCompared = comparedScholarshipIds.includes(sch.id);

  // Similar scholarships
  const similarScholarships = scholarships
    .filter(s => s.id !== sch.id && (s.type === sch.type || s.basis === sch.basis))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link to scholarship copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('scholarships')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Scholarships</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCompare(sch.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isCompared
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Compared in Matrix' : 'Add to Compare'}</span>
          </button>

          <button
            onClick={() => toggleSaveScholarship(sch.id)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isSaved
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs transition-colors"
            title="Share Opportunity"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {sch.type}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {sch.basis}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Verified Portal Scheme
              </span>
              {sch.renewable && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Renewable Annually
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {sch.name}
            </h1>
            <p className="text-sm font-semibold text-emerald-700">
              Offered by {sch.organization} • Source: {sch.sourcePortalName}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {sch.description}
            </p>
          </div>

          {/* Action Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between shrink-0 lg:w-72 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Grant Value</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5">
                {sch.amountDisplay}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Deadline:
                </span>
                <span className="font-bold text-slate-800">{formatDatePretty(sch.deadline)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${notice.isUrgent ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {notice.text}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => addToTracker(sch.id, 'Interested')}
                disabled={isTracked}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all text-center ${
                  isTracked
                    ? 'bg-slate-200 text-slate-600 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isTracked ? 'Present in Tracker ✓' : 'Add to Application Tracker'}
              </button>

              <a
                href={sch.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl font-bold text-xs border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Differentiating Feature: Opportunity Score & Readiness Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opportunity Score breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0">
            <span className="text-xl font-black">{evaluation.opportunityScore}</span>
            <span className="text-[9px] font-bold uppercase -mt-0.5">Score</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Scholarship Opportunity Score</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Top Decile Opportunity
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Composite ranking: Profile Compatibility (50%), Financial Value (30%), and Application Window Feasibility (20%).
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              Formula: ({evaluation.matchScore}% match × 0.5) + (Value × 0.3) + (Urgency × 0.2) = {evaluation.opportunityScore}/100
            </p>
          </div>
        </div>

        {/* Missing Document Detector Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
            docStatus.isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <span className="text-xl font-black">{docStatus.readyCount}/{docStatus.requiredCount}</span>
            <span className="text-[9px] font-bold uppercase -mt-0.5">Docs</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Document Readiness Radar</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                docStatus.isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {docStatus.isComplete ? '100% Application Ready' : `${docStatus.missingDocs.length} Missing in Vault`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {docStatus.isComplete 
                ? 'All mandatory certificates are verified and present in your Document Vault.'
                : `Missing: ${docStatus.missingDocs.map(d => d.name).join(', ')}.`}
            </p>
            <button
              onClick={() => setCurrentView('vault')}
              className="text-[11px] font-bold text-blue-700 hover:underline mt-2 flex items-center gap-1"
            >
              <span>Manage certificates in Document Vault</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-5 py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'eligibility'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rule-Based Eligibility Evaluation</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
              {evaluation.matchScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'documents'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderLock className="w-4 h-4 text-blue-600" />
            <span>Application Readiness Checklist</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
              {docStatus.readyCount}/{docStatus.requiredCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-5 py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'benefits'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>Benefits & Disbursement</span>
          </button>

          <button
            onClick={() => setActiveTab('how-to-apply')}
            className={`px-5 py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'how-to-apply'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Official Application Steps</span>
          </button>
        </div>

        {/* Tab 1: Detailed Rule-Based Eligibility */}
        {activeTab === 'eligibility' && (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  evaluation.status === 'Eligible'
                    ? 'bg-emerald-100 text-emerald-800'
                    : evaluation.status === 'Potentially Eligible'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  Status: {evaluation.status}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {evaluation.recommendationNote}
                </span>
              </div>
            </div>

            {/* Checklist Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Itemized Verification Against Your Profile ({currentUser.fullName})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {evaluation.checks.map((c, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {c.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{c.criterion}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{c.reason}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end text-right text-xs shrink-0 pl-8 sm:pl-0">
                      <span className="text-slate-400 font-medium text-[10px]">Your Profile:</span>
                      <span className="font-bold text-slate-800">{c.studentValue}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Required: {c.requiredValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing criteria note */}
            {evaluation.missingRequirements.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Attention Points / Missing Prerequisites:
                </span>
                <ul className="list-disc list-inside space-y-1 text-amber-800 mt-1">
                  {evaluation.missingRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Document Vault Readiness */}
        {activeTab === 'documents' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mandatory Application Documents</h4>
                <p className="text-xs text-slate-500">Cross-referenced against your uploaded vault files</p>
              </div>
              <button
                onClick={() => setCurrentView('vault')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Open Vault to Upload
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sch.requiredDocuments.map(req => {
                const isReady = docStatus.readyDocs.some(d => d.id === req.id);
                return (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      isReady ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{req.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {req.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{req.description}</p>
                    </div>
                    <div>
                      {isReady ? (
                        <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 shrink-0 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-800 shrink-0 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Missing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Benefits & Disbursements */}
        {activeTab === 'benefits' && (
          <div className="p-6 space-y-5">
            <h4 className="text-sm font-bold text-slate-900">Scholarship Benefits & Allowances</h4>
            <div className="space-y-2.5">
              {sch.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-emerald-900">Direct Benefit Transfer (DBT) Notice:</span>
              <p className="text-emerald-800">
                Disbursements are deposited directly to your bank account or remitted to your college/university registrar office. Aadhaar-seeding of your bank account is mandatory.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: How to Apply */}
        {activeTab === 'how-to-apply' && (
          <div className="p-6 space-y-5">
            <h4 className="text-sm font-bold text-slate-900">Step-by-Step Application Guide</h4>
            <ol className="space-y-3 text-xs text-slate-700">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-900">Prepare All Documents:</strong> Ensure your Aadhaar, Bonafide certificate, marksheet, and income certificate are up-to-date in your Document Vault.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-900">Visit Official Submission Domain:</strong> Navigate to the authorized portal link: <a href={sch.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">{sch.applicationUrl}</a>.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-900">Register Student OTR (One-Time Registration):</strong> Use your Aadhaar or mobile number to generate application credentials.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-slate-900">Record Application Reference in Tracker:</strong> Once submitted, update your GRANTLY Application Tracker to "Applied" and note down your reference ID for deadline tracking.
                </div>
              </li>
            </ol>

            <div className="pt-2">
              <a
                href={sch.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Proceed to Official {sch.sourcePortalName} Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Similar Scholarships */}
      <div className="pt-4">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Similar Opportunities You May Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {similarScholarships.map(sim => (
            <div
              key={sim.id}
              onClick={() => viewScholarshipDetails(sim.id)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
            >
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {sim.type}
              </span>
              <h5 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {sim.name}
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sim.organization}</p>
              <p className="text-xs font-bold text-emerald-700 mt-3">{sim.amountDisplay}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
