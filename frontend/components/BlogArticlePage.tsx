import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, User, Calendar, Clock, Hash,
  Heart, Bookmark, BookmarkCheck, Eye, Loader2, AlertCircle,
} from 'lucide-react';
import NovelRenderer, { readingTime } from './NovelRenderer';
import {
  getBlogArticle, toggleLike, toggleBookmark,
  getLikeStatus, getBookmarkStatus, type BlogArticle,
} from '../services/blogApi';
import { useAuth } from '../contexts/AuthContext';

interface BlogArticlePageProps {
  slug: string;
  onBack: () => void;
  onBookmarkChange?: (articleId: string, bookmarked: boolean) => void;
}

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug, onBack, onBookmarkChange }) => {
  const { user } = useAuth();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Engagement state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Load article
  useEffect(() => {
    setLoading(true);
    setError(null);
    getBlogArticle(slug)
      .then(({ article }) => {
        setArticle(article);
        setLikeCount(article.likeCount ?? 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Load engagement status for logged-in users
  useEffect(() => {
    if (!user || !article) return;
    getLikeStatus(article._id)
      .then(({ liked }) => setLiked(liked))
      .catch(() => {});
    getBookmarkStatus(article._id)
      .then(({ bookmarked }) => setBookmarked(bookmarked))
      .catch(() => {});
  }, [user, article]);

  const handleLike = async () => {
    if (!user || !article || likeLoading) return;
    setLikeLoading(true);
    try {
      const data = await toggleLike(article._id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch { /* silent */ }
    finally { setLikeLoading(false); }
  };

  const handleBookmark = async () => {
    if (!user || !article || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      const data = await toggleBookmark(article._id);
      setBookmarked(data.bookmarked);
      onBookmarkChange?.(article._id, data.bookmarked);
    } catch { /* silent */ }
    finally { setBookmarkLoading(false); }
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  if (error || !article) return (
    <div className="flex flex-col items-center gap-3 py-20 text-gray-500">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p>{error ?? 'Article not found'}</p>
      <button onClick={onBack} className="text-cyan-500 hover:underline text-sm">Go back</button>
    </div>
  );

  const mins = readingTime(article.content ?? '', article.contentType);
  const pubDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to feed
      </button>

      {/* Category + title */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">
          {(article.topicId as any)?.title ?? 'Blog'}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3 leading-tight">
          {article.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-500" />
            {article.authorName}
          </span>
          {pubDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {pubDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {mins} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            {article.viewCount ?? 0} views
          </span>
        </div>
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 object-cover rounded-2xl mb-8 border border-gray-800"
        />
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 text-xs text-cyan-400/80 bg-cyan-900/20 border border-cyan-500/20 px-3 py-1 rounded-full"
            >
              <Hash className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="mb-10">
        <NovelRenderer
          content={article.content ?? ''}
          contentType={article.contentType}
        />
      </div>

      {/* Engagement bar */}
      <div className="sticky bottom-6 flex items-center justify-between bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={!user || likeLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              liked
                ? 'bg-red-900/40 text-red-400 border border-red-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-red-900/30 hover:text-red-400 border border-gray-700'
            } disabled:opacity-50`}
            title={user ? 'Toggle like' : 'Sign in to like'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            disabled={!user || bookmarkLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              bookmarked
                ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-cyan-900/30 hover:text-cyan-400 border border-gray-700'
            } disabled:opacity-50`}
            title={user ? 'Toggle bookmark' : 'Sign in to bookmark'}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {!user && (
          <p className="text-xs text-gray-600">Sign in to like & bookmark</p>
        )}
      </div>
    </div>
  );
};

export default BlogArticlePage;
