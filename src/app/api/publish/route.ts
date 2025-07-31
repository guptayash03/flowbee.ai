import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contentToPost, imageToPostUrl, linkedinAuthToken } = body;

    if (!contentToPost || !imageToPostUrl || !linkedinAuthToken) {
      return NextResponse.json({ error: 'Missing required fields for publishing.' }, { status: 400 });
    }

    // Simulate the API call to the publishing service (e.g., n8n)
    console.log('Publishing to LinkedIn with token:', linkedinAuthToken);
    console.log('Content:', contentToPost);
    console.log('Image URL:', imageToPostUrl);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would handle the response from the publishing service.
    // Here, we'll just assume it's successful.
    
    return NextResponse.json({
      success: true,
      message: 'Your post has been successfully published to LinkedIn!',
    });

  } catch (error) {
    console.error('Error in /api/publish:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
