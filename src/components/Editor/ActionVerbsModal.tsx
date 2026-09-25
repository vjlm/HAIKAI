import React, { useState } from 'react';
import { ACTION_VERBS_CATEGORIES } from '../../data/defaultResumes';
import { X, Search, Check, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerb?: (verb: string) => void;
}

export const ActionVerbsModal: React.FC<Props> = ({ isOpen, onClose, onSelectVerb }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1800);
    if (onSelectVerb) {
      onSelectVerb(verb);
      onClose();
    }
  };

  const filteredCategories = ACTION_VERBS_CATEGORIES.map(cat => ({
    ...cat,
    verbs: cat.verbs.filter(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.verbs.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Action Verbs Dictionary</h3>
            <p className="text-xs text-slate-500">Power verbs to start your experience bullets and raise ATS impact</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search power verbs (e.g. Architected, Scaled, Spearheaded)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
              autoFocus
            />
          </div>
        </div>

        {/* Verbs List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {filteredCategories.map((group) => (
            <div key={group.category}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {group.category}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.verbs.map((verb) => (
                  <button
                    key={verb}
                    onClick={() => handleCopy(verb)}
                    className="group px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 transition-all text-slate-800 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{verb}</span>
                    {copiedVerb === verb ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching action verbs found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          💡 Pro-tip: Always use past-tense action verbs for previous roles and present-tense for ongoing roles.
        </div>
      </div>
    </div>
  );
};
