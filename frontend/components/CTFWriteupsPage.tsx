import React, { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
  Terminal, BookOpen, Tag, Calendar, User, ChevronRight,
  ArrowLeft, Loader2, AlertCircle, Search, Hash, FileText,
} from 'lucide-react';
import { getTopics, getArticlesByTopic, getArticle, Topic, Article } from '../services/ctfApi';

// ─── Article detail view ──────────────────────────────────────────────────────

const ArticleDetail: React.FC<{
  topicSlug: string;
  articleSlug: string;
  onBack: () => void;
}> = ({ topicSlug, articleSlug, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getArticle(topicSlug, articleSlug)
      .then(({ article }) => setArticle(article))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicSlug, articleSlug]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
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

  return (
    <div className="max-w-3xl mx-auto" data-color-mode="dark">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </button>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 object-cover rounded-2xl mb-8 border border-gray-800"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-cyan-500" />
          {article.authorName}
        </span>
        {article.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </span>
        )}
        {article.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-xs bg-gray-800/80 px-2 py-0.5 rounded-full text-cyan-400/80 border border-cyan-500/20">
            <Hash className="w-2.5 h-2.5" />{tag}
          </span>
        ))}
      </div>

      <div className="prose prose-invert max-w-none">
        <MDEditor.Markdown source={article.content} style={{ background: 'transparent', color: '#e5e7eb', fontSize: 15, lineHeight: 1.7 }} />
      </div>
    </div>
  );
};

// ─── Main CTF Writeups Page ───────────────────────────────────────────────────

const CTFWriteupsPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<{ topicSlug: string; articleSlug: string } | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [search, setSearch] = useState('');
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // Fetch topics on mount
  useEffect(() => {
    getTopics('ctf')
      .then(({ topics }) => {
        setTopics(topics);
        if (topics.length > 0) setActiveTopic(topics[0]);
      })
      .catch((err) => setTopicsError(err.message))
      .finally(() => setLoadingTopics(false));
  }, []);

  // Fetch articles when active topic changes
  useEffect(() => {
    if (!activeTopic) return;
    setLoadingArticles(true);
    setSearch('');
    setSelectedArticle(null);
    getArticlesByTopic(activeTopic.slug)
      .then(({ articles }) => setArticles(articles))
      .catch(() => setArticles([]))
      .finally(() => setLoadingArticles(false));
  }, [activeTopic]);

  const filteredArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectTopic = useCallback((topic: Topic) => {
    setActiveTopic(topic);
    setSelectedArticle(null);
  }, []);

  // ── Article detail view ──────────────────────────────────────────────────
  if (selectedArticle) {
    return (
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar stays visible */}
        <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto space-y-1 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 py-2">Topics</p>
          {topics.map((t) => (
            <button
              key={t._id}
              onClick={() => handleSelectTopic(t)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                activeTopic?._id === t._id
                  ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {t.title}
            </button>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <ArticleDetail
            topicSlug={selectedArticle.topicSlug}
            articleSlug={selectedArticle.articleSlug}
            onBack={() => setSelectedArticle(null)}
          />
        </main>
      </div>
    );
  }

  // ── Article list view ────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto flex gap-8">

      {/* ── Left sidebar: topics ───────────────────────────────────────────── */}
      <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Topics</span>
        </div>

        {loadingTopics ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
          </div>
        ) : topicsError ? (
          <p className="text-xs text-red-400 px-3">{topicsError}</p>
        ) : topics.length === 0 ? (
          <p className="text-xs text-gray-600 px-3">No topics yet.</p>
        ) : (
          <nav className="space-y-0.5">
            {topics.map((t) => (
              <button
                key={t._id}
                onClick={() => handleSelectTopic(t)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${
                  activeTopic?._id === t._id
                    ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span>{t.title}</span>
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${activeTopic?._id === t._id ? 'opacity-100 text-cyan-500' : ''}`} />
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* ── Main content: articles ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 space-y-6">

        {/* Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">CTF Writeups</h1>
              {activeTopic && (
                <p className="text-gray-400 mt-1 text-sm">
                  {activeTopic.description || `Writeups tagged under "${activeTopic.title}"`}
                </p>
              )}
            </div>

            {/* Mobile topic picker */}
            <select
              value={activeTopic?._id ?? ''}
              onChange={(e) => {
                const t = topics.find((x) => x._id === e.target.value);
                if (t) handleSelectTopic(t);
              }}
              className="lg:hidden bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              {topics.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
          </div>

          {/* Search */}
          {activeTopic && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles or tags…"
                className="w-full sm:w-72 bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600"
              />
            </div>
          )}
        </div>

        {/* Content */}
        {!activeTopic ? (
          <div className="text-center py-20 text-gray-600">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Select a topic to browse articles.</p>
          </div>
        ) : loadingArticles ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search ? 'No articles match your search.' : 'No published articles in this topic yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelectedArticle({ topicSlug: activeTopic.slug, articleSlug: a.slug })}
                className="text-left bg-gray-900 border border-gray-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all group"
              >
                {a.coverImage && (
                  <img src={a.coverImage} alt={a.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-500/60" />{a.authorName}
                    </span>
                    {a.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {a.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {a.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-gray-800 text-cyan-400/70 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-500 group-hover:gap-2 transition-all">
                    Read writeup <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CTFWriteupsPage;
