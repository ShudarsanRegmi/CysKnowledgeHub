import { auth } from './firebase';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface PopularTag {
  tag: string;
  count: number;
}

export interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  topicId: { _id: string; title: string; slug: string; type: string };
  content?: string;      // only returned in single-article fetch
  contentType: 'markdown' | 'novel';
  excerpt?: string;
  coverImage?: string;
  authorUid: string;
  authorName: string;
  tags: string[];
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
}

export interface FeedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) } });
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

// ─── Public APIs ──────────────────────────────────────────────────────────────

export const getBlogCategories = () =>
  apiFetch(`${BASE}/api/blog/categories`).then((r) =>
    json<{ categories: BlogCategory[] }>(r)
  );

export const getBlogFeed = (params: {
  page?: number;
  limit?: number;
  topicId?: string;
  tag?: string;
  sort?: 'latest' | 'trending';
  search?: string;
} = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
  ).toString();
  return apiFetch(`${BASE}/api/blog/feed${qs ? `?${qs}` : ''}`).then((r) =>
    json<{ articles: BlogArticle[]; pagination: FeedPagination }>(r)
  );
};

export const getTrendingArticles = () =>
  apiFetch(`${BASE}/api/blog/trending`).then((r) =>
    json<{ articles: BlogArticle[] }>(r)
  );

export const getPopularTags = () =>
  apiFetch(`${BASE}/api/blog/tags`).then((r) =>
    json<{ tags: PopularTag[] }>(r)
  );

export const getBlogArticle = (slug: string) =>
  apiFetch(`${BASE}/api/blog/${slug}`).then((r) =>
    json<{ article: BlogArticle }>(r)
  );

// ─── Auth: bookmarks ─────────────────────────────────────────────────────────

export const getMyBookmarks = () =>
  authFetch(`${BASE}/api/blog/bookmarks/list`).then((r) =>
    json<{ articles: BlogArticle[] }>(r)
  );

export const toggleBookmark = (articleId: string) =>
  authFetch(`${BASE}/api/blog/bookmarks/${articleId}`, { method: 'POST' }).then((r) =>
    json<{ bookmarked: boolean }>(r)
  );

export const getBookmarkStatus = (articleId: string) =>
  authFetch(`${BASE}/api/blog/bookmarks/status/${articleId}`).then((r) =>
    json<{ bookmarked: boolean }>(r)
  );

// ─── Auth: likes ─────────────────────────────────────────────────────────────

export const toggleLike = (articleId: string) =>
  authFetch(`${BASE}/api/blog/likes/${articleId}`, { method: 'POST' }).then((r) =>
    json<{ liked: boolean; likeCount: number }>(r)
  );

export const getLikeStatus = (articleId: string) =>
  authFetch(`${BASE}/api/blog/likes/status/${articleId}`).then((r) =>
    json<{ liked: boolean }>(r)
  );
