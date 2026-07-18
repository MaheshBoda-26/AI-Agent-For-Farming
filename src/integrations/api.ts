const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const TOKEN_KEY = 'auth_token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/**
 * Handle 401 responses by clearing the stale token and redirecting to /auth.
 * This is the key fix: when a JWT expires or becomes invalid (server restart,
 * secret change, token corruption), the user is automatically logged out
 * instead of being stuck in a broken state.
 */
function handleUnauthorized() {
  clearToken();
  // Only redirect if we're not already on the auth page
  if (!window.location.pathname.startsWith('/auth')) {
    window.location.href = '/auth';
  }
}

async function handleResponse(res: Response, skipAutoLogout = false) {
  if (res.status === 401 && !skipAutoLogout) {
    // Auto-logout on any 401 — expired token, invalid token, etc.
    // (but NOT for auth endpoints like signin where 401 means wrong password)
    handleUnauthorized();
    throw new Error('Session expired. Please sign in again.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res;
}

export const api = {
  async get(path: string) {
    const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
    await handleResponse(res);
    return res.json();
  },

  async post(path: string, body?: unknown, options?: { skipAutoLogout?: boolean }) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    await handleResponse(res, options?.skipAutoLogout);
    return res.json();
  },

  // Returns the raw Response for streaming
  async postStream(path: string, body: unknown) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    await handleResponse(res);
    return res;
  },

  async upload(path: string, file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    await handleResponse(res);
    return res.json();
  },

  getToken,
  setToken,
  clearToken,
  API_URL,
};
