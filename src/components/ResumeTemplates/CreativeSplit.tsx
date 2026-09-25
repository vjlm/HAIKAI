import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const CreativeSplit: React.FC<Props> = ({ data }) => {
  const { personalInfo, experience, education, skillCategories, projects, certifications, awards, settings } = data;
  const { primaryColor, spacing, showIcons } = settings;

  return (
    <div className="w-full bg-white text-slate-800 flex flex-col md:flex-row min-h-[1050px]">
      {/* Left Sidebar (35% width) */}
      <aside
        className="w-full md:w-72 shrink-0 p-6 sm:p-7 text-white flex flex-col justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          {/* Candidate Name & Title */}
          <div className="border-b border-white/20 pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs font-medium text-white/80 mt-1 uppercase tracking-wider">
              {personalInfo.jobTitle || 'Professional Role'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs text-white/90 border-b border-white/20 pb-5 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">
              Contact
            </div>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-white transition-opacity break-all">
                {showIcons && <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.email}</span>
              </a>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                {showIcons && <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                {showIcons && <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white break-all">
                {showIcons && <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white break-all">
                {showIcons && <Github className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {personalInfo.website && (
              <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white break-all">
                {showIcons && <Globe className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>

          {/* Skills Breakdown */}
          {settings.visibleSections.skills && skillCategories.length > 0 && (
            <div className="border-b border-white/20 pb-5 mb-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">
                Skills & Tools
              </div>
              <div className="space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <div className="text-xs font-semibold text-white/95 mb-1">{cat.name}</div>
                    <div className="text-[11px] text-white/80 leading-relaxed">
                      {cat.skills.map((s) => s.name).join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {settings.visibleSections.education && education.length > 0 && (
            <div className="border-b border-white/20 pb-5 mb-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">
                Education
              </div>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="font-semibold text-white">{edu.degree}</div>
                    <div className="text-white/80 text-[11px]">{edu.institution}</div>
                    <div className="text-white/60 text-[10px]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {settings.visibleSections.certifications && certifications.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">
                Certifications
              </div>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-white/70 text-[10px]">{c.issuer} ({c.issueDate})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area (Right column) */}
      <main className="flex-1 p-6 sm:p-8 space-y-5">
        {/* Professional Summary */}
        {settings.visibleSections.summary && personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Profile
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {settings.visibleSections.experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Work Experience
            </h2>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                      <span className="text-slate-600 text-xs font-medium ml-1.5">
                        · {exp.company}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  {exp.bullets && (
                    <ul className="mt-1.5 list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs leading-relaxed">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="pl-1">{b}</li>
                      ))}
                    </ul>
                  )}

                  {exp.techStack && (
                    <div className="mt-1.5 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Technologies: </span>
                      {exp.techStack.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {settings.visibleSections.projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Key Projects
            </h2>

            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-[11px] text-slate-500">{proj.startDate} – {proj.endDate}</span>
                    )}
                  </div>

                  {proj.bullets && (
                    <ul className="mt-1 list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-xs leading-relaxed">
                      {proj.bullets.map((b, i) => (
                        <li key={i} className="pl-1">{b}</li>
                      ))}
                    </ul>
                  )}

                  {proj.technologies && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">Stack: </span>
                      {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {settings.visibleSections.awards && awards.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Honors & Recognition
            </h2>
            <div className="space-y-2">
              {awards.map((a) => (
                <div key={a.id} className="text-xs">
                  <div className="font-bold text-slate-900">{a.title} · <span className="font-normal text-slate-600">{a.issuer} ({a.date})</span></div>
                  <div className="text-slate-600 text-[11px] mt-0.5">{a.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
