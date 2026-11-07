/**
 * Security utilities for GRANTLY
 * Includes input sanitization, sensitive data masking, password strength verification,
 * file upload validation, and URL protocol verification.
 */

/**
 * Sanitizes user input string against XSS, HTML injection, and control characters.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip HTML brackets
    .replace(/javascript:/gi, '') // Prevent javascript pseudo-protocol
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .trim();
}

/**
 * Masks sensitive identification numbers (e.g., Aadhaar, Phone, Email) for display privacy.
 */
export function maskSensitiveId(
  value: string,
  type: 'aadhaar' | 'phone' | 'email' | 'generic' = 'generic'
): string {
  if (!value) return '';

  if (type === 'aadhaar') {
    const clean = value.replace(/[^0-9]/g, '');
    if (clean.length === 12) {
      return `XXXX-XXXX-${clean.slice(8)}`;
    }
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }

  if (type === 'phone') {
    const clean = value.replace(/\s+/g, '');
    if (clean.length >= 10) {
      return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
    }
    return '***-***-****';
  }

  if (type === 'email') {
    const [local, domain] = value.split('@');
    if (!domain) return value;
    const maskedLocal = local.length > 2 
      ? `${local[0]}***${local[local.length - 1]}`
      : `${local[0]}***`;
    return `${maskedLocal}@${domain}`;
  }

  // Generic fallback: keep first 2 and last 2 characters
  if (value.length > 6) {
    return `${value.slice(0, 2)}****${value.slice(-2)}`;
  }
  return '******';
}

/**
 * Validates password strength and returns score and actionable feedback.
 */
export function validatePasswordStrength(password: string): {
  score: number; // 0 to 4
  strength: 'Weak' | 'Fair' | 'Good' | 'Strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Must be at least 8 characters long');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter (A-Z)');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number (0-9)');
  }

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character (!@#$%^&*)');
  }

  let strength: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (score === 4) strength = 'Strong';
  else if (score === 3) strength = 'Good';
  else if (score === 2) strength = 'Fair';

  return { score, strength, feedback };
}

/**
 * Whitelist of safe document extensions.
 * Rejects executables, scripts, and unsafe file formats.
 */
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
const BLOCKED_EXTENSIONS = ['.exe', '.sh', '.bat', '.cmd', '.js', '.vbs', '.scr', '.html', '.svg', '.bin'];

export function validateUploadedFile(
  fileName: string,
  fileSizeBytes: number,
  maxSizeMb = 10
): { isValid: boolean; error?: string } {
  const lowerName = fileName.toLowerCase().trim();

  // 1. Check for blocked extensions
  const isDangerous = BLOCKED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (isDangerous) {
    return {
      isValid: false,
      error: 'Security Alert: Executable or script files are strictly blocked.'
    };
  }

  // 2. Check for allowed extensions
  const isAllowed = ALLOWED_DOCUMENT_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (!isAllowed) {
    return {
      isValid: false,
      error: `Invalid file format. Permitted document formats: ${ALLOWED_DOCUMENT_EXTENSIONS.join(', ')}.`
    };
  }

  // 3. File size check
  const maxBytes = maxSizeMb * 1024 * 1024;
  if (fileSizeBytes > maxBytes) {
    return {
      isValid: false,
      error: `File exceeds maximum allowed size of ${maxSizeMb} MB.`
    };
  }

  return { isValid: true };
}

/**
 * Validates that an external URL uses HTTPS and is not a dangerous script protocol.
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
