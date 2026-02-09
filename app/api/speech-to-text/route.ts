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
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs STT error:', response.status, errorData);
      throw new Error(errorData.error?.message || 'ElevenLabs STT failed');
    }

    const data = await response.json();
    const transcript = data.text || '';

    console.log('[ElevenLabs STT] Transcription:', transcript);

    return NextResponse.json({
      text: transcript,
      success: true
    });
  } catch (error: any) {
    console.error('ElevenLabs STT error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Transcription failed',
        success: false
      },
      { status: 500 }
    );
  }
}
