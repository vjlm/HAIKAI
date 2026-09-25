import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { apiRouter } from './server/api';
import { getDatabase } from './server/db';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Basic security and parsing middlewares
  app.use(cookieParser());
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // Ensure uploads directory exists and is served
  const uploadsDir = path.resolve(process.cwd(), 'data', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Serve static assets from public explicitly (audio, favicons, etc.)
  const publicDir = path.resolve(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  // Serve Robots.txt with disallowed admin routes
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${
        process.env.APP_URL || ''
      }/sitemap.xml\n`
    );
  });

  // Serve Dynamic Sitemap
  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = process.env.APP_URL || 'https://haikai.anime';
    const now = new Date().toISOString();
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#world</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#characters</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#story</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#manga</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    res.type('application/xml');
    res.send(sitemap);
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Initialize DB on boot
  getDatabase();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HAIKAI SERVER] Running at http://0.0.0.0:${PORT}`);
    console.log(`[HAIKAI SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

createServer().catch((err) => {
  console.error('[HAIKAI SERVER] Failed to start:', err);
  process.exit(1);
});
