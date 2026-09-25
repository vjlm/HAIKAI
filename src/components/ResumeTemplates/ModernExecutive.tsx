import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const ModernExecutive: React.FC<Props> = ({ data }) => {
  const { personalInfo, experience, education, skillCategories, projects, certifications, awards, settings } = data;
  const { primaryColor, spacing, showIcons } = settings;

  const spacingClasses = {
    compact: { section: 'mb-4', item: 'mb-2.5', text: 'text-[11px] leading-relaxed', header: 'pb-1 mb-2' },
    balanced: { section: 'mb-6', item: 'mb-4', text: 'text-xs leading-relaxed', header: 'pb-1.5 mb-3' },
    roomy: { section: 'mb-7', item: 'mb-5', text: 'text-[13px] leading-relaxed', header: 'pb-2 mb-4' },
  }[spacing];

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 font-sans">
      {/* Header Section */}
      <header className="border-b-2 pb-5 mb-5" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <p className="text-base font-semibold mt-1" style={{ color: primaryColor }}>
              {personalInfo.jobTitle || 'Professional Title'}
            </p>
          </div>
        </div>

        {/* Contact Metadata Bar - Zero-Pill Unboxed Clean Text with Separators */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              {showIcons && <Mail className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.email}</span>
            </a>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              {showIcons && <Phone className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              {showIcons && <MapPin className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              {showIcons && <Linkedin className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              {showIcons && <Github className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {personalInfo.website && (
            <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              {showIcons && <Globe className="w-3.5 h-3.5 opacity-70" />}
              <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {settings.visibleSections.summary && personalInfo.summary && (
        <section className={spacingClasses.section}>
          <h2
            className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
            style={{ color: primaryColor }}
          >
            Professional Summary
          </h2>
          <p className={`${spacingClasses.text} text-slate-700 font-normal`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {settings.visibleSections.experience && experience.length > 0 && (
        <section className={spacingClasses.section}>
          <h2
            className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
            style={{ color: primaryColor }}
          >
            Work Experience
          </h2>

          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className={spacingClasses.item}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-600 text-xs font-medium ml-2">
                      · {exp.company}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium whitespace-nowrap mt-0.5 sm:mt-0">
                    <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    {exp.location && <span className="ml-1.5">| {exp.location}</span>}
                  </div>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`mt-2 list-disc list-outside pl-4 space-y-1 text-slate-700 ${spacingClasses.text}`}>
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="mt-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Technologies: </span>
                    <span>{exp.techStack.join(' · ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical & Core Skills */}
      {settings.visibleSections.skills && skillCategories.length > 0 && (
        <section className={spacingClasses.section}>
          <h2
            className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
            style={{ color: primaryColor }}
          >
            Skills & Competencies
          </h2>

          <div className="space-y-2">
            {skillCategories.map((category) => (
              <div key={category.id} className="flex flex-col sm:flex-row sm:items-baseline text-xs">
                <span className="font-bold text-slate-900 sm:w-44 shrink-0 mb-0.5 sm:mb-0">
                  {category.name}:
                </span>
                <span className="text-slate-700">
                  {category.skills.map((s) => s.name).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {settings.visibleSections.projects && projects.length > 0 && (
        <section className={spacingClasses.section}>
          <h2
            className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
            style={{ color: primaryColor }}
          >
            Featured Projects
          </h2>

          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className={spacingClasses.item}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{proj.title}</span>
                    {proj.role && <span className="text-xs text-slate-600">· {proj.role}</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs text-slate-500">
                      {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>

                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className={`mt-1.5 list-disc list-outside pl-4 space-y-1 text-slate-700 ${spacingClasses.text}`}>
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className="pl-1">{b}</li>
                    ))}
                  </ul>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Stack: </span>
                    <span>{proj.technologies.join(' · ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {settings.visibleSections.education && education.length > 0 && (
        <section className={spacingClasses.section}>
          <h2
            className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
            style={{ color: primaryColor }}
          >
            Education
          </h2>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className={spacingClasses.item}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-600 text-xs font-medium ml-2">· {edu.institution}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    <span>{edu.startDate} – {edu.endDate}</span>
                    {edu.location && <span className="ml-1.5">| {edu.location}</span>}
                  </div>
                </div>

                {(edu.gpa || edu.honors) && (
                  <div className="mt-0.5 text-xs text-slate-600">
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    {edu.gpa && edu.honors && <span className="mx-1.5">·</span>}
                    {edu.honors && <span className="italic">{edu.honors}</span>}
                  </div>
                )}

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className={`mt-1 list-disc list-outside pl-4 space-y-0.5 text-slate-600 ${spacingClasses.text}`}>
                    {edu.highlights.map((h, idx) => (
                      <li key={idx} className="pl-1">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Awards (Dual Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {settings.visibleSections.certifications && certifications.length > 0 && (
          <section className={spacingClasses.section}>
            <h2
              className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
              style={{ color: primaryColor }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    <span>{c.issuer}</span>
                    <span className="mx-1.5">·</span>
                    <span>{c.issueDate}</span>
                    {c.credentialId && <span className="ml-1.5">({c.credentialId})</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {settings.visibleSections.awards && awards.length > 0 && (
          <section className={spacingClasses.section}>
            <h2
              className={`text-xs font-bold uppercase tracking-wider border-b border-slate-200 ${spacingClasses.header}`}
              style={{ color: primaryColor }}
            >
              Honors & Awards
            </h2>
            <div className="space-y-2">
              {awards.map((a) => (
                <div key={a.id} className="text-xs">
                  <div className="font-semibold text-slate-900">{a.title}</div>
                  <div className="text-slate-600 text-[11px]">
                    <span>{a.issuer}</span>
                    <span className="mx-1.5">·</span>
                    <span>{a.date}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">{a.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
