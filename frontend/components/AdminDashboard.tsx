import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Hash, FileText, ShieldCheck, Loader2, AlertCircle,
  Plus, Trash2, Edit2, Check, X, ChevronUp, ChevronDown,
  RefreshCw, Eye, BookOpen, UserCog,
} from 'lucide-react';
import {
  adminGetUsers, adminSetUserRole,
  adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
  adminGetArticles, adminSetArticleStatus, adminSetArticleOrder,
  DbUser, Topic, Article,
} from '../services/ctfApi';
import MDEditor from '@uiw/react-md-editor';

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  admin:   'text-yellow-400 bg-yellow-900/30 border-yellow-700/40',
  author:  'text-cyan-400 bg-cyan-900/30 border-cyan-700/40',
  student: 'text-gray-400 bg-gray-800/60 border-gray-700',
};

const STATUS_COLORS: Record<string, string> = {
  draft:     'text-gray-400 bg-gray-800/60 border-gray-700',
  pending:   'text-yellow-400 bg-yellow-900/30 border-yellow-700/40',
  approved:  'text-indigo-400 bg-indigo-900/30 border-indigo-700/40',
  published: 'text-cyan-400 bg-cyan-900/30 border-cyan-700/40',
  rejected:  'text-red-400 bg-red-900/30 border-red-700/40',
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
    {label}
  </span>
);

// ─── Panel: Users ─────────────────────────────────────────────────────────────

const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { const { users } = await adminGetUsers(); setUsers(users); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (uid: string, role: string) => {
    setUpdatingId(uid);
    try {
      await adminSetUserRole(uid, role);
      await load();
      flash(`Role updated to "${role}".`);
    } catch (err: any) { setError(err.message); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-500" />User Management
        </h2>
        <button onClick={load} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <ErrorBanner msg={error} onDismiss={() => setError(null)} />}
      {successMsg && <SuccessBanner msg={successMsg} />}

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.uid} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{u.displayName || '(no name)'}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge label={u.role} color={ROLE_COLORS[u.role] ?? ROLE_COLORS.student} />
                <select
                  value={u.role}
                  disabled={updatingId === u.uid}
                  onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                >
                  <option value="student">student</option>
                  <option value="author">author</option>
                  <option value="admin">admin</option>
                </select>
                {updatingId === u.uid && <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Panel: Topics ────────────────────────────────────────────────────────────

const TopicsPanel: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState({ title: '', description: '', type: 'ctf' as 'ctf' | 'blog' | 'experiment' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { const { topics } = await adminGetTopics(); setTopics(topics); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ title: '', description: '', type: 'ctf' }); setEditingTopic(null); setShowForm(true); };
  const openEdit = (t: Topic) => { setForm({ title: t.title, description: t.description ?? '', type: t.type ?? 'ctf' }); setEditingTopic(t); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingTopic) {
        await adminUpdateTopic(editingTopic._id, { title: form.title, description: form.description, type: form.type });
        flash('Topic updated.');
      } else {
        await adminCreateTopic({ title: form.title, description: form.description, type: form.type });
        flash('Topic created.');
      }
      setShowForm(false);
      await load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topic and all its articles?')) return;
    setDeletingId(id);
    try { await adminDeleteTopic(id); await load(); flash('Topic deleted.'); }
    catch (err: any) { setError(err.message); }
    finally { setDeletingId(null); }
  };

  const moveOrder = async (topic: Topic, direction: 'up' | 'down') => {
    const delta = direction === 'up' ? -1.5 : 1.5;
    try { await adminUpdateTopic(topic._id, { order: topic.order + delta }); await load(); }
    catch (err: any) { setError(err.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Hash className="w-5 h-5 text-cyan-500" />Topic Management
        </h2>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />New Topic
          </button>
        </div>
      </div>

      {error && <ErrorBanner msg={error} onDismiss={() => setError(null)} />}
      {successMsg && <SuccessBanner msg={successMsg} />}

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white">{editingTopic ? 'Edit Topic' : 'New Topic'}</h3>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Topic title (e.g. XSS, SQL Injection)"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description (optional)"
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Section type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'ctf' | 'blog' | 'experiment' })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="ctf">CTF Writeup</option>
              <option value="blog">Blog</option>
              <option value="experiment">Experiment</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <LoadingSpinner /> : topics.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No topics yet. Create your first one!</p>
      ) : (
        <div className="space-y-2">
          {topics.map((t, idx) => (
            <div key={t._id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3">
              {/* Order controls */}
              <div className="flex flex-col gap-0.5">
                <button disabled={idx === 0} onClick={() => moveOrder(t, 'up')} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button disabled={idx === topics.length - 1} onClick={() => moveOrder(t, 'down')} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{t.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    t.type === 'blog' ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700/40' :
                    t.type === 'experiment' ? 'text-purple-400 bg-purple-900/30 border-purple-700/40' :
                    'text-cyan-400 bg-cyan-900/30 border-cyan-700/40'
                  }`}>{t.type ?? 'ctf'}</span>
                </div>
                {t.description && <p className="text-xs text-gray-500 truncate">{t.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(t)} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(t._id)} disabled={deletingId === t._id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50">
                  {deletingId === t._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Panel: Articles Review ───────────────────────────────────────────────────

const ArticlePreviewModal: React.FC<{ article: Article; onClose: () => void }> = ({ article, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h2 className="font-bold text-white truncate">{article.title}</h2>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6" data-color-mode="dark">
        <MDEditor.Markdown source={article.content} style={{ background: 'transparent', color: '#e5e7eb', fontSize: 14 }} />
      </div>
    </div>
  </div>
);

const ArticlesReviewPanel: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectForm, setRejectForm] = useState<{ id: string; reason: string } | null>(null);

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { articles } = await adminGetArticles({ status: statusFilter || undefined });
      setArticles(articles);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: string, status: string, rejectionReason?: string) => {
    setActionId(id);
    try {
      await adminSetArticleStatus(id, status, rejectionReason);
      flash(`Article ${status}.`);
      await load();
    } catch (err: any) { setError(err.message); }
    finally { setActionId(null); setRejectForm(null); }
  };

  const moveOrder = async (article: Article, dir: 'up' | 'down') => {
    const delta = dir === 'up' ? -1.5 : 1.5;
    try { await adminSetArticleOrder(article._id, article.order + delta); await load(); }
    catch (err: any) { setError(err.message); }
  };

  return (
    <div className="space-y-4">
      {previewArticle && <ArticlePreviewModal article={previewArticle} onClose={() => setPreviewArticle(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-500" />Article Review
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={load} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      {error && <ErrorBanner msg={error} onDismiss={() => setError(null)} />}
      {successMsg && <SuccessBanner msg={successMsg} />}

      {loading ? <LoadingSpinner /> : articles.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No articles in this state.</p>
      ) : (
        <div className="space-y-3">
          {articles.map((a, idx) => {
            const topicTitle = typeof a.topicId === 'object' ? (a.topicId as any).title : '—';
            const canReorder = a.status === 'published';

            return (
              <div key={a._id} className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 space-y-3">
                <div className="flex items-start gap-4">
                  {/* Order controls (published only) */}
                  {canReorder && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <button disabled={idx === 0} onClick={() => moveOrder(a, 'up')} className="text-gray-600 hover:text-white disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button disabled={idx === articles.length - 1} onClick={() => moveOrder(a, 'down')} className="text-gray-600 hover:text-white disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold text-white">{a.title}</h3>
                      <Badge label={a.status} color={STATUS_COLORS[a.status] ?? STATUS_COLORS.draft} />
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="mr-3">By: <span className="text-gray-400">{a.authorName}</span></span>
                      <span className="mr-3">Topic: <span className="text-gray-400">{topicTitle}</span></span>
                      <span>Submitted: {new Date(a.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {a.rejectionReason && (
                      <p className="text-xs text-red-400 mt-1">Rejection reason: {a.rejectionReason}</p>
                    )}
                  </div>

                  {/* Preview */}
                  <button
                    onClick={() => setPreviewArticle(a)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>

                {/* Action buttons based on current status */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-800">
                  {a.status === 'pending' && (
                    <>
                      <ActionButton
                        label="Approve"
                        color="text-indigo-400 border-indigo-700/40 hover:bg-indigo-900/30"
                        icon={<Check className="w-3 h-3" />}
                        loading={actionId === a._id}
                        onClick={() => handleStatus(a._id, 'approved')}
                      />
                      <ActionButton
                        label="Reject"
                        color="text-red-400 border-red-700/40 hover:bg-red-900/20"
                        icon={<X className="w-3 h-3" />}
                        loading={false}
                        onClick={() => setRejectForm({ id: a._id, reason: '' })}
                      />
                    </>
                  )}
                  {a.status === 'approved' && (
                    <ActionButton
                      label="Publish"
                      color="text-cyan-400 border-cyan-700/40 hover:bg-cyan-900/20"
                      icon={<BookOpen className="w-3 h-3" />}
                      loading={actionId === a._id}
                      onClick={() => handleStatus(a._id, 'published')}
                    />
                  )}
                  {a.status === 'published' && (
                    <ActionButton
                      label="Unpublish"
                      color="text-yellow-400 border-yellow-700/40 hover:bg-yellow-900/20"
                      icon={<X className="w-3 h-3" />}
                      loading={actionId === a._id}
                      onClick={() => handleStatus(a._id, 'approved')}
                    />
                  )}
                  {(a.status === 'rejected' || a.status === 'approved') && (
                    <ActionButton
                      label="Set Pending"
                      color="text-gray-400 border-gray-700 hover:bg-gray-800"
                      icon={<UserCog className="w-3 h-3" />}
                      loading={actionId === a._id}
                      onClick={() => handleStatus(a._id, 'pending')}
                    />
                  )}
                </div>

                {/* Rejection reason input */}
                {rejectForm?.id === a._id && (
                  <div className="flex gap-2 items-end mt-2">
                    <div className="flex-1">
                      <input
                        value={rejectForm.reason}
                        onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
                        placeholder="Reason for rejection (optional)…"
                        className="w-full bg-gray-800 border border-red-700/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleStatus(a._id, 'rejected', rejectForm.reason)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors"
                    >
                      {actionId === a._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Reject'}
                    </button>
                    <button onClick={() => setRejectForm(null)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm">Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Small shared components ──────────────────────────────────────────────────

const ActionButton: React.FC<{
  label: string; color: string; icon: React.ReactNode;
  loading: boolean; onClick: () => void;
}> = ({ label, color, icon, loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors disabled:opacity-50 ${color}`}
  >
    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : icon}{label}
  </button>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-cyan-500" /></div>
);

const ErrorBanner: React.FC<{ msg: string; onDismiss: () => void }> = ({ msg, onDismiss }) => (
  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-700/40 rounded-xl px-4 py-3">
    <AlertCircle className="w-4 h-4 flex-shrink-0" />{msg}
    <button onClick={onDismiss} className="ml-auto text-gray-500 hover:text-white">✕</button>
  </div>
);

const SuccessBanner: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="text-sm text-green-400 bg-green-950/30 border border-green-700/40 rounded-xl px-4 py-3">✓ {msg}</div>
);

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

type AdminTab = 'users' | 'topics' | 'review';

const TABS: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
  { id: 'users',  label: 'Users',          icon: Users },
  { id: 'topics', label: 'Topics',         icon: Hash },
  { id: 'review', label: 'Article Review', icon: ShieldCheck },
];

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<AdminTab>('review');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-cyan-500" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
        {tab === 'users'  && <UsersPanel />}
        {tab === 'topics' && <TopicsPanel />}
        {tab === 'review' && <ArticlesReviewPanel />}
      </div>
    </div>
  );
};

export default AdminDashboard;
