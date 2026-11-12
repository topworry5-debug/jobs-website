import crypto from 'crypto';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.tainaati.com').replace(/\/+$/, '');

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getJobSlug(job) {
  if (!job) return '';
  if (job.slug) return job.slug;
  if (job.id && /^[a-z0-9]+-[a-z0-9]+.*-(19|20)\d{2}$/i.test(job.id)) {
    return slugify(job.id);
  }
  const agency = slugify(job.agency || 'govt') || 'govt';
  const rawTitle = slugify(job.title || 'job-vacancy').slice(0, 45).replace(/-+$/, '');
  const rawCity = slugify(job.city ? job.city.split(',')[0].split('/')[0] : 'pakistan').slice(0, 20).replace(/-+$/, '');
  const year = job.postDate ? job.postDate.split('-')[0] : (job.lastDate ? job.lastDate.split('-')[0] : '2026');
  const idSuffix = slugify(job.id || 'post').replace(/^(fpsc|ppsc|spsc|kppsc|bpsc|nts)-live-/, '');
  return `${agency}-${rawTitle}-${rawCity}-${year}-${idSuffix}`.replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

// In-memory token cache
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Safely parse credentials from environment variable GOOGLE_INDEXING_CREDENTIALS.
 * Supports: raw JSON string, base64-encoded JSON, or file path.
 */
export function getServiceAccountCredentials() {
  const envVal = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!envVal || !envVal.trim()) {
    throw new Error('GOOGLE_INDEXING_CREDENTIALS environment variable is not configured.');
  }

  const trimmed = envVal.trim();

  // Try raw JSON
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      throw new Error(`Failed to parse GOOGLE_INDEXING_CREDENTIALS as JSON: ${e.message}`);
    }
  }

  // Try base64
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    if (decoded.trim().startsWith('{')) {
      return JSON.parse(decoded);
    }
  } catch (_) {
    // not base64, continue
  }

  throw new Error('GOOGLE_INDEXING_CREDENTIALS must be a valid JSON string or base64-encoded JSON.');
}

/**
 * Generate a Google OAuth2 Access Token using RS256 JWT bearer assertion.
 */
export async function getAccessToken() {
  const nowSec = Math.floor(Date.now() / 1000);
  
  // Return cached token if valid for at least 5 more minutes
  if (cachedToken && tokenExpiresAt > nowSec + 300) {
    return cachedToken;
  }

  const credentials = getServiceAccountCredentials();
  const { client_email, private_key } = credentials;

  if (!client_email || !private_key) {
    throw new Error('Invalid service account key: client_email or private_key is missing.');
  }

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const claimSet = {
    iss: client_email,
    scope: INDEXING_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: nowSec + 3600,
    iat: nowSec
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${encode(header)}.${encode(claimSet)}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  const signature = signer.sign(private_key, 'base64url');

  const jwtAssertion = `${unsignedToken}.${signature}`;

  const tokenParams = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwtAssertion
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth token request failed (${res.status}): ${errText}`);
  }

  const tokenData = await res.json();
  cachedToken = tokenData.access_token;
  tokenExpiresAt = nowSec + (tokenData.expires_in || 3600);
  return cachedToken;
}

/**
 * Ensure URL is a job-detail URL that houses JobPosting schema.
 * Rejects non-job URLs, search queries, agency list pages, etc.
 */
export function validateJobPostingUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    const pathname = parsed.pathname;
    
    // Only /jobs/<slug-or-id> are valid job detail pages
    const isJobDetail = pathname.startsWith('/jobs/') && pathname.replace('/jobs/', '').trim().length > 0;
    
    // Exclude category list filter shortcuts like /jobs/govt, /jobs/banking, etc.
    const nonDetailPaths = [
      '/jobs/govt',
      '/jobs/federal',
      '/jobs/punjab',
      '/jobs/sindh',
      '/jobs/kpk',
      '/jobs/balochistan',
      '/jobs/banking',
      '/jobs/teaching',
      '/jobs/engineering',
      '/jobs/medical'
    ];

    if (!isJobDetail || nonDetailPaths.includes(pathname.toLowerCase())) {
      throw new Error(`URL "${targetUrl}" is not a valid JobPosting detail page.`);
    }

    // Must belong to tainaati.com domain
    if (!parsed.hostname.includes('tainaati.com') && !parsed.hostname.includes('localhost')) {
      throw new Error(`URL "${targetUrl}" hostname does not match configured site domain.`);
    }

    return parsed.origin + parsed.pathname;
  } catch (e) {
    throw new Error(`Invalid Job URL: ${e.message}`);
  }
}

/**
 * Resolve full canonical URL for a job object or slug.
 */
export function resolveJobUrl(jobOrUrl) {
  if (typeof jobOrUrl === 'string') {
    if (jobOrUrl.startsWith('http://') || jobOrUrl.startsWith('https://')) {
      return validateJobPostingUrl(jobOrUrl);
    }
    const cleanPath = jobOrUrl.startsWith('/') ? jobOrUrl : `/jobs/${jobOrUrl}`;
    return validateJobPostingUrl(`${SITE_URL}${cleanPath}`);
  }

  if (jobOrUrl && typeof jobOrUrl === 'object') {
    const slug = getJobSlug(jobOrUrl);
    return validateJobPostingUrl(`${SITE_URL}/jobs/${slug}`);
  }

  throw new Error('resolveJobUrl expects a job object, slug string, or absolute URL.');
}

/**
 * Publish a single notification to the Google Indexing API.
 * Automatically retries with exponential backoff on HTTP 429 (rate limit).
 *
 * @param {string} url Clean canonical job URL
 * @param {'URL_UPDATED'|'URL_DELETED'} type Notification type
 * @param {number} maxRetries Max retries on 429
 * @returns {Promise<object>} API response metadata
 */
export async function publishUrlNotification(url, type = 'URL_UPDATED', maxRetries = 3) {
  const cleanUrl = validateJobPostingUrl(url);

  if (type !== 'URL_UPDATED' && type !== 'URL_DELETED') {
    throw new Error(`Invalid notification type "${type}". Must be URL_UPDATED or URL_DELETED.`);
  }

  // Validate credentials upfront before retry loop
  getServiceAccountCredentials();

  let attempt = 0;
  let delayMs = 1500;

  while (attempt <= maxRetries) {
    try {
      const accessToken = await getAccessToken();

      const startTime = Date.now();
      const res = await fetch(INDEXING_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          url: cleanUrl,
          type
        })
      });

      const durationMs = Date.now() - startTime;
      const status = res.status;
      const resText = await res.text();

      let resJson = null;
      try {
        resJson = JSON.parse(resText);
      } catch (_) {}

      // Log request & response without secrets
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'GOOGLE_INDEXING_API_PUBLISH',
        url: cleanUrl,
        type,
        status,
        durationMs,
        response: resJson || resText
      };

      console.log(`[IndexingAPI] [${status}] ${type} -> ${cleanUrl} (${durationMs}ms)`);

      if (status === 200) {
        return { success: true, status, data: resJson, url: cleanUrl, type };
      }

      // Handle 429 Quota / Rate limit with backoff
      if (status === 429) {
        attempt++;
        if (attempt <= maxRetries) {
          console.warn(`[IndexingAPI] Rate limited (429). Retrying attempt ${attempt}/${maxRetries} after ${delayMs}ms...`);
          await new Promise((r) => setTimeout(r, delayMs));
          delayMs *= 2;
          continue;
        }
      }

      // Permanent failure
      return {
        success: false,
        status,
        error: resJson?.error?.message || resText,
        url: cleanUrl,
        type
      };
    } catch (err) {
      attempt++;
      if (attempt <= maxRetries) {
        console.warn(`[IndexingAPI] Network error: ${err.message}. Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 2;
        continue;
      }
      return {
        success: false,
        status: 0,
        error: err.message,
        url: cleanUrl,
        type
      };
    }
  }
}

/**
 * In-memory deduplicating queue to batch and pace indexing requests.
 */
class IndexingQueue {
  constructor(delayBetweenMs = 1200) {
    this.queue = [];
    this.pendingSet = new Set();
    this.isProcessing = false;
    this.delayBetweenMs = delayBetweenMs;
  }

  enqueue(jobOrUrl, type = 'URL_UPDATED') {
    try {
      const canonicalUrl = resolveJobUrl(jobOrUrl);
      const key = `${type}:${canonicalUrl}`;

      if (this.pendingSet.has(key)) {
        return { queued: false, reason: 'Duplicate in queue', url: canonicalUrl };
      }

      this.pendingSet.add(key);
      this.queue.push({ url: canonicalUrl, type, key });
      return { queued: true, url: canonicalUrl, type };
    } catch (e) {
      return { queued: false, error: e.message };
    }
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const results = [];

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      this.pendingSet.delete(item.key);

      const result = await publishUrlNotification(item.url, item.type);
      results.push(result);

      if (this.queue.length > 0) {
        await new Promise((r) => setTimeout(r, this.delayBetweenMs));
      }
    }

    this.isProcessing = false;
    return results;
  }
}

export const indexingQueue = new IndexingQueue();

/**
 * Convenience helper to send URL_UPDATED notification.
 */
export async function notifyJobUpdated(jobOrUrl) {
  const url = resolveJobUrl(jobOrUrl);
  return publishUrlNotification(url, 'URL_UPDATED');
}

/**
 * Convenience helper to send URL_DELETED notification.
 */
export async function notifyJobDeleted(jobOrUrl) {
  const url = resolveJobUrl(jobOrUrl);
  return publishUrlNotification(url, 'URL_DELETED');
}
