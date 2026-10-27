/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Full-stack Express + Vite server for Nexis Tech.
 * Handles POST /api/consultation, background notification retries, and isolated static client serving.
 */

import 'dotenv/config';
import express, { Express } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConsultationStore } from './src/server/consultationStore.ts';
import { NotificationDispatcher } from './src/server/notifiers.ts';
import { createConsultationRouter } from './src/server/consultationRouter.ts';

export interface ServerAppOptions {
  store?: ConsultationStore;
  dispatcher?: NotificationDispatcher;
  clientDistPath?: string;
  isProduction?: boolean;
}

export async function createServerApp(options: ServerAppOptions = {}): Promise<{
  app: Express;
  store: ConsultationStore;
  dispatcher: NotificationDispatcher;
  clientDistPath: string;
}> {
  const app = express();
  const store = options.store || new ConsultationStore();
  const dispatcher = options.dispatcher || new NotificationDispatcher({ store });
  const isProd = options.isProduction ?? (process.env.NODE_ENV === 'production');
  const clientDistPath = options.clientDistPath || path.resolve(process.cwd(), 'dist', 'client');

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

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, strictly serve ONLY the frontend client build directory (dist/client).
    // The backend bundle located at dist/server/server.js is completely outside this directory
    // and cannot be accessed over the network.
    app.use(express.static(clientDistPath));

    // Return 404 for unhandled API calls rather than serving index.html
    app.all('/api/*', (_req, res) => {
      res.status(404).json({ ok: false, message: 'API route not found' });
    });

    // Asset extension guard: if a client requests any file with an extension
    // (e.g. /server.js, /server/server.js, /data.sqlite, /.env) that does not exist in dist/client,
    // immediately return 404 instead of falling back to SPA index.html
    app.get('*', (req, res) => {
      if (/\.[a-zA-Z0-9]+$/i.test(req.path)) {
        return res.status(404).type('text/plain').send('Asset not found');
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  return { app, store, dispatcher, clientDistPath };
}

export async function startServer() {
  const PORT = Number(process.env.PORT || 3000);
  const { app, store, dispatcher } = await createServerApp();

  // On server startup, immediately recover any pending or orphaned notification retries
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

  return { server, store, dispatcher };
}

// Auto-start when executed directly
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (
  executedFilePath &&
  (executedFilePath === currentFilePath ||
    executedFilePath.endsWith('server.js') ||
    executedFilePath.endsWith('server.ts'))
) {
  startServer();
}
