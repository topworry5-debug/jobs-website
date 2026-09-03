/**
 * Tainaati — Live FPSC (Federal Public Service Commission) Scraper
 * Direct Live HTML parser for https://online.fpsc.gov.pk/
 */

import { scrapeLiveFPSC } from './fpscLiveScraper.js';

export async function scrapeFPSC() {
  return await scrapeLiveFPSC();
}
