import React from 'react';
import { Project } from '../types';
import { ExternalLink, Github, Users } from 'lucide-react';

interface Props {
  project: Project;
  onClick?: (p: Project) => void;
  variant?: 'default' | 'showcase';
  highlight?: boolean;
}

const ProjectCard: React.FC<Props> = ({ project, onClick, variant = 'default' }) => {
  const isShowcase = variant === 'showcase';

  return (
    <div
      onClick={() => onClick && onClick(project)}
      className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer ${isShowcase ? 'shadow-lg' : ''} ${project.featured ? 'transform-gpu' : ''}`}
      role="button"
      tabIndex={0}
    >
      {project.imageUrl && (
        <div className={`relative ${isShowcase ? 'h-44' : 'h-40'}`}>
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          {project.featured && isShowcase && (
            <div className="absolute top-3 left-3 bg-cyan-600 text-black text-xs font-bold px-3 py-1 rounded-full">FEATURED</div>
          )}
          {isShowcase && (
            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg line-clamp-1">{project.title}</h3>
                  <div className="text-gray-200 text-sm mt-1">{project.categories.join(' • ')}</div>
                </div>
                <div className="text-gray-200 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{(project.contributors || []).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`p-4 ${isShowcase ? 'pt-3' : ''}`}>
        {!isShowcase && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400">{project.year || project.batch}</div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Users className="w-4 h-4" />
                <span>{(project.contributors || []).length}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2 line-clamp-2">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.abstract}</p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {project.categories.slice(0, 2).map((c) => (
                  <span key={c} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">{c}</span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.links && project.links.slice(0,2).map((l) => (
                  <a key={l.url} href={l.url} onClick={(e)=>e.stopPropagation()} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400">
                    {l.type === 'github' ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                  </a>
                ))}
                <button onClick={(e)=>{ e.stopPropagation(); onClick && onClick(project);}} className="text-cyan-500 font-medium text-sm">Details</button>
              </div>
            </div>
          </>
        )}

        {isShowcase && (
          <div className="mt-3">
            <p className="text-gray-300 text-sm line-clamp-2">{project.abstract}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                {project.categories.slice(0,2).map(c => <span key={c} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">{c}</span>)}
              </div>
              <button onClick={(e)=>{ e.stopPropagation(); onClick && onClick(project);}} className="bg-cyan-600 text-black px-3 py-1 rounded font-semibold text-sm">View</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
