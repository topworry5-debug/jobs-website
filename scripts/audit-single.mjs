import { runAudit } from './run-lighthouse-audit.mjs';
import fs from 'fs';

const formFactor = process.argv[2] || 'mobile';
const outputFile = process.argv[3] || `lighthouse-${formFactor}.json`;

async function main() {
  console.log(`Running Lighthouse for: ${formFactor}...`);
  const result = await runAudit('http://localhost:3000', formFactor);
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`✓ Saved ${formFactor} result to ${outputFile}`);
}

main().catch(console.error);
