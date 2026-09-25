import { ResumeData } from '../types/resume';

export interface AtsCheckItem {
  id: string;
  category: 'Contact' | 'Impact' | 'Skills' | 'Structure' | 'Format';
  title: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  maxScore: number;
  feedback: string;
  suggestion?: string;
}

export interface AtsAuditResult {
  overallScore: number; // 0-100
  rating: 'Exceptional' | 'Competitive' | 'Needs Polish' | 'Incomplete';
  summary: string;
  checks: AtsCheckItem[];
  quantifiedBulletsCount: number;
  totalBulletsCount: number;
  strongActionVerbsFound: string[];
  wordCount: number;
  estimatedReadTimeMinutes: number;
}

export interface JobDescriptionMatch {
  matchScore: number; // 0-100%
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

const STRONG_VERBS = [
  'spearheaded', 'architected', 'orchestrated', 'engineered', 'implemented',
  'accelerated', 'optimized', 'streamlined', 'pioneered', 'designed',
  'developed', 'refactored', 'reduced', 'increased', 'maximized',
  'automated', 'championed', 'mentored', 'delivered', 'scaled',
  'eliminated', 'standardized', 'consolidated', 'partnered', 'led'
];

export function auditResume(resume: ResumeData): AtsAuditResult {
  const checks: AtsCheckItem[] = [];
  const { personalInfo, experience, education, skillCategories, projects } = resume;

  // 1. Contact Info check
  const contactPassed = !!(personalInfo.fullName && personalInfo.email && personalInfo.phone && personalInfo.location);
  const hasLinkedIn = !!personalInfo.linkedin;
  const hasGithubOrWeb = !!(personalInfo.github || personalInfo.website);

  let contactScore = 0;
  if (personalInfo.fullName && personalInfo.email) contactScore += 10;
  if (personalInfo.phone) contactScore += 5;
  if (personalInfo.location) contactScore += 5;
  if (hasLinkedIn) contactScore += 5;

  checks.push({
    id: 'contact-complete',
    category: 'Contact',
    title: 'Contact Information Completeness',
    status: contactScore >= 20 ? 'passed' : contactScore >= 15 ? 'warning' : 'failed',
    score: contactScore,
    maxScore: 25,
    feedback: contactScore >= 20
      ? 'All essential contact data (Name, Email, Phone, Location, Professional links) are present.'
      : 'Missing key contact details that recruiters and ATS crawlers expect.',
    suggestion: !hasLinkedIn ? 'Add your LinkedIn profile link to improve recruiter trust.' : undefined
  });

  // 2. Summary Check
  const summaryLength = personalInfo.summary?.trim().split(/\s+/).length || 0;
  let summaryScore = 0;
  if (summaryLength >= 25 && summaryLength <= 90) {
    summaryScore = 15;
  } else if (summaryLength > 0 && summaryLength < 25) {
    summaryScore = 8;
  } else if (summaryLength > 90) {
    summaryScore = 10;
  }

  checks.push({
    id: 'summary-quality',
    category: 'Structure',
    title: 'Professional Summary & Pitch',
    status: summaryScore >= 12 ? 'passed' : summaryScore > 0 ? 'warning' : 'failed',
    score: summaryScore,
    maxScore: 15,
    feedback: summaryLength >= 25 && summaryLength <= 90
      ? `Summary is optimal length (${summaryLength} words) without fluff.`
      : summaryLength > 90
      ? `Summary is slightly long (${summaryLength} words). Keep under 80 words for fast recruiter scanning.`
      : summaryLength > 0
      ? `Summary is brief (${summaryLength} words). Expand with career scope and core strengths.`
      : 'No summary detected. A 3-4 sentence professional executive summary sets context.',
    suggestion: summaryLength < 25 ? 'Aim for 3-4 sentences outlining years of experience, primary domain, and top achievement.' : undefined
  });

  // 3. Work Experience & Quantifiable Impact
  let allBullets: string[] = [];
  experience.forEach(exp => {
    allBullets = allBullets.concat(exp.bullets || []);
  });
  projects.forEach(proj => {
    allBullets = allBullets.concat(proj.bullets || []);
  });

  const totalBulletsCount = allBullets.length;
  // Regex to detect numbers, %, $, ms, x multipliers
  const metricRegex = /\b(\d+[%$kKmMbBxX]?|\$\d+|\d+\+|\d+\.\d+[%xX]?)\b/;
  const quantifiedBullets = allBullets.filter(b => metricRegex.test(b));
  const quantifiedCount = quantifiedBullets.length;

  let impactScore = 0;
  if (totalBulletsCount >= 4) {
    const quantRatio = totalBulletsCount > 0 ? quantifiedCount / totalBulletsCount : 0;
    if (quantRatio >= 0.5) impactScore = 25;
    else if (quantRatio >= 0.3) impactScore = 18;
    else impactScore = 10;
  } else if (totalBulletsCount > 0) {
    impactScore = 8;
  }

  checks.push({
    id: 'quantified-metrics',
    category: 'Impact',
    title: 'Measurable Achievements & Metrics',
    status: impactScore >= 20 ? 'passed' : impactScore >= 12 ? 'warning' : 'failed',
    score: impactScore,
    maxScore: 25,
    feedback: `${quantifiedCount} of ${totalBulletsCount} bullet points include measurable metrics (%, $, scale, or time reductions).`,
    suggestion: quantifiedCount < Math.ceil(totalBulletsCount * 0.4)
      ? 'Add concrete numbers (e.g. "Increased conversion by 24%", "Reduced latency by 45ms", "Managed team of 8") to demonstrate business value.'
      : undefined
  });

  // 4. Action Verbs Check
  const foundVerbsSet = new Set<string>();
  allBullets.forEach(b => {
    const words = b.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    if (words.length > 0 && STRONG_VERBS.includes(words[0])) {
      foundVerbsSet.add(words[0]);
    }
    // Also check first 3 words
    words.slice(0, 3).forEach(w => {
      if (STRONG_VERBS.includes(w)) foundVerbsSet.add(w);
    });
  });

  const uniqueStrongVerbs = Array.from(foundVerbsSet);
  let actionScore = 0;
  if (uniqueStrongVerbs.length >= 5) actionScore = 15;
  else if (uniqueStrongVerbs.length >= 3) actionScore = 10;
  else if (uniqueStrongVerbs.length >= 1) actionScore = 5;

  checks.push({
    id: 'action-verbs',
    category: 'Impact',
    title: 'High-Impact Action Verbs',
    status: actionScore >= 12 ? 'passed' : actionScore >= 8 ? 'warning' : 'failed',
    score: actionScore,
    maxScore: 15,
    feedback: `Found ${uniqueStrongVerbs.length} distinct high-impact action verbs (e.g. ${uniqueStrongVerbs.slice(0, 4).join(', ')}).`,
    suggestion: uniqueStrongVerbs.length < 5 ? 'Start every bullet point with strong active past-tense verbs instead of passive phrases like "Responsible for" or "Worked on".' : undefined
  });

  // 5. Skills Diversity Check
  let totalSkillsCount = 0;
  skillCategories.forEach(cat => {
    totalSkillsCount += cat.skills?.length || 0;
  });

  let skillsScore = 0;
  if (totalSkillsCount >= 12 && skillCategories.length >= 2) skillsScore = 10;
  else if (totalSkillsCount >= 6) skillsScore = 6;
  else if (totalSkillsCount > 0) skillsScore = 3;

  checks.push({
    id: 'skills-categorization',
    category: 'Skills',
    title: 'Categorized Technical & Core Skills',
    status: skillsScore >= 8 ? 'passed' : skillsScore >= 4 ? 'warning' : 'failed',
    score: skillsScore,
    maxScore: 10,
    feedback: `${totalSkillsCount} skills indexed across ${skillCategories.length} categories for ATS keyword indexing.`,
    suggestion: skillCategories.length < 2 ? 'Group skills into distinct categories (e.g., Languages, Frameworks, Cloud, Tools) for cleaner ATS parsing.' : undefined
  });

  // 6. Education & Credentials Check
  let educationScore = 0;
  if (education.length > 0) {
    const hasDegreeAndInst = education.every(e => e.institution && e.degree);
    educationScore = hasDegreeAndInst ? 10 : 5;
  }

  checks.push({
    id: 'education-presence',
    category: 'Structure',
    title: 'Education & Degree Verification',
    status: educationScore === 10 ? 'passed' : educationScore > 0 ? 'warning' : 'failed',
    score: educationScore,
    maxScore: 10,
    feedback: education.length > 0
      ? `${education.length} educational degree(s) properly formatted with institution, degree, and graduation dates.`
      : 'No education listed.',
    suggestion: education.length === 0 ? 'Add your degrees or relevant educational background.' : undefined
  });

  // Calculate overall score
  const totalEarned = checks.reduce((sum, c) => sum + c.score, 0);
  const totalMax = checks.reduce((sum, c) => sum + c.maxScore, 0);
  const overallScore = Math.min(100, Math.round((totalEarned / totalMax) * 100));

  let rating: AtsAuditResult['rating'] = 'Needs Polish';
  let summary = '';
  if (overallScore >= 90) {
    rating = 'Exceptional';
    summary = 'Your resume is heavily optimized for modern ATS parsers with quantifiable business impact, strong action verbs, and comprehensive technical taxonomy.';
  } else if (overallScore >= 75) {
    rating = 'Competitive';
    summary = 'Solid ATS compatibility! A few tweaks to action verbs or metric quantification will boost it to top-tier percentile.';
  } else if (overallScore >= 55) {
    rating = 'Needs Polish';
    summary = 'Good foundation, but lacks several quantifiable achievements or keyword density required to bypass automated screening filters.';
  } else {
    rating = 'Incomplete';
    summary = 'Essential sections and metrics are missing. Fill out the contact, work experience, and skills sections to build an effective resume.';
  }

  // Word count & read time
  const allText = [
    personalInfo.fullName,
    personalInfo.jobTitle,
    personalInfo.summary,
    ...allBullets,
    ...skillCategories.flatMap(c => c.skills.map(s => s.name)),
    ...education.map(e => `${e.institution} ${e.degree} ${e.fieldOfStudy}`)
  ].join(' ');
  const wordCount = allText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTimeMinutes = Math.max(1, Math.round((wordCount / 220) * 10) / 10);

  return {
    overallScore,
    rating,
    summary,
    checks,
    quantifiedBulletsCount: quantifiedCount,
    totalBulletsCount,
    strongActionVerbsFound: uniqueStrongVerbs,
    wordCount,
    estimatedReadTimeMinutes
  };
}

export function matchJobDescription(resume: ResumeData, jobDescriptionText: string): JobDescriptionMatch {
  if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ['Paste a full job description (at least 20 words) to run ATS keyword comparison.']
    };
  }

  // Standard common tech & skill dictionary to cross-examine
  const COMMON_TECH_KEYWORDS = [
    'react', 'next.js', 'typescript', 'javascript', 'python', 'go', 'golang',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'graphql', 'rest', 'sql',
    'postgresql', 'mysql', 'mongodb', 'redis', 'kafka', 'ci/cd', 'terraform',
    'node.js', 'express', 'microservices', 'distributed systems', 'agile',
    'scrum', 'leadership', 'architecture', 'cypress', 'jest', 'testing',
    'git', 'github', 'security', 'monitoring', 'datadog', 'prometheus',
    'caching', 'nosql', 'performance', 'optimization', 'cloud', 'linux',
    'api design', 'full stack', 'backend', 'frontend', 'system design',
    'collaboration', 'mentorship', 'cross-functional', 'scalability'
  ];

  const jdLower = jobDescriptionText.toLowerCase();

  // Find which keywords exist in the job description
  const jdKeywords = COMMON_TECH_KEYWORDS.filter(kw => jdLower.includes(kw));

  // Build resume corpus
  const resumeText = [
    resume.personalInfo.jobTitle,
    resume.personalInfo.summary,
    ...resume.skillCategories.flatMap(c => c.skills.map(s => s.name)),
    ...resume.experience.flatMap(e => [e.role, e.company, ...(e.bullets || []), ...(e.techStack || [])]),
    ...resume.projects.flatMap(p => [p.title, ...(p.bullets || []), ...(p.technologies || [])])
  ].join(' ').toLowerCase();

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach(kw => {
    if (resumeText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalJdKeywords = jdKeywords.length || 1;
  const matchScore = Math.min(100, Math.round((matchedKeywords.length / totalJdKeywords) * 100));

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Consider incorporating target skills like: ${missingKeywords.slice(0, 5).join(', ')} into your Skills or Experience bullet points if you have experience with them.`
    );
  }
  if (matchScore >= 80) {
    recommendations.push('Strong keyword alignment! Your profile matches the primary competencies mentioned in the role.');
  } else if (matchScore < 60) {
    recommendations.push('Low to moderate keyword match. Review the missing keywords list and adapt your bullet points to address the specific requirements.');
  }

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    recommendations
  };
}
