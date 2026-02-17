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

    console.log('Starting HeyGen session with token:', session_token.substring(0, 20) + '...');

    const response = await fetch('https://api.liveavatar.com/v1/sessions/start', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${session_token}`
      }
    });

    const responseText = await response.text();
    console.log('HeyGen start response status:', response.status);
    console.log('HeyGen start response body:', responseText);

    if (!response.ok) {
      console.error('HeyGen session start failed:', responseText);
      return NextResponse.json(
        { error: `HeyGen start error: ${responseText}` },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);
    
    // HeyGen wraps response in data object
    const data = result.data || result;
    
    console.log('Session started successfully!');
    console.log('WebSocket URL:', data.ws_url);
    console.log('LiveKit URL:', data.livekit_url);
    console.log('LiveKit Client Token:', data.livekit_client_token?.substring(0, 30) + '...');
    
    return NextResponse.json({
      websocket_url: data.ws_url,  // Note: HeyGen returns ws_url
      livekit_url: data.livekit_url,
      livekit_token: data.livekit_client_token,  // Note: HeyGen returns livekit_client_token
      session_id: data.session_id
    });
  } catch (error) {
    console.error('Error starting HeyGen session:', error);
    return NextResponse.json(
      { error: 'Failed to start HeyGen session' },
      { status: 500 }
    );
  }
}
