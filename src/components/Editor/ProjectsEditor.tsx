import React, { useState } from 'react';
import { ProjectItem } from '../../types/resume';
import { Plus, Trash2, FolderGit2, ChevronDown, ChevronUp, Link as LinkIcon, Github } from 'lucide-react';

interface Props {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

export const ProjectsEditor: React.FC<Props> = ({ projects, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: ProjectItem = {
      id: newId,
      title: 'Project Name',
      role: 'Lead Developer',
      link: 'https://demo.project.org',
      github: 'https://github.com/username/project',
      startDate: '2023',
      endDate: '2024',
      bullets: [
        'Built an open-source tool used by 1,000+ developers worldwide.',
        'Engineered responsive interface and high-performance serverless backends.'
      ],
      technologies: ['React', 'TypeScript', 'Node.js']
    };
    onChange([newProj, ...projects]);
    setExpandedId(newId);
  };

  const handleDeleteProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleUpdateProject = (id: string, updates: Partial<ProjectItem>) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleAddBullet = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    handleUpdateProject(projId, { bullets: [...proj.bullets, ''] });
  };

  const handleUpdateBullet = (projId: string, index: number, text: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const bullets = [...proj.bullets];
    bullets[index] = text;
    handleUpdateProject(projId, { bullets });
  };

  const handleDeleteBullet = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    handleUpdateProject(projId, { bullets: proj.bullets.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Featured Projects</h3>
          <p className="text-xs text-slate-500">Showcase open-source repositories, client apps, and hackathons.</p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => {
          const isExpanded = expandedId === proj.id;

          return (
            <div
              key={proj.id}
              className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {proj.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {proj.role || 'Project'} · {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(proj.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(proj.id, { title: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Role (e.g. Lead Architect / Creator)
                      </label>
                      <input
                        type="text"
                        value={proj.role || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { role: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-slate-400" />
                        Repository URL
                      </label>
                      <input
                        type="text"
                        value={proj.github || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                        Live Demo / App URL
                      </label>
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { link: e.target.value })}
                        placeholder="https://myproject.com"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700">
                      Key Highlights & Accomplishments
                    </label>
                    {proj.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-slate-400 mt-2 select-none">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(proj.id, idx, e.target.value)}
                          placeholder="Describe what you built and measurable outcomes..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(proj.id, idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddBullet(proj.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  {/* Technologies */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                        handleUpdateProject(proj.id, { technologies: tags });
                      }}
                      placeholder="React, TypeScript, AWS, Docker"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
