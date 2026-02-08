import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Google Cloud Text-to-Speech
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: 'en-US',
              name: 'en-US-Neural2-F', // Professional female voice
              ssmlGender: 'FEMALE'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              pitch: 0,
              speakingRate: 0.95 // Slightly slower for clarity
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google TTS API Error:', errorData);
        throw new Error(errorData.error?.message || 'Google TTS failed');
      }

      const data = await response.json();
      const audioContent = data.audioContent;
      
      if (!audioContent) {
        throw new Error('No audio content in response');
      }

      const buffer = Buffer.from(audioContent, 'base64');

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Google TTS timeout error');
        throw new Error('Text-to-Speech service timed out. Please check your internet connection.');
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Google TTS error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Text-to-speech conversion failed',
      },
      { status: 500 }
    );
  }
}
