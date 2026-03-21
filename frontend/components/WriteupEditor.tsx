import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Loader2, Tag, ChevronDown, Flag, Trophy, Target, Award, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { JSONContent } from '@tiptap/react';
import NovelEditor from './NovelEditor';
import { uploadArticleImage, uploadInlineImage } from '../services/storage';
import { useTheme } from '../contexts/ThemeContext';
import { WriteupCategory, WriteupDifficulty } from '../services/writeupApi';
import { getTopics, Topic, createTopic } from '../services/ctfApi';

// Managed categories will be fetched from the Topic system

const DIFFICULTIES: WriteupDifficulty[] = ['easy', 'medium', 'hard'];

interface WriteupEditorProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onSubmit: (data: any) => Promise<void>;
  isSaving: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onTopicCreated?: (t: Topic) => void;
}

const WriteupEditor: React.FC<WriteupEditorProps> = ({
  initialData,
  onSave,
  onSubmit,
  isSaving,
  isSubmitting,
  onBack,
  onTopicCreated
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [title, setTitle] = useState(initialData?.title || '');
  const [eventName, setEventName] = useState(initialData?.eventName || '');
  const [challengeName, setChallengeName] = useState(initialData?.challengeName || '');
  const [category, setCategory] = useState<WriteupCategory>(initialData?.category || 'web');
  const [difficulty, setDifficulty] = useState<WriteupDifficulty>(initialData?.difficulty || 'easy');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [novelContent, setNovelContent] = useState<JSONContent | undefined>(() => {
    if (!initialData?.content) return undefined;
    try {
      return JSON.parse(initialData.content);
    } catch {
      return undefined;
    }
  });

  const [managedCategories, setManagedCategories] = useState<Topic[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = () => {
    getTopics('writeup').then(({ topics }) => {
      setManagedCategories(topics);
    }).catch(console.error);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCatTitle.trim()) return;
    setCreatingCat(true);
    setCatError(null);
    try {
      const { topic } = await createTopic({ title: newCatTitle.trim(), description: newCatDesc.trim(), type: 'writeup' });
      setNewCatTitle('');
      setNewCatDesc('');
      setShowNewCategory(false);
      setCategory(topic.title.toLowerCase());
      onTopicCreated?.(topic);
      loadCategories();
    } catch (err: any) {
      setCatError(err.message ?? 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadArticleImage(file, setUploadProgress, 'writeups');
      setCoverImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setCoverUploading(false);
      setUploadProgress(null);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const getData = () => ({
    title,
    eventName,
    challengeName,
    category,
    difficulty,
    tags,
    coverImage,
    content: JSON.stringify(novelContent),
    contentType: 'novel'
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Tag className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Rejection Notice */}
      {initialData?.status === 'rejected' && initialData?.rejectionReason && (
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-950/30 border-red-500/30 text-red-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Rejection Reason</span>
          </div>
          <p className="text-sm opacity-90">{initialData.rejectionReason}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`text-sm font-medium ${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            &larr; Back to Dashboard
          </button>
          {initialData?.status && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
              initialData.status === 'published' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
              initialData.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
              initialData.status === 'rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
              'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              {getStatusIcon(initialData.status)}
              {initialData.status}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSave(getData())}
            disabled={isSaving || isSubmitting}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              isLight ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
            }`}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />}
            Save Draft
          </button>
          <button
            onClick={() => onSubmit(getData())}
            disabled={isSaving || isSubmitting}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />}
            Submit for Review
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Writeup Title (e.g. Solving Web/Inject Challenge)"
              className={`w-full text-3xl font-bold bg-transparent border-none focus:outline-none placeholder:text-gray-700 ${isLight ? 'text-gray-900' : 'text-white'}`}
            />
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Event Name (e.g. PlaidCTF 2024)"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${isLight ? 'bg-white border-gray-200' : 'bg-gray-950 border-gray-800'}`}
                />
              </div>
              <div className="flex-1 min-w-[200px] relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="Challenge Name (e.g. Proxy-Log)"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${isLight ? 'bg-white border-gray-200' : 'bg-gray-950 border-gray-800'}`}
                />
              </div>
            </div>
          </div>

          <NovelEditor
            initialContent={novelContent}
            onChange={setNovelContent}
            className="min-h-[500px]"
            uploadType="writeups"
            onUploadImage={(file) => uploadInlineImage(file, 'writeups')}
          />
        </div>

        {/* Sidebar Metadata */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className={`p-6 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Challenge Info</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-600 uppercase">Category</label>
                  <button
                    onClick={() => { setShowNewCategory((v) => !v); setCatError(null); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>

                {showNewCategory && (
                  <div className="mt-2 p-3 rounded-xl bg-gray-950 border border-cyan-500/20 space-y-2">
                    <input
                      value={newCatTitle}
                      onChange={(e) => setNewCatTitle(e.target.value)}
                      placeholder="Category title..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Optional description"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    {catError && <p className="text-[10px] text-red-400">{catError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateCategory}
                        className="flex-1 py-1 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                      >
                        {creatingCat ? '...' : 'Create'}
                      </button>
                      <button
                        onClick={() => setShowNewCategory(false)}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WriteupCategory)}
                    className="w-full appearance-none bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    {managedCategories.length > 0 ? (
                      managedCategories.map(c => <option key={c._id} value={c.title.toLowerCase()}>{c.title}</option>)
                    ) : (
                      ['web', 'crypto', 'pwn', 'rev', 'forensics', 'misc'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)
                    )}
                    {category && !managedCategories.some(m => m.title.toLowerCase() === category.toLowerCase()) && (
                      <option value={category}>{category}</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block">Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                        difficulty === d
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                          : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Visuals & Tags</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block">Cover Image</label>
                <input ref={coverInputRef} type="file" onChange={handleCoverUpload} className="hidden" accept="image/*" />
                <div onClick={() => coverInputRef.current?.click()} className="relative aspect-video rounded-xl border-2 border-dashed border-gray-800 hover:border-cyan-500/40 cursor-pointer overflow-hidden group">
                  {coverImage ? (
                    <img src={coverImage} className="w-full h-full object-cover" alt="cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                      {coverUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
                      <span className="text-[10px] font-bold uppercase">Upload Cover</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded-md text-[10px] text-gray-400">
                      #{t}
                      <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-400" onClick={() => setTags(tags.filter(tag => tag !== t))} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="New tag..."
                    className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs"
                  />
                  <button onClick={addTag} className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs">Add</button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WriteupEditor;
