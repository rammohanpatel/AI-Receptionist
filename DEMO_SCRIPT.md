# Demo Script for AI Receptionist

## 🎬 Perfect Presentation Flow

### Pre-Demo Checklist
- [ ] `.env.local` has valid API keys
- [ ] Server running (`npm run dev`)
- [ ] Browser open to localhost:3000
- [ ] Microphone permissions granted
- [ ] Audio output working
- [ ] Browser console open (for troubleshooting)

---

## 📋 Demo Script (3-5 minutes)

### Act 1: Introduction (30 seconds)

**Presenter Says:**
> "Today I'm showing you an AI Receptionist that handles visitor interactions just like a human receptionist would. It uses voice recognition, AI reasoning, and smart call routing."

**Show:**
- Main screen with animated avatar
- Point out the Microsoft Teams-like design
- Explain it's all voice-driven

---

### Act 2: Simple Request (1 minute)

**Step 1: Click microphone, say:**
> "Hello!"

**Expected Response:**
> "Hello! How may I help you today?"

**Point Out:**
- Avatar state changes (listening → thinking → speaking)
- Voice response plays automatically
- Conversation appears in chat bubbles

---

### Act 3: Complex Request - Busy Employee (2 minutes)

**Step 2: Click microphone, say:**
> "I want to talk to Rahul from engineering."

**Expected Response:**
> "Rahul Kumar is currently in a Sprint Planning meeting. I can connect you with Anita Sharma, the Engineering Manager from the same team instead. Would that work for you?"

**Point Out:**
1. **AI Understanding**: Extracted "Rahul" and "engineering"
2. **Smart Checking**: Found he's in a meeting
3. **Intelligent Routing**: Suggests Anita (his manager) as fallback
4. **Professional Tone**: Explains why + offers alternative

**Step 3: Click microphone, say:**
> "Yes, please connect me."

**Expected Response:**
> "Perfect! I'll connect you with Anita Sharma. Please wait for a moment while I notify them."

**Point Out:**
- Notification toast appears: "Notifying Anita Sharma..."
- Countdown begins: 5... 4... 3... 2... 1...
- This simulates real employee notification time

---

### Act 4: The Call Experience (1 minute)

**What Happens:**
1. Teams-like call UI appears (full screen)
2. Shows employee avatar and info
3. "Ringing..." status with animation
4. Changes to "Connected" after 3 seconds
5. Mute and End Call buttons active

**Point Out:**
- **Professional UI**: Looks exactly like Microsoft Teams
- **Realistic Flow**: Countdown → Ringing → Connected
- **Full Controls**: Mute, speaker, end call
- **Employee Info**: Name, title, department visible

**Step 4: End the call**
- Click red "End Call" button

**Expected:**
- Call UI closes smoothly
- Returns to main screen
- AI asks: "Is there anything else I can help you with?"

---

## 🎯 Key Talking Points

### 1. Voice Intelligence
> "The system uses OpenAI's Whisper for speech-to-text - the same technology in ChatGPT's voice mode. It handles accents, background noise, and natural speech."

### 2. AI Reasoning
> "Google's Gemini AI processes the conversation. We use structured prompting to get reliable JSON responses - intent, employee name, confidence score. This ensures predictable behavior for production use."

### 3. Smart Routing
> "The availability logic checks real-time schedules. If someone's busy, it automatically suggests the best fallback - usually their manager or a teammate. No dead ends, no 'leave a message' unless necessary."

### 4. Enterprise Ready
> "Notice the polish: countdown before calls (gives employees time to prepare), professional UI matching Teams, confident voice, smooth animations. These details make it feel production-ready."

---

## 🎪 Alternative Demo Scenarios

### Scenario A: Available Employee
```
You: "I need to speak with Vikram"
AI: "Perfect! I'll connect you with Vikram Patel from Engineering..."
→ Direct call, no fallback needed
```

### Scenario B: Department Request
```
You: "Can I talk to someone from the design team?"
AI: "I can connect you with Sneha Reddy, our UX Designer..."
→ Shows smart department-based routing
```

### Scenario C: Unavailable with No Fallback
```
You: "I want to talk to Amit from Product"
AI: "Amit Verma is currently in Customer Visits and will be free at 17:00. Would you like to leave a message?"
→ Shows graceful handling when no one's available
```

---

## 💡 Handling Questions

### Q: "Is this making real phone calls?"
**A:** "For this demo, it's simulated. But the UI and flow are production-ready. In a real implementation, we'd integrate with Twilio, Zoom, or Teams APIs for actual calls."

### Q: "How accurate is the voice recognition?"
**A:** "OpenAI Whisper has 95%+ accuracy for English. It handles multiple accents well. For production, we'd add confirmation steps for critical actions."

### Q: "What about privacy and consent?"
**A:** "Great question! In production, we'd need: employee opt-in, recording notices, GDPR compliance, and data retention policies. This demo focuses on the UX and AI capabilities."

### Q: "Can it handle multiple languages?"
**A:** "Whisper supports 50+ languages. Gemini supports 40+ languages. We'd need to translate the employee directory and UI strings."

### Q: "What's the cost?"
**A:** "About $0.09 per visitor interaction. Whisper is $0.006/minute, TTS is $0.015/1000 chars, Gemini is ~$0.01. Very affordable at scale."

---

## 🚨 Troubleshooting During Demo

### Issue: Microphone not working
**Quick Fix:**
1. Check browser permissions (top left)
2. Try Chrome/Edge instead of Firefox
3. Reload page

### Issue: No AI response
**Quick Fix:**
1. Check browser console for errors
2. Verify API keys are set
3. Check internet connection

### Issue: No voice output
**Quick Fix:**
1. Check system volume
2. Verify OpenAI API key
3. Use browser console to see TTS errors

### Issue: Avatar frozen
**Quick Fix:**
1. Refresh page
2. Clear browser cache
3. Try incognito mode

---

## 🎓 Technical Deep Dive (If Asked)

### Architecture
```
User Voice → Whisper API → Text
Text → Gemini AI → Intent + Employee
Employee → Availability Check → Route Decision
Route Decision → TTS → Voice Response
Confirmed → Countdown → Call UI
```

### State Machine
```
IDLE → LISTENING → THINKING → SPEAKING → CALLING → IDLE
```

### Data Flow
1. **MediaRecorder API**: Captures audio
2. **POST /api/speech-to-text**: Blob → Text
3. **POST /api/chat**: Text + History → AI Response
4. **POST /api/text-to-speech**: Text → Audio Blob
5. **GET /api/employees**: Check availability
6. **Simulated Call**: Teams-like UI

### Key Technologies
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **AI**: Gemini Pro (reasoning), Whisper (STT), OpenAI TTS (voice)
- **State**: Simple React state (no Redux needed)
- **Audio**: Web Audio API, MediaRecorder

---

## 📊 Success Metrics for Demo

✅ **Wow Factor**: Audience reacts to voice + avatar  
✅ **Understanding**: AI correctly interprets intent  
✅ **Smart Routing**: Handles busy employee elegantly  
✅ **Professional**: Teams-like UI impresses  
✅ **Smooth**: No bugs, no crashes, no awkward pauses  

**Goal**: Audience says "This feels production-ready!"

---

## 🎬 Closing Statement

**Presenter Says:**
> "This demo shows what's possible when you combine modern AI APIs with thoughtful UX design. The tech stack is production-ready, the AI is reliable, and the experience is polished. From here, we could add: real Teams integration, actual phone calls, calendar sync, and security features. But the core experience you just saw? That's ready to deploy today."

**Call to Action:**
- Share GitHub repo
- Offer to answer technical questions
- Suggest follow-up meeting for implementation

---

**You've got this! 🚀**
