import { ResumeData, ColorTheme } from '../types/resume';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'navy-slate',
    name: 'Navy Slate',
    primary: '#1e3a8a', // blue-900
    accent: '#3b82f6',
    bgLight: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    id: 'emerald-teal',
    name: 'Forest Emerald',
    primary: '#065f46', // emerald-800
    accent: '#10b981',
    bgLight: '#ecfdf5',
    border: '#a7f3d0',
  },
  {
    id: 'charcoal-obsidian',
    name: 'Obsidian Noir',
    primary: '#18181b', // zinc-900
    accent: '#52525b',
    bgLight: '#f4f4f5',
    border: '#e4e4e7',
  },
  {
    id: 'burgundy-wine',
    name: 'Burgundy Royale',
    primary: '#881337', // rose-900
    accent: '#e11d48',
    bgLight: '#fff1f2',
    border: '#fecdd3',
  },
  {
    id: 'indigo-violet',
    name: 'Royal Indigo',
    primary: '#4338ca', // indigo-700
    accent: '#6366f1',
    bgLight: '#eef2ff',
    border: '#c7d2fe',
  },
  {
    id: 'copper-amber',
    name: 'Modern Amber',
    primary: '#92400e', // amber-800
    accent: '#f59e0b',
    bgLight: '#fffbeb',
    border: '#fde68a',
  },
];

export const ACTION_VERBS_CATEGORIES = [
  {
    category: 'Leadership & Strategy',
    verbs: [
      'Spearheaded', 'Orchestrated', 'Architected', 'Championed', 'Directed',
      'Pioneered', 'Founded', 'Scaled', 'Guided', 'Mobilized', 'Governed'
    ]
  },
  {
    category: 'Engineering & Development',
    verbs: [
      'Engineered', 'Architected', 'Implemented', 'Refactored', 'Deployed',
      'Automated', 'Constructed', 'Integrated', 'Decoupled', 'Migrated'
    ]
  },
  {
    category: 'Performance & Optimization',
    verbs: [
      'Accelerated', 'Streamlined', 'Overhauled', 'Maximized', 'Reduced',
      'Optimized', 'Eliminated', 'Standardized', 'Benchmarked', 'Consolidated'
    ]
  },
  {
    category: 'Innovation & Research',
    verbs: [
      'Discovered', 'Devised', 'Invented', 'Formulated', 'Prototyped',
      'Piloted', 'Synthesized', 'Derived', 'Simulated', 'Established'
    ]
  },
  {
    category: 'Collaboration & Impact',
    verbs: [
      'Mentored', 'Partnered', 'Negotiated', 'Coordinated', 'Facilitated',
      'Empowered', 'Unified', 'Advocated', 'Delivered', 'Instituted'
    ]
  }
];

export const DEFAULT_RESUME: ResumeData = {
  id: 'resume-vijayalakshmi',
  title: 'Vijayalakshmi R. — Senior Full-Stack & Cloud Architect',
  lastModified: new Date().toISOString(),
  personalInfo: {
    fullName: 'Vijayalakshmi R.',
    jobTitle: 'Senior Full-Stack & Cloud Architect',
    email: 'vijaylakshmi22115@gmail.com',
    phone: '+1 (555) 382-9014',
    location: 'San Francisco Bay Area, CA',
    website: 'https://vijayalakshmi.dev',
    linkedin: 'linkedin.com/in/vijayalakshmi-eng',
    github: 'github.com/vijayalakshmi-dev',
    summary:
      'High-impact Software Architect with 7+ years of experience engineering resilient distributed cloud systems and delightful web applications. Led architectural modernization for multi-tenant microservices serving 18M+ MAU with 99.99% availability. Proven track record reducing cloud infrastructure overhead by 35% through event-driven paradigms, Kubernetes containerization, and automated CI/CD pipelines.',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Aetherion Cloud Systems',
      role: 'Staff Software Architect & Tech Lead',
      location: 'San Francisco, CA',
      startDate: '2023-03',
      endDate: '',
      current: true,
      bullets: [
        'Architected a distributed event-driven ingestion platform processing 25,000+ RPS, reducing p99 latency from 420ms to 68ms across global edge regions.',
        'Spearheaded enterprise cloud migration to AWS EKS with Terraform IaC, slashing monthly cloud expenditure by 34% ($120K annual savings).',
        'Directly mentored 12 mid-level and senior engineers across three sprint teams, boosting engineering velocity by 28% while establishing zero-downtime blue/green deployment policies.',
        'Designed high-throughput GraphQL federation gateway unifying 14 legacy REST services, decreasing client payload sizes by 45%.'
      ],
      techStack: ['TypeScript', 'Node.js', 'Go', 'AWS (EKS, Lambda)', 'PostgreSQL', 'Terraform', 'Kafka', 'GraphQL']
    },
    {
      id: 'exp-2',
      company: 'Veritas Technologies & Platforms',
      role: 'Senior Full-Stack Engineer',
      location: 'San Jose, CA',
      startDate: '2020-06',
      endDate: '2023-02',
      current: false,
      bullets: [
        'Led core frontend and microservices development for an analytics SaaS platform serving 350+ Fortune 500 enterprise customers.',
        'Engineered real-time collaboration canvas with WebSockets and CRDT algorithms, supporting 80+ simultaneous multi-user cursors with zero conflict collisions.',
        'Implemented comprehensive automated test suites (Cypress, Jest) raising test coverage from 54% to 92%, resulting in a 65% drop in production regressions.',
        'Optimized critical SQL queries and Redis caching topologies, decreasing DB connection pool saturation during peak load events by 40%.'
      ],
      techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Jest']
    },
    {
      id: 'exp-3',
      company: 'Synapse Software Solutions',
      role: 'Software Development Engineer II',
      location: 'Sunnyvale, CA',
      startDate: '2018-08',
      endDate: '2020-05',
      current: false,
      bullets: [
        'Built full-stack workflow automation tools utilized daily by 15,000+ internal enterprise employees, saving an estimated 4,200 human hours annually.',
        'Integrated third-party payment gateways (Stripe, Adyen) with idempotent webhooks, eliminating duplicate transaction discrepancies.',
        'Modernized legacy monolithic frontend codebases into modular React component libraries adhering to WCAG 2.1 AA accessibility standards.'
      ],
      techStack: ['JavaScript / TypeScript', 'React', 'Express.js', 'PostgreSQL', 'REST APIs', 'AWS S3']
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Master of Science (M.S.)',
      fieldOfStudy: 'Computer Science & Distributed Systems',
      location: 'Berkeley, CA',
      startDate: '2016',
      endDate: '2018',
      gpa: '3.92 / 4.0',
      honors: 'Graduate Dean’s Fellowship Award',
      highlights: [
        'Thesis: Scalable Consensus Mechanisms in Partitioned Distributed Stores',
        'Graduate Teaching Assistant for CS 162: Operating Systems & System Programming'
      ]
    },
    {
      id: 'edu-2',
      institution: 'Anna University, College of Engineering Guindy',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Information Technology',
      location: 'Chennai, India',
      startDate: '2012',
      endDate: '2016',
      gpa: '9.4 / 10.0',
      honors: 'First Class with Distinction (Ranked Top 2% of Class)',
      highlights: [
        'President, Association of Computer Engineers',
        'National Finalist: Smart India Hackathon'
      ]
    }
  ],
  skillCategories: [
    {
      id: 'cat-languages',
      name: 'Programming Languages',
      skills: [
        { id: 'sk-1', name: 'TypeScript', level: 'Expert' },
        { id: 'sk-2', name: 'JavaScript (ESNext)', level: 'Expert' },
        { id: 'sk-3', name: 'Go (Golang)', level: 'Advanced' },
        { id: 'sk-4', name: 'Python', level: 'Advanced' },
        { id: 'sk-5', name: 'SQL', level: 'Expert' },
        { id: 'sk-6', name: 'HTML5 / CSS3', level: 'Expert' }
      ]
    },
    {
      id: 'cat-frameworks',
      name: 'Frontend & Frameworks',
      skills: [
        { id: 'sk-7', name: 'React 19', level: 'Expert' },
        { id: 'sk-8', name: 'Next.js', level: 'Expert' },
        { id: 'sk-9', name: 'Tailwind CSS', level: 'Expert' },
        { id: 'sk-10', name: 'Redux Toolkit / Zustand', level: 'Expert' },
        { id: 'sk-11', name: 'Vite & Webpack', level: 'Advanced' }
      ]
    },
    {
      id: 'cat-backend',
      name: 'Backend & Cloud Systems',
      skills: [
        { id: 'sk-12', name: 'Node.js & Express', level: 'Expert' },
        { id: 'sk-13', name: 'PostgreSQL & MySQL', level: 'Expert' },
        { id: 'sk-14', name: 'Redis Caching', level: 'Expert' },
        { id: 'sk-15', name: 'Apache Kafka / RabbitMQ', level: 'Advanced' },
        { id: 'sk-16', name: 'GraphQL & REST APIs', level: 'Expert' },
        { id: 'sk-17', name: 'MongoDB / DynamoDB', level: 'Intermediate' }
      ]
    },
    {
      id: 'cat-devops',
      name: 'Cloud & Infrastructure (DevOps)',
      skills: [
        { id: 'sk-18', name: 'Amazon Web Services (AWS)', level: 'Expert' },
        { id: 'sk-19', name: 'Docker & Kubernetes (EKS)', level: 'Advanced' },
        { id: 'sk-20', name: 'Terraform (IaC)', level: 'Advanced' },
        { id: 'sk-21', name: 'CI/CD (GitHub Actions)', level: 'Expert' },
        { id: 'sk-22', name: 'Prometheus & Grafana', level: 'Intermediate' }
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CloudMesh — Edge Observability Engine',
      role: 'Creator & Lead Architect',
      link: 'https://cloudmesh-edge.internal',
      github: 'https://github.com/vijayalakshmi-dev/cloudmesh-edge',
      startDate: '2023',
      endDate: 'Present',
      bullets: [
        'Built an open-source lightweight eBPF observability probe tracking kernel network socket metrics with negligible CPU overhead (<0.4%).',
        'Garnered 1,800+ GitHub stars and featured in KubeCon North America tech showcase sessions.'
      ],
      technologies: ['Go', 'eBPF', 'Rust', 'TypeScript', 'React', 'Prometheus']
    },
    {
      id: 'proj-2',
      title: 'ResilientQueue — Distributed CRDT Task Broker',
      role: 'Lead Developer',
      link: 'https://resilient-queue.org',
      github: 'https://github.com/vijayalakshmi-dev/resilient-queue',
      startDate: '2022',
      endDate: '2023',
      bullets: [
        'Implemented state-based CRDT broker guaranteeing high availability during network splits across multi-cloud regions.',
        'Processed over 100M test benchmark tasks with sub-millisecond local replica reads and zero loss consistency.'
      ],
      technologies: ['TypeScript', 'Node.js', 'Redis', 'WebSockets', 'Docker']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Professional (SAP-C02)',
      issuer: 'Amazon Web Services',
      issueDate: '2023-05',
      expiryDate: '2026-05',
      credentialId: 'AWS-PSA-884920'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (Linux Foundation)',
      issueDate: '2022-11',
      expiryDate: '2025-11',
      credentialId: 'LF-CKA-773190'
    }
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Engineering Excellence & Innovation Award',
      issuer: 'Aetherion Cloud Systems',
      date: '2024-01',
      description: 'Awarded for architecting zero-downtime regional failover system preventing critical outages during major tier-1 ISP fiber cut.'
    }
  ],
  settings: {
    template: 'modern-executive',
    primaryColor: '#1e3a8a',
    fontFamily: 'sans',
    spacing: 'balanced',
    showPhoto: false,
    showIcons: true,
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards'],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      awards: true
    }
  }
};

export const PRESET_RESUMES: { id: string; label: string; role: string; data: Partial<ResumeData> }[] = [
  {
    id: 'fullstack-arch',
    label: 'Vijayalakshmi (Full-Stack & Cloud Architect)',
    role: 'Senior Full-Stack & Cloud Architect',
    data: DEFAULT_RESUME
  },
  {
    id: 'product-manager',
    label: 'Elena Rostova (Lead Product Manager)',
    role: 'Lead Product Manager',
    data: {
      personalInfo: {
        fullName: 'Elena Rostova',
        jobTitle: 'Lead Technical Product Manager',
        email: 'elena.rostova@pmleaders.io',
        phone: '+1 (415) 890-4421',
        location: 'Seattle, WA',
        website: 'https://elenarostova.co',
        linkedin: 'linkedin.com/in/elena-rostova-pm',
        github: '',
        summary:
          'Data-driven Product Leader with 8+ years scaling B2B enterprise SaaS and consumer FinTech products from zero-to-one and $5M to $60M ARR. Champion of rapid customer discovery, user journey experimentation, and technical product execution with cross-functional engineering teams.'
      },
      settings: {
        template: 'classic-ivy',
        primaryColor: '#065f46',
        fontFamily: 'serif',
        spacing: 'balanced',
        showPhoto: false,
        showIcons: true,
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards'],
        visibleSections: {
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          awards: true
        }
      }
    }
  },
  {
    id: 'ai-engineer',
    label: 'Arjun Mehta (Senior AI / ML Research Engineer)',
    role: 'Senior AI & ML Research Engineer',
    data: {
      personalInfo: {
        fullName: 'Arjun Mehta',
        jobTitle: 'Senior Machine Learning & AI Research Engineer',
        email: 'arjun.mehta.ml@tensorflow.net',
        phone: '+1 (650) 412-9908',
        location: 'New York, NY',
        website: 'https://arjunmehta.ai',
        linkedin: 'linkedin.com/in/arjun-mehta-ai',
        github: 'github.com/arjun-ml-labs',
        summary:
          'Applied Machine Learning Engineer with 6+ years specializing in Large Language Model (LLM) fine-tuning, RAG architectures, and high-performance inference optimization. Reduced model inference latency by 4.2x using vLLM, TensorRT-LLM, and speculative decoding techniques.'
      },
      settings: {
        template: 'minimal-tech',
        primaryColor: '#18181b',
        fontFamily: 'mono',
        spacing: 'compact',
        showPhoto: false,
        showIcons: true,
        sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'awards'],
        visibleSections: {
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          awards: true
        }
      }
    }
  },
  {
    id: 'uiux-frontend',
    label: 'Maya Lin (Senior Design Technologist & UI Engineer)',
    role: 'Senior Design Technologist',
    data: {
      personalInfo: {
        fullName: 'Maya Lin',
        jobTitle: 'Senior Design Technologist & Frontend Specialist',
        email: 'maya@designsystems.studio',
        phone: '+1 (312) 554-1092',
        location: 'Austin, TX',
        website: 'https://mayadesign.works',
        linkedin: 'linkedin.com/in/maya-lin-design',
        github: 'github.com/mayadesign',
        summary:
          'Bridge between design systems and production frontend engineering. Built multi-brand accessible design systems adopted across 40+ engineering squads. Obsessed with micro-interactions, responsive typography, WCAG AAA compliance, and 60fps animations.'
      },
      settings: {
        template: 'creative-split',
        primaryColor: '#4338ca',
        fontFamily: 'jakarta',
        spacing: 'roomy',
        showPhoto: false,
        showIcons: true,
        sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'awards'],
        visibleSections: {
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          awards: true
        }
      }
    }
  }
];
