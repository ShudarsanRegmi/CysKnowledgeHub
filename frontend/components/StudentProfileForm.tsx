import React, { useState, useEffect } from 'react';
import {
  X, Save, User as UserIcon, Mail, Hash, GraduationCap,
  Layers, Github, Linkedin, Globe, Twitter, Link as LinkIcon,
  Plus, Trash2, AlertCircle, CheckCircle, Loader2,
} from 'lucide-react';
import { useAuth, StudentLink } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ─── Constants ────────────────────────────────────────────────────────────────

const BATCHES  = ['2022', '2023', '2024', '2025', '2026'];
const SECTIONS = ['A', 'B', 'C', 'D'];

const LINK_TYPES: { value: StudentLink['type']; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'github',    label: 'GitHub',    icon: Github },
  { value: 'linkedin',  label: 'LinkedIn',  icon: Linkedin },
  { value: 'portfolio', label: 'Portfolio', icon: Globe },
  { value: 'twitter',   label: 'Twitter',   icon: Twitter },
  { value: 'other',     label: 'Other',     icon: LinkIcon },
];

const ROLL_RE = /^CH\.SC\.U4CYS\d{5}$/i;

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentProfileFormProps {
  /** Called when the user closes the form without saving, or after a successful save. */
  onClose: () => void;
  /** If true, the form acts as a first-time setup modal (can't be dismissed without completing). */
  isSetup?: boolean;
}

interface FormState {
  displayName: string;
  campusMail: string;
  rollNumber: string;
  batch: string;
  section: string;
  bio: string;
  links: StudentLink[];
}

type SaveState = 'idle' | 'saving' | 'success' | 'error';

// ─── Component ────────────────────────────────────────────────────────────────

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({ onClose, isSetup = false }) => {
  const { user, dbUser, refreshDbUser } = useAuth();

  const [form, setForm] = useState<FormState>({
    displayName: dbUser?.displayName ?? user?.displayName ?? '',
    campusMail:  dbUser?.campusMail  ?? '',
    rollNumber:  dbUser?.rollNumber  ?? '',
    batch:       dbUser?.batch       ?? '',
    section:     dbUser?.section     ?? '',
    bio:         dbUser?.bio         ?? '',
    links:       dbUser?.links       ?? [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'links', string>>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync if dbUser loads after mount
  useEffect(() => {
    if (dbUser) {
      setForm({
        displayName: dbUser.displayName ?? user?.displayName ?? '',
        campusMail:  dbUser.campusMail  ?? '',
        rollNumber:  dbUser.rollNumber  ?? '',
        batch:       dbUser.batch       ?? '',
        section:     dbUser.section     ?? '',
        bio:         dbUser.bio         ?? '',
        links:       dbUser.links       ?? [],
      });
    }
  }, [dbUser, user]);

  // ── Field helpers ────────────────────────────────────────────────────────────

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const addLink = () =>
    setForm((prev) => ({
      ...prev,
      links: [...prev.links, { type: 'github', url: '' }],
    }));

  const updateLink = (i: number, patch: Partial<StudentLink>) =>
    setForm((prev) => {
      const links = [...prev.links];
      links[i] = { ...links[i], ...patch };
      return { ...prev, links };
    });

  const removeLink = (i: number) =>
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }));

  // ── Validation ───────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: typeof errors = {};

    if (!form.displayName.trim()) e.displayName = 'Full name is required';
    if (!form.campusMail.trim())  e.campusMail  = 'Campus mail is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.campusMail.trim()))
      e.campusMail = 'Enter a valid email address';

    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    else if (!ROLL_RE.test(form.rollNumber.trim()))
      e.rollNumber = 'Format: CH.SC.U4CYS followed by 5 digits  e.g. CH.SC.U4CYS23055';

    if (!form.batch)   e.batch   = 'Please select your batch';
    if (!form.section) e.section = 'Please select your section';

    // validate links
    for (const lnk of form.links) {
      if (!lnk.url.trim()) {
        e.links = 'All link URLs must be filled in (or remove the empty ones)';
        break;
      }
      if (!/^https?:\/\/.+/.test(lnk.url.trim())) {
        e.links = 'All links must start with http:// or https://';
        break;
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaveState('saving');
    setServerError(null);

    try {
      const idToken = await user!.getIdToken();
      const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: form.displayName.trim(),
          campusMail:  form.campusMail.trim(),
          rollNumber:  form.rollNumber.trim(),
          batch:       form.batch,
          section:     form.section,
          bio:         form.bio.trim(),
          links:       form.links.filter((l) => l.url.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message ?? 'Failed to save profile');
        setSaveState('error');
        return;
      }

      setSaveState('success');
      await refreshDbUser();
      setTimeout(() => onClose(), 1000);
    } catch {
      setServerError('Network error — please try again');
      setSaveState('error');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const saving   = saveState === 'saving';
  const success  = saveState === 'success';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 pt-10"
      onClick={(e) => { if (!isSetup && e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden mb-10">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isSetup ? 'Complete your profile' : 'Edit profile'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isSetup
                ? 'Fill in your campus details to appear on Our Students.'
                : 'Update your student profile visible on Our Students.'}
            </p>
          </div>
          {!isSetup && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-8 py-6 space-y-6">

            {/* ── Server / success banners ──────────────────────────────────── */}
            {serverError && (
              <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/40 text-red-400 rounded-lg px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 rounded-lg px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Profile saved!
              </div>
            )}

            {/* ── Section: Identity ─────────────────────────────────────────── */}
            <fieldset className="space-y-4">
              <legend className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-3">
                Identity
              </legend>

              {/* Full name */}
              <Field
                label="Full name"
                required
                error={errors.displayName}
                icon={<UserIcon className="w-4 h-4" />}
              >
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => set('displayName', e.target.value)}
                  placeholder="e.g. Aparichit Amrita"
                  className={inputCls(errors.displayName)}
                />
              </Field>

              {/* Campus mail */}
              <Field
                label="Campus mail"
                required
                error={errors.campusMail}
                icon={<Mail className="w-4 h-4" />}
                hint="Your official campus / institutional email"
              >
                <input
                  type="email"
                  value={form.campusMail}
                  onChange={(e) => set('campusMail', e.target.value)}
                  placeholder="e.g. cb.en.u4cys23055@cb.students.amrita.edu"
                  className={inputCls(errors.campusMail)}
                />
              </Field>
            </fieldset>

            {/* ── Section: Academic ─────────────────────────────────────────── */}
            <fieldset className="space-y-4">
              <legend className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-3">
                Academic details
              </legend>

              {/* Roll number */}
              <Field
                label="Roll number"
                required
                error={errors.rollNumber}
                icon={<Hash className="w-4 h-4" />}
                hint="Format: CH.SC.U4CYS followed by 5 digits"
              >
                <input
                  type="text"
                  value={form.rollNumber}
                  onChange={(e) => set('rollNumber', e.target.value.toUpperCase())}
                  placeholder="CH.SC.U4CYS23055"
                  className={`${inputCls(errors.rollNumber)} uppercase`}
                  maxLength={18}
                  spellCheck={false}
                />
              </Field>

              {/* Batch + Section side by side */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Batch"
                  required
                  error={errors.batch}
                  icon={<GraduationCap className="w-4 h-4" />}
                >
                  <select
                    value={form.batch}
                    onChange={(e) => set('batch', e.target.value)}
                    className={selectCls(errors.batch)}
                  >
                    <option value="">Select batch</option>
                    {BATCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Section"
                  required
                  error={errors.section}
                  icon={<Layers className="w-4 h-4" />}
                >
                  <select
                    value={form.section}
                    onChange={(e) => set('section', e.target.value)}
                    className={selectCls(errors.section)}
                  >
                    <option value="">Select section</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {/* ── Section: About ────────────────────────────────────────────── */}
            <fieldset className="space-y-4">
              <legend className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-3">
                About
              </legend>

              <Field label="Bio" error={errors.bio} hint={`${form.bio.length}/500`}>
                <textarea
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="A short intro about yourself — interests, focus areas, current projects…"
                  className={`${inputCls()} resize-none`}
                />
              </Field>
            </fieldset>

            {/* ── Section: Links ────────────────────────────────────────────── */}
            <fieldset>
              <div className="flex items-center justify-between mb-3">
                <legend className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">
                  Links
                </legend>
                <button
                  type="button"
                  onClick={addLink}
                  disabled={form.links.length >= 5}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add link
                </button>
              </div>

              {errors.links && (
                <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.links}
                </p>
              )}

              {form.links.length === 0 ? (
                <p className="text-sm text-gray-600 italic">No links added yet.</p>
              ) : (
                <div className="space-y-3">
                  {form.links.map((lnk, i) => (
                    <LinkRow
                      key={i}
                      link={lnk}
                      onChange={(patch) => updateLink(i, patch)}
                      onRemove={() => removeLink(i)}
                    />
                  ))}
                </div>
              )}
            </fieldset>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-8 pb-7 pt-2 border-t border-gray-800">
            {!isSetup ? (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            ) : (
              <p className="text-xs text-gray-600 max-w-[260px]">
                You can edit these details later from the user menu.
              </p>
            )}

            <button
              type="submit"
              disabled={saving || success}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : success ? (
                <><CheckCircle className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save profile</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, required, error, hint, icon, children }) => (
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
        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
      </p>
    )}
  </div>
);

interface LinkRowProps {
  link: StudentLink;
  onChange: (patch: Partial<StudentLink>) => void;
  onRemove: () => void;
}

const LinkRow: React.FC<LinkRowProps> = ({ link, onChange, onRemove }) => {
  const cfg = LINK_TYPES.find((t) => t.value === link.type) ?? LINK_TYPES[4];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-2">
      {/* Type selector */}
      <div className="relative">
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        <select
          value={link.type}
          onChange={(e) => onChange({ type: e.target.value as StudentLink['type'] })}
          className="appearance-none pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50"
        >
          {LINK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* URL input */}
      <input
        type="url"
        value={link.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="https://..."
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50"
      />

      {/* Optional label */}
      <input
        type="text"
        value={link.label ?? ''}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Label (opt)"
        className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50"
      />

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        aria-label="Remove link"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputCls = (error?: string) =>
  `w-full bg-gray-800 border ${error ? 'border-red-500/60' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-colors`;

const selectCls = (error?: string) =>
  `w-full bg-gray-800 border ${error ? 'border-red-500/60' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-colors`;

export default StudentProfileForm;
