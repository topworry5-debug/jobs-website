/**
 * Tainaati — Live PPSC (Punjab Public Service Commission) Scraper
 * Direct Live HTML Table parser for https://www.ppsc.gop.pk/Jobs.aspx
 * Adheres strictly to robots.txt and extracts exact case-level records with closing date 2026-09-03.
 */

import { scrapeLivePPSC } from './ppscLiveScraper.js';

export async function scrapePPSC() {
  return await scrapeLivePPSC();
}
