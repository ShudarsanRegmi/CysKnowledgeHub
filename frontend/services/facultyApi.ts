import { auth } from './firebase';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

export interface FacultyMember {
  _id: string;
  name: string;
  designation: string;
  email: string;
  linkedinUrl?: string;
  scholarUrl?: string;
  bio: string;
  photoUrl?: string;
  subjects: string[];
  researchInterests: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

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
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
  return data as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const getFaculty = () =>
  fetch(`${BASE}/api/faculty`).then((r) => json<{ faculty: FacultyMember[] }>(r));

// ─── Admin APIs ───────────────────────────────────────────────────────────────

export const adminCreateFaculty = (body: {
  name: string;
  designation: string;
  email: string;
  linkedinUrl?: string;
  scholarUrl?: string;
  bio: string;
  photoUrl?: string;
  subjects: string[];
  researchInterests: string[];
}) =>
  authFetch(`${BASE}/api/faculty/admin`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => json<{ faculty: FacultyMember }>(r));

export const adminUpdateFaculty = (
  id: string,
  body: Partial<{
    name: string;
    designation: string;
    email: string;
    linkedinUrl: string;
    scholarUrl: string;
    bio: string;
    photoUrl: string;
    subjects: string[];
    researchInterests: string[];
  }>
) =>
  authFetch(`${BASE}/api/faculty/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }).then((r) => json<{ faculty: FacultyMember }>(r));

export const adminDeleteFaculty = (id: string) =>
  authFetch(`${BASE}/api/faculty/admin/${id}`, {
    method: 'DELETE',
  }).then((r) => json<{ message: string }>(r));
