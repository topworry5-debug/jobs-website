/**
 * Tainaati — BPSC Scraper Gateway
 * Proxies to live BPSC scraper
 */

import { scrapeLiveBPSC } from './bpscLiveScraper.js';

export async function scrapeBPSC() {
  return await scrapeLiveBPSC();
}
