import React, { useState } from 'react';
import { Education } from '../../types/resume';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationEditor: React.FC<Props> = ({ education, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const handleAddEducation = () => {
    const newId = `edu-${Date.now()}`;
    const newEdu: Education = {
      id: newId,
      institution: 'University / College Name',
      degree: 'Bachelor of Science (B.S.)',
      fieldOfStudy: 'Computer Science',
      location: 'City, State',
      startDate: '2019',
      endDate: '2023',
      gpa: '3.8 / 4.0',
      honors: 'Dean’s List Honor Roll',
      highlights: ['Relevant Coursework: Data Structures, Algorithms, Distributed Computing']
    };
    onChange([newEdu, ...education]);
    setExpandedId(newId);
  };

  const handleDeleteEducation = (id: string) => {
    onChange(education.filter((e) => e.id !== id));
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    onChange(
      education.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Education & Academics</h3>
          <p className="text-xs text-slate-500">Add university degrees, academic honors, and relevant coursework.</p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Degree</span>
        </button>
      </div>

      <div className="space-y-3">
        {education.map((edu) => {
          const isExpanded = expandedId === edu.id;

          return (
            <div
              key={edu.id}
              className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {edu.institution} ({edu.startDate} – {edu.endDate})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEducation(edu.id);
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
                        Institution / University *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Degree (e.g. B.S., M.S., Ph.D.) *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Major / Field of Study *
                      </label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleUpdateEducation(edu.id, { fieldOfStudy: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Location (City, State)
                      </label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Years Attended (Start – Graduation)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => handleUpdateEducation(edu.id, { startDate: e.target.value })}
                          placeholder="2018"
                          className="w-1/2 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                        <span className="text-xs text-slate-400">–</span>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => handleUpdateEducation(edu.id, { endDate: e.target.value })}
                          placeholder="2022"
                          className="w-1/2 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GPA or Honors (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleUpdateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="e.g. 3.9 / 4.0 or Magna Cum Laude"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
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
