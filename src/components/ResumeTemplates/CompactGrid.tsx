import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const CompactGrid: React.FC<Props> = ({ data }) => {
  const { personalInfo, experience, education, skillCategories, projects, certifications, settings } = data;
  const { primaryColor } = settings;

  return (
    <div className="w-full bg-white text-neutral-800 p-7 sm:p-9 font-sans text-xs">
      {/* Dense Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {personalInfo.fullName}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 mt-2 sm:mt-0 sm:text-right">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-neutral-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-neutral-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-neutral-400" />
              {personalInfo.linkedin.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-neutral-400" />
              {personalInfo.github.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* Grid Layout: Main Left (65%) and Sidebar Right (35%) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          {/* Summary */}
          {settings.visibleSections.summary && personalInfo.summary && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
                Executive Profile
              </div>
              <p className="text-neutral-700 leading-relaxed text-[11px]">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {settings.visibleSections.experience && experience.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
                Experience
              </div>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-neutral-900 text-xs">
                        {exp.role} <span className="font-normal text-neutral-500">· {exp.company}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets && (
                      <ul className="mt-1 list-disc list-outside pl-3.5 space-y-0.5 text-neutral-700 text-[11px] leading-relaxed">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {settings.visibleSections.projects && projects.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
                Highlighted Projects
              </div>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-neutral-900 text-xs">{proj.title}</span>
                      {proj.startDate && <span className="text-[10px] text-neutral-500">{proj.startDate}</span>}
                    </div>
                    {proj.bullets && (
                      <ul className="mt-0.5 list-disc list-outside pl-3.5 space-y-0.5 text-neutral-700 text-[11px]">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-4">
          {/* Skills */}
          {settings.visibleSections.skills && skillCategories.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
                Technical Stack
              </div>
              <div className="space-y-2">
                {skillCategories.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-neutral-900 text-[11px]">{c.name}</div>
                    <div className="text-neutral-600 text-[10px] leading-relaxed">
                      {c.skills.map((s) => s.name).join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {settings.visibleSections.education && education.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
                Education
              </div>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-neutral-900 text-[11px]">{edu.degree}</div>
                    <div className="text-neutral-600 text-[10px]">{edu.institution}</div>
                    <div className="text-neutral-400 text-[9px]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {settings.visibleSections.certifications && certifications.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
                Certifications
              </div>
              <div className="space-y-1.5">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-medium text-neutral-900 text-[10px]">{c.name}</div>
                    <div className="text-neutral-500 text-[9px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
