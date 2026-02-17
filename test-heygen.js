// Test HeyGen API directly
const HEYGEN_API_KEY = 'db074e16-0bd8-11f1-a99e-066a7fa2e369';
const AVATAR_ID = '073b60a9-89a8-45aa-8902-c358f64d2852';

async function testHeyGenAPI() {
  console.log('Testing HeyGen API...\n');
  
  // Step 1: Create session token
  console.log('Step 1: Creating session token...');
  console.log('API Key:', HEYGEN_API_KEY);
  console.log('Avatar ID:', AVATAR_ID);
  
  const tokenResponse = await fetch('https://api.liveavatar.com/v1/sessions/token', {
    method: 'POST',
    headers: {
      'X-API-KEY': HEYGEN_API_KEY,
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mode: 'LITE',
      avatar_id: AVATAR_ID,
      video_settings: {
        quality: 'high',
        encoding: 'H264'
      }
    })
  });
  
  const tokenText = await tokenResponse.text();
  console.log('\nToken Response Status:', tokenResponse.status);
  console.log('Token Response:', tokenText);
  
  if (!tokenResponse.ok) {
    console.error('\n❌ Failed to create token!');
    return;
  }
  
  const tokenResult = JSON.parse(tokenText);
  const tokenData = tokenResult.data || tokenResult;
  console.log('\n✅ Token created successfully!');
  console.log('Session ID:', tokenData.session_id);
  console.log('Session Token:', tokenData.session_token.substring(0, 30) + '...');
  
  // Step 2: Start session
  console.log('\n\nStep 2: Starting session...');
  
  const startResponse = await fetch('https://api.liveavatar.com/v1/sessions/start', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${tokenData.session_token}`
    }
  });
  
  const startText = await startResponse.text();
  console.log('\nStart Response Status:', startResponse.status);
  console.log('Start Response:', startText);
  
  if (!startResponse.ok) {
    console.error('\n❌ Failed to start session!');
    try {
      const errorData = JSON.parse(startText);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
    } catch (e) {
      console.error('Raw error:', startText);
    }
    return;
  }
  
  const startResult = JSON.parse(startText);
  const startData = startResult.data || startResult;
  console.log('\n✅ Session started successfully!');
  console.log('WebSocket URL:', startData.ws_url);
  console.log('LiveKit URL:', startData.livekit_url);
  console.log('LiveKit Client Token:', startData.livekit_client_token?.substring(0, 30) + '...');
  console.log('LiveKit Agent Token:', startData.livekit_agent_token?.substring(0, 30) + '...');
  console.log('\n🎉 HeyGen API test completed successfully!');
}

testHeyGenAPI().catch(console.error);
