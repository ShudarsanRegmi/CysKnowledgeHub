import React from 'react';
import { User, Clock, Bookmark, BookmarkCheck, Hash, Heart, Eye } from 'lucide-react';
import type { BlogArticle } from '../services/blogApi';
import { readingTime, excerptFromContent } from './NovelRenderer';

interface BlogArticleCardProps {
  article: BlogArticle;
  onRead: (article: BlogArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string) => void;
  isLiked?: boolean;
  likeCount?: number;
  onToggleLike?: (articleId: string) => void;
}

// Deterministic gradient based on article id for cover placeholder
function placeholderGradient(id: string): string {
  const gradients = [
    'from-cyan-900/50 to-blue-900/50',
    'from-indigo-900/50 to-cyan-900/40',
    'from-emerald-900/40 to-cyan-900/40',
    'from-violet-900/50 to-indigo-900/40',
    'from-sky-900/50 to-indigo-900/50',
  ];
  const idx = id.charCodeAt(id.length - 1) % gradients.length;
  return gradients[idx];
}

const BlogArticleCard: React.FC<BlogArticleCardProps> = ({
  article,
  onRead,
  isBookmarked = false,
  onToggleBookmark,
  isLiked = false,
  likeCount = article.likeCount ?? 0,
  onToggleLike,
}) => {
  // Reading time requires full content — only available on article detail, not feed
  const mins = article.content ? readingTime(article.content, article.contentType) : null;
  const preview =
    article.excerpt ||
    (article.content
      ? excerptFromContent(article.content, article.contentType, 160)
      : '');

  const pubDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-200 group flex flex-col">
      {/* Cover */}
      <div
        className="relative cursor-pointer"
        onClick={() => onRead(article)}
      >
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-44 bg-gradient-to-br ${placeholderGradient(article._id)} flex items-center justify-center`}
          >
            <span className="text-5xl font-black text-white/10 select-none uppercase">
              {article.title.slice(0, 2)}
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-gray-900/80 backdrop-blur-sm text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/30">
          {article.topicId?.title ?? 'Blog'}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        {/* Title */}
        <h3
          onClick={() => onRead(article)}
          className="text-base font-bold leading-snug mb-2 cursor-pointer group-hover:text-cyan-400 transition-colors line-clamp-2"
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {preview && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3 flex-1">
            {preview}
          </p>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="flex items-center gap-0.5 text-[10px] text-cyan-400/70 bg-cyan-900/20 border border-cyan-500/20 px-2 py-0.5 rounded-full"
              >
                <Hash className="w-2.5 h-2.5" />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
          {/* Left — author + date + reading time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
            <User className="w-3 h-3 text-cyan-500 flex-shrink-0" />
            <span className="truncate max-w-[90px]">{article.authorName}</span>
            {pubDate && (
              <>
                <span className="text-gray-700">·</span>
                <span className="flex-shrink-0">{pubDate}</span>
              </>
            )}
            {mins !== null && (
              <>
                <span className="text-gray-700">·</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {mins} min
                </span>
              </>
            )}
          </div>

          {/* Right — engagement actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Views */}
            {(article.viewCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600 px-1.5">
                <Eye className="w-3 h-3" />
                {article.viewCount}
              </span>
            )}

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike?.(article._id);
              }}
              disabled={!onToggleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                isLiked
                  ? 'text-rose-400 bg-rose-900/30 border border-rose-500/30'
                  : onToggleLike
                    ? 'text-gray-600 hover:text-rose-400 hover:bg-rose-900/20 border border-transparent'
                    : 'text-gray-700 border border-transparent cursor-default'
              }`}
              title={onToggleLike ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
            >
              <Heart className={`w-3.5 h-3.5 ${ isLiked ? 'fill-rose-400' : ''}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Bookmark */}
            {onToggleBookmark && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleBookmark(article._id); }}
                className={`p-1.5 rounded-lg transition-colors border ${
                  isBookmarked
                    ? 'text-cyan-400 bg-cyan-900/30 border-cyan-500/30'
                    : 'text-gray-600 hover:text-cyan-400 hover:bg-cyan-900/20 border-transparent'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Save to reading list'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-3.5 h-3.5" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticleCard;
