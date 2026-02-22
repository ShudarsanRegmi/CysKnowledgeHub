import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github } from 'lucide-react';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetail: React.FC<Props> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl overflow-auto max-h-[90vh] z-10">
        <div className="p-6 border-b border-gray-800 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="text-sm text-gray-400 mt-1">{project.year || project.batch} • {project.categories.join(', ')}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />}

        <div className="p-6 space-y-4">
          <p className="text-gray-300">{project.description || project.abstract}</p>

          {project.contributors && project.contributors.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-1">Contributors</h4>
              <div className="text-gray-400 text-sm">{project.contributors.join(', ')}</div>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(t => <span key={t} className="text-[10px] bg-gray-800 px-2 py-1 rounded">{t}</span>)}
              </div>
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2">Links</h4>
              <div className="flex flex-wrap gap-3">
                {project.links.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded hover:bg-gray-800/70">
                    {l.type === 'github' ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    <span className="text-sm text-gray-300">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
