import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Search, 
  CheckCircle2, 
  Columns3, 
  Layers, 
  FolderLock, 
  CalendarDays, 
  UserCircle, 
  Settings, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    currentView, 
    setCurrentView, 
    trackedApplications, 
    comparedScholarshipIds, 
    vaultDocuments,
    currentUser 
  } = useApp();

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'scholarships',
      label: 'Scholarship Discovery',
      icon: <Search className="w-5 h-5" />
    },
    {
      id: 'eligibility',
      label: 'Eligibility Checker',
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      id: 'tracker',
      label: 'Application Tracker',
      icon: <Columns3 className="w-5 h-5" />,
      badge: trackedApplications.length
    },
    {
      id: 'compare',
      label: 'Scholarship Compare',
      icon: <Layers className="w-5 h-5" />,
      badge: comparedScholarshipIds.length > 0 ? comparedScholarshipIds.length : undefined
    },
    {
      id: 'vault',
      label: 'Document Vault',
      icon: <FolderLock className="w-5 h-5" />,
      badge: vaultDocuments.length
    },
    {
      id: 'calendar',
      label: 'Deadline Calendar',
      icon: <CalendarDays className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: <UserCircle className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Profile summary card */}
      <div className="p-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl p-3 border border-emerald-100/80">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover border border-emerald-300" 
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800 truncate">{currentUser.fullName}</h4>
              <p className="text-[11px] text-emerald-700 font-medium truncate">{currentUser.degree} • {currentUser.branch}</p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Profile Strength</span>
            <span className="text-emerald-700 font-bold">95% Complete</span>
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full w-[95%] transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Platform Workspace
        </p>

        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo & Help Card */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-left">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Smart Match Radar</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Rule engine matching your <strong className="text-slate-700">{currentUser.category}</strong> profile & <strong className="text-slate-700">{currentUser.cgpa} CGPA</strong>.
          </p>
          <button
            onClick={() => handleNav('eligibility')}
            className="mt-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            Run What-If Simulation
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Schemes 2026-27</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Navigation Menu</span>
              <button 
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
