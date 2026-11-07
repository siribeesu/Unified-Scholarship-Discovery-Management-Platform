import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Scholarship, 
  StudentProfile, 
  TrackedApplication, 
  VaultDocument, 
  ApplicationStatus,
  EligibilityEvaluation 
} from '../types/scholarship';
import { SAMPLE_SCHOLARSHIPS } from '../data/sampleScholarships';
import { DEMO_PROFILES, INITIAL_TRACKED_APPLICATIONS, INITIAL_VAULT_DOCUMENTS } from '../data/demoProfiles';
import { evaluateEligibility, detectMissingDocuments } from '../utils/eligibilityEngine';

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

interface AppContextType {
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

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'grantly_auth_v1',
  USER: 'grantly_user_v1',
  TRACKED: 'grantly_tracked_v1',
  VAULT: 'grantly_vault_v1',
  SAVED: 'grantly_saved_v1',
  COMPARE: 'grantly_compare_v1',
  VIEW: 'grantly_view_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW);
    return (saved as AppView) || 'landing';
  });
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEMO_PROFILES[0];
  });

  // Tracked Applications
  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRACKED);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TRACKED_APPLICATIONS;
  });

  // Vault Documents
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VAULT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_VAULT_DOCUMENTS;
  });

  // Saved / Bookmarked Scholarships
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return ['sch-aicte-pragati-02', 'sch-adobe-research-07'];
  });

  // Compared Scholarships
  const [comparedScholarshipIds, setComparedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPARE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return ['sch-reliance-found-03', 'sch-adobe-research-07'];
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACKED, JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(vaultDocuments));
  }, [vaultDocuments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(comparedScholarshipIds));
  }, [comparedScholarshipIds]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Nav helper
  const viewScholarshipDetails = (id: string) => {
    setSelectedScholarshipId(id);
    setCurrentView('scholarship-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const login = (_email?: string) => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    addToast({
      type: 'success',
      title: `Welcome back, ${currentUser.fullName}!`,
      message: 'Personalized scholarship matching updated for your profile.'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out of GRANTLY.'
    });
  };

  const registerAndOnboard = (profileData: Partial<StudentProfile>) => {
    const updated: StudentProfile = {
      ...currentUser,
      ...profileData,
      profileCompleted: true
    };
    setCurrentUser(updated);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    addToast({
      type: 'success',
      title: 'Profile Onboarding Complete!',
      message: 'We have calculated your personalized eligibility matches.'
    });
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Eligibility criteria and match scores recalculated.'
    });
  };

  const switchPersona = (index: number) => {
    const persona = DEMO_PROFILES[index % DEMO_PROFILES.length];
    setCurrentUser(persona);
    addToast({
      type: 'info',
      title: `Switched Persona to ${persona.fullName}`,
      message: `${persona.degree} (${persona.branch}) • CGPA ${persona.cgpa} • Income ₹${(persona.annualFamilyIncome / 100000).toFixed(1)} LPA`
    });
  };

  const resetAllData = () => {
    setCurrentUser(DEMO_PROFILES[0]);
    setTrackedApplications(INITIAL_TRACKED_APPLICATIONS);
    setVaultDocuments(INITIAL_VAULT_DOCUMENTS);
    setSavedScholarshipIds(['sch-aicte-pragati-02', 'sch-adobe-research-07']);
    setComparedScholarshipIds(['sch-reliance-found-03', 'sch-adobe-research-07']);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    addToast({
      type: 'info',
      title: 'Reset to Sample Data',
      message: 'All application trackers, documents, and profiles restored to default demo state.'
    });
  };

  // Scholarships helper
  const getScholarshipById = (id: string): Scholarship | undefined => {
    return SAMPLE_SCHOLARSHIPS.find(s => s.id === id);
  };

  const getEvaluation = (scholarship: Scholarship, customProfile?: StudentProfile) => {
    return evaluateEligibility(scholarship, customProfile || currentUser);
  };

  // Tracking actions
  const isScholarshipTracked = (scholarshipId: string) => {
    return trackedApplications.some(t => t.scholarshipId === scholarshipId);
  };

  const addToTracker = (scholarshipId: string, initialStatus: ApplicationStatus = 'Interested') => {
    const sch = getScholarshipById(scholarshipId);
    if (!sch) return;

    if (isScholarshipTracked(scholarshipId)) {
      addToast({
        type: 'info',
        title: 'Already in Tracker',
        message: `${sch.name} is already present on your Application Tracker board.`
      });
      return;
    }

    const initialChecklist: Record<string, boolean> = {};
    sch.requiredDocuments.forEach(doc => {
      initialChecklist[doc.id] = false;
    });

    const newTrack: TrackedApplication = {
      id: `track-${Date.now()}`,
      scholarshipId: sch.id,
      scholarshipName: sch.name,
      organization: sch.organization,
      amount: sch.amount,
      amountDisplay: sch.amountDisplay,
      deadline: sch.deadline,
      status: initialStatus,
      updatedAt: new Date().toISOString().split('T')[0],
      checklistStatus: initialChecklist,
      notes: `Saved opportunity on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    };

    setTrackedApplications(prev => [newTrack, ...prev]);
    addToast({
      type: 'success',
      title: 'Added to Application Tracker',
      message: `Moved "${sch.name}" to the "${initialStatus}" stage.`
    });
  };

  const updateTrackedStatus = (trackId: string, status: ApplicationStatus) => {
    setTrackedApplications(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString().split('T')[0],
          appliedDate: (status === 'Applied' && !t.appliedDate) ? new Date().toISOString().split('T')[0] : t.appliedDate
        };
      }
      return t;
    }));

    if (status === 'Approved') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }).catch(() => {});

      addToast({
        type: 'success',
        title: 'Congratulations on Approval! 🎉',
        message: 'Your scholarship funding has been awarded!'
      });
    } else {
      addToast({
        type: 'info',
        title: 'Status Updated',
        message: `Application moved to "${status}".`
      });
    }
  };

  const updateTrackedNotes = (trackId: string, notes: string, refNum?: string) => {
    setTrackedApplications(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          notes,
          applicationReferenceNumber: refNum !== undefined ? refNum : t.applicationReferenceNumber,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
    addToast({
      type: 'success',
      title: 'Application Notes Saved',
      message: 'Your personal notes and reference numbers have been updated.'
    });
  };

  const removeFromTracker = (trackId: string) => {
    setTrackedApplications(prev => prev.filter(t => t.id !== trackId));
    addToast({
      type: 'info',
      title: 'Removed from Tracker',
      message: 'The scholarship was removed from your tracking board.'
    });
  };

  const toggleApplicationDoc = (trackId: string, docId: string) => {
    setTrackedApplications(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          checklistStatus: {
            ...t.checklistStatus,
            [docId]: !t.checklistStatus[docId]
          }
        };
      }
      return t;
    }));
  };

  // Bookmarking
  const toggleSaveScholarship = (scholarshipId: string) => {
    setSavedScholarshipIds(prev => {
      const exists = prev.includes(scholarshipId);
      if (exists) {
        addToast({
          type: 'info',
          title: 'Removed from Saved',
          message: 'Scholarship removed from your bookmarks.'
        });
        return prev.filter(id => id !== scholarshipId);
      } else {
        addToast({
          type: 'success',
          title: 'Saved to Bookmarks',
          message: 'You can easily access this scholarship from your saved list.'
        });
        return [...prev, scholarshipId];
      }
    });
  };

  // Comparison
  const toggleCompare = (scholarshipId: string) => {
    setComparedScholarshipIds(prev => {
      if (prev.includes(scholarshipId)) {
        return prev.filter(id => id !== scholarshipId);
      }
      if (prev.length >= 4) {
        addToast({
          type: 'warning',
          title: 'Comparison Limit Reached',
          message: 'You can compare up to 4 scholarships simultaneously. Remove one to add another.'
        });
        return prev;
      }
      addToast({
        type: 'success',
        title: 'Added to Comparison Matrix',
        message: 'Click Compare in navigation to view side-by-side details.'
      });
      return [...prev, scholarshipId];
    });
  };

  const clearComparison = () => {
    setComparedScholarshipIds([]);
    addToast({
      type: 'info',
      title: 'Comparison Cleared',
      message: 'All scholarships removed from the comparison matrix.'
    });
  };

  // Vault
  const addVaultDocument = (docData: Omit<VaultDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: VaultDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setVaultDocuments(prev => [newDoc, ...prev]);
    addToast({
      type: 'success',
      title: 'Document Uploaded to Vault',
      message: `"${newDoc.fileName}" is secured and ready for application attachment.`
    });
  };

  const deleteVaultDocument = (id: string) => {
    setVaultDocuments(prev => prev.filter(d => d.id !== id));
    addToast({
      type: 'info',
      title: 'Document Removed',
      message: 'Document deleted from your vault.'
    });
  };

  const checkScholarshipMissingDocs = (scholarship: Scholarship) => {
    return detectMissingDocuments(scholarship, vaultDocuments);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedScholarshipId,
        viewScholarshipDetails,
        isAuthenticated,
        currentUser,
        login,
        logout,
        registerAndOnboard,
        updateProfile,
        switchPersona,
        resetAllData,
        scholarships: SAMPLE_SCHOLARSHIPS,
        getScholarshipById,
        getEvaluation,
        trackedApplications,
        addToTracker,
        updateTrackedStatus,
        updateTrackedNotes,
        removeFromTracker,
        toggleApplicationDoc,
        isScholarshipTracked,
        savedScholarshipIds,
        toggleSaveScholarship,
        comparedScholarshipIds,
        toggleCompare,
        clearComparison,
        vaultDocuments,
        addVaultDocument,
        deleteVaultDocument,
        checkScholarshipMissingDocs,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
