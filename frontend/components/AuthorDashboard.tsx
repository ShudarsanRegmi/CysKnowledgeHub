import React, { useState, useEffect, useCallback } from 'react';
import {
  PenLine, Plus, Trash2, Send, Clock, CheckCircle2, XCircle,
  Eye, FileText, Loader2, AlertCircle, ArrowLeft, RefreshCw,
} from 'lucide-react';
import ArticleEditor from './ArticleEditor';
import {
  getMyArticles, createArticle, updateArticle, deleteArticle,
  submitArticle, getArticleForEdit, getTopics, Article, Topic,
} from '../services/ctfApi';

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; icon: React.FC<any> }> = {
  draft:     { label: 'Draft',     color: 'text-gray-400 bg-gray-800/60 border-gray-700',       icon: FileText },
  pending:   { label: 'Pending',   color: 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50', icon: Clock },
  approved:  { label: 'Approved',  color: 'text-indigo-400 bg-indigo-900/30 border-indigo-700/50', icon: CheckCircle2 },
  published: { label: 'Published', color: 'text-cyan-400 bg-cyan-900/30 border-cyan-700/50',     icon: CheckCircle2 },
  rejected:  { label: 'Rejected',  color: 'text-red-400 bg-red-900/30 border-red-700/50',        icon: XCircle },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

type View = 'list' | 'new' | 'edit';

const AuthorDashboard: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ articles }, { topics }] = await Promise.all([getMyArticles(), getTopics()]);
      setArticles(articles);
      setTopics(topics);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Save draft ─────────────────────────────────────────────────────────────
  const handleSave = async (data: {
    title: string; topicId: string; content: string; coverImage: string; tags: string[];
  }) => {
    setIsSaving(true);
    try {
      if (editingArticle) {
        const { article } = await updateArticle(editingArticle._id, data);
        setEditingArticle(article);
        flash('Draft saved.');
      } else {
        const { article } = await createArticle(data);
        setEditingArticle(article);
        setView('edit');
        flash('Article created as draft.');
      }
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Submit for review ──────────────────────────────────────────────────────
  // Works in both "edit" mode (already has a draft) and "new" mode (no draft yet).
  // In new mode the article is created first, then immediately submitted.
  const handleSubmit = async (data: {
    title: string; topicId: string; content: string; coverImage: string; tags: string[];
  }) => {
    setIsSubmitting(true);
    try {
      let articleId = editingArticle?._id;
      if (!articleId) {
        // No draft exists yet — create it silently, then submit
        const { article: created } = await createArticle(data);
        articleId = created._id;
        setEditingArticle(created);
      }
      await submitArticle(articleId);
      flash('Article submitted for review.');
      await loadData();
      setView('list');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit article ───────────────────────────────────────────────────────────
  const handleEdit = async (articleId: string) => {
    try {
      const { article } = await getArticleForEdit(articleId);
      setEditingArticle(article);
      setView('edit');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Delete article ─────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      await loadData();
      flash('Article deleted.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (view === 'new' || view === 'edit') {
    const article = editingArticle;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => { setView('list'); setEditingArticle(null); }}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to My Articles
        </button>

        <div className="flex items-center gap-3">
          <PenLine className="w-5 h-5 text-cyan-500" />
          <h1 className="text-2xl font-bold">
            {view === 'new' ? 'New CTF Article' : 'Edit Article'}
          </h1>
          {article && <StatusBadge status={article.status} />}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-700/40 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-gray-500 hover:text-white">✕</button>
          </div>
        )}
        {successMsg && (
          <div className="text-sm text-green-400 bg-green-950/30 border border-green-700/40 rounded-xl px-4 py-3">
            ✓ {successMsg}
          </div>
        )}

        <ArticleEditor
          topics={topics}
          initialTitle={article?.title}
          initialContent={article?.content}
          initialCoverImage={article?.coverImage}
          initialTopicId={typeof article?.topicId === 'object' ? (article.topicId as any)._id : article?.topicId}
          initialTags={article?.tags}
          articleStatus={article?.status ?? 'draft'}
          rejectionReason={article?.rejectionReason}
          onSave={handleSave}
          onSubmit={handleSubmit}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // ── Article list ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PenLine className="w-5 h-5 text-cyan-500" />
          <h1 className="text-2xl font-bold">My Articles</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setEditingArticle(null); setView('new'); }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-700/40 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4" />{error}
          <button onClick={() => setError(null)} className="ml-auto text-gray-500 hover:text-white">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="text-sm text-green-400 bg-green-950/30 border border-green-700/40 rounded-xl px-4 py-3">
          ✓ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>You haven't written any articles yet.</p>
          <button
            onClick={() => { setEditingArticle(null); setView('new'); }}
            className="mt-4 text-cyan-500 hover:underline text-sm"
          >
            Write your first article →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => {
            const topicTitle = typeof a.topicId === 'object' ? (a.topicId as any).title : topics.find((t) => t._id === a.topicId)?.title ?? '—';
            const canDelete = ['draft', 'rejected'].includes(a.status);
            const canEdit   = ['draft', 'rejected'].includes(a.status);

            return (
              <div
                key={a._id}
                className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl px-5 py-4 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white truncate">{a.title}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="mr-3">Topic: <span className="text-gray-400">{topicTitle}</span></span>
                    <span>Updated: {new Date(a.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {a.status === 'rejected' && a.rejectionReason && (
                    <p className="text-xs text-red-400 mt-1.5">
                      Rejected: {a.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(a._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      <PenLine className="w-3 h-3" /> Edit
                    </button>
                  )}
                  {a.status === 'approved' && (
                    <button
                      onClick={() => handleEdit(a._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  )}
                  {a.status === 'published' && (
                    <button
                      onClick={() => handleEdit(a._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(a._id)}
                      disabled={deletingId === a._id}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === a._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
