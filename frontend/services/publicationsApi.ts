import { auth } from './firebase';
import { Publication } from '../types';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

async function json<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? data.error ?? `HTTP ${res.status}`);
  return data as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const getPublications = (params?: {
  search?: string;
  kind?: string;
  venueType?: string;
  publisher?: string;
  international?: 'all' | 'yes' | 'no';
  year?: number;
}) => {
  const filtered = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const qs = new URLSearchParams(filtered as Record<string, string>).toString();
  return fetch(`${BASE}/api/publications${qs ? `?${qs}` : ''}`).then((r) =>
    json<Publication[]>(r)
  );
};

// ─── Admin APIs ───────────────────────────────────────────────────────────────

export const adminGetPublications = () =>
  authFetch(`${BASE}/api/admin/publications`).then((r) =>
    json<{ publications: Publication[] }>(r)
  );

export const adminCreatePublication = (body: Record<string, any>) =>
  authFetch(`${BASE}/api/admin/publications`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => json<{ publication: Publication }>(r));

export const adminUpdatePublication = (id: string, body: Record<string, any>) =>
  authFetch(`${BASE}/api/admin/publications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }).then((r) => json<{ publication: Publication }>(r));

export const adminDeletePublication = (id: string) =>
  authFetch(`${BASE}/api/admin/publications/${id}`, {
    method: 'DELETE',
  }).then((r) => json<{ message: string }>(r));
