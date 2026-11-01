/**
 * Thin fetch wrapper around the MedLink360 API.
 *
 * The backend always answers with { success, data, meta? } on success and
 * { success: false, error: { code, message, details? }, requestId } on failure,
 * so every caller here gets the unwrapped `data` back or an ApiError thrown.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const STORAGE = {
  access: 'ss.accessToken',
  refresh: 'ss.refreshToken',
  user: 'ss.user',
};

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Field-level validation messages, flattened for form display. */
  get fieldMessages() {
    if (!Array.isArray(this.details)) return [];
    return this.details.map((d) => {
      const path = Array.isArray(d.path) ? d.path.join('.') : d.path;
      return path ? `${path}: ${d.message}` : d.message;
    });
  }
}

/* ------------------------------------------------------------------ tokens */

export const tokenStore = {
  get access() {
    return localStorage.getItem(STORAGE.access);
  },
  get refresh() {
    return localStorage.getItem(STORAGE.refresh);
  },
  get user() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.user) || 'null');
    } catch {
      return null;
    }
  },
  save({ tokens, user }) {
    if (tokens?.accessToken) localStorage.setItem(STORAGE.access, tokens.accessToken);
    if (tokens?.refreshToken) localStorage.setItem(STORAGE.refresh, tokens.refreshToken);
    if (user) localStorage.setItem(STORAGE.user, JSON.stringify(user));
  },
  clear() {
    Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
  },
};

/** Notifies the app (AuthContext) when a session dies so it can show the login screen. */
const sessionListeners = new Set();
export const onSessionExpired = (fn) => {
  sessionListeners.add(fn);
  return () => sessionListeners.delete(fn);
};
const broadcastExpiry = () => {
  tokenStore.clear();
  sessionListeners.forEach((fn) => fn());
};

/* ----------------------------------------------------------------- request */

const buildUrl = (path, query) => {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const parseError = async (response) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    /* non-JSON error body (gateway timeouts, HTML error pages) */
  }
  const error = payload?.error;
  return new ApiError(
    response.status,
    error?.code || 'HTTP_ERROR',
    error?.message || `Request failed with status ${response.status}`,
    error?.details,
  );
};

/** Access tokens live 15 minutes; swap in a new one rather than bouncing the user. */
let refreshInFlight = null;
const refreshAccessToken = async () => {
  const refreshToken = tokenStore.refresh;
  if (!refreshToken) return null;

  if (!refreshInFlight) {
    refreshInFlight = fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const body = await res.json();
        const tokens = body?.data?.tokens;
        if (!tokens?.accessToken) return null;
        tokenStore.save({ tokens });
        return tokens.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};

/**
 * @param {string} path      API path below /api, e.g. '/appointments/my'
 * @param {object} [options] method, body, query, form (FormData), raw (return Blob), auth
 */
export const request = async (path, options = {}) => {
  const { method = 'GET', body, query, form, raw = false, auth = true, _retried = false } = options;

  const headers = {};
  if (auth && tokenStore.access) headers.Authorization = `Bearer ${tokenStore.access}`;
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: form ? form : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Render free instances sleep after 15 minutes and take ~50s to wake.
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. It may be waking up - try again in a moment.');
  }

  if (response.status === 401 && auth && !_retried) {
    const fresh = await refreshAccessToken();
    if (fresh) return request(path, { ...options, _retried: true });
    broadcastExpiry();
  }

  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return null;
  if (raw) return response.blob();

  const payload = await response.json();
  // Paginated endpoints carry their meta alongside the array.
  if (payload?.meta && Array.isArray(payload.data)) {
    const items = payload.data;
    items.meta = payload.meta;
    return items;
  }
  return payload?.data ?? payload;
};

export const api = {
  get: (path, query, options) => request(path, { ...options, method: 'GET', query }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { BASE_URL };
