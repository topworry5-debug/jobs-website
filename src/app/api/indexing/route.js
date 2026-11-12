import { NextResponse } from 'next/server';
import { publishUrlNotification, indexingQueue } from '@/lib/indexingApi';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, type = 'URL_UPDATED', queue = false, secret } = body;

    // Optional API secret guardrail if configured
    const expectedSecret = process.env.INDEXING_API_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!url) {
      return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 });
    }

    if (queue) {
      const queuedResult = indexingQueue.enqueue(url, type);
      return NextResponse.json(queuedResult);
    }

    const result = await publishUrlNotification(url, type);
    return NextResponse.json(result, { status: result.success ? 200 : result.status || 500 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
