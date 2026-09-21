import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { processJobsExpiry } from '../../../../../pipeline/engine/expiryManager.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveScrapedPath = path.join(process.cwd(), 'src', 'data', 'liveScrapedJobs.json');
    if (!fs.existsSync(liveScrapedPath)) {
      return NextResponse.json({ error: 'Data store not found' }, { status: 404 });
    }

    const rawJobs = JSON.parse(fs.readFileSync(liveScrapedPath, 'utf8'));
    const { updatedJobs, newlyArchivedCount } = processJobsExpiry(rawJobs, new Date());

    fs.writeFileSync(liveScrapedPath, JSON.stringify(updatedJobs, null, 2), 'utf8');

    const totalArchived = updatedJobs.filter(j => j.status === 'archived' || j.status === 'closed').length;
    const totalActive = updatedJobs.length - totalArchived;

    return NextResponse.json({
      success: true,
      message: 'Automated job expiry audit completed successfully.',
      timestamp: new Date().toISOString(),
      newlyArchivedCount,
      totalActive,
      totalArchived
    });
  } catch (err) {
    console.error('[API Cron Expiry] Execution failed:', err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
