import React from 'react';
import { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

export const ClassicIvy: React.FC<Props> = ({ data }) => {
  const { personalInfo, experience, education, skillCategories, projects, certifications, awards, settings } = data;
  const { primaryColor, spacing } = settings;

  const spacingMap = {
    compact: { section: 'mb-4', item: 'mb-2.5', text: 'text-[12px]' },
    balanced: { section: 'mb-5', item: 'mb-3.5', text: 'text-[13px]' },
    roomy: { section: 'mb-6', item: 'mb-4.5', text: 'text-[14px]' }
  }[spacing];

  return (
    <div className="w-full bg-white text-stone-900 p-8 sm:p-11 font-serif">
      {/* Centered Academic Header */}
      <header className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-stone-950 uppercase">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-sm italic text-stone-700 mt-1 font-sans tracking-wide">
          {personalInfo.jobTitle}
        </p>

        {/* Clean Unboxed Contact Separator Line */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 mt-2.5 text-xs text-stone-600 font-sans">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.phone && <span className="text-stone-400">♦</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="text-stone-400">♦</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="hover:underline">
              {personalInfo.email}
            </a>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-stone-400">♦</span>
              <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-stone-400">♦</span>
              <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {settings.visibleSections.summary && personalInfo.summary && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2">
            Executive Summary
          </h2>
          <p className={`${spacingMap.text} text-stone-800 leading-relaxed font-serif`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Education (Placed First in Ivy / Academic Tradition) */}
      {settings.visibleSections.education && education.length > 0 && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2">
            Education
          </h2>

          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm text-stone-950">{edu.institution}</span>
                    <span className="text-xs text-stone-700 italic ml-2">
                      — {edu.degree}, {edu.fieldOfStudy}
                    </span>
                  </div>
                  <span className="text-xs font-sans text-stone-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>

                {(edu.gpa || edu.honors) && (
                  <div className="text-xs text-stone-700 italic">
                    {edu.honors} {edu.gpa && `(GPA: ${edu.gpa})`}
                  </div>
                )}

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-outside pl-4 space-y-0.5 text-xs text-stone-700">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {settings.visibleSections.experience && experience.length > 0 && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2.5">
            Professional Experience
          </h2>

          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-sm text-stone-950">
                    {exp.company}
                    <span className="font-normal italic text-stone-700 text-xs ml-2">
                      | {exp.role}
                    </span>
                  </div>
                  <span className="text-xs font-sans text-stone-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 list-disc list-outside pl-4 space-y-1 text-stone-800 text-xs sm:text-[13px] leading-relaxed">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="pl-0.5">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {settings.visibleSections.skills && skillCategories.length > 0 && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2">
            Areas of Expertise & Skills
          </h2>

          <div className="space-y-1.5 text-xs">
            {skillCategories.map((c) => (
              <div key={c.id}>
                <span className="font-bold text-stone-900">{c.name}: </span>
                <span className="text-stone-700 italic">
                  {c.skills.map((s) => s.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {settings.visibleSections.projects && projects.length > 0 && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2">
            Key Publications & Projects
          </h2>

          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-stone-950">{proj.title}</span>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs font-sans text-stone-600">{proj.startDate} – {proj.endDate}</span>
                  )}
                </div>
                {proj.bullets && (
                  <ul className="mt-1 list-disc list-outside pl-4 space-y-0.5 text-xs text-stone-700">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Honors */}
      {((settings.visibleSections.certifications && certifications.length > 0) ||
        (settings.visibleSections.awards && awards.length > 0)) && (
        <section className={spacingMap.section}>
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-stone-900 border-b border-stone-300 pb-0.5 mb-2">
            Certifications & Honors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {certifications.map((c) => (
              <div key={c.id}>
                <div className="font-bold text-stone-900">{c.name}</div>
                <div className="text-stone-600 italic">{c.issuer} ({c.issueDate})</div>
              </div>
            ))}
            {awards.map((a) => (
              <div key={a.id}>
                <div className="font-bold text-stone-900">{a.title}</div>
                <div className="text-stone-600 italic">{a.issuer} ({a.date})</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
