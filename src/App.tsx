import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentOnboarding } from './components/auth/StudentOnboarding';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ScholarshipDiscovery } from './components/scholarships/ScholarshipDiscovery';
import { ScholarshipDetails } from './components/scholarships/ScholarshipDetails';
import { EligibilityChecker } from './components/eligibility/EligibilityChecker';
import { ScholarshipComparison } from './components/compare/ScholarshipComparison';
import { ApplicationTracker } from './components/tracker/ApplicationTracker';
import { DocumentVault } from './components/vault/DocumentVault';
import { DeadlineCalendar } from './components/calendar/DeadlineCalendar';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { SettingsView } from './components/settings/SettingsView';

export function App() {
  const { currentView, isAuthenticated } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'onboarding':
        return <StudentOnboarding />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'scholarships':
        return <ScholarshipDiscovery />;
      case 'scholarship-details':
        return <ScholarshipDetails />;
      case 'eligibility':
        return <EligibilityChecker />;
      case 'compare':
        return <ScholarshipComparison />;
      case 'tracker':
        return <ApplicationTracker />;
      case 'vault':
        return <DocumentVault />;
      case 'calendar':
        return <DeadlineCalendar />;
      case 'profile':
        return <StudentProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  // Determine whether to show the authenticated application layout (with Sidebar)
  const isPublicPage = currentView === 'landing' || currentView === 'login' || currentView === 'register' || currentView === 'onboarding';
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Navbar */}
      <Navbar onToggleMobileNav={() => setMobileSidebarOpen(prev => !prev)} />

      {/* Main Body */}
      {showSidebar ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
          <main className="flex-1 py-8 lg:pl-8 min-w-0">
            {renderCurrentView()}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderCurrentView()}
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
}

export default App;
