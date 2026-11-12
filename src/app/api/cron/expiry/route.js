import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Job status and expiry lifecycle is computed dynamically in memory and archived during the 6-hour GitHub Actions pipeline.',
    managedBy: 'GitHub Actions (.github/workflows/scraper-cron.yml)',
    mode: 'read-only'
  });
}
