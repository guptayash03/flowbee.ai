import { NextResponse } from 'next/server';
import { generateLinkedInPost } from '@/ai/flows/generate-linkedin-post';
import { executions } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, instructions, image } = body;

    if (!description || !instructions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const executionId = crypto.randomUUID();

    // Immediately store the job as "processing"
    executions.set(executionId, { status: 'processing', data: null });

    // Simulate the asynchronous workflow without blocking the response
    (async () => {
      try {
        const result = await generateLinkedInPost({
          description,
          instructions,
          image: image || '', // Pass image prompt or URL
        });

        // Update the job status to "completed" with the result
        executions.set(executionId, { status: 'completed', data: result });
      } catch (error) {
        console.error('Error during background generation:', error);
        // Update the job status to "failed"
        executions.set(executionId, {
          status: 'failed',
          error: 'AI content generation failed.',
        });
      }
    })();

    // Immediately return the execution ID
    return NextResponse.json({ executionId });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
