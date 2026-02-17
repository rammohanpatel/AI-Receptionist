# HeyGen LiveAvatar Integration Guide

## Overview

This AI receptionist now features **HeyGen LiveAvatar** - a real-time, lip-synced digital avatar that provides natural, face-to-face interactions with visitors. The avatar's lips sync perfectly with the AI's speech, creating a truly immersive experience.

## 🎭 What is HeyGen LiveAvatar?

HeyGen LiveAvatar is an AI-powered digital human that can interact in real-time with synchronized audio and video. When the AI receptionist speaks, the avatar's lips move naturally and realistically, making conversations feel human-like.

## 🏗️ Architecture

We're using **HeyGen LITE Mode**, which means:
- ✅ **Your Control**: We manage our own AI (Gemini), Speech-to-Text, and Text-to-Speech (ElevenLabs/Google)
- ✅ **HeyGen's Expertise**: They provide the lip-synced avatar video stream
- ✅ **Best of Both**: Maximum flexibility with professional avatar rendering

### Data Flow

```
User speaks → Speech-to-Text → Gemini AI → Text-to-Speech
                                               ↓
                                          ElevenLabs
                                               ↓
                                     Audio (PCM 24kHz) ────→ HeyGen WebSocket
                                                                    ↓
                                                            Lip-synced Video
                                                                    ↓
                                                         LiveKit WebRTC Room
                                                                    ↓
                                                            User's Browser
```

## 📁 Files Created

### Backend API Routes
- `app/api/heygen/token/route.ts` - Creates HeyGen session tokens
- `app/api/heygen/start/route.ts` - Starts avatar sessions
- `app/api/heygen/stop/route.ts` - Stops and cleans up sessions

### Frontend Components
- `components/HeyGenAvatar.tsx` - Main avatar component with video display
- `lib/heygenService.ts` - WebSocket service and audio conversion utilities

### Configuration
- `.env.local` - Environment variables with HeyGen credentials

## 🔧 How It Works

### 1. Session Initialization

When a user starts the receptionist:

```typescript
// Create session token
POST /api/heygen/token
→ Returns: { session_id, session_token }

// Start the session
POST /api/heygen/start
→ Returns: { websocket_url, livekit_url, livekit_token }

// Connect to LiveKit room (for video)
Room.connect(livekit_url, livekit_token)

// Connect to HeyGen WebSocket (for control)
WebSocket.connect(websocket_url)
```

### 2. Speaking with Lip-Sync

When the AI responds:

```typescript
// 1. Generate speech audio
const audioBlob = await fetch('/api/elevenlabs-tts', { text })

// 2. Convert to PCM 24kHz (required by HeyGen)
const audioBuffer = await audioBlob.arrayBuffer()
const pcm24kHz = await convertAudioToPCM24kHz(audioBuffer)

// 3. Stream to HeyGen in chunks (~1 second each)
for await (const chunk of streamAudioInChunks(pcm24kHz)) {
  websocket.send({
    type: 'agent.speak',
    audio: chunk  // Base64 PCM audio
  })
}

// 4. Signal end of speech
websocket.send({ type: 'agent.speak_end' })

// 5. HeyGen renders lip-synced video → LiveKit → Browser
```

### 3. Avatar State Management

The avatar can be in different states:

- **Idle**: Neutral, waiting
- **Listening**: When user is speaking (activates listening animation)
- **Speaking**: When AI is speaking (shows pulse rings)

```typescript
// Transition to listening state
heygenService.startListening()

// Return to idle
heygenService.stopListening()

// Interrupt current speech
heygenService.interrupt()
```

## 🎨 Visual Features

### Animated State Indicators

- **Speaking**: Golden pulse rings expand outward
- **Listening**: Blue border glow
- **Thinking**: Yellow border with processing indicator
- **Error**: Red overlay with retry button

### Responsive Video Display

- 720p high-quality video (balanced quality/latency)
- Circular frame with elegant borders
- Seamless video playback via LiveKit
- Mobile-responsive design

## 🔑 Configuration

### Environment Variables

```bash
# HeyGen Configuration
HEYGEN_API_KEY=your_api_key_here
HEYGEN_AVATAR_ID=your_avatar_id_here
```

### Avatar Selection

Browse available avatars at: https://app.heygen.com/avatars

Current avatar: `073b60a9-89a8-45aa-8902-c358f64d2852`

## 📊 Technical Specifications

### Audio Requirements

HeyGen requires specific audio format:
- **Format**: PCM 16-bit
- **Sample Rate**: 24kHz
- **Channels**: Mono
- **Encoding**: Base64
- **Chunk Size**: ~1 second recommended

### Video Settings

```typescript
{
  quality: 'high',    // 720p
  encoding: 'H264'    // Best browser compatibility
}
```

### WebRTC Transport

- **Provider**: LiveKit
- **Connection**: Real-time peer-to-peer
- **Latency**: < 300ms typical
- **Bandwidth**: ~2-4 Mbps for 720p

## 🔄 State Management

### Component State

```typescript
const [isInitialized, setIsInitialized] = useState(false)
const [isConnecting, setIsConnecting] = useState(false)
const [connectionError, setConnectionError] = useState<string | null>(null)
const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking'>('idle')
```

### Session Lifecycle

1. **Not Started**: User sees "Activate LiveAvatar" button
2. **Connecting**: Spinner shown while establishing connections
3. **Connected**: Video stream active, ready for interaction
4. **Speaking**: Avatar animates with speech
5. **Cleanup**: Graceful disconnect on unmount

## 🎯 Integration Points

### In Main Page (page.tsx)

```typescript
// Ref to avatar component
const heygenAvatarRef = useRef<HeyGenAvatarRef>(null)

// Send audio to avatar for lip-sync
if (heygenAvatarRef.current?.speak) {
  const audioBuffer = await audioBlob.arrayBuffer()
  await heygenAvatarRef.current.speak(audioBuffer)
}
```

### Component API

```typescript
interface HeyGenAvatarRef {
  speak: (audioBuffer: ArrayBuffer) => Promise<void>
  initialize: () => Promise<void>
  cleanup: () => Promise<void>
}
```

## 🚀 Performance Optimizations

### Chunked Audio Streaming

Instead of sending entire audio files:
```typescript
// Bad: Send entire audio (may exceed 1MB limit)
websocket.send({ audio: entireAudioBase64 })

// Good: Stream in chunks
for await (const chunk of streamAudioInChunks(audio, 1000)) {
  websocket.send({ audio: chunk })
}
```

### Lazy Initialization

Avatar only initializes when:
- User clicks "Activate LiveAvatar" button
- OR `autoStart={true}` prop is set

This prevents unnecessary API calls on page load.

### Automatic Cleanup

```typescript
useEffect(() => {
  return () => {
    // Cleanup on unmount
    heygenService.disconnect()
    room.disconnect()
    fetch('/api/heygen/stop', { session_token })
  }
}, [])
```

## 🐛 Debugging

### Enable Debug Logs

Check browser console for:
- `🎭 Initializing HeyGen LiveAvatar session...`
- `✅ Session token created`
- `✅ Session started, connecting to LiveKit...`
- `📹 Track subscribed: video`
- `✅ Connected to LiveKit room`
- `🔌 HeyGen WebSocket state: connected`
- `🗣️ Avatar started speaking`
- `🎤 Audio sent to HeyGen avatar for lip-sync`

### Common Issues

**Video not showing:**
- Check browser video permissions
- Verify LiveKit connection in console
- Ensure video track is subscribed

**Lips not syncing:**
- Verify audio is PCM 24kHz format
- Check WebSocket connection status
- Ensure chunks are sent sequentially

**Connection errors:**
- Verify HeyGen API key is valid
- Check avatar ID exists
- Ensure network allows WebSocket connections

## 🎁 Benefits

### For Visitors
- ✨ Natural, human-like interactions
- 👁️ Eye contact and facial expressions
- 🗣️ Perfect lip synchronization
- 🎭 Professional, polished appearance

### For Operations
- 🚀 Scalable 24/7 reception
- 💰 Cost-effective compared to video actors
- 🔄 Easy to update and customize
- 📊 Consistent quality and behavior

## 🔮 Future Enhancements

Potential additions:
- Multiple avatar options (male/female, different ethnicities)
- Emotion-aware expressions based on conversation context
- Background customization (office, lobby, etc.)
- Multi-language support with localized avatars
- Avatar gestures and hand movements

## 📚 Resources

- [HeyGen LiveAvatar Docs](https://docs.liveavatar.com/)
- [LiveKit Documentation](https://docs.livekit.io/)
- [HeyGen Avatar Gallery](https://app.heygen.com/avatars)
- [API Reference](https://docs.liveavatar.com/api-reference)

## 💡 Support

For issues or questions:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Test with HeyGen's sandbox mode
4. Contact HeyGen support for avatar-specific issues

---

**Built with ❤️ for Innovation Lab @ Dubai Holding Real Estate**
*Powered by HeyGen LiveAvatar, LiveKit, ElevenLabs, and Google Gemini*
