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
import { createServer as createViteServer } from 'vite';
import { ConsultationStore } from './src/server/consultationStore.ts';
import { NotificationDispatcher } from './src/server/notifiers.ts';
import { createConsultationRouter } from './src/server/consultationRouter.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Initialize persistent SQLite database and independent notification dispatcher
  const store = new ConsultationStore();
  const dispatcher = new NotificationDispatcher({ store });

  // Background worker to process bounded retries for transient Email/Zalo errors
  const retryInterval = setInterval(() => {
    dispatcher.processDueRetries().catch(() => {
      // Errors are recorded in notification_tasks table per channel
    });
  }, 10_000);
  retryInterval.unref();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  // Mount Consultation API routes
  app.use('/api', createConsultationRouter({ store, dispatcher }));

  if (process.env.NODE_ENV !== 'production') {
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
    console.log(`Nexis Tech server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
