import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  REGIONS,
  CHARACTERS,
  RELATIONSHIPS,
  OATHS,
  STORY_ARCS,
  MYSTERY_FILES,
  WAR_RECORDS,
  GALLERY_ITEMS,
  HAIKAI_META
} from '../src/data/haikaiData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');
const AUDIT_PATH = path.resolve(DATA_DIR, 'audit.json');

export interface MangaReleaseData {
  id: string;
  title: string;
  subtitle: string;
  volumeNumber: string;
  chapterRange?: string;
  description: string;
  coverImage: string;
  releaseAt: string; // ISO 8601 UTC string
  mangaUrl: string;
  status: 'Scheduled' | 'Released' | 'Hidden';
  openInNewTab: boolean;
  published: boolean;
  updatedAt: string;
}

export interface SiteSettingsData {
  title: string;
  subtitle: string;
  centralQuestion: string;
  deeperQuestion: string;
  tagline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  socialLinks: {
    x?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  contentType: string;
  contentId?: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface ContentStore {
  siteSettings: SiteSettingsData;
  mangaRelease: MangaReleaseData;
  regions: any[];
  characters: any[];
  storyArcs: any[];
  mysteries: any[];
  oaths: any[];
  relationships: any[];
  warRecords: any[];
  gallery: any[];
  drafts: {
    mangaRelease?: Partial<MangaReleaseData>;
    siteSettings?: Partial<SiteSettingsData>;
    [key: string]: any;
  };
}

// Initial release timestamp: 3 days from now in UTC by default
const defaultReleaseDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

const defaultInitialStore: ContentStore = {
  siteSettings: {
    title: HAIKAI_META.englishTitle,
    subtitle: HAIKAI_META.subtitle,
    centralQuestion: HAIKAI_META.centralQuestion,
    deeperQuestion: HAIKAI_META.deeperQuestion,
    tagline: '“Was this world ever meant to be saved?”',
    heroCtaPrimary: '[ ENTER THE WORLD → ]',
    heroCtaSecondary: '[ MEET THE CHARACTERS ]',
    socialLinks: {
      x: 'https://x.com/haikai_ash',
      discord: 'https://discord.gg/haikai',
      youtube: 'https://youtube.com',
    },
  },
  mangaRelease: {
    id: 'vol-01',
    title: 'HAIKAI: THE SEA OF ASH',
    subtitle: '灰海 — 巻ノ一「回収の少年」',
    volumeNumber: 'Volume 01',
    chapterRange: 'Chapters 01 – 06',
    description:
      'The initial descent begins. Follow seventeen-year-old salvage diver Nero Vale as an unauthorized recovery in Sector 04 unearths the bronze cylinder that fractures three millennia of imperial cartography.',
    coverImage: '/manga-cover-vol1.svg',
    releaseAt: defaultReleaseDate,
    mangaUrl: 'https://haikai-manga.official.publication/vol-01',
    status: 'Scheduled',
    openInNewTab: true,
    published: true,
    updatedAt: new Date().toISOString(),
  },
  regions: REGIONS.map((r) => ({ ...r, status: 'Published' })),
  characters: CHARACTERS.map((c) => ({ ...c, status: 'Published' })),
  storyArcs: STORY_ARCS.map((s) => ({ ...s, status: 'Published' })),
  mysteries: MYSTERY_FILES.map((m) => ({ ...m, status: 'Published' })),
  oaths: OATHS.map((o: any) => ({ ...o, status: 'Published' })),
  relationships: RELATIONSHIPS,
  warRecords: WAR_RECORDS.map((w: any) => ({ ...w, status: 'Published' })),
  gallery: GALLERY_ITEMS.map((g) => ({ ...g, status: 'Published' })),
  drafts: {},
};

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export class StoreManager {
  private static store: ContentStore | null = null;
  private static auditLogs: AuditLogEntry[] = [];

  public static init() {
    ensureDirSync(DATA_DIR);
    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.store = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse store.json, resetting to default:', err);
        this.store = defaultInitialStore;
        this.save();
      }
    } else {
      this.store = defaultInitialStore;
      this.save();
    }

    if (fs.existsSync(AUDIT_PATH)) {
      try {
        const raw = fs.readFileSync(AUDIT_PATH, 'utf-8');
        this.auditLogs = JSON.parse(raw);
      } catch (err) {
        this.auditLogs = [];
      }
    }
  }

  public static get(): ContentStore {
    if (!this.store) {
      this.init();
    }
    return this.store!;
  }

  public static save() {
    ensureDirSync(DATA_DIR);
    if (this.store) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.store, null, 2), 'utf-8');
    }
  }

  public static logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep last 100 entries
    if (this.auditLogs.length > 100) {
      this.auditLogs = this.auditLogs.slice(0, 100);
    }
    ensureDirSync(DATA_DIR);
    fs.writeFileSync(AUDIT_PATH, JSON.stringify(this.auditLogs, null, 2), 'utf-8');
  }

  public static getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}
