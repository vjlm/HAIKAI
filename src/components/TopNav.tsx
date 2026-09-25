import React from 'react';
import { ResumeData } from '../types/resume';
import { PRESET_RESUMES } from '../data/defaultResumes';
import { auditResume } from '../utils/atsChecker';
import { Printer, Sparkles, Share2, ZoomIn, ZoomOut, Check, ChevronDown, FileText, Smartphone, Monitor } from 'lucide-react';

interface Props {
  resume: ResumeData;
  onSelectPreset: (presetId: string) => void;
  onOpenAtsModal: () => void;
  onOpenShareModal: () => void;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  activeViewMobile: 'editor' | 'preview';
  onToggleViewMobile: (view: 'editor' | 'preview') => void;
}

export const TopNav: React.FC<Props> = ({
  resume,
  onSelectPreset,
  onOpenAtsModal,
  onOpenShareModal,
  zoomLevel,
  onZoomChange,
  activeViewMobile,
  onToggleViewMobile
}) => {
  const audit = auditResume(resume);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
                Resumate
              </div>
              <div className="text-[10px] text-slate-500 font-medium hidden sm:block">
                ATS-Optimized Resume Studio
              </div>
            </div>
          </div>

          {/* Sample Profiles Dropdown */}
          <div className="relative ml-2 sm:ml-4">
            <select
              onChange={(e) => onSelectPreset(e.target.value)}
              className="text-xs font-semibold py-1.5 pl-2.5 pr-7 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-slate-700 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
              defaultValue="fullstack-arch"
            >
              {PRESET_RESUMES.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  Profile: {preset.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Center: ATS Score Checker Quick Button */}
        <button
          onClick={onOpenAtsModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left group"
        >
          <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            {audit.overallScore}
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-700 flex items-center gap-1">
              <span>ATS Score</span>
              <Sparkles className="w-3 h-3 text-indigo-500" />
            </div>
            <div className="text-[9px] text-slate-500">
              {audit.rating}
            </div>
          </div>
        </button>

        {/* Right Actions: Zoom, Mobile Switch, Share, Print */}
        <div className="flex items-center gap-2">
          {/* Zoom controls for canvas (desktop only) */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => onZoomChange(Math.max(0.6, zoomLevel - 0.1))}
              disabled={zoomLevel <= 0.6}
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-semibold text-slate-700">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => onZoomChange(Math.min(1.3, zoomLevel + 0.1))}
              disabled={zoomLevel >= 1.3}
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="lg:hidden flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => onToggleViewMobile('editor')}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                activeViewMobile === 'editor' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => onToggleViewMobile('preview')}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                activeViewMobile === 'preview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Export / Backup modal */}
          <button
            onClick={onOpenShareModal}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Export JSON / Plain Text"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Primary Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            title="Print or Save to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
