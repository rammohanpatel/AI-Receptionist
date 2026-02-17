import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { session_token } = await request.json();

    if (!session_token) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.liveavatar.com/v1/sessions/stop', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${session_token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HeyGen session stop failed:', errorText);
      // Don't throw error, as session might already be stopped
      console.warn(`Session stop returned status ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping HeyGen session:', error);
    return NextResponse.json(
      { error: 'Failed to stop HeyGen session' },
      { status: 500 }
    );
  }
}
