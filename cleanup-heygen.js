// Cleanup any active HeyGen sessions
const HEYGEN_API_KEY = 'db074e16-0bd8-11f1-a99e-066a7fa2e369';

async function listAndCleanupSessions() {
  console.log('🧹 Cleaning up HeyGen sessions...\n');
  
  // Unfortunately HeyGen API doesn't provide a list sessions endpoint
  // But we can try to stop known sessions or wait for timeout
  
  console.log('⚠️  HeyGen sessions automatically timeout after 5 minutes of inactivity.');
  console.log('📌 Current issue: Session concurrency limit reached');
  console.log('\n💡 Solutions:');
  console.log('  1. Wait 5 minutes for old sessions to timeout');
  console.log('  2. Use sandbox mode (doesn\'t count toward limit)');
  console.log('  3. Upgrade your HeyGen plan for more concurrent sessions');
  console.log('\n🔧 I\'ll update the code to use sandbox mode for testing...');
}

listAndCleanupSessions();
