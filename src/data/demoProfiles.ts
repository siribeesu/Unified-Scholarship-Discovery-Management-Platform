import { StudentProfile, TrackedApplication, VaultDocument } from '../types/scholarship';

export const DEMO_PROFILES: StudentProfile[] = [
  {
    id: 'student-priya-01',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@campus.edu.in',
    phone: '+91 98765 43210',
    gender: 'Female',
    educationLevel: 'Undergraduate',
    degree: 'B.Tech',
    branch: 'Computer Science',
    academicYear: 3,
    cgpa: 8.8,
    annualFamilyIncome: 320000,
    category: 'OBC',
    stateDomicile: 'Maharashtra',
    institutionName: 'College of Engineering, Pune (COEP)',
    preferredScholarshipTypes: ['Government (Central)', 'Private / CSR', 'International'],
    interestedInInternational: true,
    isFirstGenerationLearner: false,
    hasDisability: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profileCompleted: true
  },
  {
    id: 'student-rahul-02',
    fullName: 'Rahul Verma',
    email: 'rahul.verma@pg.iitd.ac.in',
    phone: '+91 91234 56789',
    gender: 'Male',
    educationLevel: 'Postgraduate',
    degree: 'M.Sc',
    branch: 'Biotechnology',
    academicYear: 1,
    cgpa: 7.6,
    annualFamilyIncome: 180000,
    category: 'SC',
    stateDomicile: 'Delhi',
    institutionName: 'Indian Institute of Technology, Delhi',
    preferredScholarshipTypes: ['Government (Central)', 'Private / CSR'],
    interestedInInternational: false,
    isFirstGenerationLearner: true,
    hasDisability: false,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    profileCompleted: true
  },
  {
    id: 'student-ananya-03',
    fullName: 'Ananya Sen',
    email: 'ananya.sen@univ.edu',
    phone: '+91 99887 76655',
    gender: 'Female',
    educationLevel: 'Undergraduate',
    degree: 'B.A.',
    branch: 'Economics',
    academicYear: 2,
    cgpa: 9.2,
    annualFamilyIncome: 650000,
    category: 'General',
    stateDomicile: 'West Bengal',
    institutionName: 'Presidency University, Kolkata',
    preferredScholarshipTypes: ['International', 'Private / CSR'],
    interestedInInternational: true,
    isFirstGenerationLearner: false,
    hasDisability: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    profileCompleted: true
  }
];

export const INITIAL_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-aadhaar',
    docType: 'Aadhaar Card',
    fileName: 'Aadhaar_PriyaSharma_eUIDAI.pdf',
    fileSize: '1.4 MB',
    uploadedAt: '2026-10-15',
    expiryDate: '2030-12-31',
    status: 'Verified',
    notes: 'Government verified UIDAI e-Aadhaar with digital signature.'
  },
  {
    id: 'doc-income',
    docType: 'Income Certificate',
    fileName: 'Income_Certificate_Tehsildar_FY26.pdf',
    fileSize: '820 KB',
    uploadedAt: '2026-09-01',
    expiryDate: '2027-03-31',
    status: 'Verified',
    notes: 'Issued by Sub-Divisional Magistrate / Tehsildar (₹3.20 LPA certified).'
  },
  {
    id: 'doc-marksheet',
    docType: 'Academic Marksheets',
    fileName: 'BTech_Sem4_Official_Transcript.pdf',
    fileSize: '2.1 MB',
    uploadedAt: '2026-08-20',
    status: 'Verified',
    notes: 'Cumulative Grade Point Average: 8.80 / 10.00 without any backlogs.'
  },
  {
    id: 'doc-caste',
    docType: 'Caste Certificate',
    fileName: 'OBC_NonCreamyLayer_Cert_2026.pdf',
    fileSize: '950 KB',
    uploadedAt: '2026-07-12',
    expiryDate: '2027-03-31',
    status: 'Verified',
    notes: 'Non-Creamy Layer (NCL) certificate valid for central admissions and schemes.'
  },
  {
    id: 'doc-bank',
    docType: 'Bank Passbook Copy',
    fileName: 'SBI_Passbook_AadhaarLinked.pdf',
    fileSize: '1.1 MB',
    uploadedAt: '2026-06-18',
    status: 'Verified',
    notes: 'State Bank of India account linked with NPCI mapper for DBT payments.'
  }
];

export const INITIAL_TRACKED_APPLICATIONS: TrackedApplication[] = [
  {
    id: 'track-01',
    scholarshipId: 'sch-adobe-research-07',
    scholarshipName: 'Adobe India Women-in-Technology Scholarship',
    organization: 'Adobe Systems India',
    amount: 400000,
    amountDisplay: '₹4,00,000 + Tech Internship Offer',
    deadline: '2026-12-05',
    status: 'Preparing',
    updatedAt: '2026-11-04',
    notes: 'Drafted Statement of Purpose. Need to request recommendation letter from Prof. Deshmukh.',
    checklistStatus: {
      'doc-resume': true,
      'doc-marksheet': true,
      'doc-essay': false,
      'doc-lor': false
    }
  },
  {
    id: 'track-02',
    scholarshipId: 'sch-reliance-found-03',
    scholarshipName: 'Reliance Foundation Undergraduate Scholarship 2026-27',
    organization: 'Reliance Foundation',
    amount: 200000,
    amountDisplay: 'Up to ₹2,00,000 (Entire Duration of Degree)',
    deadline: '2026-11-20',
    status: 'Applied',
    updatedAt: '2026-11-01',
    appliedDate: '2026-11-01',
    applicationReferenceNumber: 'RF-UG-2026-88419',
    notes: 'Submitted online aptitude test on Nov 3rd. Awaiting shortlist announcement.',
    checklistStatus: {
      'doc-aadhaar': true,
      'doc-marksheet': true,
      'doc-income': true,
      'doc-bonafide': true
    }
  },
  {
    id: 'track-03',
    scholarshipId: 'sch-inspire-she-05',
    scholarshipName: 'INSPIRE Scholarship for Higher Education (SHE)',
    organization: 'Department of Science & Technology (DST), Govt. of India',
    amount: 80000,
    amountDisplay: '₹80,000 / year',
    deadline: '2026-12-15',
    status: 'Interested',
    updatedAt: '2026-10-28',
    notes: 'Checking if engineering streams with applied math qualify this year.',
    checklistStatus: {
      'doc-aadhaar': true,
      'doc-marksheet': true,
      'doc-bonafide': false,
      'doc-bank': true
    }
  },
  {
    id: 'track-04',
    scholarshipId: 'sch-hdfc-badhte-06',
    scholarshipName: 'HDFC Bank Parivartan\'s ECSS Programme',
    organization: 'HDFC Bank CSR Parivartan',
    amount: 75000,
    amountDisplay: 'Up to ₹75,000 / year',
    deadline: '2026-11-25',
    status: 'Approved',
    updatedAt: '2026-10-10',
    appliedDate: '2026-09-12',
    applicationReferenceNumber: 'HDFC-ECSS-2026-3021',
    notes: 'Award letter received! ₹75,000 first semester installment disbursed on Oct 10th.',
    checklistStatus: {
      'doc-aadhaar': true,
      'doc-marksheet': true,
      'doc-income': true,
      'doc-crisis': true
    }
  }
];
