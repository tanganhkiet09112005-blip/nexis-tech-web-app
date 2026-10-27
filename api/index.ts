/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel Serverless Function entry point for Nexis Tech Express App.
 * Handles /api/consultation and all full-stack backend routes on Vercel.
 */

import type { Request, Response } from 'express';
import { createServerApp } from '../server.ts';

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
  if (!appPromise) {
    appPromise = createServerApp({ isProduction: true }).then((r) => r.app);
  }
  const app = await appPromise;
  return app(req, res);
}
