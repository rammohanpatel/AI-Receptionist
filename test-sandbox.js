// Test HeyGen API with sandbox mode
const HEYGEN_API_KEY = 'db074e16-0bd8-11f1-a99e-066a7fa2e369';
const SANDBOX_AVATAR_ID = 'dd73ea75-1218-4ef3-92ce-606d5f7fbc0a';  // Wayne - sandbox avatar

async function testSandboxMode() {
  console.log('🧪 Testing HeyGen API in SANDBOX mode with Wayne avatar...\n');
  
  // Step 1: Create session token with sandbox mode
  console.log('Step 1: Creating session token (sandbox mode)...');
  
  const tokenResponse = await fetch('https://api.liveavatar.com/v1/sessions/token', {
    method: 'POST',
    headers: {
      'X-API-KEY': HEYGEN_API_KEY,
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mode: 'LITE',
      avatar_id: SANDBOX_AVATAR_ID,  // Using Wayne avatar for sandbox
      is_sandbox: true,  // SANDBOX MODE
      video_settings: {
        quality: 'high',
        encoding: 'H264'
      }
    })
  });
  
  const tokenText = await tokenResponse.text();
  console.log('Token Response Status:', tokenResponse.status);
  
  if (!tokenResponse.ok) {
    console.error('❌ Failed:', tokenText);
    return;
  }
  
  const tokenResult = JSON.parse(tokenText);
  const tokenData = tokenResult.data || tokenResult;
  console.log('✅ Token created (SANDBOX MODE)');
  console.log('Session ID:', tokenData.session_id);
  
  // Step 2: Start session
  console.log('\nStep 2: Starting sandbox session...');
  
  const startResponse = await fetch('https://api.liveavatar.com/v1/sessions/start', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${tokenData.session_token}`
    }
  });
  
  const startText = await startResponse.text();
  console.log('Start Response Status:', startResponse.status);
  
  if (!startResponse.ok) {
    console.error('❌ Failed:', startText);
    const errorData = JSON.parse(startText);
    console.error('Error:', errorData.message);
    return;
  }
  
  const startResult = JSON.parse(startText);
  const startData = startResult.data || startResult;
  console.log('✅ Sandbox session started!');
  console.log('WebSocket URL:', startData.ws_url);
  console.log('LiveKit URL:', startData.livekit_url);
  console.log('\n🎉 Sandbox mode works! Session will auto-close in ~1 minute.');
  console.log('💡 No credits used, use this for development & testing.');
  console.log('👤 Avatar: Wayne (sandbox mode)');
}

testSandboxMode().catch(console.error);
