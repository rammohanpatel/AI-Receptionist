import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as Blob;

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    // Try ElevenLabs first
    if (ELEVENLABS_API_KEY) {
      try {
        console.log('[STT] Attempting ElevenLabs...');
        console.log('[ElevenLabs STT] Processing audio...');

        // Convert blob to buffer
        const arrayBuffer = await audio.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        // Create form data for ElevenLabs
        const elevenLabsFormData = new FormData();
        elevenLabsFormData.append('audio', new Blob([audioBuffer], { type: 'audio/webm' }));
        elevenLabsFormData.append('model_id', 'eleven_multilingual_v2');

        // Use ElevenLabs Speech-to-Text API
        const response = await fetch(
          'https://api.elevenlabs.io/v1/speech-to-text',
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: elevenLabsFormData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const transcript = data.text || '';
          
          console.log('[ElevenLabs STT] Success! Transcription:', transcript);

          return NextResponse.json({
            text: transcript,
            success: true,
            provider: 'elevenlabs'
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[ElevenLabs STT] Failed:', response.status, errorData);
          console.log('[STT] Falling back to Google Cloud STT...');
        }
      } catch (elevenLabsError: any) {
        console.warn('[ElevenLabs STT] Error:', elevenLabsError.message);
        console.log('[STT] Falling back to Google Cloud STT...');
      }
    } else {
      console.log('[STT] ElevenLabs API key not found, using Google Cloud STT...');
    }

    // Fallback to Google Cloud Speech-to-Text
    console.log('[Google STT] Processing audio...');
    
    const arrayBuffer = await audio.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const base64Audio = audioBuffer.toString('base64');

    const googleResponse = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            model: 'latest_long',
            enableAutomaticPunctuation: true,
          },
          audio: {
            content: base64Audio,
          },
        }),
      }
    );

    if (!googleResponse.ok) {
      const errorData = await googleResponse.json().catch(() => ({}));
      console.error('[Google STT] API error:', googleResponse.status, errorData);
      
      return NextResponse.json(
        {
          error: 'Both STT services failed',
          details: errorData,
          success: false
        },
        { status: 500 }
      );
    }

    const googleData = await googleResponse.json();
    
    if (!googleData.results || googleData.results.length === 0) {
      console.log('[Google STT] No transcription results');
      return NextResponse.json({
        text: '',
        success: true,
        provider: 'google'
      });
    }

    const transcript = googleData.results[0]?.alternatives[0]?.transcript || '';
    console.log('[Google STT] Success! Transcription:', transcript);

    return NextResponse.json({
      text: transcript,
      success: true,
      provider: 'google'
    });
  } catch (error: any) {
    console.error('[STT] All methods failed:', error);
    return NextResponse.json(
      {
        error: error.message || 'Transcription failed',
        success: false
      },
      { status: 500 }
    );
  }
}
