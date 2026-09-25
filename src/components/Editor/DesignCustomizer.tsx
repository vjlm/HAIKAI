import React from 'react';
import { ResumeSettings, TemplateType, FontFamilyType, SpacingDensity } from '../../types/resume';
import { COLOR_THEMES } from '../../data/defaultResumes';
import { Palette, Type, LayoutTemplate, Sliders, Eye } from 'lucide-react';

interface Props {
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
}

export const DesignCustomizer: React.FC<Props> = ({ settings, onChange }) => {
  const templates: { id: TemplateType; name: string; desc: string }[] = [
    {
      id: 'modern-executive',
      name: 'Modern Executive',
      desc: 'Balanced corporate look with refined header and strong typography.'
    },
    {
      id: 'minimal-tech',
      name: 'Minimal Tech',
      desc: 'Monospace touches, prominent tech matrix, high ATS score.'
    },
    {
      id: 'creative-split',
      name: 'Creative Split',
      desc: 'Tinted sidebar for skills & contact with spacious right body.'
    },
    {
      id: 'classic-ivy',
      name: 'Classic Ivy',
      desc: 'Academic serif elegance, centered header, traditional prestige.'
    },
    {
      id: 'compact-grid',
      name: 'Compact Grid',
      desc: 'Dense multi-column layout for maximum impact on a single page.'
    }
  ];

  const fontOptions: { id: FontFamilyType; name: string; sample: string }[] = [
    { id: 'sans', name: 'Inter / Modern Sans', sample: 'Modern, crisp, versatile' },
    { id: 'serif', name: 'Cormorant / Classic Serif', sample: 'Academic, distinguished, editorial' },
    { id: 'mono', name: 'JetBrains / Monospace', sample: 'Engineering, precise, code-friendly' }
  ];

  const spacingOptions: { id: SpacingDensity; name: string }[] = [
    { id: 'compact', name: 'Compact (Fit 1 Page)' },
    { id: 'balanced', name: 'Balanced (Standard)' },
    { id: 'roomy', name: 'Roomy (Spacious)' }
  ];

  const handleToggleSection = (section: keyof ResumeSettings['visibleSections']) => {
    onChange({
      ...settings,
      visibleSections: {
        ...settings.visibleSections,
        [section]: !settings.visibleSections[section]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Template Chooser */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <LayoutTemplate className="w-4 h-4 text-indigo-600" />
          <span>Resume Template</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {templates.map((tpl) => {
            const isSelected = settings.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChange({ ...settings, template: tpl.id })}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 mb-0.5">{tpl.name}</div>
                <div className="text-[11px] text-slate-500 leading-normal">{tpl.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Palette */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span>Accent Color Palette</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {COLOR_THEMES.map((theme) => {
            const isSelected = settings.primaryColor === theme.primary;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChange({ ...settings, primaryColor: theme.primary })}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full shadow-inner mb-1.5"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-[10px] font-semibold text-slate-700 truncate w-full">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography & Font Family */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Type className="w-4 h-4 text-indigo-600" />
          <span>Typography Style</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {fontOptions.map((font) => {
            const isSelected = settings.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onChange({ ...settings, fontFamily: font.id })}
                className={`p-2.5 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{font.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{font.sample}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Spacing & Density */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Page Density & Spacing</span>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          {spacingOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ ...settings, spacing: opt.id })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                settings.spacing === opt.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Section Visibility Toggles */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Eye className="w-4 h-4 text-indigo-600" />
          <span>Section Visibility</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              ['summary', 'Summary'],
              ['experience', 'Experience'],
              ['skills', 'Skills'],
              ['projects', 'Projects'],
              ['education', 'Education'],
              ['certifications', 'Certifications'],
              ['awards', 'Awards']
            ] as const
          ).map(([key, label]) => {
            const isVisible = settings.visibleSections[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleToggleSection(key)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                  isVisible
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-400 opacity-60'
                }`}
              >
                {label} {isVisible ? '✓' : '×'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
