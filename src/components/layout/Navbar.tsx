import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Search, 
  Layers, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { DEMO_PROFILES } from '../../data/demoProfiles';

export const Navbar: React.FC<{ onToggleMobileNav?: () => void }> = ({ onToggleMobileNav }) => {
  const { 
    currentView, 
    setCurrentView, 
    isAuthenticated, 
    currentUser, 
    logout, 
    switchPersona,
    comparedScholarshipIds 
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Demo Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-emerald-300 font-semibold">GRANTLY Platform Preview:</strong> Realistic scholarship data & rule-based eligibility engine. Direct links provided for verified applications.
        </span>
        <div className="hidden sm:inline-flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-700">
          <span className="text-slate-400">Current Persona:</span>
          <span className="text-emerald-300 font-semibold">{currentUser.fullName} ({currentUser.degree})</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleMobileNav}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  GRANTLY
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  EdTech
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">Unified Scholarship Platform</p>
            </div>
          </button>
        </div>

        {/* Desktop Public Nav or Authenticated Quick Search */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('landing')}
              className={`text-sm font-medium transition-colors ${currentView === 'landing' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('scholarships')}
              className={`text-sm font-medium transition-colors ${currentView === 'scholarships' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Discover Scholarships
            </button>
            <button
              onClick={() => setCurrentView('eligibility')}
              className={`text-sm font-medium transition-colors ${currentView === 'eligibility' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Eligibility Engine
            </button>
            <button
              onClick={() => setCurrentView('compare')}
              className={`text-sm font-medium transition-colors ${currentView === 'compare' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Comparison
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
            <div 
              onClick={() => setCurrentView('scholarships')}
              className="w-full relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-400 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <span>Search 10,000+ scholarships, portals, keywords...</span>
              <kbd className="ml-auto text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono shadow-2xs">
                Browse
              </kbd>
            </div>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher Dropdown (Available everywhere for easy testing) */}
          <div className="relative">
            <button
              onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
              aria-label="Switch student test persona"
              aria-expanded={personaDropdownOpen}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Test with different student demographics"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Persona: <strong>{currentUser.fullName.split(' ')[0]}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {personaDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
                onMouseLeave={() => setPersonaDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Test Different Student Profiles
                </div>
                {DEMO_PROFILES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPersona(idx);
                      setPersonaDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors ${p.id === currentUser.id ? 'bg-emerald-50/70 border-l-2 border-emerald-600' : ''}`}
                  >
                    <img 
                      src={p.avatarUrl} 
                      alt={p.fullName} 
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5" 
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{p.fullName}</p>
                      <p className="text-[11px] text-slate-500">{p.degree} ({p.branch}) • Year {p.academicYear}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>CGPA: <strong className="text-slate-700">{p.cgpa}</strong></span>
                        <span>•</span>
                        <span>Income: <strong className="text-slate-700">₹{(p.annualFamilyIncome/100000).toFixed(1)}L</strong></span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-600 px-1 rounded">{p.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Comparison Tray shortcut */}
          <button
            onClick={() => setCurrentView('compare')}
            aria-label={`Open scholarship comparison (${comparedScholarshipIds.length} selected)`}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Open Scholarship Comparison Matrix"
          >
            <Layers className="w-5 h-5" />
            {comparedScholarshipIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {comparedScholarshipIds.length}
              </span>
            )}
          </button>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setCurrentView('login')}
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 px-4 py-2 rounded-xl transition-all hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Get Started Free
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('calendar')}
                aria-label="View deadlines and reminders"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Upcoming Deadlines"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-label="User account menu"
                  aria-expanded={profileDropdownOpen}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-2xs"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{currentUser.degree} • Year {currentUser.academicYear}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Student Profile
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      Preferences & Data
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button for non-authenticated */}
          {!isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Overview
          </button>
          <button
            onClick={() => { setCurrentView('scholarships'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Discover Scholarships
          </button>
          <button
            onClick={() => { setCurrentView('eligibility'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Eligibility Engine
          </button>
          <button
            onClick={() => { setCurrentView('compare'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Comparison Matrix
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center text-sm font-medium border border-slate-200 rounded-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => { setCurrentView('onboarding'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-600 rounded-xl"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
