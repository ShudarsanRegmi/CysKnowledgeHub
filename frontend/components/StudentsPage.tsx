import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Github, Linkedin, ExternalLink, Globe,
  Twitter, User, X, Loader2, RefreshCw, Link as LinkIcon,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentLink {
  type: 'linkedin' | 'github' | 'portfolio' | 'twitter' | 'other';
  url: string;
  label?: string;
}

export interface Student {
  _id: string;
  uid: string;
  displayName?: string;
  photoURL?: string;
  rollNumber?: string;
  batch?: string;
  section?: string;
  bio?: string;
  links?: StudentLink[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const nameToHue = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const LINK_CONFIG: Record<
  StudentLink['type'],
  { icon: React.FC<{ className?: string }>; label: string; color: string }
> = {
  linkedin:  { icon: Linkedin,     label: 'LinkedIn',  color: 'text-blue-400 hover:text-blue-300' },
  github:    { icon: Github,       label: 'GitHub',    color: 'text-gray-300 hover:text-white' },
  portfolio: { icon: Globe,        label: 'Portfolio', color: 'text-cyan-400 hover:text-cyan-300' },
  twitter:   { icon: Twitter,      label: 'Twitter',   color: 'text-sky-400 hover:text-sky-300' },
  other:     { icon: ExternalLink, label: 'Link',      color: 'text-gray-400 hover:text-gray-200' },
};

// ─── StudentCard ──────────────────────────────────────────────────────────────

const StudentCard: React.FC<{ student: Student; onClick: () => void }> = ({ student, onClick }) => {
  const name = student.displayName ?? 'Unknown';
  const hue = nameToHue(name);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const avatarStyle = isLight
    ? { background: `radial-gradient(circle at 40% 40%, hsl(${hue},40%,82%), hsl(${hue},25%,90%))`, color: `hsl(${hue},60%,30%)` }
    : { background: `radial-gradient(circle at 40% 40%, hsl(${hue},50%,20%), hsl(${hue},30%,10%))`, color: `hsl(${hue},80%,75%)` };

  const rollBadgeStyle = isLight
    ? { color: `hsl(${hue},60%,30%)`, borderColor: `hsl(${hue},50%,70%)`, backgroundColor: `hsl(${hue},40%,92%)` }
    : { color: `hsl(${hue},75%,65%)`, borderColor: `hsl(${hue},50%,30%)`, backgroundColor: `hsl(${hue},40%,12%)` };

  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center text-center
                 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, hsla(${hue},60%,50%,0.08) 0%, transparent 70%)` }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `hsl(${hue},70%,60%)` }}
      />

      {/* Avatar */}
      <div className="relative mb-4">
        {student.photoURL ? (
          <img
            src={student.photoURL}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-700 group-hover:border-cyan-500/60 transition-colors duration-300"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full border-2 border-gray-700 group-hover:border-cyan-500/60 flex items-center justify-center
                       text-xl font-bold transition-colors duration-300 select-none"
            style={avatarStyle}
          >
            {getInitials(name)}
          </div>
        )}
        {/* Section badge */}
        {student.section && (
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center text-[9px] font-black"
            style={{ background: `hsl(${hue},60%,25%)`, color: `hsl(${hue},80%,75%)` }}
          >
            {student.section}
          </span>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-100 leading-tight line-clamp-2 mb-1">{name}</p>

      {/* Roll number */}
      {student.rollNumber && (
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border mt-1 mb-3"
          style={rollBadgeStyle}
        >
          {student.rollNumber}
        </span>
      )}

      {/* Links */}
      {(student.links ?? []).length > 0 && (
        <div className="flex gap-3 mt-auto pt-2">
          {(student.links ?? []).slice(0, 4).map((lnk, i) => {
            const cfg = LINK_CONFIG[lnk.type] ?? LINK_CONFIG.other;
            const Icon = cfg.icon;
            return (
              <a
                key={i}
                href={lnk.url}
                target="_blank"
                rel="noopener noreferrer"
                title={lnk.label ?? cfg.label}
                className={`transition-colors ${cfg.color}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── StudentModal ─────────────────────────────────────────────────────────────

const StudentModal: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
  const name = student.displayName ?? 'Unknown';
  const hue = nameToHue(name);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${hue},70%,60%), transparent)` }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Avatar */}
          {student.photoURL ? (
            <img
              src={student.photoURL}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-2 mb-4"
              style={{ borderColor: `hsl(${hue},50%,40%)` }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-4 select-none"
              style={
                isLight
                  ? { background: `hsl(${hue},40%,82%)`, color: `hsl(${hue},60%,30%)` }
                  : { background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},80%,72%)` }
              }
            >
              {getInitials(name)}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>

          {/* Meta pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {student.rollNumber && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                style={{ color: `hsl(${hue},75%,65%)`, borderColor: `hsl(${hue},50%,30%)`, background: `hsl(${hue},40%,12%)` }}>
                {student.rollNumber}
              </span>
            )}
            {student.batch && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                Batch {student.batch}
              </span>
            )}
            {student.section && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                Section {student.section}
              </span>
            )}
          </div>

          {/* Bio */}
          {student.bio && (
            <p className="text-sm text-gray-400 mb-5 max-w-xs leading-relaxed">{student.bio}</p>
          )}

          {/* Links */}
          {(student.links ?? []).length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {(student.links ?? []).map((lnk, i) => {
                const cfg = LINK_CONFIG[lnk.type] ?? LINK_CONFIG.other;
                const Icon = cfg.icon;
                return (
                  <a
                    key={i}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg
                                bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors ${cfg.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    {lnk.label ?? cfg.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── BatchBlock ───────────────────────────────────────────────────────────────

const BatchBlock: React.FC<{
  batch: string;
  students: Student[];
  onSelect: (s: Student) => void;
}> = ({ batch, students, onSelect }) => {
  const sections = useMemo(
    () => Array.from(new Set(students.map((s) => s.section ?? '?'))).sort(),
    [students]
  );

  return (
    <div>
      {/* Batch heading */}
      <div className="flex items-center gap-3 mb-5">
        <div className="px-4 py-1.5 bg-gray-900 border border-gray-700 rounded-xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Batch</span>
          <span className="text-lg font-bold text-white">{batch}</span>
        </div>
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-xs text-gray-600">{students.length} student{students.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Section sub-groups */}
      {sections.map((sec) => {
        const secStudents = students.filter((s) => (s.section ?? '?') === sec);
        return (
          <div key={sec} className="mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-[10px]">
                {sec}
              </span>
              Section {sec}
              <span className="text-gray-700 font-normal normal-case">— {secStudents.length}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {secStudents.map((s) => (
                <StudentCard key={s._id} student={s} onClick={() => onSelect(s)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentsPage: React.FC = () => {
  const [students, setStudents]     = useState<Student[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [query, setQuery]           = useState('');
  const [batchFilter, setBatchFilter]     = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile/students`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch (err) {
      setError('Could not load student data. Please try again.');
      console.error('[StudentsPage]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── Derived filter options ──────────────────────────────────────────────────
  const batches = useMemo(
    () => ['All', ...Array.from(new Set(students.map((s) => s.batch ?? ''))).filter(Boolean).sort((a, b) => Number(b) - Number(a))],
    [students]
  );
  const sections = useMemo(
    () => ['All', ...Array.from(new Set(students.map((s) => s.section ?? ''))).filter(Boolean).sort()],
    [students]
  );

  // ── Filtered + grouped by batch ─────────────────────────────────────────────
  const batchGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = students.filter((s) => {
      if (batchFilter   !== 'All' && s.batch   !== batchFilter)   return false;
      if (sectionFilter !== 'All' && s.section !== sectionFilter) return false;
      if (q) {
        const name = (s.displayName ?? '').toLowerCase();
        const roll = (s.rollNumber  ?? '').toLowerCase();
        if (!name.includes(q) && !roll.includes(q)) return false;
      }
      return true;
    });

    const map = new Map<string, Student[]>();
    filtered.forEach((s) => {
      const b = s.batch ?? 'Unknown';
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => Number(b) - Number(a));
  }, [students, query, batchFilter, sectionFilter]);

  const totalVisible = batchGroups.reduce((sum, [, arr]) => sum + arr.length, 0);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 p-8 md:p-10">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest mb-3 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Department Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">Our Students</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              Every student in the department — batch by batch, section by section. The brightest minds securing tomorrow's digital world.
            </p>
          </div>

          {/* Quick stats */}
          {!loading && !error && (
            <div className="flex gap-4 flex-shrink-0">
              {[
                { label: 'Batches',  value: batches.length - 1 },
                { label: 'Students', value: students.length },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-900/70 border border-gray-800 rounded-2xl px-5 py-4 text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Loading ────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="py-24 flex flex-col items-center gap-4 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          <p className="text-sm">Loading students…</p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="py-20 text-center border border-red-800/40 rounded-3xl bg-red-900/10">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchStudents}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* ── Controls + list ────────────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number…"
                className="w-full bg-gray-900 border border-gray-800 rounded-full py-2.5 pl-10 pr-4 text-sm
                           focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50
                           placeholder-gray-600 transition-colors"
              />
            </div>

            {/* Batch pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mr-1">Batch:</span>
              {batches.map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchFilter(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    batchFilter === b
                      ? 'bg-cyan-600 text-slate-50'
                      : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-cyan-500/40 hover:text-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Section pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mr-1">Section:</span>
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectionFilter(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sectionFilter === sec
                      ? 'bg-cyan-600 text-slate-50'
                      : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-cyan-500/40 hover:text-gray-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {(query || batchFilter !== 'All' || sectionFilter !== 'All') && (
            <p className="text-sm text-gray-500">
              Showing <span className="text-cyan-400 font-semibold">{totalVisible}</span> student{totalVisible !== 1 ? 's' : ''}
              {query && <> matching "<span className="text-gray-300">{query}</span>"</>}
            </p>
          )}

          {/* Empty state — no students at all */}
          {students.length === 0 && (
            <div className="py-20 text-center border border-gray-800 rounded-3xl bg-gray-900/40">
              <User className="w-14 h-14 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-1">No profiles yet</p>
              <p className="text-gray-600 text-sm">
                Students who complete their profile will appear here.
              </p>
            </div>
          )}

          {/* Empty state — filters returned nothing */}
          {students.length > 0 && batchGroups.length === 0 && (
            <div className="py-20 text-center border border-gray-800 rounded-3xl bg-gray-900/40">
              <User className="w-14 h-14 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-1">No students found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Batch groups */}
          {batchGroups.length > 0 && (
            <div className="space-y-8">
              {batchGroups.map(([batch, bStudents]) => (
                <BatchBlock key={batch} batch={batch} students={bStudents} onSelect={setSelectedStudent} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Student detail modal */}
      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default StudentsPage;
