export type EducationLevel = 'High School' | 'Undergraduate' | 'Postgraduate' | 'PhD / Doctorate' | 'Diploma';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';

export type ScholarshipType = 'Government (Central)' | 'Government (State)' | 'Private / CSR' | 'International' | 'Institutional';

export type FundingBasis = 'Merit-Based' | 'Need-Based' | 'Merit-cum-Means' | 'Special / Reserved';

export type ApplicationStatus = 
  | 'Interested' 
  | 'Preparing' 
  | 'Applied' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Approved' 
  | 'Rejected';

export interface EligibilityRules {
  educationLevels: EducationLevel[];
  minCgpaOrPercentage?: number; // e.g. 7.5 or 75
  maxFamilyIncome?: number; // annual family income ceiling in INR
  allowedCategories?: Category[];
  eligibleBranches?: string[]; // e.g. ['Computer Science', 'Engineering', 'Medical', 'All']
  genderPreference?: 'All' | 'Female Only' | 'Transgender / Non-binary';
  stateDomicile?: string[]; // ['All India'] or specific states like ['Maharashtra', 'Karnataka']
  courseYear?: number[]; // e.g. [1, 2, 3, 4]
  ageLimitMax?: number;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  category: 'Identity' | 'Academic' | 'Income' | 'Admission' | 'Special';
  isRequired: boolean;
  description: string;
}

export interface Scholarship {
  id: string;
  name: string;
  organization: string;
  type: ScholarshipType;
  basis: FundingBasis;
  amount: number; // numeric in INR or converted
  amountDisplay: string; // e.g. "₹50,000 / year" or "Full Tuition + ₹1,20,000 Stipend"
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  deadline: string; // ISO date YYYY-MM-DD
  description: string;
  eligibilitySummary: string;
  eligibilityRules: EligibilityRules;
  requiredDocuments: DocumentRequirement[];
  benefits: string[];
  applicationUrl: string;
  isVerified: boolean;
  isClosingSoon?: boolean;
  isNewlyAdded?: boolean;
  sourcePortalName: string;
  totalSeats?: number;
  contactEmail?: string;
  renewable: boolean;
  tags: string[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Female' | 'Male' | 'Other';
  educationLevel: EducationLevel;
  degree: string; // e.g. B.Tech, B.Sc, M.Sc, MBBS
  branch: string; // e.g. Computer Science, Biotechnology
  academicYear: number; // 1, 2, 3, 4, 5
  cgpa: number; // Scale of 10.0 or converted percentage (e.g. 8.6)
  annualFamilyIncome: number; // in INR e.g. 320000
  category: Category;
  stateDomicile: string;
  institutionName: string;
  preferredScholarshipTypes: ScholarshipType[];
  interestedInInternational: boolean;
  isFirstGenerationLearner?: boolean;
  hasDisability?: boolean;
  avatarUrl?: string;
  profileCompleted: boolean;
}

export interface TrackedApplication {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  organization: string;
  amount: number;
  amountDisplay: string;
  deadline: string;
  status: ApplicationStatus;
  updatedAt: string;
  appliedDate?: string;
  notes?: string;
  applicationReferenceNumber?: string;
  checklistStatus: Record<string, boolean>; // docId -> uploaded/ready
}

export interface VaultDocument {
  id: string;
  docType: string; // e.g. "Aadhaar Card", "Income Certificate", "Bonafide Certificate"
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  expiryDate?: string; // YYYY-MM-DD
  isExpired?: boolean;
  status: 'Verified' | 'Pending Review' | 'Expired';
  fileUrl?: string;
  notes?: string;
}

export interface EligibilityEvaluation {
  scholarshipId: string;
  matchScore: number; // 0 to 100
  status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  opportunityScore: number; // 0 to 100
  checks: {
    criterion: string;
    studentValue: string;
    requiredValue: string;
    passed: boolean;
    isMandatory: boolean;
    reason: string;
  }[];
  missingRequirements: string[];
  qualifications: string[];
  recommendationNote: string;
}
