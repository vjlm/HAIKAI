import React from 'react';
import { PersonalInfo } from '../../types/resume';
import { User, Briefcase, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Personal & Contact Information</h3>
        <p className="text-xs text-slate-500">Provide accurate contact details so recruiters and automated ATS can reach you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Vijayalakshmi R."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Professional Job Title *
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="e.g. Senior Full-Stack & Cloud Architect"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. your.name@example.com"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g. +1 (555) 019-2834"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Location (City, State / Country) *
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. San Francisco Bay Area, CA"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-slate-400" />
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="e.g. linkedin.com/in/vijayalakshmi"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-slate-400" />
            GitHub Profile
          </label>
          <input
            type="text"
            value={data.github}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="e.g. github.com/username"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Portfolio / Personal Website
          </label>
          <input
            type="text"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="e.g. https://portfolio.dev"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
