import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Star
} from 'lucide-react';
import { formatDeadlineNotice } from '../../utils/formatters';

export const LandingPage: React.FC = () => {
  const { setCurrentView, scholarships, viewScholarshipDetails, addToTracker } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredScholarships = scholarships.slice(0, 4);

  const faqs = [
    {
      q: 'How does GRANTLY calculate my scholarship eligibility?',
      a: 'Unlike generic websites that use random match percentages, GRANTLY implements a transparent rule engine. It compares your exact academic level, CGPA, family annual income bracket, caste category, domicile, and branch against the scholarship\'s official mandate to calculate your match score, explain qualifications, and highlight any gaps.'
    },
    {
      q: 'Is GRANTLY completely free for students?',
      a: 'Yes, 100% free. GRANTLY was created to eliminate barriers to educational funding. We never charge registration fees, application processing fees, or commission on grants.'
    },
    {
      q: 'How does the Missing Document Detector work?',
      a: 'When you upload your certificates (like Aadhaar, Income Certificate, Marksheets) to your secure Document Vault, GRANTLY automatically cross-checks your files against the mandatory requirements of your tracked scholarships and highlights missing or expiring documents before deadlines approach.'
    },
    {
      q: 'Are the scholarships on GRANTLY verified and authentic?',
      a: 'Yes. Every scholarship listed on GRANTLY references authentic government portals (such as the National Scholarship Portal, AICTE, DST) or verified corporate CSR foundations (such as Reliance Foundation, Tata Trusts, HDFC Parivartan). Direct links to official submission portals are provided.'
    },
    {
      q: 'Can I track both government and private scholarships together?',
      a: 'Absolutely. GRANTLY provides a unified Kanban tracking board where you can manage Central Government schemes, State DBT waivers, corporate CSR grants, and study abroad fellowships in one intuitive workspace.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 border-b border-slate-200/60">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Next-Generation Scholarship Discovery for 2026-27</span>
          </div>

          {/* Mandatory Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Your Future Deserves Funding. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Find It Here.</span>
          </h1>

          {/* Mandatory Hero Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover scholarships that match your ambitions, understand your eligibility, and manage every application in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('scholarships')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 hover:shadow-lg hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 shadow-2xs transition-all flex items-center justify-center"
            >
              How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rule-Based Match Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Application Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Government & Private CSR Portals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Auto Missing-Document Radar</span>
            </div>
          </div>

          {/* Interactive Live Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl border border-slate-300/80">
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 text-left">
              {/* Preview Header bar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] ml-2 hidden sm:inline">grantly.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                    Live Engine Active
                  </span>
                </div>
              </div>

              {/* Preview Content Inside Mock */}
              <div className="p-5 sm:p-6 bg-slate-50">
                {/* Preview Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Potential Funding Unlocked</span>
                    <p className="text-2xl font-bold text-slate-900 mt-1">₹4,25,000</p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Across 4 matched opportunities</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Profile Eligibility Compatibility</span>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">94% Fit</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Academic & Income verified</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Document Vault Readiness</span>
                    <p className="text-2xl font-bold text-blue-700 mt-1">5 of 6 Ready</p>
                    <p className="text-[11px] text-amber-600 font-medium mt-0.5">Missing: Bonafide Certificate</p>
                  </div>
                </div>

                {/* Preview Card Spotlight */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          98% High Match
                        </span>
                        <span className="text-xs text-slate-400">Reliance Foundation</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        Reliance Foundation Undergraduate Scholarship 2026-27
                      </h4>
                      <p className="text-xs text-slate-500">
                        Up to ₹2,00,000 for full course duration • Closes in 13 days
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('scholarships')}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                  >
                    View in Platform
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹14.2 Cr+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Aggregate Verified Funding Pool</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">92.4%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Eligibility Engine Accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Government & CSR Schemes</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Free for All Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Streamlined Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              How GRANTLY Powers Your Scholarship Journey in 3 Steps
            </h3>
            <p className="text-sm text-slate-600 mt-3">
              We eliminated the chaos of scattered deadlines, vague guidelines, and rejected applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Build Your Smart Profile</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide your education level, academic score, branch, annual family income, and category once. GRANTLY protects your data securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-black text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Evaluate Match & Missing Docs</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our rule engine checks your profile against real eligibility guidelines, calculates your match percentage, and checks your Document Vault for gaps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 font-black text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Track Every Stage to Success</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage applications through an intuitive Kanban tracker: from Interested, Preparing, and Applied to Shortlisted and Final Grant Approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section */}
      <section className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verified Opportunities</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                Featured Scholarship Programs
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Active opportunities with verified funding and clear guidelines.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('scholarships')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 self-start md:self-auto bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200 transition-colors"
            >
              <span>View All 12+ Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredScholarships.map(sch => {
              const notice = formatDeadlineNotice(sch.deadline);
              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all group"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {sch.type}
                      </span>
                      {notice.isUrgent ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {notice.text}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          {notice.text}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {sch.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{sch.organization}</p>

                    {/* Amount */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Grant Amount</span>
                      <p className="text-base font-bold text-emerald-700">{sch.amountDisplay}</p>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                      {sch.eligibilitySummary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="flex-1 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => addToTracker(sch.id, 'Interested')}
                      className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                      title="Save to Tracker"
                    >
                      Track
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Illustrative Student Success Stories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Student Success</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Empowering Students to Achieve Their Academic Dreams
            </h3>
            <p className="text-xs text-slate-400 mt-2 italic">
              Illustrative user experiences representing common platform student journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Before GRANTLY, I had no idea AICTE had a ₹50,000/year Pragati scholarship specifically for women engineers. The rule-based checker gave me a 95% match and highlighted exactly what documents I needed."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Priya Sharma</h5>
                  <p className="text-[11px] text-slate-400">B.Tech CSE, 3rd Year • Pune</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "The Missing Document Detector saved my application. It alerted me that my state income certificate was expiring in two weeks before the ONGC CSR deadline, giving me time to renew it."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Rahul Verma</h5>
                  <p className="text-[11px] text-slate-400">M.Sc Biotechnology • New Delhi</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "The side-by-side comparison matrix makes it crystal clear which international fellowships require work experience vs straight academic transcripts. It removed all the confusion."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Ananya Sen</h5>
                  <p className="text-[11px] text-slate-400">Economics Scholar • Kolkata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Frequently Asked Questions</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Everything You Need to Know About GRANTLY
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {openFaq === idx && (
                  <div id={`faq-answer-${idx}`} role="region" aria-label={faq.q} className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Bottom Call-To-Action Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Unlock Educational Funding?
          </h3>
          <p className="mt-3 text-emerald-100 text-sm max-w-xl mx-auto">
            Join thousands of scholars managing applications effortlessly with GRANTLY.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('onboarding')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Get Started with Onboarding
            </button>
            <button
              onClick={() => setCurrentView('scholarships')}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm border border-emerald-500/40 transition-all"
            >
              Browse Opportunities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
