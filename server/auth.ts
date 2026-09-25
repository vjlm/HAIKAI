import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

interface SessionData {
  userId: string;
  role: 'owner' | 'admin';
  createdAt: number;
  expiresAt: number;
}

const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours
const sessions = new Map<string, SessionData>();

// In-memory rate limiting for failed login attempts
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const loginRateLimits = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'haikai-2026-ash';
}

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginRateLimits.get(ip);

  if (!record) return { allowed: true };

  if (record.blockedUntil && now < record.blockedUntil) {
    const waitSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    loginRateLimits.delete(ip);
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return { allowed: false, waitSeconds: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginRateLimits.get(ip) || { attempts: 0, firstAttempt: now };
  record.attempts += 1;
  loginRateLimits.set(ip, record);
}

export function resetRateLimit(ip: string) {
  loginRateLimits.delete(ip);
}

export function createSession(userId: string = 'owner'): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  sessions.set(token, {
    userId,
    role: 'owner',
    createdAt: now,
    expiresAt: now + SESSION_TTL,
  });
  return token;
}

export function validateSession(token?: string): SessionData | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function invalidateSession(token?: string) {
  if (token) {
    sessions.delete(token);
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.haikai_admin_session || req.headers.authorization?.replace('Bearer ', '');
  const session = validateSession(token);

  if (!session) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required to access owner controls',
    });
    return;
  }

  (req as any).user = session;
  next();
}
