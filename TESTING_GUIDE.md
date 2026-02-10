# Testing Guide - TTS Call Implementation

## Quick Start
🚀 **Development server is running at**: http://localhost:3000

## Test Scenarios

### ✅ Test 1: Scheduled Meeting (Correct Employee Routing)
**Goal**: Verify call goes to Ahmed Al Mansoori and TTS message is spoken

**Steps**:
1. Click "Scheduled Appointment" demo button (green card, top)
2. Watch the conversation play through
3. **Listen for**: Ringing sound during 5-second countdown
4. **Verify**: Call connects to "Ahmed Al Mansoori" (not someone else)
5. **Listen for**: Call connected beep
6. **Listen for**: TTS voice saying: "Hello Ahmed, you have a visitor in the lobby for your scheduled appointment at 2 PM. They are ready to meet with you now."
7. **Listen for**: Call end sound (descending tone)
8. **Verify**: Call automatically ends after message

**Demo Logs to Check**:
```
🔊 Call ringing...
✅ Call connected
🔊 Reading message to Ahmed Al Mansoori...
✓ Message delivered to Ahmed Al Mansoori
📞 Ending call...
✓ Call ended
```

---

### ✅ Test 2: Walk-in Visitor (Fallback Routing)
**Goal**: Verify fallback to Omar Al Mazrouei with appropriate TTS message

**Steps**:
1. Click "Walk-in Visitor" demo button (amber card, middle)
2. Watch conversation (visitor asks for Aisha, gets Omar instead)
3. **Listen for**: Ringing sound during countdown
4. **Verify**: Call connects to "Omar Al Mazrouei"
5. **Listen for**: Call connected beep
6. **Listen for**: TTS voice saying: "Hello Omar, there is a visitor in the lobby who was looking for Aisha Al Hashimi from Product team. She is currently in a client workshop until 12 PM. I see your calendar is free. Could you kindly assist this visitor?"
7. **Listen for**: Call end sound
8. **Verify**: Call automatically ends

**Demo Logs to Check**:
```
🔊 Call ringing...
✅ Call connected
🔊 Reading message to Omar Al Mazrouei...
✓ Message delivered to Omar Al Mazrouei
📞 Ending call...
✓ Call ended
```

---

### ✅ Test 3: Failed Scenario (No Call)
**Goal**: Verify no call is made, no sounds play

**Steps**:
1. Click "Unclear Request" demo button (red card, bottom)
2. Watch conversation play through
3. **Verify**: No countdown appears
4. **Verify**: No ringing sound
5. **Verify**: No call UI appears
6. **Verify**: Shows "Connecting you with human reception..." message

---

### ✅ Test 4: Live Session
**Goal**: Test TTS in real conversation

**Steps**:
1. Click "Start Live Session" button
2. Allow microphone and camera access
3. Wait for greeting: "Welcome to Dubai Holding Real Estate..."
4. Click microphone button and say: **"I have a meeting with Ahmed"**
5. AI should respond and initiate call
6. **Listen for**: Ringing sound during countdown
7. **Listen for**: Call connected beep
8. **Listen for**: TTS message to Ahmed
9. **Listen for**: Call end sound
10. **Verify**: Call auto-ends

---

## Sound Effects Reference

### 🔔 Ringing Sound
- **When**: During 5-second countdown
- **Pattern**: Two-tone beep (high-low) repeating every 3 seconds
- **Duration**: Until call connects or countdown ends

### ✅ Connected Sound
- **When**: Immediately after call connects
- **Pattern**: Quick high-pitched beep
- **Duration**: 0.2 seconds

### 🔚 End Call Sound
- **When**: After TTS message completes
- **Pattern**: Descending tone (high to low)
- **Duration**: 0.5 seconds

---

## Troubleshooting

### No Sound Playing?
- Check browser volume/mute settings
- Check system volume
- Try Chrome/Firefox (best Web Audio API support)
- Check browser console for errors (F12)

### TTS Not Speaking?
- Verify `.env.local` has valid `ELEVENLABS_API_KEY`
- Check demo logs (bottom-right) for error messages
- TTS may fall back to Google Cloud if ElevenLabs fails

### Call Going to Wrong Employee?
- Check demo logs - should show correct employee name
- Scenario 1 must connect to "Ahmed Al Mansoori"
- Scenario 2 must connect to "Omar Al Mazrouei"

### Call Not Auto-Ending?
- Wait for full TTS message to complete
- Should end 1.5 seconds after message finishes
- Check demo logs for "Call ended" message

---

## Expected Behavior Summary

| Scenario | Employee | Ringing? | TTS? | Auto-End? |
|----------|----------|----------|------|-----------|
| Scheduled Meeting | Ahmed Al Mansoori | ✅ Yes | ✅ Yes | ✅ Yes |
| Walk-in (Fallback) | Omar Al Mazrouei | ✅ Yes | ✅ Yes | ✅ Yes |
| Failed Request | N/A | ❌ No | ❌ No | N/A |
| Live Session | Dynamic | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Demo Log Verification

**Good Example** (Successful Call):
```
[14:32:15] 🎬 Starting demo scenario: scheduled
[14:32:15] 📹 Activating camera...
[14:32:16] 💬 AI: "Welcome to Dubai Holding Real Estate..."
[14:32:18] 💬 User: "Hi, I have a scheduled appointment..."
[14:32:20] 🔄 Processing request...
[14:32:24] 💬 AI: "Great! Let me verify your appointment..."
[14:32:28] 📞 Checking calendar and initiating call...
[14:32:31] 🔊 Call ringing...
[14:32:36] ✅ Call connected
[14:32:37] 🔊 Reading message to Ahmed Al Mansoori...
[14:32:42] ✓ Message delivered to Ahmed Al Mansoori
[14:32:43] 📞 Ending call...
[14:32:44] ✓ Call ended
[14:32:45] ✅ Demo scenario completed
```

**Check for errors** if you see:
- `⚠ TTS service unavailable`
- `⚠ Audio playback error`
- `⚠ TTS error: [error message]`

---

## Browser Console Commands

Open browser console (F12) and run these to debug:

```javascript
// Check if CallSounds initialized
console.log('CallSounds available:', typeof CallSounds !== 'undefined');

// Check audio context
console.log('AudioContext:', typeof AudioContext !== 'undefined');

// Check ElevenLabs API
fetch('/api/elevenlabs-tts', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'Test', voiceType: 'female'})
}).then(r => console.log('TTS Status:', r.status));
```

---

## Success Criteria

✅ **All tests pass if**:
1. Ringing sound plays during countdown (all scenarios)
2. Call connects with beep sound
3. TTS speaks full message to employee
4. Call ends automatically with descending tone
5. Scheduled meeting goes to Ahmed Al Mansoori (emp001)
6. Walk-in goes to Omar Al Mazrouei (emp005)
7. Demo logs show all expected messages
8. No errors in browser console

---

## Next Steps After Testing

If all tests pass:
- ✅ Mark feature as complete
- 📝 Document any edge cases discovered
- 🚀 Ready for production deployment

If issues found:
- 📋 Note which test failed
- 🔍 Check demo logs for errors
- 🐛 Report specific error messages
- 🔧 May need API key verification or browser compatibility check
