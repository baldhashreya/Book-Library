import { request, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * GLOBAL SETUP: Strictly executes ONCE before all tests and workers.
 * This script performs API login and saves storageState.json.
 */
async function globalSetup(config: FullConfig) {
  // 1. Determine paths and baseURL
  const authFile = path.join(__dirname, '../../.auth/user.json');
  const apiAuthFile = path.join(__dirname, '../../.auth/auth.json');
  
  // Try to get baseURL from global config or first project
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173';
  
  // 2. Load credentials (with basic validation)
  let creds;
  try {
    creds = require('../../../data/login.json');
  } catch (error) {
    console.error('❌ [Global Setup] Failed to load credentials from data/login.json');
    throw error;
  }

  // 3. Initialize API Request Context
  const requestContext = await request.newContext({
    baseURL: baseURL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  console.log(`🚀 [Global Setup] Authenticating user: ${creds.email} against ${baseURL}`);

  try {
    // 4. Perform API Login
    const loginResponse = await requestContext.post('/api/auth/login', {
      data: {
        email: creds.email,
        password: creds.password
      },
      timeout: 15000 // Robustness: prevent hanging
    });

    if (!loginResponse.ok()) {
      const errorBody = await loginResponse.text();
      console.error(`❌ [Global Setup] Login failed (${loginResponse.status()}): ${errorBody}`);
      throw new Error(`Authentication failed. Check your credentials and server status.`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.access_token;
    const refreshToken = loginData.data.refresh_token;

    if (!token) {
      throw new Error('Login successful but no access_token received in response.');
    }

    // 5. Fetch User Profile (Ensures the token is valid and session is complete)
    console.log('🔍 [Global Setup] Fetching user profile...');
    const profileResponse = await requestContext.get('/api/profile/me', {
      headers: { 'Authorization': token }
    });

    let user = { email: creds.email };
    if (profileResponse.ok()) {
      const profileData = await profileResponse.json();
      user = profileData.data || user;
    }

    // 6. Construct storage state (Matches React application's localStorage keys)
    const storageState = {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [
            { name: 'token', value: token },
            { name: 'refresh_token', value: refreshToken },
            { name: 'user', value: JSON.stringify(user) }
          ]
        }
      ]
    };

    // 7. Save to file system
    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Save storage state for UI tests
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));

    // Save pure API token object for direct API testing usage
    const apiAuthData = {
      access_token: token,
      refresh_token: refreshToken,
      user: user
    };
    fs.writeFileSync(apiAuthFile, JSON.stringify(apiAuthData, null, 2));

    console.log(`✅ [Global Setup] Authentication successful!`);
    console.log(`   - UI State saved to ${authFile}`);
    console.log(`   - API Tokens saved to ${apiAuthFile}`);
  } catch (error) {
    console.error('❌ [Global Setup] Critical error during authentication:', error.message);
    throw error; // Fail the entire test run immediately
  } finally {
    await requestContext.dispose();
  }
}

export default globalSetup;
