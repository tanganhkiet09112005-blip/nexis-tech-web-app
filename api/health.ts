/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Standalone fast health check endpoint for Vercel Serverless.
 */

export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'nexis-tech',
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString(),
  });
}
