const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const TOKEN_KEY = 'ori6in_token';
const ROLE_KEY = 'ori6in_role';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_KEY);
}

export function setSession(token: string, role: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ori6in-auth'));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ori6in-auth'));
  }
}

export function portalPathForRole(role: string) {
  if (role === 'mentor') return '/mentor';
  if (role === 'admin' || role === 'super_admin') return '/admin';
  if (role === 'parent') return '/parent';
  if (role === 'company') return '/company';
  return '/student';
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: T }> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, { ...init, headers });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export async function fetchMe(): Promise<AuthUser | null> {
  const { ok, data } = await apiFetch<AuthUser>('/auth/me');
  if (!ok) return null;
  return data;
}
