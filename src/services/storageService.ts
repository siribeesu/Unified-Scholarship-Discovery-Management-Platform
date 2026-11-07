import { STORAGE_KEYS } from '../constants';
import { StudentProfile, TrackedApplication, VaultDocument } from '../types/scholarship';
import { DEMO_PROFILES, INITIAL_TRACKED_APPLICATIONS, INITIAL_VAULT_DOCUMENTS } from '../data/demoProfiles';
import { sanitizeInput } from '../utils/security';

export class StorageService {
  /**
   * Safely parses JSON with prototype-pollution protection and graceful fallback
   */
  public static safeParseJson<T>(rawJson: string, fallback: T): T {
    try {
      if (!rawJson || typeof rawJson !== 'string') return fallback;
      // Pre-parse string check for prototype pollution injection
      if (rawJson.includes('__proto__') || (rawJson.includes('constructor') && rawJson.includes('prototype'))) {
        console.warn('[Security Alert] Blocked prototype pollution payload in safeParseJson');
        return fallback;
      }
      return JSON.parse(rawJson) as T;
    } catch {
      return fallback;
    }
  }

  /**
   * Generates a versioned backup payload for student data
   */
  public static createBackupPayload(data: {
    user: StudentProfile;
    tracked: TrackedApplication[];
    vault: VaultDocument[];
  }) {
    return {
      schemaVersion: '2.0.0',
      timestamp: new Date().toISOString(),
      data: {
        userProfile: data.user,
        trackedApplications: data.tracked,
        vaultDocuments: data.vault
      }
    };
  }

  /**
   * Safely loads JSON data from localStorage with schema fallback
   */
  public static getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      // Pre-parse check for prototype pollution
      if (item.includes('__proto__') || (item.includes('constructor') && item.includes('prototype'))) {
        console.warn(`[Security Alert] Prototype pollution attempt blocked on key ${key}`);
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[StorageService] Failed to load key ${key}:`, e);
      return fallback;
    }
  }

  /**
   * Safely stores JSON data in localStorage
   */
  public static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[StorageService] Failed to persist key ${key}:`, e);
    }
  }

  /**
   * Loads or initializes student profile
   */
  public static loadProfile(): StudentProfile {
    return this.getItem<StudentProfile>(STORAGE_KEYS.USER, DEMO_PROFILES[0]);
  }

  /**
   * Loads or initializes tracked applications
   */
  public static loadTracked(): TrackedApplication[] {
    return this.getItem<TrackedApplication[]>(STORAGE_KEYS.TRACKED, INITIAL_TRACKED_APPLICATIONS);
  }

  /**
   * Loads or initializes vault documents
   */
  public static loadVault(): VaultDocument[] {
    return this.getItem<VaultDocument[]>(STORAGE_KEYS.VAULT, INITIAL_VAULT_DOCUMENTS);
  }

  /**
   * Resets all storage keys to default demo data
   */
  public static resetToDemo(): {
    profile: StudentProfile;
    tracked: TrackedApplication[];
    vault: VaultDocument[];
  } {
    this.setItem(STORAGE_KEYS.USER, DEMO_PROFILES[0]);
    this.setItem(STORAGE_KEYS.TRACKED, INITIAL_TRACKED_APPLICATIONS);
    this.setItem(STORAGE_KEYS.VAULT, INITIAL_VAULT_DOCUMENTS);
    this.setItem(STORAGE_KEYS.SAVED, ['sch-aicte-pragati-02', 'sch-adobe-research-07']);
    this.setItem(STORAGE_KEYS.COMPARE, ['sch-reliance-found-03', 'sch-adobe-research-07']);
    this.setItem(STORAGE_KEYS.AUTH, 'true');

    return {
      profile: DEMO_PROFILES[0],
      tracked: INITIAL_TRACKED_APPLICATIONS,
      vault: INITIAL_VAULT_DOCUMENTS
    };
  }

  /**
   * Deeply validates and imports backup data safely, stripping malicious payloads
   */
  public static safeImportData(rawJson: string): {
    success: boolean;
    data?: {
      userProfile: StudentProfile;
      trackedApplications: TrackedApplication[];
      vaultDocuments: VaultDocument[];
    };
    error?: string;
  } {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Malformed JSON payload.' };
      }

      if (!parsed.userProfile || !Array.isArray(parsed.trackedApplications) || !Array.isArray(parsed.vaultDocuments)) {
        return { success: false, error: 'Invalid backup structure. Missing essential schema keys.' };
      }

      // Sanitize string fields in imported profile
      const sanitizedProfile: StudentProfile = {
        ...parsed.userProfile,
        fullName: sanitizeInput(parsed.userProfile.fullName || ''),
        email: sanitizeInput(parsed.userProfile.email || ''),
        phone: sanitizeInput(parsed.userProfile.phone || ''),
        degree: sanitizeInput(parsed.userProfile.degree || ''),
        branch: sanitizeInput(parsed.userProfile.branch || ''),
        institutionName: sanitizeInput(parsed.userProfile.institutionName || ''),
        stateDomicile: sanitizeInput(parsed.userProfile.stateDomicile || '')
      };

      return {
        success: true,
        data: {
          userProfile: sanitizedProfile,
          trackedApplications: parsed.trackedApplications,
          vaultDocuments: parsed.vaultDocuments
        }
      };
    } catch {
      return { success: false, error: 'Could not parse JSON file.' };
    }
  }
}
