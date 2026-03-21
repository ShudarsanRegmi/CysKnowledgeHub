import { auth } from './firebase';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WriteupStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type WriteupDifficulty = 'easy' | 'medium' | 'hard';
export type WriteupCategory = 'web' | 'crypto' | 'pwn' | 'rev' | 'forensics' | 'misc' | (string & {});

export interface Writeup {
  _id: string;
  title: string;
  slug: string;
  eventName: string;
  eventSlug: string;
  challengeName: string;
  category: WriteupCategory;
  difficulty: WriteupDifficulty;
  content: string;
  contentType: 'markdown' | 'novel';
  coverImage?: string;
  authorUid: string;
  authorName: string;
  tags: string[];
  status: WriteupStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

async function json<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
  return data as T;
}

// ─── APIs ─────────────────────────────────────────────────────────────────────

export const getWriteups = () =>
  fetch(`${BASE}/api/writeups`).then((r) => json<{ writeups: Writeup[] }>(r));

export const getWriteup = (slug: string) =>
  fetch(`${BASE}/api/writeups/${slug}`).then((r) => json<{ writeup: Writeup }>(r));

export const getMyWriteups = () =>
  authFetch(`${BASE}/api/writeups/me`).then((r) => json<{ writeups: Writeup[] }>(r));

export const getWriteupsByEvent = (eventSlug: string) =>
  fetch(`${BASE}/api/writeups/event/${eventSlug}`).then((r) => json<{ writeups: Writeup[] }>(r));

export const getWriteupsByCategory = (category: string) =>
  fetch(`${BASE}/api/writeups/category/${category}`).then((r) => json<{ writeups: Writeup[] }>(r));

export const createWriteup = (body: Partial<Writeup>) =>
  authFetch(`${BASE}/api/writeups`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => json<{ writeup: Writeup }>(r));

export const updateWriteup = (id: string, body: Partial<Writeup>) =>
  authFetch(`${BASE}/api/writeups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }).then((r) => json<{ writeup: Writeup }>(r));

export const deleteWriteup = (id: string) =>
  authFetch(`${BASE}/api/writeups/${id}`, {
    method: 'DELETE',
  }).then((r) => json<{ message: string }>(r));

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminGetWriteups = (params: { status?: string; category?: string; difficulty?: string } = {}) => {
  const query = new URLSearchParams(params as any).toString();
  return authFetch(`${BASE}/api/admin/writeups?${query}`).then((r) => json<{ writeups: Writeup[] }>(r));
};

export const adminSetWriteupStatus = (id: string, status: string, rejectionReason?: string) =>
  authFetch(`${BASE}/api/admin/writeups/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, rejectionReason }),
  }).then((r) => json<{ writeup: Writeup }>(r));

export const adminDeleteWriteup = (id: string) =>
  authFetch(`${BASE}/api/admin/writeups/${id}`, {
    method: 'DELETE',
  }).then((r) => json<{ message: string }>(r));
