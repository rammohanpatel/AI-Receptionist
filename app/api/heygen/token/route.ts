import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { useSandbox } = await request.json().catch(() => ({ useSandbox: false }));
    
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || 'db074e16-0bd8-11f1-a99e-066a7fa2e369';
    const AVATAR_ID = process.env.HEYGEN_AVATAR_ID || '073b60a9-89a8-45aa-8902-c358f64d2852';
    const SANDBOX_AVATAR_ID = 'dd73ea75-1218-4ef3-92ce-606d5f7fbc0a'; // Wayne - sandbox compatible avatar

    const requestBody = {
      mode: 'LITE',
      avatar_id: useSandbox ? SANDBOX_AVATAR_ID : AVATAR_ID,  // Use sandbox avatar in sandbox mode
      is_sandbox: useSandbox || false,  // Enable sandbox mode for testing
      video_settings: {
        quality: 'high',
        encoding: 'H264'
      }
    };

    console.log('Creating HeyGen session token with:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
      method: 'POST',
      headers: {
        'X-API-KEY': HEYGEN_API_KEY,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('HeyGen token response status:', response.status);
    console.log('HeyGen token response body:', responseText);

    if (!response.ok) {
      console.error('HeyGen token creation failed:', responseText);
      return NextResponse.json(
        { error: `HeyGen API error: ${responseText}` },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);
    
    // HeyGen wraps response in data object
    const data = result.data || result;
    
    return NextResponse.json({
      session_id: data.session_id,
      session_token: data.session_token
    });
  } catch (error) {
    console.error('Error creating HeyGen token:', error);
    return NextResponse.json(
      { error: 'Failed to create HeyGen session token' },
      { status: 500 }
    );
  }
}
