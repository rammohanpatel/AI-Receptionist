# Testing Guide - Urgent Handover Feature

## 🚀 Quick Start
**Development server**: http://localhost:3000  
**Server status**: ✅ Running

---

## 🚨 NEW: Test Scenario 3 - Urgent Handover

### Overview
Scenario 3 (Unclear Request) has been completely redesigned:
- **Old**: Just shows message, no call
- **New**: Makes URGENT call to Reception Supervisor with special effects

### Test Steps

1. **Navigate to Application**
   - Open http://localhost:3000
   - You'll see 3 demo scenarios on the right side

2. **Click "Unclear Request" (Red Card)**
   - Third demo button at the bottom
   - Red color indicates failure/urgent scenario

3. **Watch Conversation Flow**
   ```
   AI: "Welcome to Dubai Holding Real Estate..."
   User: "I need to speak with... um... Muhammed or Mahmood?"
   AI: "Let me help you find the right person..."
   User: "I'm not sure... maybe IT or Engineering?"
   AI: "I'm having trouble identifying..."
   User: "Hmm, I'm not certain..."
   AI: "I apologize... Let me urgently connect you with our Reception Supervisor..."
   ```

4. **🚨 URGENT Processing Indicator**
   - ✅ Should display: "🚨 URGENT: AI assistance required - escalating to human supervisor..."
   - Different from normal "📞 Checking calendar..."

5. **🚨 Red Urgent Notification**
   - ✅ Should show: "🚨 URGENT: Escalating to Rashid Al Mansoori..."
   - Color: Red (error-style), not blue (info-style)
   - Icon: 🚨 emoji

6. **📱 Notification Modal**
   - ✅ Should show urgent message to employee:
     > "🚨 URGENT: Rashid Al Mansoori, the AI receptionist needs immediate assistance at reception. A visitor requires human help."

7. **🔔 Urgent Ringing Sound**
   - **Listen carefully**: Should be different from Scenarios 1 & 2
   - **Pattern**: 3 ascending tones (beep-beep-beep)
   - **Speed**: Every 1.5 seconds (faster than normal 3s)
   - **Volume**: Noticeably louder
   - **Duration**: During 5-second countdown

8. **🔴 Call UI - URGENT Badge**
   - ✅ Call screen should appear
   - ✅ Top bar should show red "URGENT" badge
   - ✅ Badge has warning triangle icon (⚠️)
   - ✅ Badge text: "URGENT" in white on red background
   - ✅ Badge should pulse/glow
   - ✅ Connected to: **Rashid Al Mansoori - Reception Supervisor**

9. **🎤 TTS Urgent Message**
   - ✅ After call connects (brief beep sound)
   - ✅ Female voice should speak:
     > "This is an urgent request. The AI receptionist is facing difficulty understanding the visitor's requirement. The visitor is unsure about the employee name and department. Kindly come to the reception immediately and take over."
   - ✅ Message emphasizes "urgent" and "immediately"

10. **📞 Auto Call End**
    - ✅ Brief pause after TTS completes (~1.5s)
    - ✅ Call end sound plays (descending tone)
    - ✅ Call terminates automatically
    - ✅ Returns to idle state

11. **📋 Demo Logs Verification**
    - Check bottom-right corner logs
    - Should contain:
      ```
      [Time] 🚨 URGENT: AI assistance required - escalating to human supervisor...
      [Time] 🚨 URGENT call ringing...
      [Time] ✅ Call connected
      [Time] 🔊 Reading message to Rashid Al Mansoori...
      [Time] ✓ Message delivered to Rashid Al Mansoori
      [Time] 📞 Ending call...
      [Time] ✓ Call ended
      ```

---

## 📊 Comparison Table

| Feature | Scenario 1 & 2 (Normal) | Scenario 3 (Urgent) |
|---------|------------------------|---------------------|
| **Processing Message** | 📞 Checking calendar... | 🚨 URGENT: AI assistance required... |
| **Notification Color** | Blue (info) | Red (error) |
| **Notification Icon** | Standard | 🚨 emoji |
| **Employee** | Ahmed / Omar | **Rashid Al Mansoori (Supervisor)** |
| **Ringing Sound** | 2 tones, low-high | **3 tones, ascending** |
| **Ringing Speed** | Every 3 seconds | **Every 1.5 seconds (2x faster)** |
| **Ringing Volume** | 30% | **40% (louder)** |
| **Call Badge** | None | **Red "URGENT" badge** |
| **Badge Icon** | N/A | ⚠️ Warning triangle |
| **TTS Wording** | "you have a visitor..." | **"This is an urgent request..."** |
| **TTS Emphasis** | Polite, informational | **Urgent, immediate action required** |
| **Demo Log Icon** | 🔊 Call ringing... | **🚨 URGENT call ringing...** |

---

## ✅ Success Checklist

### Visual Checks
- [ ] Red notification appears with 🚨 emoji
- [ ] Notification says "URGENT: Escalating to..."
- [ ] Call connects to "Rashid Al Mansoori - Reception Supervisor"
- [ ] Red "URGENT" badge visible in call top bar
- [ ] Badge has warning triangle icon
- [ ] Badge animates/pulses

### Audio Checks
- [ ] Urgent ringing sounds different (3 tones vs 2)
- [ ] Ringing is faster (~1.5s interval)
- [ ] Ringing is louder than Scenarios 1 & 2
- [ ] Call connected beep plays
- [ ] TTS speaks urgent message with "urgent" and "immediately"
- [ ] Call end sound plays (descending tone)

### Flow Checks
- [ ] Processing shows "🚨 URGENT: AI assistance required"
- [ ] Notification modal shows urgent message
- [ ] 5-second countdown with urgent ringing
- [ ] Call connects automatically
- [ ] TTS message plays automatically
- [ ] Call ends automatically after TTS
- [ ] Demo logs show 🚨 icons for urgent steps

### Content Verification
- [ ] TTS includes: "This is an urgent request"
- [ ] TTS includes: "AI receptionist is facing difficulty"
- [ ] TTS includes: "unsure about the employee name and department"
- [ ] TTS includes: "come to the reception immediately and take over"

---

## 🎯 Comparison Test

**Best way to verify**: Run all 3 scenarios back-to-back

1. **Run Scenario 1** (Scheduled - Green)
   - Normal blue notification
   - Connects to Ahmed Al Mansoori
   - 2-tone ringing every 3 seconds
   - No urgent badge
   - Standard TTS: "you have a visitor for your scheduled appointment"

2. **Run Scenario 2** (Walk-in - Amber)
   - Normal blue notification
   - Connects to Omar Al Mazrouei (fallback from Aisha)
   - 2-tone ringing every 3 seconds
   - No urgent badge
   - Standard TTS: "visitor looking for Aisha... could you assist?"

3. **Run Scenario 3** (Urgent - Red) 🚨
   - **RED notification with 🚨**
   - **Connects to Rashid Al Mansoori (Supervisor)**
   - **3-tone ringing every 1.5 seconds**
   - **RED "URGENT" badge**
   - **Urgent TTS: "This is an urgent request... facing difficulty... immediately and take over"**

**You should clearly hear/see the difference** in Scenario 3!

---

## 🔊 Audio Pattern Reference

### Normal Ringing (Scenarios 1 & 2)
```
[Tone 1: 480Hz - 0.4s] ... 400ms gap ... [Tone 2: 440Hz - 0.4s]
Wait 3 seconds
Repeat
```

### Urgent Ringing (Scenario 3) 🚨
```
[Tone 1: 600Hz - 0.25s] ... 150ms gap ... 
[Tone 2: 650Hz - 0.25s] ... 150ms gap ... 
[Tone 3: 700Hz - 0.25s]
Wait 1.5 seconds (FASTER!)
Repeat
```

**Key Differences**:
- Urgent has 3 tones (vs 2)
- Urgent tones are higher pitch (600-700Hz vs 440-480Hz)
- Urgent repeats faster (1.5s vs 3s)
- Urgent is louder (40% vs 30%)

---

## 🐛 Troubleshooting

### Issue: No Red Notification
**Check**: 
- Demo logs should show "🚨 URGENT: AI assistance required"
- If missing, scenario flag might not be set

### Issue: Normal Ringing Sound
**Check**:
- Should hear 3 tones, not 2
- Should repeat every ~1.5 seconds
- Try comparing with Scenario 1 or 2 to hear difference

### Issue: No "URGENT" Badge
**Check**:
- Look at top bar of call screen
- Should be to the right of the timer
- Red background with white text

### Issue: Wrong Employee
**Check**:
- Must be "Rashid Al Mansoori"
- Title: "Reception Supervisor"
- Department: "Reception Services"
- If different, check employee data

### Issue: Wrong TTS Message
**Check**:
- Should say "This is an urgent request"
- Should mention "facing difficulty"
- Should say "immediately and take over"
- If standard message, check scenario callMessage

### Issue: Can't Hear Difference in Ringing
**Try**:
1. Run Scenario 1 first, listen to ringing
2. Exit and run Scenario 3, listen to ringing
3. Compare: Scenario 3 should be faster and have 3 tones

---

## 📝 Expected Console Output

Open browser console (F12) and check for:

```javascript
[DEMO LOG] 🎬 Starting demo scenario: fail
[DEMO LOG] 📹 Activating camera...
[DEMO LOG] 💬 AI: "Welcome to Dubai Holding Real Estate..."
// ... conversation messages ...
[DEMO LOG] 🚨 URGENT: AI assistance required - escalating to human supervisor...
[DEMO LOG] 🚨 URGENT call ringing...
[DEMO LOG] ✅ Call connected
[DEMO LOG] 🔊 Reading message to Rashid Al Mansoori...
[DEMO LOG] ✓ Message delivered to Rashid Al Mansoori
[DEMO LOG] 📞 Ending call...
[DEMO LOG] ✓ Call ended
[DEMO LOG] ✅ Demo scenario completed
```

**No errors should appear**. If you see TTS errors, check API keys.

---

## ⚡ Quick Verification (30 seconds)

**Fastest way to confirm it works**:

1. Open http://localhost:3000
2. Click red "Unclear Request" button
3. Wait for conversation (~15 seconds)
4. **Look for**: Red notification with 🚨
5. **Listen for**: Fast 3-tone ringing
6. **Look for**: Red "URGENT" badge on call screen
7. **Listen for**: TTS saying "This is an urgent request"
8. ✅ **If all 4 present** → Feature working correctly!

---

## 📞 Employee Directory Quick Reference

| ID | Name | Department | Role in Demos |
|----|------|------------|---------------|
| emp001 | Ahmed Al Mansoori | Engineering | Scenario 1 (Scheduled) |
| emp005 | Omar Al Mazrouei | Product | Scenario 2 (Walk-in fallback) |
| **emp011** | **Rashid Al Mansoori** | **Reception Services** | **Scenario 3 (Urgent)** 🚨 |

**Note**: Rashid is the only Reception Supervisor and handles all urgent AI escalations.

---

## 🎬 Video Recording Suggestions

If recording demo:
1. Show all 3 scenarios to highlight the difference
2. Turn up volume so urgent ringing is audible
3. Point out the red URGENT badge when it appears
4. Let TTS message play completely to show urgent wording
5. Show demo logs to prove correct flow

---

## ✨ What Makes This "Urgent"?

1. **Visual**: Red notifications and badge (vs blue)
2. **Audio**: Faster, louder, 3-tone ringing (vs 2-tone)
3. **Wording**: "urgent request", "immediately", "take over"
4. **Employee**: Dedicated supervisor (vs regular staff)
5. **Context**: AI explicitly admits difficulty
6. **Priority**: Different from regular visitor requests

All elements combined create a clear **escalation experience** that feels appropriately urgent! 🚨
