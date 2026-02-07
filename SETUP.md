# Setup Guide for AI Receptionist

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your API Keys

#### Gemini API Key (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API key in new project"
4. Copy the generated API key

#### OpenAI API Key (Required)
1. Go to [OpenAI Platform](https://platform.openai.com/signup)
2. Create an account or sign in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Give it a name (e.g., "AI Receptionist")
6. Copy the key immediately (you won't see it again!)

**Note**: You'll need to add credits to your OpenAI account to use the API.
- Minimum: $5 USD
- Usage for testing: ~$0.10-0.50 for a full demo session

#### ElevenLabs API Key (Optional - Alternative TTS)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account
3. Navigate to Profile Settings → API Keys
4. Copy your API key

### 3. Configure Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your API keys:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
OPENAI_API_KEY=sk-proj-...your_key_here
ELEVENLABS_API_KEY=...optional...
```

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

### 4. Verify Installation

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ "AI Receptionist" header
- ✅ Animated avatar
- ✅ Microphone button
- ✅ Feature cards

### 5. Test Microphone Access

1. Click the blue microphone button
2. Browser will prompt for microphone permission
3. Click "Allow"
4. Button should turn red (recording)
5. Speak: "Hello, can you hear me?"
6. Click button again to stop
7. AI should respond with voice

### 6. Test Full Flow

Try this conversation:

**You**: "I want to talk to Rahul from engineering"

**Expected**:
1. Avatar state changes (listening → thinking → speaking)
2. AI responds: "Rahul is currently in a Sprint Planning meeting..."
3. Suggests fallback: "I can connect you with Anita Sharma instead"
4. You confirm: "Yes, please"
5. Countdown appears: 5... 4... 3... 2... 1...
6. Call UI opens with Teams-like interface
7. You can end call with red button

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues
- Verify no extra spaces in `.env.local`
- Check key format (Gemini starts with `AIza`, OpenAI with `sk-`)
- Restart dev server after changing `.env.local`

### Microphone Not Working
- Chrome/Edge/Safari recommended (not Firefox)
- Must use HTTPS or localhost
- Check browser settings → Site permissions
- Close other apps using microphone (Zoom, Skype)

### No Audio Output
- Check system volume
- Try different browser
- Verify OpenAI API key is valid
- Check browser console for errors

### Gemini API Errors
- Free tier has rate limits (60 requests/minute)
- If hitting limits, wait 1 minute
- Or upgrade to paid tier

### OpenAI API Errors
- Ensure you have credits ($5+ recommended)
- Check [usage dashboard](https://platform.openai.com/usage)
- Verify API key permissions

## Development Tips

### Hot Reload
Changes to files automatically reload the browser.
Exception: Changes to `.env.local` require server restart.

### Browser Console
Open DevTools (F12) to see:
- API calls and responses
- Error messages
- Performance metrics

### Testing Without APIs
For quick UI testing without API calls:
1. Comment out API calls in `page.tsx`
2. Use mock responses
3. Test UI states manually

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## Production Deployment

### Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Import to Vercel:
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repo
- Add environment variables
- Deploy!

3. Add Environment Variables in Vercel:
- Go to Project Settings → Environment Variables
- Add each key from `.env.local`
- Redeploy

### Other Platforms

**Netlify**:
```bash
npm run build
# Upload .next folder
```

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Cost Estimation

### Per Demo Session (~5 minutes)

**OpenAI**:
- Whisper (STT): ~$0.006 per minute = $0.03
- TTS: ~$0.015 per 1000 chars = $0.05
- **Total**: ~$0.08 per session

**Gemini**:
- Free tier: 60 requests/minute
- Paid: $0.00025 per request = $0.01
- **Total**: ~$0.01 per session

**Grand Total**: ~$0.09 per demo session

**For 100 demos**: ~$9
**For 1000 demos**: ~$90

## Next Steps

✅ **Basic Setup**: Install and run locally
✅ **Test Demo**: Complete full user journey
✅ **Customize**: Edit employee data in `lib/employees.ts`
✅ **Deploy**: Push to Vercel for public access
✅ **Present**: Show off your AI receptionist!

## Getting Help

- Check browser console for errors
- Review API documentation
- Test each API separately
- Check GitHub issues (if repo is public)

---

**Ready to go? Run `npm run dev` and start testing! 🚀**
