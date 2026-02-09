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

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not found');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Voice IDs for ElevenLabs (free tier voices)
    const voiceIds = {
      female: '21m00Tcm4TlvDq8ikWAM', // Rachel - Professional, warm female voice (free tier)
      male: 'pNInz6obpgDQGcFmaJgB', // Adam - Clear, professional male voice
    };

    const voiceId = voiceIds[voiceType as keyof typeof voiceIds] || voiceIds.female;

    console.log(`[ElevenLabs TTS] Synthesizing ${voiceType} voice with ID: ${voiceId}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5', // Fast, high-quality model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs API error:', response.status, errorData);
      
      return NextResponse.json(
        { 
          error: 'Text-to-speech service error',
          details: errorData
        },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Return audio file
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
