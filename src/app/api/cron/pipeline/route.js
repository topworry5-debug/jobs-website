import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Tainaati scraper pipeline is automated via GitHub Actions with persistent git commits.',
    managedBy: 'GitHub Actions (.github/workflows/scraper-cron.yml)',
    schedule: 'Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)',
    mode: 'read-only'
  });
}
