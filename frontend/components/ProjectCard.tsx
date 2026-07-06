import React from 'react';
import { ApiProject } from '../services/ctfApi';
import {
  ExternalLink, Github, Users, Calendar, Tag,
  Video, FileText, Star, ArrowRight, Code2
} from 'lucide-react';

interface Props {
  project: ApiProject;
  onClick?: (p: ApiProject) => void;
  variant?: 'default' | 'featured-hero';
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

const typeColorMap: Record<string, string> = {
  'Final Year':  'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-50',
  'Semester':    'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-50',
  'Hackathon':   'bg-gradient-to-r from-purple-600 to-pink-600 text-slate-50',
  'Research':    'bg-gradient-to-r from-amber-600 to-orange-600 text-slate-50',
  'Tool':        'bg-gradient-to-r from-slate-600 to-gray-600 text-slate-50',
};

const getCategoryColor = (cat: string) =>
  categoryColorMap[cat] ?? 'bg-gray-800/60 text-gray-300 border-gray-600/30';

const ProjectCard: React.FC<Props> = ({ project, onClick, variant = 'default' }) => {
  const isFeaturedHero = variant === 'featured-hero';

  const githubLink = project.links?.find(l => l.type === 'github');
  const demoLink   = project.links?.find(l => l.type === 'demo');
  const paperLink  = project.links?.find(l => l.type === 'paper');

  if (isFeaturedHero) {
    return (
      <div
        onClick={() => onClick?.(project)}
        className="group relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700/60 rounded-3xl overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
              <Code2 className="w-16 h-16 text-cyan-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {project.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-amber-950 backdrop-blur-sm">
                <Star className="w-3 h-3" /> FEATURED
              </span>
            )}
            {project.projectType && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${typeColorMap[project.projectType] ?? 'bg-gray-800 text-gray-300'}`}>
                {project.projectType}
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.categories.slice(0, 3).map(c => (
              <span key={c} className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(c)}`}>
                {c}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{project.abstract}</p>

          {/* Tech stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.techStack.slice(0, 4).map(t => (
                <span key={t} className="text-[10px] bg-gray-800/80 text-cyan-400/80 px-2 py-0.5 rounded font-mono border border-cyan-500/10">
                  {t}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-[10px] text-gray-500 px-1.5 py-0.5">+{project.techStack.length - 4}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3">
              {project.year && (
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Calendar className="w-3 h-3" /> {project.year}
                </span>
              )}
              {(project.contributors?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Users className="w-3 h-3" /> {project.contributors!.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {githubLink && (
                <a href={githubLink.url} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {demoLink && (
                <a href={demoLink.url} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={e => { e.stopPropagation(); onClick?.(project); }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-500 hover:text-cyan-300 group/btn transition-all"
              >
                Details <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Default card ──────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => onClick?.(project)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(project)}
      className="group relative bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/40 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col"
    >
      {/* Top color accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      {project.imageUrl && (
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          {/* Quick link icons */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {githubLink && (
              <a href={githubLink.url} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-lg bg-black/75 text-slate-300 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-slate-700/50">
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {demoLink && (
              <a href={demoLink.url} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-lg bg-black/75 text-slate-300 hover:text-emerald-400 transition-colors backdrop-blur-sm border border-slate-700/50">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {(project.demoVideoUrl || project.links?.find(l => l.type === 'other')?.url) && (
              <a href={project.demoVideoUrl || '#'} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-lg bg-black/75 text-slate-300 hover:text-rose-400 transition-colors backdrop-blur-sm border border-slate-700/50">
                <Video className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          {/* Badges */}
          {project.projectType && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${typeColorMap[project.projectType] ?? 'bg-gray-800 text-gray-300'}`}>
                {project.projectType}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            {project.year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {project.year}
              </span>
            )}
            {project.batch && !project.year && (
              <span>{project.batch}</span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <Users className="w-3 h-3" /> {project.contributors?.length ?? 0}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white line-clamp-2 mb-1.5 group-hover:text-cyan-400 transition-colors duration-200 leading-snug">
          {project.title}
        </h3>

        {/* Abstract */}
        <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed flex-1">{project.abstract}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.categories.slice(0, 2).map(c => (
            <span key={c} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${getCategoryColor(c)}`}>
              {c}
            </span>
          ))}
          {project.categories.length > 2 && (
            <span className="text-[9px] text-gray-600 px-1">+{project.categories.length - 2}</span>
          )}
        </div>

        {/* Tech stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 3).map(t => (
              <span key={t} className="text-[9px] bg-gray-800/60 text-cyan-400/70 px-1.5 py-0.5 rounded font-mono border border-cyan-500/10">
                {t}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[9px] text-gray-600">+{project.techStack.length - 3}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[9px] text-gray-500 flex items-center gap-0.5">
                <Tag className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/60 mt-auto">
          <div className="flex gap-2">
            {paperLink && (
              <a href={paperLink.url} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-amber-400 transition-colors">
                <FileText className="w-3 h-3" /> Report
              </a>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClick?.(project); }}
            className="flex items-center gap-1 text-[11px] font-semibold text-cyan-500 hover:text-cyan-300 group/btn transition-all"
          >
            View details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
