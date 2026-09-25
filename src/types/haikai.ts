export interface VisibleSections {
  introduction?: boolean;
  seaOfAsh?: boolean;
  world?: boolean;
  characters?: boolean;
  ashSection?: boolean;
  relationships?: boolean;
  romance?: boolean;
  oathSystem?: boolean;
  storyArcs?: boolean;
  mysteries?: boolean;
  manga?: boolean;
  warRecords?: boolean;
  trailers?: boolean;
  gallery?: boolean;
  finalQuestion?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  japaneseTitle: string;
  tagline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink?: string;
  heroNotice?: string;
  showHeroNotice?: boolean;
  heroNoticeLink?: string;
  accentColor?: string;
  showAshParticles?: boolean;
  animationSpeed?: 'calm' | 'cinematic' | 'hyper';
  ambientAudioUrl?: string;
  ambientAudioTitle?: string;
  visibleSections?: VisibleSections;
  socialLinks: {
    x?: string;
    instagram?: string;
    youtube?: string;
    discord?: string;
  };
  footerCredits?: string;
  seoDescription: string;
  updatedAt?: string;
}

export interface MangaRelease {
  id: string;
  title: string;
  volumeNumber: string;
  subtitle: string;
  chapterRange: string;
  description: string;
  coverImage?: string;
  releaseAt: string;
  mangaUrl: string;
  status: 'Scheduled' | 'Released' | 'Hidden';
  openInNewTab?: boolean;
  category?: string;
  isFeatured?: boolean;
  serverTime?: string;
  isReleased?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Region {
  id: string;
  number: string;
  name: string;
  japanese: string;
  tagline: string;
  visualSummary: string;
  quote: string;
  government: string;
  powerSource: string;
  ideology: string;
  description: string;
  depthRecord: string;
  hazards: string[];
  keyLocations: string[];
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface Character {
  id: string;
  name: string;
  japanese: string;
  age: number | string;
  role: string;
  origin: string;
  quote: string;
  appearance: string;
  description: string;
  highlight: string;
  knownFor: string[];
  classifiedNote?: string;
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface StoryArc {
  id: string;
  number: string;
  arcNumber: number;
  title: string;
  japanese: string;
  synopsis: string;
  quote: string;
  depthLevel: string;
  keyArtifact: string;
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface MysteryFile {
  id: string;
  fileNumber: string;
  title: string;
  japanese: string;
  classification: string;
  description: string;
  dialogue?: Array<{ speaker: string; text: string }>;
  inconsistencies: string[];
  redactedLore: string;
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  japanese: string;
  category: string;
  description: string;
  aspectRatio: string;
  visualType: string;
  imageUrl?: string;
  focalPoint?: { x: number; y: number } | any;
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface TrailerItem {
  id: string;
  title: string;
  japanese?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  releaseDate?: string;
  description?: string;
  category?: string;
  status?: 'Published' | 'Draft' | 'Hidden';
  displayOrder?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  contentType: string;
  contentId: string;
  details: string;
}

export interface PublicContentResponse {
  serverTime: string;
  settings: SiteSettings;
  mangaRelease: MangaRelease;
  countdowns?: MangaRelease[];
  regions: Region[];
  characters: Character[];
  storyArcs: StoryArc[];
  mysteries: MysteryFile[];
  galleryItems: GalleryItem[];
  trailers?: TrailerItem[];
}
