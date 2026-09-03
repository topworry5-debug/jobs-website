/**
 * Tainaati — Centralized Site URL & Canonical Domain Resolver
 * Official live domain: https://tainaati.com
 */

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.SITE_URL;

  const baseUrl = envUrl || 'https://tainaati.com';
  return baseUrl.replace(/\/+$/, '');
}

export function getAbsoluteUrl(path = '') {
  const baseUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}${cleanPath}`;
}
