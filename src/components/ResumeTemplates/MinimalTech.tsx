import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const MinimalTech: React.FC<Props> = ({ data }) => {
  const { personalInfo, experience, education, skillCategories, projects, certifications, awards, settings } = data;
  const { primaryColor, spacing } = settings;

  const spacingMap = {
    compact: { section: 'mb-4', item: 'mb-3', text: 'text-[11px]' },
    balanced: { section: 'mb-5', item: 'mb-4', text: 'text-xs' },
    roomy: { section: 'mb-6', item: 'mb-5', text: 'text-[13px]' }
  }[spacing];

  return (
    <div className="w-full bg-white text-zinc-800 p-8 sm:p-10 font-mono text-xs">
      {/* Header */}
      <header className="border-b border-zinc-300 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded border"
            style={{ color: primaryColor, borderColor: primaryColor }}
          >
            {personalInfo.jobTitle || 'Software Engineer'}
          </span>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-zinc-600">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="hover:text-zinc-950 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{personalInfo.email}</span>
            </a>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:text-zinc-950 flex items-center gap-1">
              <Github className="w-3 h-3" />
              <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:text-zinc-950 flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {settings.visibleSections.summary && personalInfo.summary && (
        <section className={spacingMap.section}>
          <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>Profile Overview</span>
          </div>
          <p className={`${spacingMap.text} text-zinc-700 leading-relaxed font-sans`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Skills Matrix (Placed high for Tech resume) */}
      {settings.visibleSections.skills && skillCategories.length > 0 && (
        <section className={spacingMap.section}>
          <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>Technical Taxonomy</span>
          </div>
          <div className="border border-zinc-200 divide-y divide-zinc-200 rounded text-[11px]">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="p-2 sm:grid sm:grid-cols-4 gap-2">
                <div className="font-semibold text-zinc-900 col-span-1">{cat.name}</div>
                <div className="col-span-3 text-zinc-700 font-sans text-xs">
                  {cat.skills.map((s) => s.name).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {settings.visibleSections.experience && experience.length > 0 && (
        <section className={spacingMap.section}>
          <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>Work Experience</span>
          </div>

          <div className="border-l-2 pl-3 ml-1 space-y-4" style={{ borderColor: primaryColor }}>
            {experience.map((exp) => (
              <div key={exp.id} className={spacingMap.item}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="font-sans font-bold text-sm text-zinc-950">
                    {exp.role} <span className="text-zinc-500 font-normal font-mono text-xs">@ {exp.company}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {exp.startDate} ~ {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 font-sans text-zinc-700 text-xs">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-zinc-400 select-none mt-0.5">›</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="mt-1.5 text-[10px] text-zinc-500">
                    <span className="font-bold text-zinc-700">Stack: </span>
                    {exp.techStack.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {settings.visibleSections.projects && projects.length > 0 && (
        <section className={spacingMap.section}>
          <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>Selected Engineering Projects</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 border border-zinc-200 rounded">
                <div className="flex items-center justify-between">
                  <div className="font-bold font-sans text-xs text-zinc-900 flex items-center gap-1.5">
                    <span>{proj.title}</span>
                    {proj.role && <span className="text-zinc-500 font-mono text-[10px]">({proj.role})</span>}
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5">
                        <Github className="w-3 h-3" />
                        <span>Source</span>
                      </a>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5">
                        <ExternalLink className="w-3 h-3" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {proj.bullets && (
                  <ul className="mt-1.5 space-y-1 font-sans text-xs text-zinc-700">
                    {proj.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-zinc-400 select-none">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {proj.technologies && (
                  <div className="mt-1.5 text-[10px] text-zinc-500 font-mono">
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {settings.visibleSections.education && education.length > 0 && (
          <section className={spacingMap.section}>
            <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>Education</span>
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-sans font-bold text-xs text-zinc-950">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    {edu.institution} ({edu.startDate} – {edu.endDate})
                  </div>
                  {edu.gpa && <div className="text-[10px] text-zinc-500">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {settings.visibleSections.certifications && certifications.length > 0 && (
          <section className={spacingMap.section}>
            <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>Credentials</span>
            </div>
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-sans font-semibold text-xs text-zinc-900">{c.name}</div>
                  <div className="text-[11px] text-zinc-500">{c.issuer} · {c.issueDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
