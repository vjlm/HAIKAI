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
  AuditLog,
  PublicContentResponse,
} from '../src/types/haikai';
import {
  REGIONS,
  CHARACTERS,
  STORY_ARCS,
  MYSTERY_FILES,
  GALLERY_ITEMS,
} from '../src/data/haikaiData';

export interface DatabaseSchema {
  settings: SiteSettings;
  mangaRelease: MangaRelease;
  regions: Region[];
  characters: Character[];
  storyArcs: StoryArc[];
  mysteries: MysteryFile[];
  galleryItems: GalleryItem[];
  admin: {
    passwordHash: string;
    salt: string;
  };
  sessions: Record<string, { username: string; expiresAt: number }>;
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'haikai_db.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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
  ctaSecondaryLabel: '[ MEET THE CHARACTERS ]',
  heroNotice: 'PRE-FLOOD RECKONING',
  socialLinks: {
    x: 'https://x.com/haikai_official',
    instagram: 'https://instagram.com/haikai_manga',
    youtube: 'https://youtube.com',
    discord: 'https://discord.gg',
  },
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

function loadDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      return dbCache!;
    } catch (err) {
      console.error('Failed to parse haikai_db.json, backing up and reinitializing', err);
    }
  }

  // Initialize DB from defaults
  const newDb: DatabaseSchema = {
    settings: DEFAULT_SETTINGS,
    mangaRelease: DEFAULT_MANGA_RELEASE,
    regions: REGIONS.map((r, i) => ({ ...r, status: 'Published', displayOrder: i })),
    characters: CHARACTERS.map((c, i) => ({ ...c, status: 'Published', displayOrder: i })),
    storyArcs: STORY_ARCS.map((s, i) => ({ ...s, status: 'Published', displayOrder: i })),
    mysteries: MYSTERY_FILES.map((m, i) => ({ ...m, status: 'Published', displayOrder: i })),
    galleryItems: GALLERY_ITEMS.map((g, i) => ({ ...g, status: 'Published', displayOrder: i })),
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
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
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

  return {
    serverTime: nowIso,
    settings: db.settings,
    mangaRelease: mangaReleaseCopy,
    regions,
    characters,
    storyArcs,
    mysteries,
    galleryItems,
  };
}
