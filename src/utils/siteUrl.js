/**
 * RozgarPK — Centralized Site URL & Canonical Domain Resolver
 * Dynamically resolves base deployment URL based on environment variables
 * (NEXT_PUBLIC_SITE_URL, SITE_URL, VERCEL_URL) and defaults to current
 * active Vercel deployment URL until custom domain DNS is fully live.
 */

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.SITE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  const baseUrl = envUrl || 'https://jobs-website-delta.vercel.app';
  return baseUrl.replace(/\/+$/, '');
}

export function getAbsoluteUrl(path = '') {
  const baseUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}${cleanPath}`;
}
