import React, { useEffect } from 'react';
import { ApiProject } from '../services/ctfApi';
import {
  X, ExternalLink, Github, Users, Calendar, Tag,
  FileText, Video, Code2, Star, Globe, ChevronRight,
  Layers, BookOpen, Play
} from 'lucide-react';

interface Props {
  project: ApiProject | null;
  onClose: () => void;
}

const categoryColorMap: Record<string, string> = {
  'Cyber Forensics':  'bg-purple-900/40 text-purple-300 border-purple-500/30',
  'VAPT':             'bg-red-900/40 text-red-300 border-red-500/30',
  'Network Security': 'bg-blue-900/40 text-blue-300 border-blue-500/30',
  'Malware Analysis': 'bg-orange-900/40 text-orange-300 border-orange-500/30',
  'Cloud Security':   'bg-sky-900/40 text-sky-300 border-sky-500/30',
  'Red Team':         'bg-rose-900/40 text-rose-300 border-rose-500/30',
  'SIEM':             'bg-indigo-900/40 text-indigo-300 border-indigo-500/30',
  'Research':         'bg-emerald-900/40 text-emerald-300 border-emerald-500/30',
  'IoT':              'bg-teal-900/40 text-teal-300 border-teal-500/30',
  'Threat Hunting':   'bg-yellow-900/40 text-yellow-300 border-yellow-500/30',
};

const getCategoryColor = (cat: string) =>
  categoryColorMap[cat] ?? 'bg-gray-800/60 text-gray-300 border-gray-600/30';

const typeColorMap: Record<string, string> = {
  'Final Year':  'bg-cyan-900/40 text-cyan-300 border-cyan-500/30',
  'Semester':    'bg-emerald-900/40 text-emerald-300 border-emerald-500/30',
  'Hackathon':   'bg-purple-900/40 text-purple-300 border-purple-500/30',
  'Research':    'bg-amber-900/40 text-amber-300 border-amber-500/30',
  'Tool':        'bg-gray-800/60 text-gray-300 border-gray-600/30',
};

const ProjectDetailModal: React.FC<Props> = ({ project, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;

  const githubLink  = project.links?.find(l => l.type === 'github');
  const demoLink    = project.links?.find(l => l.type === 'demo');
  const paperLink   = project.links?.find(l => l.type === 'paper');
  const docsLink    = project.links?.find(l => l.type === 'docs');
  const otherLinks  = project.links?.filter(l => !['github', 'demo', 'paper', 'docs'].includes(l.type ?? '')) ?? [];

  const hasVideo = !!project.demoVideoUrl;
  const isYouTube = hasVideo && (project.demoVideoUrl!.includes('youtube.com') || project.demoVideoUrl!.includes('youtu.be'));
  const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl z-10 animate-scale-in max-h-[92vh] flex flex-col">

        {/* ── Hero Image / Header ── */}
        <div className="relative flex-shrink-0">
          {project.imageUrl ? (
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-cyan-900/30 via-gray-950 to-purple-900/20 flex items-center justify-center">
              <Code2 className="w-20 h-20 text-cyan-500/20" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className={`${project.imageUrl ? 'absolute bottom-0 left-0 right-0 p-6' : 'px-6 py-5'}`}>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.featured && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-amber-950">
                  <Star className="w-3 h-3" /> FEATURED
                </span>
              )}
              {project.projectType && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${typeColorMap[project.projectType] ?? 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                  {project.projectType} Project
                </span>
              )}
              {project.categories.map(c => (
                <span key={c} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getCategoryColor(c)}`}>
                  {c}
                </span>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {project.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {project.year && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" /> {project.year}
                </span>
              )}
              {project.batch && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <BookOpen className="w-4 h-4" /> {project.batch}
                </span>
              )}
              {(project.contributors?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Users className="w-4 h-4" /> {project.contributors!.length} contributor{project.contributors!.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">

          {/* Quick Action Links */}
          <div className="flex flex-wrap gap-3">
            {githubLink && (
              <a
                href={githubLink.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" /> GitHub Repository
              </a>
            )}
            {demoLink && (
              <a
                href={demoLink.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-sm font-semibold text-emerald-300 transition-all hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.demoVideoUrl && (
              <a
                href={project.demoVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/30 text-sm font-semibold text-rose-300 transition-all hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" /> Demo Video
              </a>
            )}
            {paperLink && (
              <a
                href={paperLink.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/30 text-sm font-semibold text-amber-300 transition-all hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" /> Paper / Report
              </a>
            )}
            {docsLink && (
              <a
                href={docsLink.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/30 text-sm font-semibold text-blue-300 transition-all hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" /> Documentation
              </a>
            )}
            {otherLinks.map(l => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-semibold text-gray-300 transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="w-4 h-4" /> {l.label}
              </a>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Description */}
            <div className="lg:col-span-2 space-y-6">

              {/* Abstract / Description */}
              <div>
                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5" /> About this Project
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {project.description || project.abstract}
                </p>
                {project.description && project.description !== project.abstract && (
                  <p className="text-gray-400 leading-relaxed text-sm mt-3">
                    {project.abstract}
                  </p>
                )}
              </div>

              {/* Demo Video Embed */}
              {hasVideo && (
                <div>
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Video className="w-3.5 h-3.5" /> Demo Video
                  </h3>
                  {isYouTube ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800">
                      <iframe
                        src={getYouTubeEmbed(project.demoVideoUrl!)}
                        title={project.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800">
                      <video src={project.demoVideoUrl} controls className="w-full h-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-gray-800/80 border border-cyan-500/15 text-cyan-400/90 text-xs font-mono hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(t => (
                      <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-400 text-xs hover:text-gray-300 cursor-default transition-colors">
                        <Tag className="w-2.5 h-2.5" /> #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">

              {/* Team Members */}
              {(project.contributors?.length ?? 0) > 0 && (
                <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Team Members
                  </h3>
                  <div className="space-y-2">
                    {project.contributors!.map((contributor, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border border-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-cyan-400">
                            {contributor.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-300 font-medium">{contributor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Metadata */}
              <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Project Info
                </h3>
                <dl className="space-y-3">
                  {project.year && (
                    <div>
                      <dt className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">Year</dt>
                      <dd className="text-sm text-gray-300">{project.year}</dd>
                    </div>
                  )}
                  {project.batch && (
                    <div>
                      <dt className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">Batch / Semester</dt>
                      <dd className="text-sm text-gray-300">{project.batch}</dd>
                    </div>
                  )}
                  {project.projectType && (
                    <div>
                      <dt className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">Project Type</dt>
                      <dd className="text-sm text-gray-300">{project.projectType} Project</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-1">Categories</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {project.categories.map(c => (
                        <span key={c} className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getCategoryColor(c)}`}>
                          {c}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* All Links */}
              {project.links && project.links.length > 0 && (
                <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" /> Resources
                  </h3>
                  <div className="space-y-2">
                    {project.links.map(l => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-800 transition-all group/link"
                      >
                        {l.type === 'github' && <Github className="w-4 h-4 text-gray-400 group-hover/link:text-cyan-400 flex-shrink-0" />}
                        {l.type === 'demo' && <Globe className="w-4 h-4 text-gray-400 group-hover/link:text-emerald-400 flex-shrink-0" />}
                        {l.type === 'paper' && <FileText className="w-4 h-4 text-gray-400 group-hover/link:text-amber-400 flex-shrink-0" />}
                        {l.type === 'docs' && <BookOpen className="w-4 h-4 text-gray-400 group-hover/link:text-blue-400 flex-shrink-0" />}
                        {(!l.type || l.type === 'other') && <ExternalLink className="w-4 h-4 text-gray-400 group-hover/link:text-gray-300 flex-shrink-0" />}
                        <span className="text-sm text-gray-400 group-hover/link:text-gray-200 truncate">{l.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover/link:text-gray-500 ml-auto flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
