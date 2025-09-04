#!/usr/bin/env node

/**
 * Simple test script for rate limiting
 * Run with: node test-rate-limit.js
 */

const BASE_URL = 'http://localhost:5000/api';

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting System...\n');

  // Test 1: First failed attempt
  console.log('1️⃣ Testing first failed login attempt...');
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@email.com', password: 'wrongpass' })
    });
    
    if (response.status === 401) {
      console.log('✅ First attempt: 401 Unauthorized (expected)');
    } else {
      console.log(`❌ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  // Test 2: Check rate limit status
  console.log('\n2️⃣ Checking rate limit status...');
  try {
    const response = await fetch(`${BASE_URL}/auth/rate-limit-status`);
    const data = await response.json();
    console.log('📊 Rate limit status:', data);
  } catch (error) {
    console.log('❌ Failed to check status:', error.message);
  }

  // Test 3: Make multiple failed attempts
  console.log('\n3️⃣ Making multiple failed attempts...');
  for (let i = 2; i <= 5; i++) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@email.com', password: 'wrongpass' })
      });
      
      if (response.status === 401) {
        console.log(`✅ Attempt ${i}: 401 Unauthorized`);
      } else if (response.status === 429) {
        console.log(`🚫 Attempt ${i}: 429 Rate Limited (BLOCKED!)`);
        break;
      } else {
        console.log(`❌ Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Attempt ${i} failed:`, error.message);
    }

    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Test 4: Final status check
  console.log('\n4️⃣ Final rate limit status...');
  try {
    const response = await fetch(`${BASE_URL}/auth/rate-limit-status`);
    const data = await response.json();
    console.log('📊 Final status:', data);
  } catch (error) {
    console.log('❌ Failed to check final status:', error.message);
  }

  console.log('\n🎯 Test completed! Check your server console for detailed logs.');
}

// Run the test
testRateLimit().catch(console.error);
