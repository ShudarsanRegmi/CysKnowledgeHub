import React, { useState, useEffect, useCallback } from 'react';
import {
  Terminal, BookOpen, Tag, Calendar, User, ChevronRight,
  ArrowLeft, Loader2, AlertCircle, Search, Hash, FileText,
  Sword, Trophy, Flag, ShieldCheck, Layers, BarChart3, RefreshCw
} from 'lucide-react';
import NovelRenderer from './NovelRenderer';
import { getTopics, getArticlesByTopic, getArticle, getGroupedContent, Topic, Article } from '../services/ctfApi';
import { getWriteups, getWriteupsByCategory, getWriteup, getWriteupsByEvent, Writeup, WriteupCategory, WriteupDifficulty } from '../services/writeupApi';

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
        Back to CTF Guides
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

      <div className="mt-6">
        <NovelRenderer
          content={article.content}
          contentType={(article as any).contentType ?? 'markdown'}
        />
      </div>
    </div>
  );
};

// ─── Writeup detail view ──────────────────────────────────────────────────────

const WriteupDetail: React.FC<{
  slug: string;
  onBack: () => void;
}> = ({ slug, onBack }) => {
  const [writeup, setWriteup] = useState<Writeup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getWriteup(slug)
      .then(({ writeup }) => setWriteup(writeup))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  if (error || !writeup) return (
    <div className="flex flex-col items-center gap-3 py-20 text-gray-500">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p>{error ?? 'Writeup not found'}</p>
      <button onClick={onBack} className="text-cyan-500 hover:underline text-sm">Go back</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto" data-color-mode="dark">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to writeups
      </button>

      {/* Metadata Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {writeup.eventName}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${writeup.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
            writeup.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
            {writeup.difficulty}
          </span>
          <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-gray-700">
            {writeup.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{writeup.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-cyan-500" />
            </div>
            <span>{writeup.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(writeup.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 prose prose-invert max-w-none">
        <NovelRenderer
          content={writeup.content}
          contentType={writeup.contentType}
        />
      </div>
    </div>
  );
};

const CATEGORY_ICONS: Record<string, any> = {
  web: ShieldCheck,
  crypto: Flag,
  pwn: Sword,
  rev: RefreshCw,
  forensics: Search,
  misc: Hash,
};

// ─── Animations ───────────────────────────────────────────────────────────────

const FADE_IN_ANIMATION = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out both;
  }
  .shimmer-bg {
    background: linear-gradient(90deg, 
      rgba(255,255,255,0.02) 25%, 
      rgba(255,255,255,0.06) 50%, 
      rgba(255,255,255,0.02) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite linear;
  }
`;

// ─── Loading Skeletons ───────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-[360px] flex flex-col">
    <div className="h-44 shimmer-bg" />
    <div className="p-6 space-y-4 flex-1">
      <div className="h-4 w-2/3 rounded-lg shimmer-bg" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded-lg shimmer-bg" />
        <div className="h-4 w-5/6 rounded-lg shimmer-bg" />
      </div>
      <div className="pt-4 flex gap-2">
        <div className="h-3 w-12 rounded-full shimmer-bg" />
        <div className="h-3 w-12 rounded-full shimmer-bg" />
      </div>
    </div>
    <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
      <div className="h-4 w-20 rounded-lg shimmer-bg" />
      <div className="h-4 w-12 rounded-lg shimmer-bg" />
    </div>
  </div>
);

// ─── Main CTF Hub Page ────────────────────────────────────────────────────────

const CTFPage: React.FC = () => {
  const [mode, setMode] = useState<'guides' | 'writeups'>('guides');

  // Guides state
  const [topics, setTopics] = useState<(Topic & { articles?: Article[] })[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic | 'all'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<{ topicSlug: string; articleSlug: string } | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // Writeups state
  const [writeups, setWriteups] = useState<Writeup[]>([]);
  const [activeCategory, setActiveCategory] = useState<WriteupCategory | 'all'>('all');
  const [activeEvent, setActiveEvent] = useState<string | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<WriteupDifficulty | 'all'>('all');
  const [selectedWriteup, setSelectedWriteup] = useState<string | null>(null); // slug
  const [loadingWriteups, setLoadingWriteups] = useState(false);
  const [writeupCategories, setWriteupCategories] = useState<{ id: string; label: string; icon: any }[]>([]);

  // Derived events list from currently visible writeups OR we could fetch them
  const [events, setEvents] = useState<string[]>([]);

  const [search, setSearch] = useState('');

  // Fetch topics (guides) & writeup categories
  useEffect(() => {
    if (mode === 'guides' && (topics.length === 0 || topics[0].articles === undefined)) {
      setLoadingTopics(true);
      getGroupedContent('ctf')
        .then(({ topics }) => {
          setTopics(topics);
          // If we are in "all" or specific topic, we have the data now
        })
        .catch((err) => setTopicsError(err.message))
        .finally(() => setLoadingTopics(false));
    }

    if (mode === 'writeups' && writeupCategories.length === 0) {
      getTopics('writeup').then(({ topics }) => {
        const dynamicCats = topics.map(t => ({
          id: t.title.toLowerCase(),
          label: t.title,
          icon: CATEGORY_ICONS[t.title.toLowerCase()] || Hash
        }));
        setWriteupCategories([{ id: 'all', label: 'All Categories', icon: Layers }, ...dynamicCats]);
      }).catch(() => {
        // Fallback if no topics found
        setWriteupCategories([
          { id: 'all', label: 'All Categories', icon: Layers },
          { id: 'web', label: 'Web Security', icon: ShieldCheck },
          { id: 'crypto', label: 'Cryptography', icon: Flag },
          { id: 'pwn', label: 'Binary Exploitation', icon: Sword },
          { id: 'rev', label: 'Reverse Engineering', icon: RefreshCw },
          { id: 'forensics', label: 'Digital Forensics', icon: Search },
          { id: 'misc', label: 'Miscellaneous', icon: Hash },
        ]);
      });
    }
  }, [mode, topics.length, writeupCategories.length]);

  // Fetch writeups based on filters
  useEffect(() => {
    if (mode === 'writeups') {
      setLoadingWriteups(true);

      let promise;
      if (activeEvent !== 'all') {
        const eventSlug = activeEvent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        promise = getWriteupsByEvent(eventSlug);
      } else if (activeCategory !== 'all') {
        promise = getWriteupsByCategory(activeCategory);
      } else {
        promise = getWriteups();
      }

      promise
        .then(({ writeups }) => {
          setWriteups(writeups);
          // Update unique events list based on what we just fetched if we are in "all" or "category" mode
          if (activeEvent === 'all') {
            const uniqueEvs = Array.from(new Set(writeups.map(w => w.eventName))).sort() as string[];
            setEvents(uniqueEvs);
          }
        })
        .catch(() => setWriteups([]))
        .finally(() => setLoadingWriteups(false));
    }
  }, [mode, activeCategory, activeEvent]);

  // Handle filtering/articles when active topic changes
  useEffect(() => {
    if (mode !== 'guides') return;
    if (activeTopic === 'all') {
      // Flatten all articles from all topics
      const all = topics.flatMap(t => t.articles || []);
      setArticles(all);
    } else {
      const found = topics.find(t => t._id === activeTopic._id);
      if (found && found.articles) {
        setArticles(found.articles);
      } else if (activeTopic) {
        setLoadingArticles(true);
        getArticlesByTopic(activeTopic.slug)
          .then(({ articles }) => setArticles(articles))
          .catch(() => setArticles([]))
          .finally(() => setLoadingArticles(false));
      }
    }
  }, [activeTopic, mode, topics]);

  const filteredArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredWriteups = writeups.filter(
    (w) => (
      (difficultyFilter === 'all' || w.difficulty === difficultyFilter) &&
      (w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.eventName.toLowerCase().includes(search.toLowerCase()) ||
        w.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    )
  );

  const handleSelectTopic = useCallback((topic: Topic | 'all') => {
    setActiveTopic(topic);
    setSelectedArticle(null);
  }, []);

  // ── Detail views ──────────────────────────────────────────────────────────

  if (selectedArticle) {
    return (
      <div className="max-w-7xl mx-auto">
        <ArticleDetail
          topicSlug={selectedArticle.topicSlug}
          articleSlug={selectedArticle.articleSlug}
          onBack={() => setSelectedArticle(null)}
        />
      </div>
    );
  }

  if (selectedWriteup) {
    return (
      <div className="max-w-7xl mx-auto">
        <WriteupDetail
          slug={selectedWriteup}
          onBack={() => setSelectedWriteup(null)}
        />
      </div>
    );
  }

  // ── Main list view ────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <style>{FADE_IN_ANIMATION}</style>

      {/* ── Left sidebar ───────────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pb-6 custom-scrollbar">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2">
              {mode === 'guides' ? (
                <BookOpen className="w-4 h-4 text-cyan-500" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {mode === 'guides' ? 'Guide Topics' : 'Categories'}
              </span>
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {mode === 'guides' ? (
              loadingTopics ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                </div>
              ) : topicsError ? (
                <p className="text-xs text-red-400 px-3">{topicsError}</p>
              ) : (
                <>
                  <button
                    onClick={() => handleSelectTopic('all')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${activeTopic === 'all'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                      }`}
                  >
                    <span>All Guides</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-all ${activeTopic === 'all' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => handleSelectTopic(t)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${(activeTopic !== 'all' && activeTopic?._id === t._id)
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                        }`}
                    >
                      <span className="truncate pr-2">{t.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-all ${(activeTopic !== 'all' && activeTopic?._id === t._id) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                    </button>
                  ))}
                </>
              )
            ) : (
              <div className="space-y-6">
                <div>
                  {writeupCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setActiveEvent('all'); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${activeCategory === cat.id && activeEvent === 'all'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                        }`}
                    >
                      <cat.icon className={`w-4 h-4 ${activeCategory === cat.id && activeEvent === 'all' ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {events.length > 0 && (
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 px-3 mb-2">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Recent Events</span>
                    </div>
                    {events.map((ev) => (
                      <button
                        key={ev}
                        onClick={() => { setActiveEvent(ev); setActiveCategory('all'); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] transition-all flex items-center justify-between group ${activeEvent === ev
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                          }`}
                      >
                        <span className="truncate pr-2">{ev}</span>
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-opacity ${activeEvent === ev ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main
        key={`${mode}-${activeTopic === 'all' ? 'all' : (activeTopic as Topic)?._id}-${activeCategory}`}
        className="flex-1 min-w-0 space-y-8"
      >

        {/* Top Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                CTF <span className="text-cyan-500">Vault</span>
              </h1>
              <p className="text-gray-500 text-sm max-w-lg">
                {mode === 'guides'
                  ? 'Access professional learning paths and cybersecurity documentation.'
                  : 'Browse capture-the-flag challenge solutions and competition writeups.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-gray-900 border border-gray-800 rounded-2xl">
              <button
                onClick={() => setMode('guides')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'guides'
                  ? 'bg-gray-800 text-cyan-400 shadow-xl'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <BookOpen className="w-4 h-4" />
                Guides
              </button>
              <button
                onClick={() => setMode('writeups')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'writeups'
                  ? 'bg-gray-800 text-cyan-400 shadow-xl'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <Flag className="w-4 h-4" />
                Writeups
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within:text-cyan-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={mode === 'guides' ? "Search CTF guides..." : "Search challenges, events, or tags..."}
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
              />
            </div>

            {/* Difficulty Chips (Writeups only) */}
            {mode === 'writeups' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mr-2">Difficulty:</span>
                {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${difficultyFilter === diff
                      ? diff === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/40' :
                        diff === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40' :
                          diff === 'hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/40' :
                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                      : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-700'
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List Content */}
        {mode === 'guides' ? (
          <div>
            {!activeTopic ? (
              <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-600 font-medium">Select a topic from the sidebar to browse guides.</p>
              </div>
            ) : loadingArticles ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                <p className="text-gray-600 font-medium">No guides found in this topic.</p>
              </div>
            ) : (
              <div 
                key={`${activeTopic === 'all' ? 'all' : (activeTopic as Topic)?._id}-${search}-${filteredArticles.length}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredArticles.map((a, idx) => (
                  <button
                    key={a._id}
                    style={{ animationDelay: `${(idx + 1) * 500}ms` }}
                    onClick={() => {
                      const topicSlug = typeof a.topicId === 'object'
                        ? (a.topicId as any).slug
                        : topics.find(t => t._id === a.topicId)?.slug || (activeTopic !== 'all' ? activeTopic.slug : '');
                      setSelectedArticle({ topicSlug, articleSlug: a.slug });
                    }}
                    className="text-left bg-gray-900 border border-gray-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all group hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/5 animate-fadeIn"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {a.coverImage ? (
                        <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/20">
                          {typeof a.topicId === 'object' ? (a.topicId as any).title : topics.find(t => t._id === a.topicId)?.title || 'Guide'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col h-[180px]">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                        {a.title}
                      </h3>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-cyan-500/60" />{a.authorName}
                          </span>
                          {a.publishedAt && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-cyan-500">
                        Read Guide <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Writeups View */
          <div>
            {loadingWriteups ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredWriteups.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                <Sword className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-600 font-medium">No writeups matching your search or filters.</p>
              </div>
            ) : (
              <div 
                key={`${activeCategory}-${activeEvent}-${difficultyFilter}-${search}-${filteredWriteups.length}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredWriteups.map((w, idx) => (
                  <button
                    key={w._id}
                    style={{ animationDelay: `${(idx + 1) * 500}ms` }}
                    onClick={() => setSelectedWriteup(w.slug)}
                    className="text-left bg-gray-900 border border-gray-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all group hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/5 flex flex-col animate-fadeIn"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-cyan-500/10">
                            {w.eventName}
                          </span>
                          <span className="bg-gray-800 text-gray-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                            {w.category}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[10px] font-bold uppercase ${w.difficulty === 'hard' ? 'text-orange-500' :
                            w.difficulty === 'medium' ? 'text-yellow-500' :
                              'text-green-500'
                            }`}>
                            {w.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                        {w.title}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {w.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] bg-gray-950 text-gray-500 px-2 py-0.5 rounded-full border border-gray-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                          <User className="w-3 h-3" />
                        </div>
                        {w.authorName}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-500">
                        View Writeup <Flag className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CTFPage;
