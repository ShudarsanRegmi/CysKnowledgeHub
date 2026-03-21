import React, { useState, useEffect, useCallback } from 'react';
import {
  PenLine, Plus, Trash2, Clock, CheckCircle2, XCircle,
  Eye, FileText, Loader2, AlertCircle, ArrowLeft, RefreshCw,
  BookOpen, Terminal, Tag, CalendarDays, LayoutGrid, Flag, Trophy
} from 'lucide-react';
import ArticleEditor from './ArticleEditor';
import WriteupEditor from './WriteupEditor';
import {
  getMyArticles, createArticle, updateArticle, deleteArticle,
  submitArticle, getArticleForEdit, getTopics, Article, Topic,
} from '../services/ctfApi';
import {
  getMyWriteups, createWriteup, updateWriteup, deleteWriteup, Writeup
} from '../services/writeupApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

// ─── Status badge ─────────────────────────────────────────────────────────────

const getStatusMeta = (status: string, isLight: boolean) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: isLight
        ? 'text-gray-700 bg-gray-100 border-gray-300'
        : 'text-gray-400 bg-gray-800/60 border-gray-700',
      icon: FileText
    },
    pending: {
      label: 'Pending',
      color: isLight
        ? 'text-yellow-700 bg-yellow-100 border-yellow-300'
        : 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50',
      icon: Clock
    },
    published: {
      label: 'Published',
      color: isLight
        ? 'text-cyan-700 bg-cyan-100 border-cyan-300'
        : 'text-cyan-400 bg-cyan-900/30 border-cyan-700/50',
      icon: CheckCircle2
    },
    rejected: {
      label: 'Rejected',
      color: isLight
        ? 'text-red-700 bg-red-100 border-red-300'
        : 'text-red-400 bg-red-950/30 border-red-700/50',
      icon: XCircle
    },
  };
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
};

const StatusBadge: React.FC<{ status: string; isLight: boolean }> = ({ status, isLight }) => {
  const meta = getStatusMeta(status, isLight);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

type View = 'list' | 'new' | 'edit' | 'new-writeup' | 'edit-writeup';
type TabMode = 'blog' | 'guides' | 'writeups';

const AuthorDashboard: React.FC = () => {
  const toast = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [view, setView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState<TabMode>('guides');
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Writeups state
  const [writeups, setWriteups] = useState<Writeup[]>([]);
  const [editingWriteup, setEditingWriteup] = useState<Writeup | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [artRes, topRes, wupRes] = await Promise.all([
        getMyArticles(), 
        getTopics(),
        getMyWriteups()
      ]);
      setArticles(artRes.articles);
      setTopics(topRes.topics);
      setWriteups(wupRes.writeups);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Article Handlers ───────────────────────────────────────────────────────
  const handleSaveArticle = async (data: any) => {
    setIsSaving(true);
    try {
      if (editingArticle) {
        const { article } = await updateArticle(editingArticle._id, data);
        setEditingArticle(article);
        toast.info('Draft saved.');
      } else {
        const { article } = await createArticle(data);
        setEditingArticle(article);
        setView('edit');
        toast.success('Article created as draft.');
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitArticle = async (data: any) => {
    setIsSubmitting(true);
    try {
      let articleId = editingArticle?._id;
      if (!articleId) {
        const { article: created } = await createArticle(data);
        articleId = created._id;
      }
      await submitArticle(articleId);
      toast.success('Article submitted for review.');
      await loadData();
      setView('list');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      await loadData();
      toast.success('Article deleted.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Writeup Handlers ───────────────────────────────────────────────────────
  const handleSaveWriteup = async (data: any) => {
    setIsSaving(true);
    try {
      if (editingWriteup) {
        const { writeup } = await updateWriteup(editingWriteup._id, { ...data, status: 'draft' });
        setEditingWriteup(writeup);
        toast.info('Draft saved.');
      } else {
        const { writeup } = await createWriteup({ ...data, status: 'draft' });
        setEditingWriteup(writeup);
        setView('edit-writeup');
        toast.success('Writeup created as draft.');
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitWriteup = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingWriteup) {
        await updateWriteup(editingWriteup._id, { ...data, status: 'pending' });
      } else {
        await createWriteup({ ...data, status: 'pending' });
      }
      toast.success('Writeup submitted for review.');
      await loadData();
      setView('list');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWriteup = async (id: string) => {
    if (!confirm('Delete this writeup?')) return;
    setDeletingId(id);
    try {
      await deleteWriteup(id);
      await loadData();
      toast.success('Writeup deleted.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (view === 'new-writeup' || view === 'edit-writeup') {
    return (
      <WriteupEditor
        initialData={editingWriteup}
        onSave={handleSaveWriteup}
        onSubmit={handleSubmitWriteup}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        onBack={() => { setView('list'); setEditingWriteup(null); }}
        onTopicCreated={loadData}
      />
    );
  }

  if (view === 'new' || view === 'edit') {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <button
            onClick={() => { setView('list'); setEditingArticle(null); }}
            className={`flex items-center gap-2 text-sm group transition-colors ${
              isLight ? 'text-gray-600 hover:text-cyan-600' : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
        <ArticleEditor
          topics={topics.filter(t => activeTab === 'blog' ? t.type === 'blog' : t.type === 'ctf')}
          isBlog={activeTab === 'blog'}
          initialTitle={editingArticle?.title}
          initialContent={editingArticle?.content}
          initialContentType={(editingArticle as any)?.contentType}
          initialCoverImage={editingArticle?.coverImage}
          initialTopicId={typeof editingArticle?.topicId === 'object' ? (editingArticle.topicId as any)._id : editingArticle?.topicId}
          initialTags={editingArticle?.tags}
          articleStatus={editingArticle?.status ?? 'draft'}
          onSave={handleSaveArticle}
          onSubmit={handleSubmitArticle}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  const tabContent = activeTab === 'writeups' 
    ? writeups 
    : articles.filter(a => {
        const topicType = typeof a.topicId === 'object' ? (a.topicId as any).type : null;
        return activeTab === 'blog' ? topicType === 'blog' : topicType === 'ctf';
      });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <PenLine className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Author Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your contributions to the Cys Knowledge Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="p-2.5 border border-gray-800 rounded-xl hover:bg-gray-800 text-gray-400">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingArticle(null);
              setEditingWriteup(null);
              setView(activeTab === 'writeups' ? 'new-writeup' : 'new');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/20"
          >
            <Plus className="w-4 h-4" />
            New {activeTab === 'writeups' ? 'Writeup' : activeTab === 'blog' ? 'Blog Post' : 'Guide'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 flex gap-1">
        {[
          { id: 'guides',   label: 'CTF Guides',   icon: BookOpen },
          { id: 'writeups', label: 'CTF Writeups', icon: Flag },
          { id: 'blog',     label: 'Blog Posts',   icon: PenLine },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as TabMode)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTab === t.id ? 'text-cyan-400' : 'text-gray-500 hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-500/20" /></div>
      ) : tabContent.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
          <p className="text-gray-500">No {activeTab} yet. Start by creating a new one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tabContent.map((item: any) => (
            <div key={item._id} className="group flex items-center justify-between p-4 bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-2xl transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-white truncate">{item.title}</h3>
                  <StatusBadge status={item.status} isLight={false} />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(item.updatedAt).toLocaleDateString()}</span>
                  {activeTab === 'writeups' ? (
                    <span className="flex items-center gap-1 text-cyan-500/60"><Trophy className="w-3 h-3" /> {item.eventName}</span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    if (activeTab === 'writeups') {
                      setEditingWriteup(item);
                      setView('edit-writeup');
                    } else {
                      setEditingArticle(item);
                      setView('edit');
                    }
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
                >
                  <PenLine className="w-4 h-4" />
                </button>
                <button
                  onClick={() => activeTab === 'writeups' ? handleDeleteWriteup(item._id) : handleDeleteArticle(item._id)}
                  className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-400"
                >
                  {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
