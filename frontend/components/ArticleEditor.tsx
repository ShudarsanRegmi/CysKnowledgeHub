import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Loader2, Tag, ChevronDown, Plus, Check } from 'lucide-react';
import type { JSONContent } from '@tiptap/react';
import NovelEditor from './NovelEditor';
import { uploadArticleImage } from '../services/storage';
import { createTopic } from '../services/ctfApi';
import type { Topic } from '../services/ctfApi';

interface ArticleEditorProps {
  /** Populated when editing an existing article */
  initialTitle?: string;
  initialContent?: string;          // JSON string (novel) or markdown string (legacy)
  initialContentType?: 'markdown' | 'novel';
  initialCoverImage?: string;
  initialTopicId?: string;
  initialTags?: string[];
  initialExcerpt?: string;

  topics: Topic[];

  /** Called when user clicks "Save Draft" */
  onSave: (data: {
    title: string;
    topicId: string;
    content: string;
    contentType: 'novel';
    excerpt: string;
    coverImage: string;
    tags: string[];
  }) => Promise<void>;

  /** Called when user clicks "Submit for Review" */
  onSubmit?: (data: {
    title: string;
    topicId: string;
    content: string;
    contentType: 'novel';
    excerpt: string;
    coverImage: string;
    tags: string[];
  }) => Promise<void>;

  isSaving?: boolean;
  isSubmitting?: boolean;

  /** 'draft' | 'pending' | 'approved' | 'published' | 'rejected' */
  articleStatus?: string;
  rejectionReason?: string;
  /** When true: rename 'Topic' → 'Category', show category selector */
  isBlog?: boolean;
  /** Called after a new topic is created inline so parent can update its list */
  onTopicCreated?: (t: Topic) => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialContentType,
  initialCoverImage = '',
  initialTopicId = '',
  initialTags = [],
  initialExcerpt = '',
  topics,
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false,
  articleStatus = 'draft',
  rejectionReason,
  isBlog = false,
  onTopicCreated,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [novelContent, setNovelContent] = useState<JSONContent | undefined>(() => {
    if (!initialContent) return undefined;
    // If content looks like JSON (novel format), parse it; else start fresh for Novel
    if (initialContent.trim().startsWith('{') || initialContent.trim().startsWith('[')) {
      try { return JSON.parse(initialContent) as JSONContent; } catch { /* fall through */ }
    }
    return undefined; // markdown legacy — editor starts fresh
  });
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  // Auto-select if only one option
  const [topicId, setTopicId] = useState(() =>
    initialTopicId || (topics.length === 1 ? topics[0]._id : '')
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  // Inline new-category form
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Sync props when parent updates them (edit mode)
  useEffect(() => { setTitle(initialTitle); }, [initialTitle]);
  useEffect(() => {
    if (!initialContent) { setNovelContent(undefined); return; }
    if (initialContent.trim().startsWith('{') || initialContent.trim().startsWith('[')) {
      try { setNovelContent(JSON.parse(initialContent) as JSONContent); return; } catch { /* fall through */ }
    }
    setNovelContent(undefined);
  }, [initialContent]);
  useEffect(() => { setCoverImage(initialCoverImage); }, [initialCoverImage]);
  useEffect(() => {
    setTopicId(initialTopicId || (topics.length === 1 ? topics[0]._id : ''));
  }, [initialTopicId, topics]);    // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setTags(initialTags); }, [initialTags.join(',')]);
  useEffect(() => { setExcerpt(initialExcerpt); }, [initialExcerpt]);
  // ── Cover image upload ─────────────────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setUploadError(null);
    try {
      const url = await uploadArticleImage(file, setUploadProgress, isBlog ? 'blog' : 'ctf');
      setCoverImage(url);
    } catch (err: any) {
      setUploadError('Cover upload failed: ' + (err.message ?? String(err)));
    } finally {
      setCoverUploading(false);
      setUploadProgress(null);
    }
  };

  // ── Tag management ─────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  };

  // ── New category inline handler ────────────────────────────────────────────
  const handleCreateCategory = async () => {
    if (!newCatTitle.trim()) return;
    setCreatingCat(true);
    setCatError(null);
    try {
      const type = isBlog ? 'blog' : 'ctf'; // default to ctf for non-blog; parent passes correct type via isBlog
      const { topic } = await createTopic({ title: newCatTitle.trim(), description: newCatDesc.trim(), type });
      setNewCatTitle('');
      setNewCatDesc('');
      setShowNewCategory(false);
      // Select the newly created topic automatically
      setTopicId(topic._id);
      onTopicCreated?.(topic);
    } catch (err: any) {
      setCatError(err.message ?? 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  // ── Save handler ───────────────────────────────────────────────────────────
  const buildData = () => ({
    title: title.trim(),
    topicId,
    content: novelContent ? JSON.stringify(novelContent) : JSON.stringify({ type: 'doc', content: [] }),
    contentType: 'novel' as const,
    excerpt: excerpt.trim(),
    coverImage,
    tags,
  });

  const handleSave = () => {
    if (!title.trim() || !topicId) return;
    onSave(buildData());
  };

  const canEdit = ['draft', 'rejected'].includes(articleStatus);
  const canSubmit = canEdit && !!onSubmit && !!novelContent;

  return (
    <div data-color-mode="dark" className="flex flex-col gap-4">
      {/* Rejection notice — full width */}
      {articleStatus === 'rejected' && rejectionReason && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
          <span className="font-semibold text-red-400">Rejected: </span>{rejectionReason}
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* ── LEFT — Writing area ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
            placeholder="Enter a clear, descriptive title…"
            className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl px-5 py-3.5 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 placeholder:text-gray-600"
          />

          {/* Content editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Content *
            </label>
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            <NovelEditor
              initialContent={novelContent}
              onChange={setNovelContent}
              disabled={!canEdit}
              className="min-h-[600px]"
            />
          </div>
        </div>

        {/* ── RIGHT — Metadata sidebar ─────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-5 sticky top-24">

          {/* Status pill */}
          {articleStatus && articleStatus !== 'draft' && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                articleStatus === 'published' ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/40' :
                articleStatus === 'approved'  ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/40' :
                articleStatus === 'pending'   ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/40' :
                articleStatus === 'rejected'  ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
                'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
                {articleStatus.charAt(0).toUpperCase() + articleStatus.slice(1)}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {canSubmit && (
              <button
                onClick={() => onSubmit!(buildData())}
                disabled={isSubmitting || !title.trim() || !topicId}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Submitting…' : 'Submit for Review'}
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim() || !topicId}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSaving ? 'Saving…' : 'Save Draft'}
              </button>
            )}
            {!canEdit && (
              <p className="text-xs text-gray-500 italic text-center">
                This article is in <span className="capitalize font-medium text-gray-400">{articleStatus}</span> state and cannot be edited.
              </p>
            )}
          </div>

          <div className="border-t border-gray-800" />

          {/* Topic / Category selector — shown for all content types */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {isBlog ? 'Category' : 'Topic'} *
              </label>
              {canEdit && (
                <button
                  onClick={() => { setShowNewCategory((v) => !v); setCatError(null); }}
                  className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  New {isBlog ? 'Category' : 'Topic'}
                </button>
              )}
            </div>

            {/* Inline new category form */}
            {showNewCategory && canEdit && (
              <div className="bg-gray-800/60 border border-cyan-500/20 rounded-xl p-3 space-y-2">
                <input
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  placeholder={`${isBlog ? 'Category' : 'Topic'} title…`}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <input
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description (optional)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                {catError && <p className="text-xs text-red-400">{catError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCategory}
                    disabled={creatingCat || !newCatTitle.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {creatingCat ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    {creatingCat ? 'Creating…' : 'Create'}
                  </button>
                  <button
                    onClick={() => { setShowNewCategory(false); setNewCatTitle(''); setNewCatDesc(''); setCatError(null); }}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {topics.length === 0 && !showNewCategory ? (
              <div className="text-xs text-amber-400 bg-amber-900/20 border border-amber-700/40 rounded-xl px-3 py-2.5 leading-relaxed">
                No {isBlog ? 'categories' : 'topics'} found. Create one above to continue.
              </div>
            ) : (
              <div className="relative">
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  disabled={!canEdit || topics.length === 0}
                  className="w-full appearance-none bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 pr-9"
                >
                  <option value="">— Select a {isBlog ? 'category' : 'topic'} —</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>{t.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Excerpt <span className="normal-case text-gray-600 font-normal">(feed preview)</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={!canEdit}
              rows={3}
              placeholder="A short summary shown in the article feed…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Cover image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Cover Image
            </label>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            <div
              onClick={() => canEdit && coverInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                canEdit ? 'border-gray-700 hover:border-cyan-500/50 cursor-pointer' : 'border-gray-800 opacity-60'
              }`}
            >
              {coverImage ? (
                <>
                  <img src={coverImage} alt="cover" className="w-full h-36 object-cover" />
                  {canEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                      className="absolute top-2 right-2 bg-gray-900/80 rounded-full p-1 hover:bg-red-900/70 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-28 text-gray-600 gap-2">
                  {coverUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                      <span className="text-xs">{uploadProgress ?? 0}%</span>
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5" />
                      <span className="text-xs">Click to upload cover</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Tags
            </label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-xs"
                  >
                    #{tag}
                    {canEdit && (
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            {canEdit && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag, press Enter…"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
                  />
                </div>
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

        </div>{/* end sidebar */}
      </div>{/* end two-column */}
    </div>
  );
};

export default ArticleEditor;
