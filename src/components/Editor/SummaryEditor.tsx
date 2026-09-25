import React, { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { ActionVerbsModal } from './ActionVerbsModal';

interface Props {
  summary: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
}

export const SummaryEditor: React.FC<Props> = ({ summary, onChange, jobTitle }) => {
  const [showVerbsModal, setShowVerbsModal] = useState(false);

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;

  const sampleSummaries = [
    {
      title: 'Senior Engineering & Architecture',
      text: 'Senior Software Engineer with 7+ years of experience architecting resilient distributed cloud systems and high-throughput web applications. Proven track record leading multi-disciplinary engineering squads, optimizing microservices latency by 40%, and maintaining 99.99% system availability.'
    },
    {
      title: 'Full-Stack Developer',
      text: 'Dynamic Full-Stack Developer proficient in React, TypeScript, Node.js, and modern cloud infrastructure. Passionate about crafting intuitive user experiences and scalable backend services with measurable performance impact and robust automated test suites.'
    },
    {
      title: 'Technical Leadership & Cloud',
      text: 'Results-driven Engineering Lead specializing in cloud-native platforms, AWS/GCP architecture, and team mentorship. Expert in decoupling monolithic architectures into event-driven microservices with significant infrastructure cost reductions.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
          <p className="text-xs text-slate-500">
            A concise 3–4 sentence pitch highlighting your career scope, core expertise, and measurable achievements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowVerbsModal(true)}
          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Action Verbs</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Briefly summarize your background, strongest technical proficiencies, and top business impact..."
          className="w-full p-3 text-xs leading-relaxed rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 font-sans"
        />

        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold ${wordCount >= 30 && wordCount <= 80 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {wordCount} words
            </span>
            <span>·</span>
            <span>Recommended: 35–75 words</span>
          </div>
          {wordCount > 0 && wordCount < 30 && (
            <span className="text-amber-600">Consider expanding with specific impact numbers</span>
          )}
        </div>
      </div>

      {/* Quick Templates & Inspiration */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
        <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Quick Inspiration Templates</span>
        </div>
        <div className="space-y-2">
          {sampleSummaries.map((item, idx) => (
            <div key={idx} className="p-2 bg-white rounded border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-800">{item.title}</span>
                <button
                  type="button"
                  onClick={() => onChange(item.text)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Use this template
                </button>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <ActionVerbsModal
        isOpen={showVerbsModal}
        onClose={() => setShowVerbsModal(false)}
        onSelectVerb={(verb) => {
          onChange(summary ? `${summary} ${verb}` : verb);
        }}
      />
    </div>
  );
};
