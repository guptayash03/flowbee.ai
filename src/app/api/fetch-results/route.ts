import { NextResponse } from 'next/server';
import { executions } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const executionId = searchParams.get('executionId');

  if (!executionId) {
    return NextResponse.json({ error: 'executionId is required' }, { status: 400 });
  }

  const job = executions.get(executionId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}
