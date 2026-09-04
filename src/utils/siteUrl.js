/**
 * Tainaati — Centralized Site URL & Canonical Domain Resolver
 * Official live canonical domain: https://www.tainaati.com
 */

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.SITE_URL;

  let baseUrl = envUrl || 'https://www.tainaati.com';
  baseUrl = baseUrl.replace(/\/+$/, '');

  // Normalize any bare domain or non-canonical URL to canonical https://www.tainaati.com
  if (baseUrl === 'https://tainaati.com' || baseUrl === 'http://tainaati.com' || baseUrl === 'http://www.tainaati.com') {
    baseUrl = 'https://www.tainaati.com';
  }

  return baseUrl;
}

export function getAbsoluteUrl(path = '') {
  const baseUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}${cleanPath}`;
}
