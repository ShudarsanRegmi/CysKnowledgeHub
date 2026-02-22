import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../projectsData';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-gray-400 mt-2">The project you are looking for does not exist or has been removed.</p>
        <div className="mt-6">
          <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-cyan-600 rounded text-white">Back to Projects</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="text-sm text-gray-400">{project.year || project.batch} • {project.categories.join(', ')}</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="text-sm text-cyan-500 flex items-center gap-2">Back to projects <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>

      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover rounded-lg" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold">Abstract</h3>
          <p className="text-gray-300">{project.abstract}</p>

          {project.description && (
            <>
              <h3 className="text-xl font-bold">Details</h3>
              <p className="text-gray-300">{project.description}</p>
            </>
          )}

          {project.links && project.links.length > 0 && (
            <div>
              <h3 className="text-lg font-bold">External Links</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {project.links.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded hover:bg-gray-800">
                    {l.type === 'github' ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    <span className="text-sm text-gray-200">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 bg-gray-900 border border-gray-800 p-4 rounded-lg">
          <div>
            <h4 className="text-sm font-bold text-gray-300">Contributors</h4>
            <div className="text-gray-400 text-sm mt-2">{(project.contributors || []).join(', ') || '—'}</div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-300">Tags</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(project.tags || []).length > 0 ? project.tags.map(t => (
                <span key={t} className="text-[10px] bg-gray-800 px-2 py-1 rounded">{t}</span>
              )) : <div className="text-gray-400 text-sm">—</div>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-300">Categories</h4>
            <div className="text-gray-400 text-sm mt-2">{project.categories.join(', ')}</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
