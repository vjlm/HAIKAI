import React, { useState } from 'react';
import { WorkExperience } from '../../types/resume';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Building2, Calendar, MapPin, Tag } from 'lucide-react';
import { ActionVerbsModal } from './ActionVerbsModal';

interface Props {
  experience: WorkExperience[];
  onChange: (experience: WorkExperience[]) => void;
}

export const ExperienceEditor: React.FC<Props> = ({ experience, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [showVerbsModal, setShowVerbsModal] = useState(false);
  const [activeBulletTarget, setActiveBulletTarget] = useState<{ expId: string; bulletIdx: number } | null>(null);

  const handleAddExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: WorkExperience = {
      id: newId,
      company: 'Company / Organization',
      role: 'Software Engineer',
      location: 'City, State',
      startDate: '2023-01',
      endDate: '',
      current: true,
      bullets: [
        'Spearheaded development of core features resulting in a 25% increase in user engagement.',
        'Engineered scalable RESTful API endpoints handling over 5,000 requests per minute with 99.9% uptime.'
      ],
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL']
    };
    onChange([newExp, ...experience]);
    setExpandedId(newId);
  };

  const handleDeleteExperience = (id: string) => {
    onChange(experience.filter((e) => e.id !== id));
  };

  const handleUpdateExperience = (id: string, updates: Partial<WorkExperience>) => {
    onChange(
      experience.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleAddBullet = (expId: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const newBullets = [...exp.bullets, ''];
    handleUpdateExperience(expId, { bullets: newBullets });
  };

  const handleUpdateBullet = (expId: string, index: number, text: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const newBullets = [...exp.bullets];
    newBullets[index] = text;
    handleUpdateExperience(expId, { bullets: newBullets });
  };

  const handleDeleteBullet = (expId: string, index: number) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const newBullets = exp.bullets.filter((_, i) => i !== index);
    handleUpdateExperience(expId, { bullets: newBullets });
  };

  const handleAddTechTag = (expId: string, tag: string) => {
    if (!tag.trim()) return;
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const currentTags = exp.techStack || [];
    if (currentTags.includes(tag.trim())) return;
    handleUpdateExperience(expId, { techStack: [...currentTags, tag.trim()] });
  };

  const handleRemoveTechTag = (expId: string, tagToRemove: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const currentTags = exp.techStack || [];
    handleUpdateExperience(expId, { techStack: currentTags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
          <p className="text-xs text-slate-500">Document your career history with measurable impact.</p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-3">
        {experience.map((exp, expIdx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div
              key={exp.id}
              className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header (Accordion toggle) */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {expIdx + 1}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {exp.role || 'Position Title'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {exp.company || 'Company'} · {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'End Date'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExperience(exp.id);
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

              {/* Card Body */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Job Title / Role *
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(exp.id, { location: e.target.value })}
                        placeholder="e.g. San Francisco, CA / Remote"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Time Period
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="e.g. 2021-03"
                          className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                        <span className="text-xs text-slate-400">–</span>
                        {exp.current ? (
                          <div className="w-1/2 px-2.5 py-1.5 text-xs bg-slate-100 rounded-lg text-slate-600 font-medium">
                            Present
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="e.g. 2023-08"
                            className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                          />
                        )}
                      </div>
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(exp.id, { current: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-[11px] text-slate-600">I currently work here</span>
                      </label>
                    </div>
                  </div>

                  {/* Bullet Points with Action Verbs trigger */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Key Responsibilities & Measurable Impact
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveBulletTarget(null);
                          setShowVerbsModal(true);
                        }}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Action Verbs Guide</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-xs font-bold text-slate-400 mt-2 select-none">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                            placeholder="Start with a strong action verb + metric (e.g. Architected distributed pipeline processing 25M requests...)"
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteBullet(exp.id, bIdx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBullet(exp.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Achievement Bullet</span>
                    </button>
                  </div>

                  {/* Tech stack used in this role */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      Role Technologies / Tools
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(exp.techStack || []).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTechTag(exp.id, tech)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type a technology and press Enter (e.g. AWS, React, Kafka)..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTechTag(exp.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ActionVerbsModal
        isOpen={showVerbsModal}
        onClose={() => setShowVerbsModal(false)}
        onSelectVerb={(verb) => {
          if (activeBulletTarget) {
            const exp = experience.find(e => e.id === activeBulletTarget.expId);
            if (exp) {
              const currentText = exp.bullets[activeBulletTarget.bulletIdx] || '';
              handleUpdateBullet(exp.id, activeBulletTarget.bulletIdx, currentText ? `${verb} ${currentText}` : `${verb} `);
            }
          }
        }}
      />
    </div>
  );
};
