import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceType = 'female' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use Google Cloud Text-to-Speech API with different voice based on voiceType
    const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Choose voice based on type
    const voiceConfig = voiceType === 'male' 
      ? {
          languageCode: 'en-US',
          name: 'en-US-Neural2-D', // Male voice
          ssmlGender: 'MALE'
        }
      : {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F', // Female voice
          ssmlGender: 'FEMALE'
        };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text },
            voice: voiceConfig,
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 1.0,
              pitch: voiceType === 'male' ? -2.0 : 0.0, // Lower pitch for male
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Google TTS API error:', response.status, errorData);
        
        // Return a more user-friendly error
        return NextResponse.json(
          { 
            error: 'Text-to-speech service temporarily unavailable',
            details: errorData
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      const audioContent = data.audioContent;

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioContent, 'base64');

      // Return audio file
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('TTS request timeout after 15 seconds');
        return NextResponse.json(
          { error: 'Text-to-speech request timed out. The service may be experiencing issues.' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
