import React, { useState } from 'react';
import { SkillCategory, SkillItem } from '../../types/resume';
import { Plus, Trash2, Cpu } from 'lucide-react';

interface Props {
  skillCategories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<Props> = ({ skillCategories, onChange }) => {
  const [newCatName, setNewCatName] = useState('');
  const [skillInputs, setSkillInputs] = useState<{ [catId: string]: string }>({});

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCategory: SkillCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      skills: []
    };
    onChange([...skillCategories, newCategory]);
    setNewCatName('');
  };

  const handleDeleteCategory = (catId: string) => {
    onChange(skillCategories.filter((c) => c.id !== catId));
  };

  const handleAddSkill = (catId: string) => {
    const text = (skillInputs[catId] || '').trim();
    if (!text) return;

    onChange(
      skillCategories.map((c) => {
        if (c.id !== catId) return c;
        if (c.skills.some((s) => s.name.toLowerCase() === text.toLowerCase())) return c;
        return {
          ...c,
          skills: [...c.skills, { id: `sk-${Date.now()}`, name: text, level: 'Advanced' }]
        };
      })
    );

    setSkillInputs({ ...skillInputs, [catId]: '' });
  };

  const handleRemoveSkill = (catId: string, skillId: string) => {
    onChange(
      skillCategories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.filter((s) => s.id !== skillId)
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Skills & Technical Competencies</h3>
          <p className="text-xs text-slate-500">
            Categorized skills maximize ATS keyword indexing and readability.
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3.5">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(skillCategories.map((c) => (c.id === cat.id ? { ...c, name: val } : c)));
                }}
                className="font-bold text-xs text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
              />
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive tag list - unboxed or styled pills allowed since they have interactive delete handlers */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200/70 text-slate-800 rounded-md border border-slate-200/80 transition-colors"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat.id, skill.id)}
                    className="text-slate-400 hover:text-rose-600 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (press Enter)..."
                value={skillInputs[cat.id] || ''}
                onChange={(e) => setSkillInputs({ ...skillInputs, [cat.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(cat.id);
                  }
                }}
                className="flex-1 px-3 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(cat.id)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new Category */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-2">
        <input
          type="text"
          placeholder="New Category (e.g. Cloud & DevOps, Databases, Soft Skills)..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>
    </div>
  );
};
