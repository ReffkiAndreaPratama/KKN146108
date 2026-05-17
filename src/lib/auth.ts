/**
 * Simple admin authentication
 * Credentials disimpan di environment variables
 * Di production, ganti dengan Supabase Auth
 */

export const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "admin";
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "kkn146talangmarap";

export const SESSION_KEY = "kkn146_admin_session";
export const SESSION_VALUE = "authenticated";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
}

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
