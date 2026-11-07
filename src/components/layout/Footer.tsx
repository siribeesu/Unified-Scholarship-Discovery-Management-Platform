import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">GRANTLY</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Next-Gen EdTech
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Democratizing access to higher education funding. Discover verified scholarships, evaluate rule-based eligibility, organize documents, and track every application seamlessly.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free & Open Access for Students Across India & Abroad</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => setCurrentView('scholarships')} className="hover:text-emerald-400 transition-colors">
                  Scholarship Discovery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('eligibility')} className="hover:text-emerald-400 transition-colors">
                  Smart Eligibility Checker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('compare')} className="hover:text-emerald-400 transition-colors">
                  Side-by-Side Comparison
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tracker')} className="hover:text-emerald-400 transition-colors">
                  Kanban Application Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('vault')} className="hover:text-emerald-400 transition-colors">
                  Secure Document Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Scholarship Portals Reference */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.aicte-pragati-saksham-gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  AICTE Pragati Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://online-inspire.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  DST INSPIRE Program <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  MahaDBT State Schemes <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.usief.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  USIEF Fulbright Fellowships <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Student Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              GRANTLY is an independent discovery platform. We never ask for bank PINs, passwords, or processing fees. Always verify final application guidelines on official authority domains.
            </p>
            <div className="mt-4 p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Need Guidance?</span>
              <p className="mt-0.5 text-slate-400">Reach our student support desk at <span className="text-slate-200 font-mono">support@grantly.edu</span></p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GRANTLY Inc. Built for ambitious scholars worldwide.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for equal educational opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
