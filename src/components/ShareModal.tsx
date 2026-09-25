import React, { useState } from 'react';
import { Modal } from './Modal';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareDataPayload;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formatted = `«${data.text}»\n\n— ${data.title}\n${data.url}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const tweet = `«${data.text.slice(0, 180)}» — ${data.title}\n${data.url}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SHARE ARCHIVE EXCERPT">
      <div className="space-y-4 text-xs font-editorial-mono">
        <div className="p-4 border border-[#2b3748] bg-[#070b10] text-[#c4ccd6] space-y-2">
          <span className="text-[#9e2a2b] font-bold block uppercase tracking-wider">
            {data.title}
          </span>
          <p className="italic font-serif-cinematic text-sm text-[#e6ebf1]">
            «{data.text}»
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCopy}
            type="button"
            className="flex-1 py-2.5 px-4 bg-[#121924] hover:bg-[#1a2433] border border-[#243142] text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#9e2a2b]" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY EXCERPT'}</span>
          </button>

          <button
            onClick={handleShareX}
            type="button"
            className="py-2.5 px-4 bg-[#9e2a2b] hover:bg-[#b53235] text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE ON X</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
