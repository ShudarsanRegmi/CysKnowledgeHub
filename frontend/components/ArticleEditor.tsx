import React, { useState, useRef, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Image, X, Loader2, Tag, ChevronDown } from 'lucide-react';
import { uploadArticleImage } from '../services/storage';
import type { Topic } from '../services/ctfApi';

interface ArticleEditorProps {
  /** Populated when editing an existing article */
  initialTitle?: string;
  initialContent?: string;
  initialCoverImage?: string;
  initialTopicId?: string;
  initialTags?: string[];

  topics: Topic[];

  /** Called when user clicks "Save Draft" */
  onSave: (data: {
    title: string;
    topicId: string;
    content: string;
    coverImage: string;
    tags: string[];
  }) => Promise<void>;

  /** Called when user clicks "Submit for Review" — receives current form data so the
   *  parent can create-then-submit in a single action (no prior save required). */
  onSubmit?: (data: {
    title: string;
    topicId: string;
    content: string;
    coverImage: string;
    tags: string[];
  }) => Promise<void>;

  isSaving?: boolean;
  isSubmitting?: boolean;

  /** 'draft' | 'pending' | 'approved' | 'published' | 'rejected' — controls which buttons to show */
  articleStatus?: string;
  rejectionReason?: string;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialCoverImage = '',
  initialTopicId = '',
  initialTags = [],
  topics,
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false,
  articleStatus = 'draft',
  rejectionReason,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [topicId, setTopicId] = useState(initialTopicId);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImgInputRef = useRef<HTMLInputElement>(null);
  const [inlineInsertFn, setInlineInsertFn] = useState<((url: string) => void) | null>(null);

  // Sync props when parent updates them (edit mode)
  useEffect(() => { setTitle(initialTitle); }, [initialTitle]);
  useEffect(() => { setContent(initialContent); }, [initialContent]);
  useEffect(() => { setCoverImage(initialCoverImage); }, [initialCoverImage]);
  useEffect(() => { setTopicId(initialTopicId); }, [initialTopicId]);
  useEffect(() => { setTags(initialTags); }, [initialTags.join(',')]);

  // ── Cover image upload ─────────────────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setUploadError(null);
    try {
      const url = await uploadArticleImage(file, setUploadProgress);
      setCoverImage(url);
    } catch (err: any) {
      setUploadError('Cover upload failed: ' + (err.message ?? String(err)));
    } finally {
      setCoverUploading(false);
      setUploadProgress(null);
    }
  };

  // ── Inline image upload (inserts markdown) ────────────────────────────────
  const handleInlineImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadError(null);
      try {
        const url = await uploadArticleImage(file, setUploadProgress);
        inlineInsertFn?.(url);
      } catch (err: any) {
        setUploadError('Image upload failed: ' + (err.message ?? String(err)));
      } finally {
        setUploadProgress(null);
      }
    },
    [inlineInsertFn]
  );

  // ── Custom MDEditor toolbar command: insert image ─────────────────────────
  const insertImageCommand = {
    name: 'insert-image',
    keyCommand: 'insert-image',
    buttonProps: { 'aria-label': 'Insert image', title: 'Upload & insert image' },
    icon: <Image className="w-3.5 h-3.5" />,
    execute: (_state: any, api: any) => {
      // Store a callback that inserts the URL at cursor after upload
      setInlineInsertFn(() => (url: string) => {
        api.replaceSelection(`\n![image](${url})\n`);
      });
      inlineImgInputRef.current?.click();
    },
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

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!title.trim() || !topicId || !content.trim()) return;
    onSave({ title: title.trim(), topicId, content, coverImage, tags });
  };

  const canEdit = ['draft', 'rejected'].includes(articleStatus);
  const canSubmit = canEdit && !!onSubmit;

  return (
    <div className="space-y-6" data-color-mode="dark">
      {/* Rejection notice */}
      {articleStatus === 'rejected' && rejectionReason && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
          <span className="font-semibold text-red-400">Rejected: </span>{rejectionReason}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Article Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          placeholder="Enter a clear, descriptive title…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 placeholder:text-gray-600"
        />
      </div>

      {/* Topic selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Topic *
        </label>
        <div className="relative">
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            disabled={!canEdit}
            className="w-full appearance-none bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 pr-10"
          >
            <option value="">— Select a topic —</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Cover Image
        </label>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
        <div
          onClick={() => canEdit && coverInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
            canEdit
              ? 'border-gray-700 hover:border-cyan-500/50 cursor-pointer'
              : 'border-gray-800 opacity-60'
          }`}
          style={{ minHeight: 140 }}
        >
          {coverImage ? (
            <>
              <img src={coverImage} alt="cover" className="w-full h-40 object-cover" />
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
            <div className="flex flex-col items-center justify-center h-36 text-gray-600 gap-2">
              {coverUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                  <span className="text-xs">{uploadProgress ?? 0}%</span>
                </>
              ) : (
                <>
                  <Image className="w-6 h-6" />
                  <span className="text-xs">Click to upload cover image</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-xs"
            >
              #{tag}
              {canEdit && (
                <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag and press Enter…"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-gray-600"
              />
            </div>
            <button
              onClick={addTag}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Markdown editor */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Content (Markdown) *
        </label>
        {uploadProgress !== null && !coverUploading && (
          <div className="mb-2 text-xs text-cyan-400 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading image… {uploadProgress}%
          </div>
        )}
        {uploadError && (
          <div className="mb-2 text-xs text-red-400">{uploadError}</div>
        )}

        {/* Hidden file input for inline image uploads */}
        <input
          ref={inlineImgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInlineImageUpload}
        />

        <div className="rounded-xl overflow-hidden border border-gray-700">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? '')}
            preview={canEdit ? 'live' : 'preview'}
            height={520}
            visibleDragbar={false}
            extraCommands={[insertImageCommand]}
            style={{ background: '#030712', colorScheme: 'dark' }}
            textareaProps={{
              placeholder: '# My Article\n\nWrite your CTF writeup here using Markdown…\n\n```bash\n# code blocks work too\nnmap -sV target\n```',
              disabled: !canEdit,
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !topicId || !content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? 'Saving…' : 'Save Draft'}
          </button>
        )}
        {canSubmit && (
          <button
            onClick={() => onSubmit!({ title: title.trim(), topicId, content, coverImage, tags })}
            disabled={isSubmitting || !title.trim() || !topicId || !content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? 'Submitting…' : 'Submit for Review'}
          </button>
        )}
        {!canEdit && (
          <span className="text-sm text-gray-500 italic">
            This article is in <span className="capitalize font-medium text-gray-400">{articleStatus}</span> state and cannot be edited.
          </span>
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
