import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Flame, TrendingUp, Tag, Loader2, AlertCircle,
  Bookmark, BookmarkCheck, Clock, User, Eye, LayoutList, Rss,
} from 'lucide-react';
import BlogArticleCard from './BlogArticleCard';
import BlogArticlePage from './BlogArticlePage';
import {
  getBlogFeed, getBlogCategories, getTrendingArticles, getPopularTags,
  toggleBookmark, getMyBookmarks, toggleLike,
  type BlogArticle, type BlogCategory, type PopularTag,
} from '../services/blogApi';
import { readingTime, excerptFromContent } from './NovelRenderer';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// ─── Trending card (right panel) ─────────────────────────────────────────────

const TrendingCard: React.FC<{
  article: BlogArticle;
  index: number;
  onRead: (article: BlogArticle) => void;
}> = ({ article, index, onRead }) => {
  // content is not returned by the trending endpoint; skip reading time
  const mins = article.content ? readingTime(article.content, article.contentType) : null;
  return (
    <button
      onClick={() => onRead(article)}
      className="w-full text-left flex gap-3 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/40 rounded-lg px-2 -mx-2 transition-colors group"
    >
      <span className="text-2xl font-black text-gray-800 group-hover:text-gray-700 w-6 flex-shrink-0 leading-tight">
        {index + 1}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
          <User className="w-2.5 h-2.5" />
          <span>{article.authorName}</span>
          {mins !== null && (
            <>
              <span>·</span>
              <Clock className="w-2.5 h-2.5" />
              <span>{mins} min</span>
            </>
          )}
          <span>·</span>
          <Eye className="w-2.5 h-2.5" />
          <span>{article.viewCount}</span>
        </div>
      </div>
    </button>
  );
};

const FADE_IN_ANIMATION = `
  @keyframes fadeInRise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeInRise 0.4s ease-out both;
  }
`;

const BlogSkeletonCard = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="w-full h-44 bg-gray-800/50" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-800/60 rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-800/40 rounded w-full" />
        <div className="h-3 bg-gray-800/40 rounded w-5/6" />
      </div>
      <div className="pt-3 border-t border-gray-800 flex justify-between">
        <div className="h-3 bg-gray-800/40 rounded w-1/3" />
        <div className="h-3 bg-gray-800/40 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const LIMIT = 8;

const BlogPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const handleWriteForUs = () => navigate('/author-dashboard');

  // Filter / search state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input 350ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('');
  const [sortMode, setSortMode] = useState<'latest' | 'trending'>('latest');

  // Data
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<BlogArticle[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<BlogArticle[]>([]);

  // Likes (optimistic, session-scoped — no per-article prefetch to avoid N requests)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(new Map());

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Load sidebar data (once) ──────────────────────────────────────────────
  useEffect(() => {
    setSidebarLoading(true);
    Promise.all([getBlogCategories(), getTrendingArticles(), getPopularTags()])
      .then(([{ categories }, { articles }, { tags }]) => {
        setCategories(categories);
        setTrendingArticles(articles);
        setPopularTags(tags);
      })
      .catch(console.error)
      .finally(() => setSidebarLoading(false));
  }, []);

  // ── Load user bookmarks when logged in ────────────────────────────────────
  useEffect(() => {
    if (!user) { setBookmarkedIds(new Set()); setBookmarkedArticles([]); return; }
    getMyBookmarks()
      .then(({ articles }) => {
        setBookmarkedIds(new Set(articles.map((a) => a._id)));
        setBookmarkedArticles(articles);
      })
      .catch(() => {});
  }, [user]);

  // ── Fetch feed (reset on filter change) ──────────────────────────────────
  const fetchFeed = useCallback(
    async (pg: number, reset: boolean) => {
      if (reset) setInitialLoading(true);
      else setLoadingMore(true);
      setFeedError(null);
      try {
        const { articles: incoming, pagination } = await getBlogFeed({
          page: pg,
          limit: LIMIT,
          topicId: activeCategory || undefined,
          tag: activeTag || undefined,
          sort: sortMode,
          search: debouncedSearch || undefined,
        });
        setArticles((prev) => (reset ? incoming : [...prev, ...incoming]));
        setHasMore(pagination.hasMore);
        setPage(pg);
      } catch (err: any) {
        setFeedError(err.message ?? 'Failed to load articles');
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, activeTag, sortMode, debouncedSearch]
  );

  // Reset + refetch on filter change
  useEffect(() => {
    fetchFeed(1, true);
  }, [fetchFeed]);

  // ── Infinite scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !initialLoading) {
          fetchFeed(page + 1, false);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, initialLoading, page, fetchFeed]);

  // ── Bookmark toggle ───────────────────────────────────────────────────────
  const handleToggleBookmark = async (articleId: string) => {
    if (!user) return;
    try {
      const { bookmarked } = await toggleBookmark(articleId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (bookmarked) next.add(articleId);
        else next.delete(articleId);
        return next;
      });
      setBookmarkedArticles((prev) => {
        if (bookmarked) {
          const art = articles.find((a) => a._id === articleId);
          return art && !prev.some((a) => a._id === articleId) ? [art, ...prev] : prev;
        }
        return prev.filter((a) => a._id !== articleId);
      });
    } catch { /* silent */ }
  };

  // ── Like toggle ───────────────────────────────────────────────────────────
  const handleToggleLike = async (articleId: string) => {
    if (!user) return;
    const wasLiked = likedIds.has(articleId);
    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(articleId); else next.add(articleId);
      return next;
    });
    setLikeCounts((prev) => {
      const next = new Map(prev);
      const current = next.get(articleId) ?? (articles.find((a) => a._id === articleId)?.likeCount ?? 0);
      next.set(articleId, Math.max(0, current + (wasLiked ? -1 : 1)));
      return next;
    });
    try {
      const { liked, likeCount } = await toggleLike(articleId);
      // Reconcile with server truth
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (liked) next.add(articleId); else next.delete(articleId);
        return next;
      });
      setLikeCounts((prev) => new Map(prev).set(articleId, likeCount));
    } catch {
      // Roll back optimistic update on error
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(articleId); else next.delete(articleId);
        return next;
      });
    }
  };

  // ── If a slug param is active, show article detail ────────────────────────
  // ── Sync bookmark state when returning from article detail ────────────────
  const handleArticleBookmarkChange = useCallback(
    (articleId: string, isBookmarked: boolean) => {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(articleId);
        else next.delete(articleId);
        return next;
      });
      setBookmarkedArticles((prev) => {
        if (isBookmarked) {
          const art = articles.find((a) => a._id === articleId);
          return art && !prev.some((a) => a._id === articleId) ? [art, ...prev] : prev;
        }
        return prev.filter((a) => a._id !== articleId);
      });
    },
    [articles]
  );

  if (slug) {
    return (
      <BlogArticlePage
        slug={slug}
        onBack={() => navigate('/blogs')}
        onBookmarkChange={handleArticleBookmarkChange}
      />
    );
  }

  return (
    <div className="flex gap-6 min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════
          LEFT COLUMN — Filter Panel (sticky)
      ═══════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col gap-6 w-60 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600"
          />
        </div>

        {/* Sort */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1 mb-2">Sort by</p>
          {(['latest', 'trending'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                sortMode === mode
                  ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {mode === 'latest' ? <Rss className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {mode === 'latest' ? 'Latest' : 'Trending'}
            </button>
          ))}
        </div>

        {/* Categories */}
        {!sidebarLoading && categories.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1 mb-2">Categories</p>
            <button
              onClick={() => setActiveCategory('')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                !activeCategory
                  ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              All Posts
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(activeCategory === cat._id ? '' : cat._id)}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  activeCategory === cat._id
                    ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {!sidebarLoading && popularTags.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1 mb-3">Popular Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map(({ tag }) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    activeTag === tag
                      ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500/40'
                      : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-cyan-400 hover:border-cyan-500/30'
                  }`}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks shortcut — only shown when user has bookmarks */}
        {user && bookmarkedArticles.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-medium">Reading List</span>
              <span className="ml-auto text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 rounded-full px-1.5 py-0.5">
                {bookmarkedArticles.length}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5">
              Bookmarked articles appear here and in the right panel.
            </p>
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════
          CENTER COLUMN — Feed
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0">
        <style>{FADE_IN_ANIMATION}</style>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Security Blog</h1>
          <p className="text-gray-400 text-sm mt-1">
            Insights, writeups, and research from the community.
          </p>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600"
          />
        </div>

        {/* Active filters summary */}
        {(activeCategory || activeTag) && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-400 flex-wrap">
            <span>Filtering by:</span>
            {activeCategory && (
              <span className="flex items-center gap-1 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {categories.find((c) => c._id === activeCategory)?.title ?? activeCategory}
                <button onClick={() => setActiveCategory('')} className="ml-1 hover:text-red-400">✕</button>
              </span>
            )}
            {activeTag && (
              <span className="flex items-center gap-1 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                #{activeTag}
                <button onClick={() => setActiveTag('')} className="ml-1 hover:text-red-400">✕</button>
              </span>
            )}
          </div>
        )}

        {/* Feed cards */}
        {initialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <BlogSkeletonCard key={i} />
            ))}
          </div>
        ) : feedError ? (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-500">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p>{feedError}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-600">
            <Rss className="w-10 h-10 opacity-30" />
            <p className="text-lg font-semibold">No articles found</p>
            <p className="text-sm">
              {search ? 'Try a different search.' : 'Check back soon — content is on the way.'}
            </p>
          </div>
        ) : (
          <div
            key={`${activeCategory}-${activeTag}-${debouncedSearch}-${sortMode}`}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {articles.map((article, idx) => (
              <BlogArticleCard
                key={article._id}
                article={article}
                onRead={(a) => navigate(`/blogs/${a.slug}`)}
                isBookmarked={bookmarkedIds.has(article._id)}
                onToggleBookmark={user ? handleToggleBookmark : undefined}
                isLiked={likedIds.has(article._id)}
                likeCount={likeCounts.get(article._id) ?? article.likeCount ?? 0}
                onToggleLike={user ? handleToggleLike : undefined}
                className="animate-fadeIn"
                style={{ animationDelay: `${(idx + 1) * 300}ms` }}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4 mt-4" />

        {/* Load-more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-center text-xs text-gray-700 py-6">— You've reached the end —</p>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT COLUMN — Trending & Top Reads
      ═══════════════════════════════════════════════════════════════════ */}
      <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
        {/* Top Reads */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
              Trending This Month
            </h3>
          </div>
          {sidebarLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-500/50" />
            </div>
          ) : trendingArticles.length === 0 ? (
            <p className="text-xs text-gray-600 py-2">No trending articles yet.</p>
          ) : (
            trendingArticles.map((a, idx) => (
              <TrendingCard
                key={a._id}
                article={a}
                index={idx}
                onRead={(art) => navigate(`/blogs/${art.slug}`)}
              />
            ))
          )}
        </div>

        {/* Bookmarks panel */}
        {user && bookmarkedArticles.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                Reading List
              </h3>
              <span className="ml-auto text-xs text-cyan-400">{bookmarkedArticles.length}</span>
            </div>
            {bookmarkedArticles
              .slice(0, 5)
              .map((a) => (
                <button
                  key={a._id}
                  onClick={() => navigate(`/blogs/${a.slug}`)}
                  className="w-full text-left py-2 border-b border-gray-800 last:border-0 hover:text-cyan-400 transition-colors"
                >
                  <p className="text-xs text-gray-300 line-clamp-2 leading-snug">{a.title}</p>
                </button>
              ))}
          </div>
        )}

        {/* Write for us CTA — role-aware */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-2 text-cyan-300">Write for Us</h3>
          <p className="text-xs text-gray-400 mb-3">
            Share your research, writeups, or insights with the community.
          </p>
          {(role === 'author' || role === 'admin') ? (
            <button
              onClick={handleWriteForUs}
              className="block w-full text-center text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-3 py-2 transition-colors"
            >
              Go to Dashboard →
            </button>
          ) : user ? (
            <p className="text-[10px] text-gray-500 italic">
              Author access is required to publish. Contact an admin to request the author role.
            </p>
          ) : (
            <p className="text-[10px] text-gray-500 italic">
              Sign in with an author account to start writing.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default BlogPage;
