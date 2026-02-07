# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Get Your API Keys

You'll need two API keys (both have free tiers):

#### Gemini API Key (Free)
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

#### ElevenLabs API Key (Free - 10K chars/month)
1. Visit: https://elevenlabs.io/
2. Create free account
3. Go to Profile Settings → API Keys
4. Click "Generate API Key"
5. Copy the key

### 2️⃣ Configure the App

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and paste your API keys
```

Your `.env.local` should look like:
```
GEMINI_API_KEY=AIzaSyABC123...
ELEVENLABS_API_KEY=abc123xyz...
```

### 3️⃣ Run the App

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser!

---

## 🎯 Try It Out

1. **Click the blue microphone button**
2. **Say**: "I want to talk to Rahul from engineering"
3. **Watch the magic**:
   - AI listens and transcribes
   - Understands your intent
   - Checks employee availability
   - Suggests fallback if busy
   - Connects you with countdown
   - Shows Teams-like call UI

---

## 💡 Demo Tips

### Best Test Phrases

✅ **"I want to talk to Rahul from engineering"**
- Shows busy employee handling + smart routing

✅ **"Can I speak with Vikram?"**
- Shows direct connection (employee available)

✅ **"I need someone from the design team"**
- Shows department-based routing

✅ **"Connect me with Anita Sharma"**
- Shows full name recognition

### What to Notice

1. **Avatar States**: Changes color and animation based on activity
2. **Voice Quality**: Natural, professional TTS voice
3. **Smart Responses**: AI explains why and offers alternatives
4. **Countdown**: 5-second notification before call (realistic!)
5. **Call UI**: Looks exactly like Microsoft Teams
6. **Smooth Flow**: No awkward pauses or errors

---

## 📱 Browser Requirements

- ✅ **Chrome** (recommended)
- ✅ **Edge** (recommended)
- ✅ **Safari** (works well)
- ⚠️ **Firefox** (may have audio issues)

**Important**: Grant microphone permission when prompted!

---

## 🐛 Quick Troubleshooting

### Problem: "Cannot find module" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: API errors in console
**Solution**: 
- Check your `.env.local` has correct keys
- Restart server: Stop (Ctrl+C) then `npm run dev`
- Verify ElevenLabs account is active (free tier: 10K chars/month)

### Problem: Microphone not working
**Solution**:
- Check browser permissions (click lock icon in address bar)
- Try Chrome or Edge browser
- Close other apps using microphone (Zoom, Skype)

### Problem: No voice output
**Solution**:
- Check system volume is not muted
- Verify ElevenLabs API key is valid
- Check free tier quota at elevenlabs.io/usage
- Try different browser

---

## 📚 Documentation

- **README.md** - Full feature overview
- **SETUP.md** - Detailed installation guide
- **DEMO_SCRIPT.md** - Perfect for presentations
- **TECHNICAL.md** - Architecture and code details

---

## 💰 Costs

**Per Demo Session (~5 minutes)**: ~$0.02

- ElevenLabs TTS: ~$0.015
- Gemini: $0.01

**For 100 demos**: ~$2
**For 1000 demos**: ~$20

**FREE TIER**: 10,000 chars/month = ~30-50 demos! 🎉

---

## 🎬 Ready to Present?

Read **DEMO_SCRIPT.md** for a perfect 3-5 minute presentation flow with talking points and Q&A prep.

---

## 🤝 Need Help?

1. Check browser console (F12) for error messages
2. Review SETUP.md for detailed troubleshooting
3. Verify all dependencies are installed: `npm list`

---

**Let's build something amazing! 🚀**
