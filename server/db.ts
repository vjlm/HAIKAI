import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  MangaRelease,
  SiteSettings,
  Region,
  Character,
  StoryArc,
  MysteryFile,
  GalleryItem,
  TrailerItem,
  AuditLog,
  PublicContentResponse,
} from '../src/types/haikai';
import {
  REGIONS,
  CHARACTERS,
  STORY_ARCS,
  MYSTERY_FILES,
  GALLERY_ITEMS,
  TRAILERS,
} from '../src/data/haikaiData';

export interface DatabaseSchema {
  settings: SiteSettings;
  mangaRelease: MangaRelease;
  countdowns?: MangaRelease[];
  regions: Region[];
  characters: Character[];
  storyArcs: StoryArc[];
  mysteries: MysteryFile[];
  galleryItems: GalleryItem[];
  trailers: TrailerItem[];
  admin: {
    passwordHash: string;
    salt: string;
  };
  sessions: Record<string, { username: string; expiresAt: number }>;
  auditLogs: AuditLog[];
}

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

export const DATA_DIR = isServerless
  ? path.resolve('/tmp', 'haikai_data')
  : path.resolve(process.cwd(), 'data');

export const DB_FILE = path.join(DATA_DIR, 'haikai_db.json');
export const UPLOADS_DIR = isServerless
  ? path.resolve('/tmp', 'haikai_uploads')
  : path.join(DATA_DIR, 'uploads');

const BUNDLED_DB_FILE = path.resolve(process.cwd(), 'data', 'haikai_db.json');

// Ensure directories exist safely without throwing in read-only environments
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback in read-only environment
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback in read-only environment
}

export function hashPassword(password: string, salt?: string): { passwordHash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, generatedSalt, 64);
  return { passwordHash: derivedKey.toString('hex'), salt: generatedSalt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (keyBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, storedBuffer);
}

// Default initial release set 2 days into the future for live countdown demonstration
const initialReleaseDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'HAIKAI — The Sea of Ash',
  siteSubtitle: 'THE SEA OF ASH',
  japaneseTitle: '灰海',
  tagline: '“Was this world ever meant to be saved?”',
  ctaPrimaryLabel: '[ ENTER THE WORLD → ]',
  ctaPrimaryLink: '#manga',
  ctaSecondaryLabel: '[ MEET THE CHARACTERS ]',
  ctaSecondaryLink: '#characters',
  heroNotice: '',
  showHeroNotice: false,
  accentColor: '#9e2a2b',
  showAshParticles: true,
  animationSpeed: 'cinematic',
  visibleSections: {
    introduction: true,
    seaOfAsh: true,
    world: true,
    characters: true,
    ashSection: true,
    relationships: true,
    romance: true,
    oathSystem: true,
    storyArcs: true,
    mysteries: true,
    manga: true,
    warRecords: true,
    trailers: true,
    gallery: true,
    finalQuestion: true,
  },
  socialLinks: {
    x: 'https://x.com/haikai_official',
    instagram: 'https://instagram.com/haikai_manga',
    youtube: 'https://youtube.com',
    discord: 'https://discord.gg',
  },
  footerCredits: 'HAIKAI PRODUCTION COMMITTEE · ALL RIGHTS RESERVED',
  seoDescription:
    'Enter the world of HAIKAI — a dark fantasy mystery surrounding the Sea of Ash, the First Flood, and a civilization built on forgotten truth.',
  updatedAt: new Date().toISOString(),
};

const DEFAULT_MANGA_RELEASE: MangaRelease = {
  id: 'manga-vol-01',
  title: 'HAIKAI — THE SEA OF ASH',
  volumeNumber: 'Volume 01',
  subtitle: 'FIRST PUBLICATION · CHAPTERS 01–05',
  chapterRange: 'Chapters 01–05: The Salvage Boy to The War Records',
  description:
    'Seventeen-year-old salvage diver Nero Vale pulls an impossible pre-Flood bronze cylinder from the midnight shelf, triggering an imperial manhunt that shatters three thousand years of Crownlands peace.',
  coverImage: '/assets/manga_vol_01_cover.webp',
  releaseAt: initialReleaseDate,
  mangaUrl: 'https://haikai-manga.official.jp/read/volume-01',
  status: 'Scheduled',
  openInNewTab: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default master admin password: check process.env.ADMIN_PASSWORD, fallback to 'haikai-sea-of-ash-2026'
const defaultMasterPassword = process.env.ADMIN_PASSWORD || 'haikai-sea-of-ash-2026';
const initialAdmin = hashPassword(defaultMasterPassword);

let dbCache: DatabaseSchema | null = null;

function normalizeDatabase(db: DatabaseSchema): DatabaseSchema {
  // Guarantee settings has all default fields
  db.settings = {
    ...DEFAULT_SETTINGS,
    ...(db.settings || {}),
    visibleSections: {
      ...DEFAULT_SETTINGS.visibleSections,
      ...(db.settings?.visibleSections || {}),
    },
    socialLinks: {
      ...DEFAULT_SETTINGS.socialLinks,
      ...(db.settings?.socialLinks || {}),
    },
  };

  // Guarantee mangaRelease exists
  if (!db.mangaRelease) {
    db.mangaRelease = { ...DEFAULT_MANGA_RELEASE };
  }

  // Guarantee countdowns list exists and has at least mangaRelease
  if (!db.countdowns || !Array.isArray(db.countdowns) || db.countdowns.length === 0) {
    db.countdowns = [{ ...db.mangaRelease, isFeatured: true }];
  } else {
    // Ensure every countdown has valid fields
    db.countdowns = db.countdowns.map((c, i) => ({
      id: c?.id || `countdown-${i}-${Date.now()}`,
      title: c?.title || 'HAIKAI Release',
      volumeNumber: c?.volumeNumber || `Volume 0${i + 1}`,
      subtitle: c?.subtitle || '',
      chapterRange: c?.chapterRange || '',
      category: c?.category || 'Manga',
      description: c?.description || '',
      coverImage: c?.coverImage || '/manga-cover-vol1.svg',
      releaseAt: c?.releaseAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      mangaUrl: c?.mangaUrl || 'https://haikai-manga.official.jp',
      status: c?.status || 'Scheduled',
      openInNewTab: c?.openInNewTab !== false,
      isFeatured: Boolean(c?.isFeatured),
      createdAt: c?.createdAt || new Date().toISOString(),
      updatedAt: c?.updatedAt || new Date().toISOString(),
    }));
  }

  if (!db.trailers || db.trailers.length === 0) {
    db.trailers = (TRAILERS || []).map((t, i) => ({ ...t, status: 'Published', displayOrder: i }));
  }
  if (!db.characters || db.characters.length === 0) {
    db.characters = CHARACTERS.map((c, i) => ({ ...c, status: 'Published', displayOrder: i }));
  }
  if (!db.regions || db.regions.length === 0) {
    db.regions = REGIONS.map((r, i) => ({ ...r, status: 'Published', displayOrder: i }));
  }
  if (!db.storyArcs || db.storyArcs.length === 0) {
    db.storyArcs = STORY_ARCS.map((s, i) => ({ ...s, status: 'Published', displayOrder: i }));
  }
  if (!db.mysteries || db.mysteries.length === 0) {
    db.mysteries = MYSTERY_FILES.map((m, i) => ({ ...m, status: 'Published', displayOrder: i }));
  }
  if (!db.galleryItems || db.galleryItems.length === 0) {
    db.galleryItems = GALLERY_ITEMS.map((g, i) => ({ ...g, status: 'Published', displayOrder: i }));
  }
  if (!db.sessions) {
    db.sessions = {};
  }
  if (!db.auditLogs) {
    db.auditLogs = [];
  }
  return db;
}

function loadDatabase(): DatabaseSchema {
  if (dbCache) return normalizeDatabase(dbCache);

  // 1. Try runtime DB_FILE (e.g., /tmp/haikai_data/haikai_db.json or ./data/haikai_db.json)
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = normalizeDatabase(JSON.parse(raw));
      saveDatabase(dbCache);
      return dbCache;
    } catch (err) {
      console.error('[DB] Failed to parse haikai_db.json from DB_FILE:', err);
    }
  }

  // 2. Try bundled repo DB file if running on serverless/read-only
  if (DB_FILE !== BUNDLED_DB_FILE && fs.existsSync(BUNDLED_DB_FILE)) {
    try {
      const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      dbCache = normalizeDatabase(JSON.parse(raw));
      saveDatabase(dbCache);
      return dbCache;
    } catch (err) {
      console.error('[DB] Failed to parse haikai_db.json from BUNDLED_DB_FILE:', err);
    }
  }

  // 3. Initialize DB from defaults
  const newDb: DatabaseSchema = {
    settings: DEFAULT_SETTINGS,
    mangaRelease: DEFAULT_MANGA_RELEASE,
    countdowns: [{ ...DEFAULT_MANGA_RELEASE, isFeatured: true }],
    regions: REGIONS.map((r, i) => ({ ...r, status: 'Published', displayOrder: i })),
    characters: CHARACTERS.map((c, i) => ({ ...c, status: 'Published', displayOrder: i })),
    storyArcs: STORY_ARCS.map((s, i) => ({ ...s, status: 'Published', displayOrder: i })),
    mysteries: MYSTERY_FILES.map((m, i) => ({ ...m, status: 'Published', displayOrder: i })),
    galleryItems: GALLERY_ITEMS.map((g, i) => ({ ...g, status: 'Published', displayOrder: i })),
    trailers: (TRAILERS || []).map((t, i) => ({ ...t, status: 'Published', displayOrder: i })),
    admin: initialAdmin,
    sessions: {},
    auditLogs: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        user: 'System',
        action: 'INITIALIZE',
        contentType: 'Database',
        contentId: 'root',
        details: 'Initial database schema and canonical lore seeded.',
      },
    ],
  };

  saveDatabase(newDb);
  dbCache = newDb;
  return newDb;
}

export function saveDatabase(data: DatabaseSchema): void {
  dbCache = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.warn('[DB] Could not persist database file to disk (read-only environment):', err);
  }
}

export function getDatabase(): DatabaseSchema {
  return loadDatabase();
}

export function recordAudit(
  user: string,
  action: string,
  contentType: string,
  contentId: string,
  details: string
): void {
  const db = getDatabase();
  const log: AuditLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user,
    action,
    contentType,
    contentId,
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDatabase(db);
}

export function getPublicContent(): PublicContentResponse {
  const db = getDatabase();
  const now = new Date();
  const nowIso = now.toISOString();

  // Server-authoritative calculation of release state
  const releaseTime = new Date(db.mangaRelease.releaseAt).getTime();
  const isReleased =
    db.mangaRelease.status === 'Released' ||
    (db.mangaRelease.status === 'Scheduled' && now.getTime() >= releaseTime);

  const mangaReleaseCopy: MangaRelease = {
    ...db.mangaRelease,
    serverTime: nowIso,
    isReleased: isReleased,
  };

  // Process all countdowns
  const rawCountdowns = db.countdowns && db.countdowns.length > 0 ? db.countdowns : [db.mangaRelease];
  const countdowns = rawCountdowns
    .filter((c) => c.status !== 'Hidden')
    .map((c) => {
      const rTime = new Date(c.releaseAt).getTime();
      const isRel = c.status === 'Released' || (c.status === 'Scheduled' && now.getTime() >= rTime);
      return {
        ...c,
        serverTime: nowIso,
        isReleased: isRel,
      };
    });

  // Filter only published content for public consumption
  const regions = db.regions
    .filter((r) => r.status !== 'Draft' && r.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const characters = db.characters
    .filter((c) => c.status !== 'Draft' && c.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const storyArcs = db.storyArcs
    .filter((s) => s.status !== 'Draft' && s.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const mysteries = db.mysteries
    .filter((m) => m.status !== 'Draft' && m.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const galleryItems = db.galleryItems
    .filter((g) => g.status !== 'Draft' && g.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const trailers = (db.trailers || [])
    .filter((t) => t.status !== 'Draft' && t.status !== 'Hidden')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return {
    serverTime: nowIso,
    settings: db.settings,
    mangaRelease: mangaReleaseCopy,
    countdowns,
    regions,
    characters,
    storyArcs,
    mysteries,
    galleryItems,
    trailers,
  };
}
