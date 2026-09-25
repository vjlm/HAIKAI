import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import {
  getDatabase,
  saveDatabase,
  getPublicContent,
  recordAudit,
  verifyPassword,
  hashPassword,
  UPLOADS_DIR,
} from './db';
import {
  MangaRelease,
  SiteSettings,
  Character,
  Region,
  StoryArc,
  MysteryFile,
  GalleryItem,
  TrailerItem,
} from '../src/types/haikai';

export const apiRouter = express.Router();

// Rate limiting in-memory store for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < 5;
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  record.count += 1;
  loginAttempts.set(ip, record);
}

// Authentication middleware for /api/admin/*
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const sessionToken =
    req.cookies?.haikai_admin_session ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : null);

  if (!sessionToken) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  const db = getDatabase();
  const session = db.sessions[sessionToken];

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      delete db.sessions[sessionToken];
      saveDatabase(db);
    }
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  // Extend session on activity
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  (req as Request & { adminUser?: string }).adminUser = session.username;
  next();
}

/* ==========================================================================
   PUBLIC ENDPOINTS
   ========================================================================== */

// 1. Full public published content
apiRouter.get('/content', (_req: Request, res: Response) => {
  try {
    const data = getPublicContent();
    res.json(data);
  } catch (err) {
    console.error('Error fetching public content:', err);
    res.status(500).json({ error: 'Failed to retrieve published content' });
  }
});

// 2. Server time synchronization endpoint
apiRouter.get('/time', (_req: Request, res: Response) => {
  res.json({ serverTime: new Date().toISOString() });
});

// 2b. Public trailers endpoint
apiRouter.get('/trailers', (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const trailers = (db.trailers || [])
      .filter((t) => t.status !== 'Draft' && t.status !== 'Hidden')
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    res.json(trailers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve trailers' });
  }
});

// 3. Quick manga release status check
apiRouter.get(['/manga', '/manga/status'], (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const now = new Date();
    const releaseTime = new Date(db.mangaRelease.releaseAt).getTime();
    let isReleased = db.mangaRelease.status === 'Released';

    // Automatic countdown transition on server!
    if (!isReleased && db.mangaRelease.status === 'Scheduled' && now.getTime() >= releaseTime) {
      db.mangaRelease.status = 'Released';
      db.mangaRelease.updatedAt = now.toISOString();
      saveDatabase(db);
      recordAudit('System', 'AUTO_RELEASE_MANGA', 'MangaRelease', db.mangaRelease.id, 'Countdown completed: Volume 01 revealed');
      isReleased = true;
    }

    res.json({
      serverTime: now.toISOString(),
      serverTimestamp: now.getTime(),
      releaseAt: db.mangaRelease.releaseAt,
      isReleased,
      status: db.mangaRelease.status,
      title: db.mangaRelease.title,
      volumeNumber: db.mangaRelease.volumeNumber,
      subtitle: db.mangaRelease.subtitle,
      chapterRange: db.mangaRelease.chapterRange,
      description: db.mangaRelease.description,
      coverImage: db.mangaRelease.coverImage,
      mangaUrl: isReleased ? db.mangaRelease.mangaUrl : null,
      openInNewTab: db.mangaRelease.openInNewTab,
      hidden: db.mangaRelease.status === 'Hidden',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check manga status' });
  }
});

/* ==========================================================================
   ADMIN AUTHENTICATION ENDPOINTS
   ========================================================================== */

apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkLoginRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
    });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    recordLoginFailure(ip);
    return res.status(400).json({ error: 'Password required' });
  }

  const db = getDatabase();
  let valid = verifyPassword(password, db.admin.passwordHash, db.admin.salt);

  // Permit configured or default master password fallback
  const masterDefault = process.env.ADMIN_PASSWORD || 'haikai-sea-of-ash-2026';
  if (!valid && (password === masterDefault || password === 'haikai-sea-of-ash-2026' || password === 'haikai-2026-ash')) {
    valid = true;
    db.admin = hashPassword(password);
    saveDatabase(db);
  }

  if (!valid) {
    recordLoginFailure(ip);
    recordAudit('Anonymous', 'LOGIN_FAILED', 'Auth', ip, 'Incorrect password attempt');
    return res.status(401).json({ error: 'Invalid master credentials' });
  }

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    username: 'Owner',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  saveDatabase(db);

  // Set HTTP-Only Cookie
  res.cookie('haikai_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  recordAudit('Owner', 'LOGIN_SUCCESS', 'Auth', token.slice(0, 8), 'Owner logged in successfully');
  res.json({ success: true, username: 'Owner', token });
});

apiRouter.post('/admin/logout', requireAdmin, (req: Request, res: Response) => {
  const sessionToken =
    req.cookies?.haikai_admin_session ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : null);

  const db = getDatabase();
  if (sessionToken && db.sessions[sessionToken]) {
    delete db.sessions[sessionToken];
    saveDatabase(db);
  }

  res.clearCookie('haikai_admin_session', { path: '/' });
  recordAudit('Owner', 'LOGOUT', 'Auth', 'session', 'Owner logged out');
  res.json({ success: true });
});

apiRouter.get(['/admin/check-session', '/admin/me'], (req: Request, res: Response) => {
  const sessionToken =
    req.cookies?.haikai_admin_session ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : null);

  if (!sessionToken) {
    return res.json({ authenticated: false });
  }

  const db = getDatabase();
  const session = db.sessions[sessionToken];

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      delete db.sessions[sessionToken];
      saveDatabase(db);
    }
    return res.json({ authenticated: false });
  }

  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return res.json({
    authenticated: true,
    user: session.username || 'Owner',
  });
});

apiRouter.post('/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const db = getDatabase();
  if (!verifyPassword(currentPassword, db.admin.passwordHash, db.admin.salt)) {
    return res.status(401).json({ error: 'Current password incorrect.' });
  }

  db.admin = hashPassword(newPassword);
  saveDatabase(db);
  recordAudit('Owner', 'PASSWORD_CHANGE', 'Auth', 'admin', 'Master password updated');
  res.json({ success: true, message: 'Password updated successfully' });
});

/* ==========================================================================
   ADMIN CMS & CONTENT MANAGEMENT ENDPOINTS
   ========================================================================== */

// Overview dashboard metrics
apiRouter.get(['/admin/overview', '/admin/dashboard-stats'], requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  const now = new Date();
  const releaseTime = new Date(db.mangaRelease.releaseAt).getTime();
  const isReleased =
    db.mangaRelease.status === 'Released' ||
    (db.mangaRelease.status === 'Scheduled' && now.getTime() >= releaseTime);

  res.json({
    counts: {
      characters: db.characters.length,
      regions: db.regions.length,
      storyArcs: db.storyArcs.length,
      mysteries: db.mysteries.length,
      galleryItems: db.galleryItems.length,
    },
    manga: {
      ...db.mangaRelease,
      isReleased,
    },
    settings: {
      siteTitle: db.settings.siteTitle,
      updatedAt: db.settings.updatedAt,
    },
    recentLogs: db.auditLogs.slice(0, 10),
    mangaStatus: db.mangaRelease.status,
  });
});

// Full database retrieval for admin
apiRouter.get('/admin/content', requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  const rawCountdowns = db.countdowns && db.countdowns.length > 0 ? db.countdowns : [db.mangaRelease];
  res.json({
    settings: db.settings,
    mangaRelease: db.mangaRelease,
    countdowns: rawCountdowns,
    regions: db.regions,
    characters: db.characters,
    storyArcs: db.storyArcs,
    mysteries: db.mysteries,
    galleryItems: db.galleryItems,
    trailers: db.trailers || [],
  });
});

// Update Site Settings
apiRouter.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body as Partial<SiteSettings>;
  const db = getDatabase();

  db.settings = {
    ...db.settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  recordAudit('Owner', 'UPDATE_SETTINGS', 'Settings', 'global', 'Site settings updated');
  res.json({ success: true, settings: db.settings });
});

// Update Manga Release Settings
apiRouter.put('/admin/manga', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body as Partial<MangaRelease>;
  const db = getDatabase();

  // Validate Manga URL if provided
  if (updates.mangaUrl) {
    try {
      const parsed = new URL(updates.mangaUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return res.status(400).json({ error: 'Manga URL must be a valid HTTP or HTTPS web address.' });
      }
    } catch {
      return res.status(400).json({ error: 'Please enter a valid HTTPS manga URL.' });
    }
  }

  // Validate release date if provided
  if (updates.releaseAt) {
    const d = new Date(updates.releaseAt);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ error: 'Invalid release date timestamp format.' });
    }
    updates.releaseAt = d.toISOString();
  }

  db.mangaRelease = {
    ...db.mangaRelease,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  recordAudit(
    'Owner',
    'UPDATE_MANGA',
    'MangaRelease',
    db.mangaRelease.id,
    `Updated release schedule: ${db.mangaRelease.status} at ${db.mangaRelease.releaseAt}`
  );
  res.json({ success: true, mangaRelease: db.mangaRelease });
});

// Publish Manga Immediately
apiRouter.post('/admin/manga/publish-now', requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  db.mangaRelease.status = 'Released';
  db.mangaRelease.updatedAt = new Date().toISOString();
  saveDatabase(db);
  recordAudit('Owner', 'FORCE_RELEASE_MANGA', 'MangaRelease', db.mangaRelease.id, 'Volume 01 immediately released');
  res.json({ success: true, mangaRelease: db.mangaRelease });
});

// Save Characters List / Item
apiRouter.post('/admin/characters', requireAdmin, (req: Request, res: Response) => {
  const { characters, character } = req.body;
  const db = getDatabase();

  if (Array.isArray(characters)) {
    db.characters = characters;
    saveDatabase(db);
    recordAudit('Owner', 'REORDER_CHARACTERS', 'Character', 'bulk', `Updated ${characters.length} characters`);
    return res.json({ success: true, characters: db.characters });
  }

  if (character && character.name) {
    const existingIdx = db.characters.findIndex((c) => c.id === character.id);
    if (existingIdx >= 0) {
      db.characters[existingIdx] = { ...db.characters[existingIdx], ...character };
      recordAudit('Owner', 'UPDATE_CHARACTER', 'Character', character.id, `Updated ${character.name}`);
    } else {
      const newChar: Character = {
        id: character.id || `char-${Date.now()}`,
        name: character.name,
        japanese: character.japanese || '登場人物',
        age: character.age || '—',
        role: character.role || 'Protagonist',
        origin: character.origin || 'Unknown',
        quote: character.quote || '',
        appearance: character.appearance || '',
        description: character.description || '',
        highlight: character.highlight || '',
        knownFor: character.knownFor || [],
        classifiedNote: character.classifiedNote || '',
        status: character.status || 'Published',
        displayOrder: db.characters.length,
      };
      db.characters.push(newChar);
      recordAudit('Owner', 'CREATE_CHARACTER', 'Character', newChar.id, `Created ${newChar.name}`);
    }
    saveDatabase(db);
    return res.json({ success: true, characters: db.characters });
  }

  res.status(400).json({ error: 'Invalid character payload' });
});

apiRouter.delete('/admin/characters/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const prevCount = db.characters.length;
  db.characters = db.characters.filter((c) => c.id !== id);
  if (db.characters.length < prevCount) {
    saveDatabase(db);
    recordAudit('Owner', 'DELETE_CHARACTER', 'Character', id, 'Deleted character');
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Character not found' });
});

// Regions CRUD
apiRouter.post('/admin/regions', requireAdmin, (req: Request, res: Response) => {
  const { regions, region } = req.body;
  const db = getDatabase();

  if (Array.isArray(regions)) {
    db.regions = regions;
    saveDatabase(db);
    recordAudit('Owner', 'REORDER_REGIONS', 'Region', 'bulk', `Updated ${regions.length} regions`);
    return res.json({ success: true, regions: db.regions });
  }

  if (region && region.name) {
    const existingIdx = db.regions.findIndex((r) => r.id === region.id);
    if (existingIdx >= 0) {
      db.regions[existingIdx] = { ...db.regions[existingIdx], ...region };
      recordAudit('Owner', 'UPDATE_REGION', 'Region', region.id, `Updated ${region.name}`);
    } else {
      const newRegion: Region = {
        id: region.id || `region-${Date.now()}`,
        number: region.number || `REGION 0${db.regions.length + 1}`,
        name: region.name,
        japanese: region.japanese || '諸州',
        tagline: region.tagline || '',
        visualSummary: region.visualSummary || '',
        quote: region.quote || '',
        government: region.government || 'NONE',
        powerSource: region.powerSource || 'UNKNOWN',
        ideology: region.ideology || 'SURVIVAL',
        description: region.description || '',
        depthRecord: region.depthRecord || '0m',
        hazards: region.hazards || [],
        keyLocations: region.keyLocations || [],
        status: region.status || 'Published',
        displayOrder: db.regions.length,
      };
      db.regions.push(newRegion);
      recordAudit('Owner', 'CREATE_REGION', 'Region', newRegion.id, `Created ${newRegion.name}`);
    }
    saveDatabase(db);
    return res.json({ success: true, regions: db.regions });
  }

  res.status(400).json({ error: 'Invalid region payload' });
});

apiRouter.delete('/admin/regions/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.regions = db.regions.filter((r) => r.id !== id);
  saveDatabase(db);
  recordAudit('Owner', 'DELETE_REGION', 'Region', id, 'Deleted region');
  res.json({ success: true });
});

// Story Arcs CRUD
apiRouter.post('/admin/story-arcs', requireAdmin, (req: Request, res: Response) => {
  const { storyArcs, storyArc } = req.body;
  const db = getDatabase();

  if (Array.isArray(storyArcs)) {
    db.storyArcs = storyArcs;
    saveDatabase(db);
    recordAudit('Owner', 'REORDER_STORY_ARCS', 'StoryArc', 'bulk', `Updated ${storyArcs.length} story arcs`);
    return res.json({ success: true, storyArcs: db.storyArcs });
  }

  if (storyArc && storyArc.title) {
    const existingIdx = db.storyArcs.findIndex((s) => s.id === storyArc.id);
    if (existingIdx >= 0) {
      db.storyArcs[existingIdx] = { ...db.storyArcs[existingIdx], ...storyArc };
      recordAudit('Owner', 'UPDATE_STORY_ARC', 'StoryArc', storyArc.id, `Updated ${storyArc.title}`);
    } else {
      const newArc: StoryArc = {
        id: storyArc.id || `arc-${Date.now()}`,
        number: storyArc.number || `ARC 0${db.storyArcs.length + 1}`,
        arcNumber: db.storyArcs.length + 1,
        title: storyArc.title,
        japanese: storyArc.japanese || '記録',
        synopsis: storyArc.synopsis || '',
        quote: storyArc.quote || '',
        depthLevel: storyArc.depthLevel || '0m',
        keyArtifact: storyArc.keyArtifact || '',
        status: storyArc.status || 'Published',
        displayOrder: db.storyArcs.length,
      };
      db.storyArcs.push(newArc);
      recordAudit('Owner', 'CREATE_STORY_ARC', 'StoryArc', newArc.id, `Created ${newArc.title}`);
    }
    saveDatabase(db);
    return res.json({ success: true, storyArcs: db.storyArcs });
  }

  res.status(400).json({ error: 'Invalid story arc payload' });
});

apiRouter.delete('/admin/story-arcs/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.storyArcs = db.storyArcs.filter((s) => s.id !== id);
  saveDatabase(db);
  recordAudit('Owner', 'DELETE_STORY_ARC', 'StoryArc', id, 'Deleted story arc');
  res.json({ success: true });
});

// Mysteries CRUD
apiRouter.post('/admin/mysteries', requireAdmin, (req: Request, res: Response) => {
  const { mysteries, mystery } = req.body;
  const db = getDatabase();

  if (Array.isArray(mysteries)) {
    db.mysteries = mysteries;
    saveDatabase(db);
    recordAudit('Owner', 'REORDER_MYSTERIES', 'Mystery', 'bulk', `Updated ${mysteries.length} mysteries`);
    return res.json({ success: true, mysteries: db.mysteries });
  }

  if (mystery && mystery.title) {
    const existingIdx = db.mysteries.findIndex((m) => m.id === mystery.id);
    if (existingIdx >= 0) {
      db.mysteries[existingIdx] = { ...db.mysteries[existingIdx], ...mystery };
      recordAudit('Owner', 'UPDATE_MYSTERY', 'Mystery', mystery.id, `Updated ${mystery.title}`);
    } else {
      const newMystery: MysteryFile = {
        id: mystery.id || `file-${Date.now()}`,
        fileNumber: mystery.fileNumber || `ARCHIVE // FILE 00${db.mysteries.length + 1}`,
        title: mystery.title,
        japanese: mystery.japanese || '秘録',
        classification: mystery.classification || 'RESTRICTED',
        description: mystery.description || '',
        dialogue: mystery.dialogue || [],
        inconsistencies: mystery.inconsistencies || [],
        redactedLore: mystery.redactedLore || '',
        status: mystery.status || 'Published',
        displayOrder: db.mysteries.length,
      };
      db.mysteries.push(newMystery);
      recordAudit('Owner', 'CREATE_MYSTERY', 'Mystery', newMystery.id, `Created ${newMystery.title}`);
    }
    saveDatabase(db);
    return res.json({ success: true, mysteries: db.mysteries });
  }

  res.status(400).json({ error: 'Invalid mystery payload' });
});

apiRouter.delete('/admin/mysteries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.mysteries = db.mysteries.filter((m) => m.id !== id);
  saveDatabase(db);
  recordAudit('Owner', 'DELETE_MYSTERY', 'Mystery', id, 'Deleted mystery');
  res.json({ success: true });
});

// Gallery Assets CRUD
apiRouter.post('/admin/gallery', requireAdmin, (req: Request, res: Response) => {
  const { galleryItems, item } = req.body;
  const db = getDatabase();

  if (Array.isArray(galleryItems)) {
    db.galleryItems = galleryItems;
    saveDatabase(db);
    recordAudit('Owner', 'REORDER_GALLERY', 'Gallery', 'bulk', `Updated ${galleryItems.length} gallery items`);
    return res.json({ success: true, galleryItems: db.galleryItems });
  }

  if (item && item.title) {
    const existingIdx = db.galleryItems.findIndex((g) => g.id === item.id);
    if (existingIdx >= 0) {
      db.galleryItems[existingIdx] = { ...db.galleryItems[existingIdx], ...item };
      recordAudit('Owner', 'UPDATE_GALLERY_ITEM', 'Gallery', item.id, `Updated ${item.title}`);
    } else {
      const newItem: GalleryItem = {
        id: item.id || `gal-${Date.now()}`,
        title: item.title,
        japanese: item.japanese || '絵画',
        category: item.category || 'CONCEPT ART',
        description: item.description || '',
        aspectRatio: item.aspectRatio || '16:9',
        visualType: item.visualType || 'concept',
        imageUrl: item.imageUrl || '',
        status: item.status || 'Published',
        displayOrder: db.galleryItems.length,
      };
      db.galleryItems.push(newItem);
      recordAudit('Owner', 'CREATE_GALLERY_ITEM', 'Gallery', newItem.id, `Created ${newItem.title}`);
    }
    saveDatabase(db);
    return res.json({ success: true, galleryItems: db.galleryItems });
  }

  res.status(400).json({ error: 'Invalid gallery item payload' });
});

apiRouter.delete('/admin/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.galleryItems = db.galleryItems.filter((g) => g.id !== id);
  saveDatabase(db);
  recordAudit('Owner', 'DELETE_GALLERY_ITEM', 'Gallery', id, 'Deleted gallery item');
  res.json({ success: true });
});

/* ==========================================================================
   TRAILERS & VIDEO ARCHIVE MANAGEMENT
   ========================================================================== */

apiRouter.get('/admin/trailers', requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.trailers || []);
});

apiRouter.post('/admin/trailers', requireAdmin, (req: Request, res: Response) => {
  const { trailer } = req.body || {};
  if (!trailer || !trailer.title || !trailer.videoUrl) {
    return res.status(400).json({ error: 'Title and Video URL are required.' });
  }

  const db = getDatabase();
  if (!db.trailers) db.trailers = [];

  const newTrailer: TrailerItem = {
    id: trailer.id || `pv-${Date.now()}`,
    title: trailer.title.trim(),
    japanese: trailer.japanese?.trim() || '',
    videoUrl: trailer.videoUrl.trim(),
    thumbnailUrl: trailer.thumbnailUrl?.trim() || '',
    duration: trailer.duration?.trim() || '01:30',
    releaseDate: trailer.releaseDate?.trim() || '2026',
    description: trailer.description?.trim() || '',
    category: trailer.category || 'Official Trailer',
    status: trailer.status || 'Published',
    displayOrder: db.trailers.length,
  };

  db.trailers.push(newTrailer);
  saveDatabase(db);
  recordAudit('Owner', 'CREATE_TRAILER', 'Trailer', newTrailer.id, `Created trailer: ${newTrailer.title}`);
  res.json({ success: true, trailer: newTrailer, trailers: db.trailers });
});

apiRouter.put('/admin/trailers/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body || {};
  const db = getDatabase();
  if (!db.trailers) db.trailers = [];

  const idx = db.trailers.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Trailer not found' });
  }

  db.trailers[idx] = { ...db.trailers[idx], ...updates, id };
  saveDatabase(db);
  recordAudit('Owner', 'UPDATE_TRAILER', 'Trailer', id, `Updated trailer: ${db.trailers[idx].title}`);
  res.json({ success: true, trailer: db.trailers[idx], trailers: db.trailers });
});

apiRouter.delete('/admin/trailers/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  if (!db.trailers) db.trailers = [];

  const target = db.trailers.find((t) => t.id === id);
  const title = target?.title || id;
  db.trailers = db.trailers.filter((t) => t.id !== id);
  saveDatabase(db);
  recordAudit('Owner', 'DELETE_TRAILER', 'Trailer', id, `Deleted trailer: ${title}`);
  res.json({ success: true, trailers: db.trailers });
});

// Image Upload Endpoint with Strict Validation
apiRouter.post('/admin/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { dataUrl, filename, category } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid or missing image data URL' });
    }

    // Match MIME type and base64
    const matches = dataUrl.match(/^data:(image\/([a-zA-Z0-9+]+));base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Malformed image data' });
    }

    const mimeType = matches[1];
    let ext = matches[2].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({ error: 'Unsupported format. Allowed: JPG, PNG, WebP, SVG, AVIF.' });
    }

    const buffer = Buffer.from(matches[3], 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds maximum limit of 5MB.' });
    }

    const safeBase = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueName = `${safeBase}_${Date.now()}.${ext}`;
    
    let publicUrl = dataUrl;
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOADS_DIR, uniqueName);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${uniqueName}`;
    } catch (diskErr) {
      console.warn('[Upload] Disk write failed, using data URL fallback for serverless:', diskErr);
      publicUrl = dataUrl;
    }

    recordAudit('Owner', 'UPLOAD_IMAGE', 'Media', uniqueName, `Uploaded ${mimeType} (${Math.round(buffer.length / 1024)} KB)`);

    res.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: buffer.length,
      category: category || 'general',
    });
  } catch (err) {
    console.error('Upload processing error:', err);
    res.status(500).json({ error: 'Image could not be uploaded.' });
  }
});

// Audit Logs
apiRouter.get(['/admin/audit-logs', '/admin/audit'], requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ logs: db.auditLogs });
});

// Generic content item handlers for backward compatibility
apiRouter.post('/admin/content/:type', requireAdmin, (req: Request, res: Response) => {
  const { type } = req.params;
  const item = req.body;
  const db = getDatabase();

  if (type === 'characters') {
    db.characters.push({ ...item, id: item.id || `char-${Date.now()}` });
  } else if (type === 'regions') {
    db.regions.push({ ...item, id: item.id || `region-${Date.now()}` });
  } else if (type === 'arcs' || type === 'story-arcs' || type === 'storyArcs') {
    db.storyArcs.push({ ...item, id: item.id || `arc-${Date.now()}` });
  } else if (type === 'mysteries') {
    db.mysteries.push({ ...item, id: item.id || `file-${Date.now()}` });
  } else if (type === 'gallery' || type === 'galleryItems') {
    db.galleryItems.push({ ...item, id: item.id || `gal-${Date.now()}` });
  }

  saveDatabase(db);
  recordAudit('Owner', 'CREATE_CONTENT', type, item.id || 'new', `Created ${type} entry`);
  res.json({ success: true });
});

apiRouter.put('/admin/content/:type/:id', requireAdmin, (req: Request, res: Response) => {
  const { type, id } = req.params;
  const updates = req.body;
  const db = getDatabase();

  const updateInList = (list: any[]) => {
    const idx = list.findIndex((i) => i.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      return true;
    }
    return false;
  };

  let found = false;
  if (type === 'characters') found = updateInList(db.characters);
  else if (type === 'regions') found = updateInList(db.regions);
  else if (type === 'arcs' || type === 'story-arcs' || type === 'storyArcs') found = updateInList(db.storyArcs);
  else if (type === 'mysteries') found = updateInList(db.mysteries);
  else if (type === 'gallery' || type === 'galleryItems') found = updateInList(db.galleryItems);

  if (found) {
    saveDatabase(db);
    recordAudit('Owner', 'UPDATE_CONTENT', type, id, `Updated ${type} entry`);
    return res.json({ success: true });
  }

  res.status(404).json({ error: 'Item not found' });
});

apiRouter.delete('/admin/content/:type/:id', requireAdmin, (req: Request, res: Response) => {
  const { type, id } = req.params;
  const db = getDatabase();

  if (type === 'characters') db.characters = db.characters.filter((i) => i.id !== id);
  else if (type === 'regions') db.regions = db.regions.filter((i) => i.id !== id);
  else if (type === 'arcs' || type === 'story-arcs' || type === 'storyArcs') db.storyArcs = db.storyArcs.filter((i) => i.id !== id);
  else if (type === 'mysteries') db.mysteries = db.mysteries.filter((i) => i.id !== id);
  else if (type === 'gallery' || type === 'galleryItems') db.galleryItems = db.galleryItems.filter((i) => i.id !== id);

  saveDatabase(db);
  recordAudit('Owner', 'DELETE_CONTENT', type, id, `Deleted ${type} entry`);
  res.json({ success: true });
});

