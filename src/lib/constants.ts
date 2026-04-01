const DEFAULT_PHONE = '918237655610';

export const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Asrar Solar';
export const BUSINESS_TAGLINE =
  import.meta.env.VITE_BUSINESS_TAGLINE?.trim() || 'Clean rooftop solar for homes, farms, and businesses';
export const BUSINESS_PHONE = (import.meta.env.VITE_BUSINESS_PHONE || DEFAULT_PHONE).replace(/\D/g, '') || DEFAULT_PHONE;
export const BUSINESS_PHONE_DISPLAY = formatPhoneNumber(BUSINESS_PHONE);
export const BUSINESS_EMAIL = import.meta.env.VITE_BUSINESS_EMAIL?.trim() || 'Junaidk5610@gmail.com';
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_PHONE}`;
export const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL?.trim() || '';
export function validateAdminCredentials(inputPassword: string): boolean {
  const configuredPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim();
  if (!configuredPassword) return false;
  return inputPassword === configuredPassword;
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ADMIN_PASSWORD?.trim());
}

export const ADMIN_SESSION_KEY = 'asrar_admin_auth';
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const LOGIN_ATTEMPTS_KEY = 'asrar_login_attempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

interface LoginAttempts {
  count: number;
  firstAttemptAt: number;
}

export function getRemainingLockoutMs(): number {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    if (!raw) return 0;
    const data: LoginAttempts = JSON.parse(raw);
    if (data.count >= MAX_LOGIN_ATTEMPTS) {
      const elapsed = Date.now() - data.firstAttemptAt;
      if (elapsed < LOCKOUT_DURATION_MS) return LOCKOUT_DURATION_MS - elapsed;
      sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    }
    return 0;
  } catch {
    return 0;
  }
}

export function recordLoginFailure(): void {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const now = Date.now();
    let data: LoginAttempts = raw ? JSON.parse(raw) : { count: 0, firstAttemptAt: now };
    if (now - data.firstAttemptAt > LOCKOUT_DURATION_MS) {
      data = { count: 0, firstAttemptAt: now };
    }
    data.count += 1;
    sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

export function resetLoginFailures(): void {
  try {
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

function formatPhoneNumber(phone: string) {
  if (phone.length === 12 && phone.startsWith('91')) {
    return `+91 ${phone.slice(2, 7)} ${phone.slice(7)}`;
  }

  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }

  return phone;
}
