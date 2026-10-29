/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Asset path resolution helper.
 * Handles subpath hosting (e.g. GitHub Pages /nexis-tech-web-app/),
 * root hosting (e.g. Vercel /), and local dev environments.
 */

export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip leading ./ or /
  const clean = path.replace(/^(\.\/|\/)/, '');

  // Detect GitHub Pages subpath hosting dynamically
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && !clean.startsWith(segments[0])) {
      return `/${segments[0]}/${clean}`;
    }
  }

  return `./${clean}`;
}
