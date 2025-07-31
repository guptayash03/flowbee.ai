import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contentToPost, imageToPostUrl, linkedinAuthToken } = body;

    if (!contentToPost || !imageToPostUrl || !linkedinAuthToken) {
      return NextResponse.json({ error: 'Missing required fields for publishing.' }, { status: 400 });
    }

    // Call the n8n webhook
    const webhookUrl = 'https://n8n.larc.ai/webhook/76d3b8d7-4c24-46c8-a578-86e571d0acd6';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentToPost,
        imageToPostUrl,
        linkedinAuthToken,
      }),
    });

    if (!response.ok) {
      // Forward the error from the webhook if possible
      const errorBody = await response.text();
      console.error('n8n webhook error:', errorBody);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Your post has been successfully sent for publishing!',
    });

  } catch (error) {
    console.error('Error in /api/publish:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
