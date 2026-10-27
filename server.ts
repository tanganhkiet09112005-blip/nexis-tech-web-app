/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Full-stack Express + Vite server for Nexis Tech.
 * Handles POST /api/consultation and background notification retries.
 */

import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { ConsultationStore } from './src/server/consultationStore.ts';
import { NotificationDispatcher } from './src/server/notifiers.ts';
import { createConsultationRouter } from './src/server/consultationRouter.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Initialize persistent SQLite database and independent notification dispatcher
  const store = new ConsultationStore();
  const dispatcher = new NotificationDispatcher({ store });

  // On server startup, immediately recover any pending notification retries
  dispatcher.processDueRetries().catch(() => {
    // Errors are recorded in notification_tasks table per channel
  });

  // Background worker to process bounded retries for transient Email/Zalo errors
  const retryInterval = setInterval(() => {
    dispatcher.processDueRetries().catch(() => {
      // Errors are recorded in notification_tasks table per channel
    });
  }, 10_000);
  retryInterval.unref();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  // Health check endpoint for uptime monitors and deployment checks
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'nexis-tech',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // Mount Consultation API routes
  app.use('/api', createConsultationRouter({ store, dispatcher }));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Return 404 for unhandled API calls rather than serving index.html
    app.all('/api/*', (_req, res) => {
      res.status(404).json({ ok: false, message: 'API route not found' });
    });

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexis Tech server running on http://0.0.0.0:${PORT}`);
  });

  const shutdown = () => {
    clearInterval(retryInterval);
    server.close(() => {
      store.close();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
