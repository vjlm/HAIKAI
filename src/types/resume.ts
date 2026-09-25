export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  avatarUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  highlights?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export type TemplateType = 'modern-executive' | 'minimal-tech' | 'creative-split' | 'classic-ivy' | 'compact-grid';

export type FontFamilyType = 'sans' | 'serif' | 'mono' | 'jakarta';

export type SpacingDensity = 'compact' | 'balanced' | 'roomy';

export interface ResumeSettings {
  template: TemplateType;
  primaryColor: string; // Hex color code
  fontFamily: FontFamilyType;
  spacing: SpacingDensity;
  showPhoto: boolean;
  showIcons: boolean;
  sectionOrder: string[];
  visibleSections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    awards: boolean;
  };
}

export interface ResumeData {
  id: string;
  title: string;
  lastModified: string;
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: Certification[];
  awards: AwardItem[];
  settings: ResumeSettings;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  bgLight: string;
  border: string;
}
