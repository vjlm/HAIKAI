import React, { useState } from 'react';
import { ResumeData } from '../types/resume';
import { auditResume, matchJobDescription } from '../utils/atsChecker';
import { X, CheckCircle, AlertTriangle, XCircle, Search, Target, FileText, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const AtsAuditorModal: React.FC<Props> = ({ isOpen, onClose, resume }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'matcher'>('audit');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');

  if (!isOpen) return null;

  const audit = auditResume(resume);
  const jdMatch = jobDescriptionInput ? matchJobDescription(resume, jobDescriptionInput) : null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-indigo-600 border-indigo-500 bg-indigo-50';
    if (score >= 50) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center font-bold ${getScoreColor(audit.overallScore)}`}>
              <span className="text-base leading-none">{audit.overallScore}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold">ATS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">ATS Compatibility & Keyword Audit</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {audit.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulates Fortune 500 ATS crawlers (Workday, Greenhouse, Lever, Taleo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-4 bg-white">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'matcher'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Job Description Matcher</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'audit' ? (
            <>
              {/* Executive Summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {audit.summary}
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Quantified Bullets</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {audit.quantifiedBulletsCount} <span className="text-xs font-normal text-slate-400">/ {audit.totalBulletsCount}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">
                    {Math.round((audit.quantifiedBulletsCount / (audit.totalBulletsCount || 1)) * 100)}% with metrics
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Action Verbs</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {audit.strongActionVerbsFound.length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {audit.strongActionVerbsFound.slice(0, 3).join(', ') || 'None yet'}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estimated Read</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {audit.estimatedReadTimeMinutes} <span className="text-xs font-normal text-slate-400">min</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {audit.wordCount} words
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Comprehensive ATS Criteria
                </div>

                {audit.checks.map((chk) => (
                  <div key={chk.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {chk.status === 'passed' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      {chk.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {chk.status === 'failed' && <XCircle className="w-4 h-4 text-rose-500" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900">{chk.title}</div>
                        <span className="text-xs font-semibold text-slate-600">
                          {chk.score} / {chk.maxScore} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{chk.feedback}</p>
                      {chk.suggestion && (
                        <div className="mt-1.5 p-2 bg-amber-50/70 rounded border border-amber-200/60 text-[11px] text-amber-800">
                          <span className="font-bold">Suggestion: </span>{chk.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Target Job Description Comparison
                </h4>
                <p className="text-xs text-slate-500 mb-2">
                  Paste the job posting you want to apply for. We will analyze keywords, skills, and show what to add.
                </p>
                <textarea
                  rows={6}
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste the job description text here (e.g. requirements, technical skills, responsibilities)..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-sans"
                />
              </div>

              {jdMatch && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-indigo-950">Keyword Match Score</div>
                      <div className="text-xs text-indigo-700">Alignment with job posting terminology</div>
                    </div>
                    <div className="text-2xl font-black text-indigo-600">
                      {jdMatch.matchScore}%
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  {jdMatch.matchedKeywords.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matched Keywords Found in Your Resume ({jdMatch.matchedKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {jdMatch.matchedKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {jdMatch.missingKeywords.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Keywords in Job Posting Missing from Resume ({jdMatch.missingKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {jdMatch.missingKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900">Optimization Advice:</div>
                    {jdMatch.recommendations.map((rec, i) => (
                      <p key={i} className="text-xs text-slate-600">{rec}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
