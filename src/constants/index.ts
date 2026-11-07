export const APP_CONFIG = {
  NAME: 'GRANTLY',
  VERSION: '2.0.0',
  TAGLINE: 'Unified Scholarship Discovery & Management Platform',
  DESCRIPTION: 'Your Future Deserves Funding. Find It Here.',
  COPYRIGHT_YEAR: 2026,
  SUPPORT_EMAIL: 'support@grantly.edu',
  OFFICIAL_SOURCES_COUNT: '120+',
  TOTAL_FUNDING_POOL_DISPLAY: '₹14.2 Cr+'
} as const;

export const STORAGE_KEYS = {
  AUTH: 'grantly_auth_v2',
  USER: 'grantly_user_v2',
  TRACKED: 'grantly_tracked_v2',
  VAULT: 'grantly_vault_v2',
  SAVED: 'grantly_saved_v2',
  COMPARE: 'grantly_compare_v2',
  VIEW: 'grantly_view_v2',
  SETTINGS: 'grantly_settings_v2'
} as const;

export const EVALUATION_WEIGHTS = {
  EDUCATION_LEVEL: 0.25,
  ACADEMIC_MERIT: 0.25,
  FINANCIAL_INCOME: 0.25,
  DEMOGRAPHIC_QUOTAS: 0.25
} as const;

export const OPPORTUNITY_SCORE_WEIGHTS = {
  COMPATIBILITY: 0.50,
  FUNDING_VALUE: 0.30,
  DEADLINE_FEASIBILITY: 0.20
} as const;

export const SECURITY_POLICIES = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  BLOCKED_EXTENSIONS: ['.exe', '.sh', '.bat', '.cmd', '.js', '.vbs', '.scr', '.html', '.svg', '.bin'],
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 30000,
  SESSION_TIMEOUT_MINUTES: 60
} as const;

export const TRACKER_STAGES = [
  'Interested',
  'Preparing',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Approved',
  'Rejected'
] as const;
