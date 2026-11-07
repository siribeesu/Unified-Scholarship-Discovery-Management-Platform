import { useState, lazy, Suspense } from 'react';
import { useApp } from './context';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Lazy-loaded routes for code splitting & high-performance loading
const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./components/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./components/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const StudentOnboarding = lazy(() => import('./components/auth/StudentOnboarding').then(m => ({ default: m.StudentOnboarding })));
const StudentDashboard = lazy(() => import('./components/dashboard/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const ScholarshipDiscovery = lazy(() => import('./components/scholarships/ScholarshipDiscovery').then(m => ({ default: m.ScholarshipDiscovery })));
const ScholarshipDetails = lazy(() => import('./components/scholarships/ScholarshipDetails').then(m => ({ default: m.ScholarshipDetails })));
const EligibilityChecker = lazy(() => import('./components/eligibility/EligibilityChecker').then(m => ({ default: m.EligibilityChecker })));
const ScholarshipComparison = lazy(() => import('./components/compare/ScholarshipComparison').then(m => ({ default: m.ScholarshipComparison })));
const ApplicationTracker = lazy(() => import('./components/tracker/ApplicationTracker').then(m => ({ default: m.ApplicationTracker })));
const DocumentVault = lazy(() => import('./components/vault/DocumentVault').then(m => ({ default: m.DocumentVault })));
const DeadlineCalendar = lazy(() => import('./components/calendar/DeadlineCalendar').then(m => ({ default: m.DeadlineCalendar })));
const StudentProfileView = lazy(() => import('./components/profile/StudentProfileView').then(m => ({ default: m.StudentProfileView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));

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

  const isPublicPage = currentView === 'landing' || currentView === 'login' || currentView === 'register' || currentView === 'onboarding';
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        {/* WCAG Skip-to-Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:font-bold focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Top Navbar */}
        <Navbar onToggleMobileNav={() => setMobileSidebarOpen(prev => !prev)} />

        {/* Main Body */}
        {showSidebar ? (
          <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Sidebar
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
            <main id="main-content" tabIndex={-1} className="flex-1 py-8 lg:pl-8 min-w-0 outline-none">
              <Suspense fallback={<LoadingSpinner />}>
                {renderCurrentView()}
              </Suspense>
            </main>
          </div>
        ) : (
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <Suspense fallback={<LoadingSpinner />}>
              {renderCurrentView()}
            </Suspense>
          </main>
        )}

        {/* Footer */}
        <Footer />

        {/* Global Toast Stack */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
