# ElevenLabs Integration Guide

## Overview

The AI Receptionist now uses **ElevenLabs** for both Speech-to-Text (STT) and Text-to-Speech (TTS) instead of OpenAI. ElevenLabs provides:

- ✅ **Higher quality voices** - More natural and human-like
- ✅ **Better voice cloning** - Create custom voices
- ✅ **Multilingual support** - 29+ languages
- ✅ **Lower latency** - Faster response times

---

## Getting Your ElevenLabs API Key

### 1. Sign Up

Visit [ElevenLabs](https://elevenlabs.io/) and create an account.

**Free Tier Includes:**
- 10,000 characters/month for TTS
- Perfect for demos and testing!

### 2. Get API Key

1. Log in to your ElevenLabs account
2. Click on your profile → **Profile Settings**
3. Navigate to **API Keys** section
4. Click **Generate API Key**
5. Copy the key (starts with random characters)

### 3. Add to Environment Variables

Edit `.env.local`:

```env
GEMINI_API_KEY=your_gemini_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

---

## Voice Selection

The app currently uses **Rachel** voice (professional, calm female voice).

### Available ElevenLabs Voices

To change the voice, edit `app/api/text-to-speech/route.ts` and update the `voiceId`:

```typescript
// Popular professional voices:
const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Rachel (current)
// const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel (alternative)
// const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi (confident)
// const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella (soft)
// const voiceId = 'ErXwobaYiN019PkySvjV'; // Antoni (male, calm)
// const voiceId = 'VR6AewLTigWG4xSOukaG'; // Arnold (male, deep)
```

### How to Find Voice IDs

1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. Preview voices
3. Click on a voice
4. Copy the Voice ID from the URL or settings

---

## Voice Settings Explained

In `app/api/text-to-speech/route.ts`:

```typescript
voice_settings: {
  stability: 0.5,          // 0-1: Lower = more expressive, Higher = more stable
  similarity_boost: 0.75,  // 0-1: How close to original voice
  style: 0.0,              // 0-1: Exaggeration of style
  use_speaker_boost: true  // Boost clarity
}
```

### Recommended Settings for Receptionist

**Professional & Calm:**
```typescript
{
  stability: 0.6,
  similarity_boost: 0.8,
  style: 0.0,
  use_speaker_boost: true
}
```

**Friendly & Warm:**
```typescript
{
  stability: 0.4,
  similarity_boost: 0.75,
  style: 0.2,
  use_speaker_boost: true
}
```

**Formal & Clear:**
```typescript
{
  stability: 0.75,
  similarity_boost: 0.9,
  style: 0.0,
  use_speaker_boost: true
}
```

---

## Speech-to-Text Configuration

ElevenLabs STT automatically:
- Detects language
- Handles background noise
- Supports multiple audio formats

### Supported Audio Formats

- ✅ WebM (what we use)
- ✅ MP3
- ✅ WAV
- ✅ FLAC
- ✅ OGG

---

## Cost Comparison

### ElevenLabs Pricing

**Free Tier:**
- 10,000 characters/month (TTS)
- ~30-50 demo sessions

**Starter ($5/month):**
- 30,000 characters/month
- ~100-150 demo sessions

**Creator ($22/month):**
- 100,000 characters/month
- ~300-500 demo sessions

### Per Demo Session (~5 minutes)

**ElevenLabs:**
- TTS: ~500 characters = $0.015 (free tier)
- STT: Included in plan
- **Total: ~$0.015 per session**

**Much cheaper than OpenAI!** 🎉

---

## Advanced Features

### 1. Custom Voice Cloning

You can clone your own voice or create a custom receptionist voice:

1. Go to ElevenLabs → **Voice Lab**
2. Click **Instant Voice Cloning**
3. Upload 1-minute audio sample
4. Get custom Voice ID
5. Use in app!

### 2. Voice Design

Create completely synthetic voices:
1. Go to **Voice Design**
2. Describe the voice (age, gender, accent)
3. Generate and test
4. Use the Voice ID

### 3. Multiple Languages

ElevenLabs supports 29+ languages. To enable:

```typescript
// In text-to-speech/route.ts
body: JSON.stringify({
  text: text,
  model_id: 'eleven_multilingual_v2', // Changed from monolingual
  voice_settings: { ... }
})
```

Supported languages:
- English, Spanish, French, German, Italian
- Portuguese, Polish, Hindi, Arabic, Japanese
- And 19 more!

---

## Troubleshooting

### Issue: "API key not configured"

**Solution:**
```bash
# Check .env.local has the key
cat .env.local

# Should show:
ELEVENLABS_API_KEY=abc123...

# Restart server
npm run dev
```

### Issue: "Quota exceeded"

**Solution:**
- Check usage at elevenlabs.io/usage
- Free tier: 10,000 chars/month
- Upgrade plan or wait for reset

### Issue: "Voice not found"

**Solution:**
- Verify Voice ID is correct
- Check voice exists in your account
- Use default voices from library

### Issue: Poor voice quality

**Solution:**
1. Adjust `stability` (try 0.6-0.8)
2. Enable `use_speaker_boost: true`
3. Try different voice
4. Check internet connection

### Issue: Slow response

**Solution:**
- ElevenLabs is usually faster than OpenAI
- Check your internet speed
- Try different voice (smaller models are faster)
- Consider upgrading plan for priority processing

---

## API Endpoints

### Text-to-Speech
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Headers:
  - xi-api-key: YOUR_API_KEY
  - Content-Type: application/json
Body:
  {
    "text": "Your text here",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": { ... }
  }
```

### Speech-to-Text
```
POST https://api.elevenlabs.io/v1/speech-to-text
Headers:
  - xi-api-key: YOUR_API_KEY
Body: FormData with audio file
```

---

## Testing

### Test TTS
```bash
curl -X POST http://localhost:3000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, welcome to our office!"}' \
  --output test.mp3
```

### Test STT
```bash
curl -X POST http://localhost:3000/api/speech-to-text \
  -F "audio=@recording.webm" \
  -o response.json
```

---

## Migration from OpenAI

### What Changed

**Before (OpenAI):**
- Used Whisper for STT
- Used TTS-1 with Nova voice
- Required $5 minimum credit

**After (ElevenLabs):**
- Uses ElevenLabs STT
- Uses Rachel voice (customizable)
- Free tier available

### No Code Changes Needed in Frontend

The API endpoints remain the same:
- `POST /api/speech-to-text`
- `POST /api/text-to-speech`

Only backend implementation changed!

---

## Best Practices

1. **Voice Consistency**: Use same voice throughout
2. **Error Handling**: Always handle quota limits
3. **Caching**: Cache common phrases (coming soon)
4. **Monitoring**: Track usage in ElevenLabs dashboard
5. **Testing**: Test with different accents/languages

---

## Resources

- [ElevenLabs Docs](https://docs.elevenlabs.io/)
- [Voice Library](https://elevenlabs.io/voice-library)
- [API Reference](https://docs.elevenlabs.io/api-reference)
- [Pricing](https://elevenlabs.io/pricing)

---

**Your AI Receptionist now has a better voice! 🎤✨**
