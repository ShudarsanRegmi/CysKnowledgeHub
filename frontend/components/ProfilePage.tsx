import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon, Mail, Hash, GraduationCap, Layers,
  Github, Linkedin, Globe, Twitter, Link as LinkIcon,
  Plus, Trash2, AlertCircle, CheckCircle, Loader2,
  Save, Camera, ExternalLink, Edit3,
} from 'lucide-react';
import { useAuth, StudentLink } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';
const BATCHES  = ['2022', '2023', '2024', '2025', '2026'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const ROLL_RE  = /^CH\.SC\.U4CYS\d{5}$/i;

const LINK_META: Record<
  StudentLink['type'],
  { icon: React.FC<{ className?: string }>; label: string; color: string; placeholder: string }
> = {
  github:    { icon: Github,       label: 'GitHub',    color: 'text-gray-300', placeholder: 'https://github.com/username' },
  linkedin:  { icon: Linkedin,     label: 'LinkedIn',  color: 'text-blue-400', placeholder: 'https://linkedin.com/in/username' },
  portfolio: { icon: Globe,        label: 'Portfolio', color: 'text-cyan-400', placeholder: 'https://yoursite.com' },
  twitter:   { icon: Twitter,      label: 'Twitter',   color: 'text-sky-400',  placeholder: 'https://twitter.com/username' },
  other:     { icon: ExternalLink, label: 'Other',     color: 'text-gray-400', placeholder: 'https://...' },
};

type SaveState = 'idle' | 'saving' | 'success' | 'error';

interface FormState {
  displayName: string;
  campusMail: string;
  rollNumber: string;
  batch: string;
  section: string;
  bio: string;
  github: string;
  linkedin: string;
  links: StudentLink[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const nameToHue = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
};

// Extract github/linkedin from links array for the dedicated fields
function extractSocial(links: StudentLink[], type: 'github' | 'linkedin') {
  return links.find((l) => l.type === type)?.url ?? '';
}

// Merge dedicated github/linkedin back into the links array
function mergeSocial(links: StudentLink[], github: string, linkedin: string): StudentLink[] {
  const filtered = links.filter((l) => l.type !== 'github' && l.type !== 'linkedin');
  const result: StudentLink[] = [];
  if (github.trim()) result.push({ type: 'github', url: github.trim() });
  if (linkedin.trim()) result.push({ type: 'linkedin', url: linkedin.trim() });
  return [...result, ...filtered];
}

const ic = (err?: string) =>
  `w-full bg-gray-800/60 border ${err ? 'border-red-500/60' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-colors`;

const sc = (err?: string) =>
  `w-full bg-gray-800/60 border ${err ? 'border-red-500/60' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-colors`;

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string; required?: boolean; error?: string;
  hint?: string; icon?: React.ReactNode; children: React.ReactNode;
}> = ({ label, required, error, hint, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1.5">
      {icon && <span className="text-gray-500">{icon}</span>}
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
      {hint && !error && <span className="ml-auto font-normal text-gray-600">{hint}</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
      </p>
    )}
  </div>
);

// ─── Avatar uploader ──────────────────────────────────────────────────────────

const AvatarUploader: React.FC<{
  photoURL?: string | null;
  name: string;
  onUploaded: (url: string) => void;
  getToken: () => Promise<string>;
}> = ({ photoURL, name, onUploaded, getToken }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const hue = nameToHue(name || 'user');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setErr('Only image files are allowed'); return; }
    if (file.size > 3 * 1024 * 1024) { setErr('Max 3 MB'); return; }
    setErr(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch(`${BACKEND_URL}/api/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message ?? 'Upload failed'); return; }
      onUploaded(data.photoURL);
    } catch { setErr('Network error'); }
    finally { setUploading(false); }
  };

  const src = preview ?? photoURL;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-28 h-28 rounded-full cursor-pointer group"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {src ? (
          <img src={src} alt={name} referrerPolicy="no-referrer"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-700 group-hover:border-cyan-500/60 transition-colors" />
        ) : (
          <div className="w-28 h-28 rounded-full border-2 border-gray-700 group-hover:border-cyan-500/60 flex items-center justify-center text-2xl font-bold select-none transition-colors"
            style={{ background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},80%,72%)` }}>
            {getInitials(name || '?')}
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading
            ? <Loader2 className="w-6 h-6 text-white animate-spin" />
            : <Camera className="w-6 h-6 text-white" />}
        </div>
      </div>
      <button type="button" onClick={() => !uploading && inputRef.current?.click()}
        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
        disabled={uploading}>
        <Camera className="w-3.5 h-3.5" />
        {uploading ? 'Uploading…' : 'Change photo'}
      </button>
      {err && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  );
};

// ─── Profile view card (read-only) ───────────────────────────────────────────

const ProfileCard: React.FC<{ onEdit: () => void }> = ({ onEdit }) => {
  const { user, dbUser } = useAuth();
  const name = dbUser?.displayName ?? user?.displayName ?? 'Unknown';
  const hue = nameToHue(name);
  const src = dbUser?.photoURL ?? user?.photoURL;

  // quick-access social links
  const github   = dbUser?.links?.find((l) => l.type === 'github');
  const linkedin = dbUser?.links?.find((l) => l.type === 'linkedin');
  const others   = (dbUser?.links ?? []).filter((l) => l.type !== 'github' && l.type !== 'linkedin');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Colour bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, transparent, hsl(${hue},65%,55%), transparent)` }} />

      <div className="p-8 flex flex-col sm:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {src ? (
            <img src={src} alt={name} referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-2"
              style={{ borderColor: `hsl(${hue},45%,40%)` }} />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold select-none"
              style={{ background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},80%,72%)` }}>
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
            </div>
            <button onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {dbUser?.rollNumber && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                style={{ color: `hsl(${hue},75%,65%)`, borderColor: `hsl(${hue},50%,30%)`, background: `hsl(${hue},40%,12%)` }}>
                {dbUser.rollNumber}
              </span>
            )}
            {dbUser?.batch && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                Batch {dbUser.batch}
              </span>
            )}
            {dbUser?.section && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                Section {dbUser.section}
              </span>
            )}
            {dbUser?.profileComplete
              ? <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400">Profile complete</span>
              : <span className="text-xs px-3 py-1 rounded-full bg-amber-900/30 border border-amber-500/30 text-amber-400">Profile incomplete</span>
            }
          </div>

          {/* Bio */}
          {dbUser?.bio && <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-2xl">{dbUser.bio}</p>}

          {/* Social links */}
          <div className="flex flex-wrap gap-3 mt-5">
            {github && (
              <a href={github.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-sm text-gray-300 hover:text-white transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {others.map((l, i) => {
              const m = LINK_META[l.type] ?? LINK_META.other;
              const Icon = m.icon;
              return (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-sm transition-colors ${m.color}`}>
                  <Icon className="w-4 h-4" />{l.label ?? m.label}
                </a>
              );
            })}
          </div>

          {/* Campus mail */}
          {dbUser?.campusMail && (
            <p className="mt-3 text-xs text-gray-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />{dbUser.campusMail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Edit form ────────────────────────────────────────────────────────────────

const EditForm: React.FC<{ onCancel: () => void; onSaved: () => void }> = ({ onCancel, onSaved }) => {
  const { user, dbUser, refreshDbUser } = useAuth();

  const init = (): FormState => ({
    displayName: dbUser?.displayName ?? user?.displayName ?? '',
    campusMail:  dbUser?.campusMail  ?? '',
    rollNumber:  dbUser?.rollNumber  ?? '',
    batch:       dbUser?.batch       ?? '',
    section:     dbUser?.section     ?? '',
    bio:         dbUser?.bio         ?? '',
    github:      extractSocial(dbUser?.links ?? [], 'github'),
    linkedin:    extractSocial(dbUser?.links ?? [], 'linkedin'),
    links:       (dbUser?.links ?? []).filter((l) => l.type !== 'github' && l.type !== 'linkedin'),
  });

  const [form, setForm] = useState<FormState>(init);
  const [photoURL, setPhotoURL] = useState<string | undefined>(dbUser?.photoURL ?? user?.photoURL ?? undefined);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'links', string>>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => { setForm(init()); }, [dbUser]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const addLink = () => form.links.length < 5 &&
    setForm((p) => ({ ...p, links: [...p.links, { type: 'other', url: '' }] }));

  const updateLink = (i: number, patch: Partial<StudentLink>) =>
    setForm((p) => { const l = [...p.links]; l[i] = { ...l[i], ...patch }; return { ...p, links: l }; });

  const removeLink = (i: number) =>
    setForm((p) => ({ ...p, links: p.links.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.displayName.trim()) e.displayName = 'Full name is required';
    if (!form.campusMail.trim())  e.campusMail  = 'Campus mail is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.campusMail.trim())) e.campusMail = 'Enter a valid email';
    if (!form.rollNumber.trim())  e.rollNumber  = 'Roll number is required';
    else if (!ROLL_RE.test(form.rollNumber.trim())) e.rollNumber = 'Format: CH.SC.U4CYS23055';
    if (!form.batch)   e.batch   = 'Select your batch';
    if (!form.section) e.section = 'Select your section';
    if (form.github.trim() && !/^https?:\/\/.+/.test(form.github.trim())) e.github = 'Must start with https://';
    if (form.linkedin.trim() && !/^https?:\/\/.+/.test(form.linkedin.trim())) e.linkedin = 'Must start with https://';
    for (const l of form.links) {
      if (!l.url.trim()) { e.links = 'Fill in or remove empty link URLs'; break; }
      if (!/^https?:\/\/.+/.test(l.url.trim())) { e.links = 'All links must start with https://'; break; }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveState('saving'); setServerError(null);
    try {
      const token = await user!.getIdToken();
      const allLinks = mergeSocial(form.links, form.github, form.linkedin);
      const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          displayName: form.displayName.trim(),
          campusMail:  form.campusMail.trim(),
          rollNumber:  form.rollNumber.trim(),
          batch: form.batch, section: form.section,
          bio: form.bio.trim(), links: allLinks.filter((l) => l.url.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message ?? 'Failed to save'); setSaveState('error'); return; }
      setSaveState('success');
      await refreshDbUser();
      setTimeout(() => { onSaved(); }, 900);
    } catch { setServerError('Network error — try again'); setSaveState('error'); }
  };

  const saving  = saveState === 'saving';
  const success = saveState === 'success';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {serverError && (
        <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/40 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{serverError}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 rounded-xl px-4 py-3 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />Profile saved!
        </div>
      )}

      {/* Avatar */}
      <div className="flex justify-center">
        <AvatarUploader
          photoURL={photoURL}
          name={form.displayName || dbUser?.displayName || ''}
          getToken={() => user!.getIdToken()}
          onUploaded={(url) => { setPhotoURL(url); refreshDbUser(); }}
        />
      </div>

      {/* Identity */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-4">Identity</h3>
        <div className="space-y-4">
          <Field label="Full name" required error={errors.displayName} icon={<UserIcon className="w-4 h-4" />}>
            <input type="text" value={form.displayName} onChange={(e) => set('displayName', e.target.value)}
              placeholder="e.g. Aparichit Amrita" className={ic(errors.displayName)} />
          </Field>
          <Field label="Campus mail" required error={errors.campusMail} icon={<Mail className="w-4 h-4" />}
            hint="Official institutional email">
            <input type="email" value={form.campusMail} onChange={(e) => set('campusMail', e.target.value)}
              placeholder="cb.en.u4cys23055@cb.students.amrita.edu" className={ic(errors.campusMail)} />
          </Field>
        </div>
      </section>

      {/* Academic */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-4">Academic details</h3>
        <div className="space-y-4">
          <Field label="Roll number" required error={errors.rollNumber} icon={<Hash className="w-4 h-4" />}
            hint="CH.SC.U4CYS + 5 digits">
            <input type="text" value={form.rollNumber}
              onChange={(e) => set('rollNumber', e.target.value.toUpperCase())}
              placeholder="CH.SC.U4CYS23055" maxLength={18} spellCheck={false}
              className={`${ic(errors.rollNumber)} uppercase`} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Batch" required error={errors.batch} icon={<GraduationCap className="w-4 h-4" />}>
              <select value={form.batch} onChange={(e) => set('batch', e.target.value)} className={sc(errors.batch)}>
                <option value="">Select batch</option>
                {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Section" required error={errors.section} icon={<Layers className="w-4 h-4" />}>
              <select value={form.section} onChange={(e) => set('section', e.target.value)} className={sc(errors.section)}>
                <option value="">Select section</option>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-4">About</h3>
        <Field label="Bio" hint={`${form.bio.length}/500`}>
          <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)}
            rows={3} maxLength={500} className={`${ic()} resize-none`}
            placeholder="Short intro — interests, focus areas, current projects…" />
        </Field>
      </section>

      {/* Social */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-4">Social profiles</h3>
        <div className="space-y-4">
          <Field label="GitHub" error={(errors as any).github} icon={<Github className="w-4 h-4" />}>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input type="url" value={form.github} onChange={(e) => set('github', e.target.value)}
                placeholder="https://github.com/username" className={`${ic((errors as any).github)} pl-10`} />
            </div>
          </Field>
          <Field label="LinkedIn" error={(errors as any).linkedin} icon={<Linkedin className="w-4 h-4" />}>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input type="url" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username" className={`${ic((errors as any).linkedin)} pl-10`} />
            </div>
          </Field>
        </div>
      </section>

      {/* Other links */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Other links</h3>
          <button type="button" onClick={addLink} disabled={form.links.length >= 5}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition-colors">
            <Plus className="w-3.5 h-3.5" />Add link
          </button>
        </div>
        {errors.links && (
          <p className="text-xs text-red-400 mb-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />{errors.links}
          </p>
        )}
        {form.links.length === 0
          ? <p className="text-sm text-gray-600 italic">No extra links added yet.</p>
          : (
            <div className="space-y-3">
              {form.links.map((lnk, i) => {
                const m = LINK_META[lnk.type] ?? LINK_META.other;
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="relative">
                      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <select value={lnk.type} onChange={(e) => updateLink(i, { type: e.target.value as StudentLink['type'] })}
                        className="appearance-none pl-8 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500">
                        {(Object.keys(LINK_META) as StudentLink['type'][]).filter(t => t !== 'github' && t !== 'linkedin').map((t) => (
                          <option key={t} value={t}>{LINK_META[t].label}</option>
                        ))}
                      </select>
                    </div>
                    <input type="url" value={lnk.url} onChange={(e) => updateLink(i, { url: e.target.value })}
                      placeholder={m.placeholder}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <input type="text" value={lnk.label ?? ''} onChange={(e) => updateLink(i, { label: e.target.value })}
                      placeholder="Label (opt)"
                      className="w-28 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <button type="button" onClick={() => removeLink(i)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
      </section>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        <button type="button" onClick={onCancel} disabled={saving}
          className="px-5 py-2.5 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={saving || success}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {saving  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
          : success ? <><CheckCircle className="w-4 h-4" />Saved!</>
          : <><Save className="w-4 h-4" />Save profile</>}
        </button>
      </div>
    </form>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { user, dbUser } = useAuth();
  const [editing, setEditing] = useState(false);

  // Auto-open edit form if profile is incomplete
  useEffect(() => {
    if (dbUser && !dbUser.profileComplete) setEditing(true);
  }, [dbUser]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
        <UserIcon className="w-12 h-12 opacity-20" />
        <p className="text-lg">Sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-3 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          Student Profile
        </div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your profile is shown on{' '}
          <span className="text-cyan-400">Our Students</span> once complete.
        </p>
      </div>

      {/* View card always visible */}
      <ProfileCard onEdit={() => setEditing(true)} />

      {/* Inline edit form */}
      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Edit profile</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Fields marked <span className="text-red-400">*</span> are required to appear on Our Students.
              </p>
            </div>
            <button onClick={() => setEditing(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close editor">
              ✕
            </button>
          </div>
          <EditForm onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
