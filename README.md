# AI Receptionist 🤖

A realistic, human-like AI receptionist that handles voice interactions, understands visitor intent, checks employee availability, and routes calls intelligently with a Microsoft Teams-like interface.

![AI Receptionist Demo](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)

## 🎯 Product Vision

Create an enterprise-ready AI receptionist that:
- ✅ Talks to visitors via voice + avatar
- ✅ Understands whom they want to call
- ✅ Checks employee availability
- ✅ Notifies employees before calls
- ✅ Routes calls intelligently
- ✅ Looks & feels like Microsoft Teams

## 🚀 Features

### Core Capabilities
- **Voice Interaction**: Real-time speech-to-text (Whisper) and text-to-speech (OpenAI TTS)
- **AI Avatar**: Animated avatar with state transitions (idle, listening, thinking, speaking)
- **Smart Intent Recognition**: Gemini AI extracts intent and employee information
- **Availability Logic**: Hard-coded but realistic employee schedules
- **Smart Call Routing**: Automatic fallback to alternative employees
- **Teams-Like UI**: Professional call interface with countdown and notifications

### User Journey
1. **Visitor Arrives** → AI greets and starts listening
2. **User Speaks** → "I want to talk to Rahul from engineering"
3. **AI Understands** → Gemini extracts intent and employee name
4. **Availability Check** → Checks mock schedule
5. **Smart Response** → "Rahul is in a meeting. I'll connect you with Anita"
6. **Notify Employee** → Simulated notification with 5-second countdown
7. **Teams-Like Call** → Full-featured call UI with mute/end controls

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                         │
│              (Next.js 14 + React)                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Conversation & Reasoning                  │
│               (Gemini AI)                           │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│             Business Logic                          │
│        (Availability + Routing)                     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│               Media Layer                           │
│      (STT, TTS, Avatar, Call UI)                    │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Audio**: Web Audio API, MediaRecorder API

### Backend (API Routes)
- **AI**: Google Gemini Pro (conversation understanding)
- **STT**: ElevenLabs Speech-to-Text
- **TTS**: ElevenLabs Text-to-Speech (Rachel voice)

### Data
- Hard-coded employee directory (JSON)
- Mock availability schedules
- No database required for demo

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- API Keys:
  - **Gemini API Key** (from Google AI Studio)
  - **ElevenLabs API Key** (from ElevenLabs)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd ai-receptionist

# Install dependencies
npm install
```

### 2. Configure API Keys

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

#### Getting API Keys:

**Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

**ElevenLabs API Key:**
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up for free account
3. Go to Profile Settings → API Keys
4. Click "Generate API Key"
5. Copy the key

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Application

1. **Grant Microphone Permission** when prompted
2. **Click the microphone button** to start speaking
3. **Say**: "I want to talk to Rahul from engineering"
4. **Watch the magic happen**:
   - AI avatar transitions through states
   - AI responds with voice
   - Smart routing if employee is busy
   - Countdown and call UI appear
   - Professional Teams-like call interface

## 🎭 Demo Script

Perfect for presentations:

1. **Start**: "Hello! Welcome to our office. How may I help you today?"
2. **You say**: "I need to speak with Rahul from engineering"
3. **AI responds**: "Rahul is currently in a Sprint Planning meeting. I can connect you with Anita Sharma, the Engineering Manager, instead. Would that work for you?"
4. **You say**: "Yes, please"
5. **AI**: "Perfect! I'll connect you with Anita. Please wait for a moment while I notify them."
6. **Notification appears**: "Notifying Anita Sharma..."
7. **Countdown**: 5... 4... 3... 2... 1...
8. **Call UI**: Professional Microsoft Teams-like interface
9. **End call**: Click red button

## 📁 Project Structure

```
ai-receptionist/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # Gemini AI conversation
│   │   ├── speech-to-text/route.ts # Whisper STT
│   │   ├── text-to-speech/route.ts # OpenAI TTS
│   │   └── employees/route.ts      # Employee directory
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── Avatar.tsx                  # AI avatar with animations
│   ├── CallUI.tsx                  # Teams-like call interface
│   ├── ConversationHistory.tsx     # Chat bubbles
│   ├── Controls.tsx                # Microphone controls
│   └── Notification.tsx            # Toast notifications
├── lib/
│   └── employees.ts                # Employee data & logic
├── types/
│   └── index.ts                    # TypeScript types
├── .env.local                      # API keys (not in git)
├── .env.example                    # Example env file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Key Components

### Avatar Component
- **States**: idle, listening, thinking, speaking, calling
- **Animations**: Pulse rings, sound waves, spinner
- **Visual feedback**: Color-coded states

### Call UI Component
- **Microsoft Teams look**: Professional and familiar
- **Features**: Avatar, status, mute, end call
- **Animations**: Ringing, countdown, pulse effects
- **Simulated**: Looks real but doesn't make actual calls

### Conversation Intelligence
- **Gemini AI**: Structured JSON responses
- **Intent extraction**: make_call, ask_question, leave_message
- **Context aware**: Multi-turn conversation history
- **Fallback handling**: Graceful error recovery

## 🧪 Testing Scenarios

### Scenario 1: Available Employee
**You**: "I want to talk to Vikram"  
**AI**: "Perfect! I'll connect you with Vikram Patel from Engineering..."  
**Result**: Direct call initiated

### Scenario 2: Busy Employee with Fallback
**You**: "Can I speak with Rahul?"  
**AI**: "Rahul is currently in a Sprint Planning meeting. I can connect you with Anita Sharma instead..."  
**Result**: Smart routing to fallback

### Scenario 3: Department Request
**You**: "I need someone from the design team"  
**AI**: "I can connect you with Sneha Reddy, our UX Designer..."  
**Result**: Department-based routing

## 🎯 Demo Success Metrics

- ✅ Visitor completes call flow in **under 60 seconds**
- ✅ **Zero visible AI confusion** (structured responses)
- ✅ **Feels enterprise-ready** (professional UI/UX)
- ✅ **Confident voice** (Nova TTS at 0.95 speed)
- ✅ **Smart fallbacks** (no dead ends)

## 🔒 What's NOT Built (By Design)

For demo purposes, we intentionally excluded:
- ❌ Real Microsoft Teams integration
- ❌ Real phone calling (PSTN)
- ❌ Real calendar sync
- ❌ Real employee consent workflows
- ❌ Security, auth, compliance
- ❌ Database persistence

This is **PM scoping** for a successful demo.

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions (Chrome/Edge recommended)
- Ensure HTTPS or localhost
- Try different browser

### API Errors
- Verify API keys in `.env.local`
- Check API rate limits
- Ensure internet connection

### Audio Not Playing
- Check browser audio permissions
- Verify volume is not muted
- Try different browser

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Vercel
Add these in your Vercel project settings:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY` (optional)

## 📊 Performance Tips

1. **Audio Processing**: Runs on-demand, no background processing
2. **API Calls**: Optimized with proper error handling
3. **State Management**: Simple React state (no Redux needed)
4. **Animations**: Hardware-accelerated with Framer Motion

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a demo project. Feel free to fork and customize!

## 📝 License

MIT License - Feel free to use for demos, learning, or building your own version.

## 🌟 Credits

Built with ❤️ using:
- Next.js 14
- Google Gemini AI
- OpenAI Whisper & TTS
- Framer Motion
- Tailwind CSS

---

**Ready to impress? Run `npm run dev` and start your demo! 🚀**
