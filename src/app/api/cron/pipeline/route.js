import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runFullPipeline } from '../../../../../pipeline/engine/pipelineRunner.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const outputPath = path.join(process.cwd(), 'src', 'data', 'liveScrapedJobs.json');
    let existingJobs = [];
    if (fs.existsSync(outputPath)) {
      try {
        existingJobs = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      } catch {
        existingJobs = [];
      }
    }

    console.log('[API 6-Hour Cron] Triggering 6-hour gazette monitoring ingestion cycle...');
    const result = await runFullPipeline(existingJobs);

    const jobsToSave = result.allJobs || result.updatedActiveJobs;
    fs.writeFileSync(outputPath, JSON.stringify(jobsToSave, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: '6-Hour gazette monitoring pipeline executed successfully.',
      timestamp: new Date().toISOString(),
      summary: result.summary,
      totalSaved: jobsToSave.length,
      activeCount: result.updatedActiveJobs.length
    });
  } catch (err) {
    console.error('[API 6-Hour Cron] Pipeline failed:', err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
