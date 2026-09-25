import React from 'react';
import { ResumeData } from '../../types/resume';
import { ModernExecutive } from './ModernExecutive';
import { MinimalTech } from './MinimalTech';
import { CreativeSplit } from './CreativeSplit';
import { ClassicIvy } from './ClassicIvy';
import { CompactGrid } from './CompactGrid';

interface Props {
  data: ResumeData;
  scale?: number;
}

export const ResumeRenderer: React.FC<Props> = ({ data, scale = 1 }) => {
  const { settings } = data;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    jakarta: 'font-sans'
  }[settings.fontFamily || 'sans'];

  const renderTemplate = () => {
    switch (settings.template) {
      case 'modern-executive':
        return <ModernExecutive data={data} />;
      case 'minimal-tech':
        return <MinimalTech data={data} />;
      case 'creative-split':
        return <CreativeSplit data={data} />;
      case 'classic-ivy':
        return <ClassicIvy data={data} />;
      case 'compact-grid':
        return <CompactGrid data={data} />;
      default:
        return <ModernExecutive data={data} />;
    }
  };

  return (
    <div className="resume-container flex justify-center w-full py-4 transition-transform duration-200 origin-top">
      {/* 
        Standard Resume Sheet Container:
        Using standard standard 210mm x 297mm (A4) / 8.5in x 11in ratio
        Shadowed paper look for screen, flat pristine background for print.
      */}
      <div
        id="resume-printable-area"
        className={`resume-paper w-full max-w-[820px] bg-white text-slate-800 shadow-2xl rounded-sm print:shadow-none print:m-0 print:p-0 print:max-w-none print:w-full ${fontClass}`}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
