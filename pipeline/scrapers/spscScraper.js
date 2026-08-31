/**
 * RozgarPK — Live SPSC & KPPSC Provincial Scrapers
 * Sources: spsc.gov.pk (Sindh) & kppsc.gov.pk (KPK)
 */

import { scrapeLiveSPSC } from './spscLiveScraper.js';
import { scrapeLiveKPPSC } from './kppscLiveScraper.js';

export async function scrapeSPSC() {
  return await scrapeLiveSPSC();
}

export async function scrapeKPPSC() {
  return await scrapeLiveKPPSC();
}
