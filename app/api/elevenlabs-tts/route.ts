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
    
    // Try ElevenLabs first
    if (ELEVENLABS_API_KEY) {
      try {
        console.log('[TTS] Attempting ElevenLabs...');
        
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

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          console.log('[ElevenLabs TTS] Success!');
          
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
            },
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[ElevenLabs TTS] Failed:', response.status, errorData);
          console.log('[TTS] Falling back to Google Cloud TTS...');
        }
      } catch (elevenLabsError: any) {
        console.warn('[ElevenLabs TTS] Error:', elevenLabsError.message);
        console.log('[TTS] Falling back to Google Cloud TTS...');
      }
    } else {
      console.log('[TTS] ElevenLabs API key not found, using Google Cloud TTS...');
    }

    // Fallback to Google Cloud TTS
    console.log('[Google TTS] Synthesizing speech...');
    
    const googleResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: voiceType === 'female' ? 'en-US-Neural2-F' : 'en-US-Neural2-D',
            ssmlGender: voiceType === 'female' ? 'FEMALE' : 'MALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: 0,
            speakingRate: 1.0,
          },
        }),
      }
    );

    if (!googleResponse.ok) {
      const errorData = await googleResponse.json().catch(() => ({}));
      console.error('[Google TTS] API error:', googleResponse.status, errorData);
      
      return NextResponse.json(
        { 
          error: 'Both TTS services failed',
          details: errorData
        },
        { status: 500 }
      );
    }

    const googleData = await googleResponse.json();
    const audioContent = googleData.audioContent;

    if (!audioContent) {
      throw new Error('No audio content received from Google TTS');
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioContent, 'base64');
    console.log('[Google TTS] Success!');

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('[TTS] All methods failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
