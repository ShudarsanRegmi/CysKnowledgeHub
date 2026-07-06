import React, { useMemo, useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import { getProjects, ApiProject } from '../services/ctfApi';
import {
  Search, X, ChevronRight, Star, Code2, SlidersHorizontal,
  GraduationCap, FlaskConical, Trophy, Microscope, Wrench, LayoutGrid, Layers,
  ArrowRight, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Category / filter config ─────────────────────────────────────────────────

const PROJECT_TYPES = [
  { id: 'all',        label: 'All Types',    icon: LayoutGrid  },
  { id: 'Final Year', label: 'Final Year',   icon: GraduationCap },
  { id: 'Semester',   label: 'Semester',     icon: Layers      },
  { id: 'Hackathon',  label: 'Hackathon',    icon: Trophy      },
  { id: 'Research',   label: 'Research',     icon: Microscope  },
  { id: 'Tool',       label: 'Tools',        icon: Wrench      },
];

const SORT_OPTIONS = [
  { id: 'year-desc',  label: 'Newest First' },
  { id: 'year-asc',   label: 'Oldest First' },
  { id: 'title-asc',  label: 'A → Z'        },
  { id: 'title-desc', label: 'Z → A'        },
];

const YEARS_LIMIT = 5;

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const CardSkeleton: React.FC = () => (
  <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-36 bg-gray-800" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-800 rounded w-2/3" />
      <div className="h-4 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-3/4" />
      <div className="flex gap-2 mt-4">
        <div className="h-5 bg-gray-800 rounded-full w-16" />
        <div className="h-5 bg-gray-800 rounded-full w-20" />
      </div>
    </div>
  </div>
);

// ─── Featured hero banner ─────────────────────────────────────────────────────

interface FeaturedBannerProps {
  project: ApiProject;
  onOpen: (p: ApiProject) => void;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ project, onOpen }) => (
  <div
    onClick={() => onOpen(project)}
    className="group relative rounded-3xl overflow-hidden cursor-pointer border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 bg-gray-900"
  >
    {/* Background image */}
    {project.imageUrl ? (
      <div className="absolute inset-0">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
      </div>
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-900 to-purple-900/20" />
    )}

    {/* Animated grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)', backgroundSize: '32px 32px' }}
    />

    <div className="relative p-8 md:p-12 min-h-[280px] flex flex-col justify-center max-w-3xl">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-amber-950 backdrop-blur-sm">
          <Star className="w-3 h-3" /> FEATURED PROJECT
        </span>
        {project.projectType && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold border border-cyan-500/30 bg-cyan-900/40 text-cyan-300">
            {project.projectType}
          </span>
        )}
        {project.categories.slice(0, 2).map(c => (
          <span key={c} className="px-3 py-1 rounded-full text-[10px] font-semibold border border-gray-700/60 bg-gray-900/60 text-gray-300 backdrop-blur-sm">
            {c}
          </span>
        ))}
      </div>

      <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-cyan-300 transition-colors duration-300">
        {project.title}
      </h2>
      <p className="text-gray-400 text-base md:text-lg mb-6 max-w-xl leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
        {project.abstract}
      </p>

      {/* Tech stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.slice(0, 5).map(t => (
            <span key={t} className="px-3 py-1 rounded-lg bg-gray-800/60 border border-cyan-500/15 text-cyan-400/80 text-xs font-mono backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={e => { e.stopPropagation(); onOpen(project); }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-50 font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20"
        >
          Explore Project <ArrowRight className="w-4 h-4" />
        </button>
        {project.links?.find(l => l.type === 'github') && (
          <a
            href={project.links.find(l => l.type === 'github')!.url}
            onClick={e => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold text-sm transition-all hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <Code2 className="w-4 h-4" /> Source Code
          </a>
        )}
      </div>
    </div>
  </div>
);

// ─── Main ProjectsPage ────────────────────────────────────────────────────────

const ProjectsPage: React.FC = () => {
  const [projects, setProjects]   = useState<ApiProject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory]   = useState('All');
  const [projectType, setProjectType] = useState('all');
  const [yearFilter, setYearFilter]   = useState('All');
  const [techFilter, setTechFilter]   = useState('All');
  const [sortBy, setSortBy]           = useState('year-desc');
  const [selected, setSelected]       = useState<ApiProject | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 220);
    return () => clearTimeout(t);
  }, [query]);

  // Auto-rotate featured projects
  useEffect(() => {
    const featured = projects.filter(p => p.featured);
    if (featured.length <= 1) return;
    const t = setInterval(() => {
      setFeaturedIdx(i => (i + 1) % featured.length);
    }, 7000);
    return () => clearInterval(t);
  }, [projects]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Computed data
  const allCategories = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => p.categories.forEach(c => s.add(c)));
    return ['All', ...Array.from(s).sort()];
  }, [projects]);

  const allYears = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => { if (p.year) s.add(p.year); });
    return ['All', ...Array.from(s).sort((a, b) => Number(b) - Number(a)).slice(0, YEARS_LIMIT)];
  }, [projects]);

  const allTechStacks = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => (p.techStack ?? []).forEach(t => s.add(t)));
    return ['All', ...Array.from(s).sort()].slice(0, 20);
  }, [projects]);

  const featured = useMemo(() => projects.filter(p => p.featured), [projects]);

  const filtered = useMemo(() => {
    let list = projects;

    // Category filter
    if (category !== 'All') {
      list = list.filter(p => p.categories.includes(category));
    }

    // Project type filter
    if (projectType !== 'all') {
      list = list.filter(p => p.projectType === projectType);
    }

    // Year filter
    if (yearFilter !== 'All') {
      list = list.filter(p => p.year === yearFilter);
    }

    // Tech stack filter
    if (techFilter !== 'All') {
      list = list.filter(p => p.techStack?.includes(techFilter));
    }

    // Search query
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter(p => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inAbstract = (p.abstract ?? '').toLowerCase().includes(q);
        const inDesc = (p.description ?? '').toLowerCase().includes(q);
        const inTags = (p.tags ?? []).some(t => t.toLowerCase().includes(q));
        const inCats = p.categories.some(c => c.toLowerCase().includes(q));
        const inTech = (p.techStack ?? []).some(t => t.toLowerCase().includes(q));
        const inContrib = (p.contributors ?? []).some(c => c.toLowerCase().includes(q));
        return inTitle || inAbstract || inDesc || inTags || inCats || inTech || inContrib;
      });
    }

    // Sorting
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'year-desc': return Number(b.year ?? 0) - Number(a.year ?? 0);
        case 'year-asc':  return Number(a.year ?? 0) - Number(b.year ?? 0);
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
  }, [projects, category, projectType, yearFilter, techFilter, debounced, sortBy]);

  // Group filtered by category for sectioned view
  const grouped = useMemo(() => {
    const map = new Map<string, ApiProject[]>();
    filtered.forEach(p => {
      const primaryCat = p.categories[0] ?? 'General';
      if (!map.has(primaryCat)) map.set(primaryCat, []);
      map.get(primaryCat)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const activeFilterCount = [
    category !== 'All',
    projectType !== 'all',
    yearFilter !== 'All',
    techFilter !== 'All',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCategory('All');
    setProjectType('all');
    setYearFilter('All');
    setTechFilter('All');
    setQuery('');
  };

  const toggleGroup = (cat: string) => {
    setExpandedGroups(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const INITIAL_PER_GROUP = 6;

  return (
    <div className="space-y-12 pb-8">

      {/* ── Page Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 md:p-12">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 rounded-full">
              Flagship Section
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Student <span className="text-cyan-500">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            The central hub for showcasing student work — from final-year projects and research to hackathon victories and security tools.
          </p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-cyan-500" /> {projects.length} Projects</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> {featured.length} Featured</span>
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-purple-400" /> {allCategories.length - 1} Categories</span>
          </div>
        </div>
      </div>

      {/* ── Featured Projects Section ── */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Featured Projects</h2>
                <p className="text-gray-500 text-sm">Hand-picked for their impact and quality</p>
              </div>
            </div>
            {featured.length > 1 && (
              <div className="flex items-center gap-2">
                {featured.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedIdx(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === featuredIdx
                        ? 'w-6 h-2 bg-cyan-500'
                        : 'w-2 h-2 bg-gray-700 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Main featured hero */}
          <FeaturedBanner
            project={featured[featuredIdx]}
            onOpen={setSelected}
          />

          {/* Thumbnail row */}
          {featured.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
              {featured.map((p, idx) => (
                <div
                  key={p._id}
                  onClick={() => setFeaturedIdx(idx)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                    idx === featuredIdx
                      ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'border-gray-800 hover:border-gray-700 opacity-60 hover:opacity-90'
                  }`}
                >
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-16 object-cover" />
                  ) : (
                    <div className="w-full h-16 bg-gray-800 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div className="bg-gray-900 px-2 py-1.5">
                    <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{p.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Search + Filters Bar ── */}
      <section>
        <div className="space-y-4">
          {/* Search and main controls row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, tags, tech stack, contributors… (⌘K)"
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder-gray-600"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-sm">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-gray-300 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-cyan-900/30 border-cyan-500/40 text-cyan-300'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-gray-950 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-red-500/30 bg-red-900/20 text-red-400 text-sm font-medium hover:bg-red-900/30 transition-all"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Project type pills */}
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map(pt => {
              const Icon = pt.icon;
              const active = projectType === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setProjectType(pt.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    active
                      ? 'bg-cyan-600 border-cyan-500 text-slate-50 shadow-lg shadow-cyan-500/20'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {pt.label}
                </button>
              );
            })}
          </div>

          {/* Advanced filters dropdown */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gray-900/60 border border-gray-800 rounded-2xl animate-fade-in">
              {/* Category */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Year</label>
                <select
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Tech Stack</label>
                <select
                  value={techFilter}
                  onChange={e => setTechFilter(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {allTechStacks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── All Projects (Grouped) ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">All Projects</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
              {(debounced || activeFilterCount > 0) && ' · filtered view'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-600 text-sm mb-6">Try adjusting your search terms or filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-semibold text-gray-300 transition-all"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(([cat, items]) => {
              const isExpanded = expandedGroups[cat] ?? false;
              const showToggle = items.length > INITIAL_PER_GROUP;
              const visibleItems = showToggle && !isExpanded ? items.slice(0, INITIAL_PER_GROUP) : items;

              return (
                <div key={cat}>
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-cyan-500/50" />
                      <h3 className="text-lg font-bold text-white">{cat}</h3>
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                    {showToggle && (
                      <button
                        onClick={() => toggleGroup(cat)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors"
                      >
                        {isExpanded
                          ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                          : <><ChevronDown className="w-3.5 h-3.5" /> Show all {items.length}</>
                        }
                      </button>
                    )}
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleItems.map(p => (
                      <ProjectCard
                        key={p._id}
                        project={p}
                        onClick={setSelected}
                        variant="featured-hero"
                      />
                    ))}
                  </div>

                  {/* Show more / less button */}
                  {showToggle && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => toggleGroup(cat)}
                        className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 text-sm text-gray-400 hover:text-gray-300 transition-all"
                      >
                        {isExpanded ? (
                          <><ChevronUp className="w-4 h-4" /> Show fewer</>
                        ) : (
                          <><ChevronRight className="w-4 h-4" /> {items.length - INITIAL_PER_GROUP} more in {cat}</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Project Detail Modal ── */}
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default ProjectsPage;
