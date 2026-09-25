import React, { useState } from 'react';
import { ResumeData } from '../types/resume';
import { X, Download, Upload, Copy, Check, Share2, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onImport: (data: ResumeData) => void;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, resume, onImport }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyPlainText = () => {
    const lines: string[] = [];
    const { personalInfo, experience, education, skillCategories, projects, certifications } = resume;

    lines.push(personalInfo.fullName.toUpperCase());
    lines.push(personalInfo.jobTitle);
    lines.push(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`);
    if (personalInfo.linkedin) lines.push(`LinkedIn: ${personalInfo.linkedin}`);
    if (personalInfo.github) lines.push(`GitHub: ${personalInfo.github}`);
    lines.push('');

    if (personalInfo.summary) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push('-------------------');
      lines.push(personalInfo.summary);
      lines.push('');
    }

    if (experience.length > 0) {
      lines.push('WORK EXPERIENCE');
      lines.push('---------------');
      experience.forEach((e) => {
        lines.push(`${e.role} — ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`);
        if (e.location) lines.push(`Location: ${e.location}`);
        (e.bullets || []).forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (skillCategories.length > 0) {
      lines.push('SKILLS');
      lines.push('------');
      skillCategories.forEach((c) => {
        lines.push(`${c.name}: ${c.skills.map((s) => s.name).join(', ')}`);
      });
      lines.push('');
    }

    if (projects.length > 0) {
      lines.push('PROJECTS');
      lines.push('--------');
      projects.forEach((p) => {
        lines.push(`${p.title} (${p.startDate || ''} - ${p.endDate || ''})`);
        (p.bullets || []).forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (education.length > 0) {
      lines.push('EDUCATION');
      lines.push('---------');
      education.forEach((ed) => {
        lines.push(`${ed.degree} in ${ed.fieldOfStudy} — ${ed.institution} (${ed.startDate} - ${ed.endDate})`);
      });
      lines.push('');
    }

    if (certifications.length > 0) {
      lines.push('CERTIFICATIONS');
      lines.push('--------------');
      certifications.forEach((c) => {
        lines.push(`${c.name} — ${c.issuer} (${c.issueDate})`);
      });
    }

    const fullPlainText = lines.join('\n');
    navigator.clipboard.writeText(fullPlainText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleImportJson = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText);
      if (!parsed.personalInfo) {
        throw new Error('Invalid resume data format: missing personalInfo');
      }
      onImport(parsed);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Export & Data Options</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJson}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <Download className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-900">Download JSON Backup</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Save resume data to your computer</div>
            </button>

            <button
              onClick={handleCopyPlainText}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
            >
              {copiedText ? (
                <Check className="w-5 h-5 text-emerald-600 mb-2" />
              ) : (
                <Copy className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              )}
              <div className="font-bold text-xs text-slate-900">
                {copiedText ? 'Copied to Clipboard!' : 'Copy Plain Text'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ideal for pasting into application portals</div>
            </button>
          </div>

          {/* Import JSON Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import Existing JSON Data</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">Paste a previously saved JSON backup to restore your resume.</p>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON content here..."
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
            {importError && (
              <div className="text-[11px] text-rose-600 mt-1">{importError}</div>
            )}
            <button
              onClick={handleImportJson}
              disabled={!importJsonText.trim()}
              className="mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors"
            >
              Restore from JSON
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
