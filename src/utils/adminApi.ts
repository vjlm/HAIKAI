/**
 * Admin API Client & Token Management
 * Works seamlessly in standard browsers and sandboxed iframe preview environments.
 */

const TOKEN_KEY = 'haikai_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure cookies are also sent whenever supported
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}
