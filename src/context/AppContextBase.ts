import { createContext } from 'react';
import { 
  Scholarship, 
  StudentProfile, 
  TrackedApplication, 
  VaultDocument, 
  ApplicationStatus,
  EligibilityEvaluation 
} from '../types/scholarship';
import { detectMissingDocuments } from '../utils/eligibilityEngine';

export type AppView = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'onboarding' 
  | 'dashboard' 
  | 'scholarships' 
  | 'scholarship-details' 
  | 'eligibility' 
  | 'compare' 
  | 'tracker' 
  | 'vault' 
  | 'calendar' 
  | 'profile' 
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedScholarshipId: string | null;
  viewScholarshipDetails: (id: string) => void;

  // Auth & Profile
  isAuthenticated: boolean;
  currentUser: StudentProfile;
  login: (email?: string) => void;
  logout: () => void;
  registerAndOnboard: (profile: Partial<StudentProfile>) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  switchPersona: (personaIndex: number) => void;
  resetAllData: () => void;

  // Scholarships
  scholarships: Scholarship[];
  getScholarshipById: (id: string) => Scholarship | undefined;
  getEvaluation: (scholarship: Scholarship, customProfile?: StudentProfile) => EligibilityEvaluation;

  // Tracking
  trackedApplications: TrackedApplication[];
  addToTracker: (scholarshipId: string, initialStatus?: ApplicationStatus) => void;
  updateTrackedStatus: (trackId: string, status: ApplicationStatus) => void;
  updateTrackedNotes: (trackId: string, notes: string, refNum?: string) => void;
  removeFromTracker: (trackId: string) => void;
  toggleApplicationDoc: (trackId: string, docId: string) => void;
  isScholarshipTracked: (scholarshipId: string) => boolean;

  // Bookmarking / Saved
  savedScholarshipIds: string[];
  toggleSaveScholarship: (scholarshipId: string) => void;

  // Comparison
  comparedScholarshipIds: string[];
  toggleCompare: (scholarshipId: string) => void;
  clearComparison: () => void;

  // Document Vault
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'uploadedAt'>) => void;
  deleteVaultDocument: (id: string) => void;
  checkScholarshipMissingDocs: (scholarship: Scholarship) => ReturnType<typeof detectMissingDocuments>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
