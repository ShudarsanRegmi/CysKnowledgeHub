import React, { useMemo, useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import { PROJECTS } from '../projectsData';
import { Project } from '../types';
import { Search, Filter } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    PROJECTS.forEach(p => p.categories.forEach(c => s.add(c)));
    return ['All', ...Array.from(s).sort()];
  }, []);

  const featured = useMemo(() => PROJECTS.filter(p => p.featured).slice(0, 5), []);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  function prevFeatured() {
    setFeaturedIndex((i) => (i - 1 + featured.length) % featured.length);
  }

  function nextFeatured() {
    setFeaturedIndex((i) => (i + 1) % featured.length);
  }

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      if (category !== 'All' && !p.categories.includes(category)) return false;
      const q = debounced.trim().toLowerCase();
      if (!q) return true;
      const inTitle = p.title.toLowerCase().includes(q);
      const inAbstract = (p.abstract || '').toLowerCase().includes(q);
      const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
      return inTitle || inAbstract || inTags;
    });
  }, [debounced, category]);

  // Group by category for comprehensive section
  const grouped = useMemo(() => {
    const map = new Map<string, Project[]>();
    filtered.forEach(p => {
      p.categories.forEach(c => {
        if (!map.has(c)) map.set(c, []);
        map.get(c)!.push(p);
      });
    });
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  }, [filtered]);

  function openProject(p: Project) {
    setSelected(p);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-400">Browse featured and categorized projects from the community.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={query} onChange={(e)=>setQuery(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none" placeholder="Search projects..." />
          </div>

          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full py-2 px-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-transparent outline-none text-sm">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Showcase - TV style */}
      <section>
        {/* TV Branding is shown on the bezel */}

        {featured.length > 0 && (
          <div className="space-y-6">
            {/* TV bezel wrapping the primary featured project with interactive controls */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl relative">
                <div className="relative rounded-3xl bg-[#0b1220] border-2 border-gray-800 shadow-xl overflow-visible">
                  {/* top speaker / info bar */}
                  <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">CYBERSHIELD TV</div>
                      <div className="w-36 h-3 bg-gray-800 rounded-md opacity-80 hidden sm:block" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm" />
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm" />
                    </div>
                  </div>

                  {/* screen area - shows prev/current/next partially */}
                  <div className="p-6 pt-10 overflow-hidden min-h-[260px] md:min-h-[360px]">
                    <div className="flex items-center justify-center relative">
                      <button onClick={(e)=>{e.stopPropagation(); prevFeatured();}} aria-label="Previous" className="absolute left-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full">
                        ‹
                      </button>

                      <div className="w-full flex items-center justify-center">
                        <div className="flex items-center gap-8 transition-all duration-500 ease-in-out items-stretch justify-center">
                          {/* prev (small and recessed) */}
                          {featured.length > 1 && (
                            <div className="w-40 opacity-20 transform scale-75 translate-y-8 pointer-events-none">
                              <ProjectCard project={featured[(featuredIndex - 1 + featured.length) % featured.length]} onClick={openProject} variant="showcase" />
                            </div>
                          )}

                          {/* current (center, takes max width) */}
                          <div className="w-full max-w-3xl">
                            <div className="transform transition-transform duration-500 z-20">
                              <ProjectCard project={featured[featuredIndex]} onClick={openProject} variant="showcase" />
                            </div>
                          </div>

                          {/* next (small and recessed) */}
                          {featured.length > 1 && (
                            <div className="w-40 opacity-20 transform scale-75 -translate-y-8 pointer-events-none">
                              <ProjectCard project={featured[(featuredIndex + 1) % featured.length]} onClick={openProject} variant="showcase" />
                            </div>
                          )}
                        </div>
                      </div>

                      <button onClick={(e)=>{e.stopPropagation(); nextFeatured();}} aria-label="Next" className="absolute right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full">
                        ›
                      </button>
                    </div>
                  </div>

                  {/* bottom control strip (bezel) */}
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4">
                    <div className="w-12 h-3 bg-gray-800 rounded-md" />
                    <div className="w-4 h-4 bg-gray-700 rounded-full" />
                    <div className="w-4 h-4 bg-gray-700 rounded-full" />
                    <div className="w-12 h-3 bg-gray-800 rounded-md" />
                  </div>
                </div>

                {/* TV stand below bezel */}
                <div className="flex justify-center -mt-6">
                  <div className="w-8 h-12 bg-gray-800 rounded-md shadow-inner" />
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-96 h-6 bg-gray-900 rounded-full shadow-inner" />
                </div>
              </div>
            </div>

            {/* Secondary featured items (if any) shown below as smaller cards */}
            {featured.length > 1 && (
              <div className="flex justify-center gap-6">
                {featured.map((p, idx) => (
                  <div key={p.id} className={`w-44 transition-transform duration-300 ${idx === featuredIndex ? 'scale-105' : 'opacity-60 scale-95'}`}>
                    <ProjectCard project={p} onClick={openProject} variant="showcase" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Comprehensive grouped list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">All Projects</h2>
            <p className="text-gray-400">Browse projects grouped by categories. Use search and filters to narrow down.</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No projects found. Try a different filter or search.</div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([cat, items]) => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xl font-bold">{cat} <span className="text-sm text-gray-400">({items.length})</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(p => <ProjectCard key={p.id} project={p} onClick={openProject} />)}
                </div>
              </div>
            ))}
          </div>
        )} 
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      </section>
      
    </div>
  );
};

export default ProjectsPage;
