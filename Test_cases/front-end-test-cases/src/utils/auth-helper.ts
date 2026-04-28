import { Page, expect, APIRequestContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../pages/auth/login.page";
import { getCredentials } from "./credentials";


/**
 * Performs a high-speed API login and returns the session state (LocalStorage).
 */
export const getApiSessionState = async (request: APIRequestContext, baseURL: string) => {
  const creds = getCredentials();
  
  const loginResponse = await request.post("/api/auth/login", {
    data: { email: creds.email, password: creds.password },
  });

  if (!loginResponse.ok()) {
    throw new Error(`Login API failed: ${await loginResponse.text()}`);
  }

  const loginData = await loginResponse.json();
  const token = loginData.data.access_token;
  const refreshToken = loginData.data.refresh_token;

  const profileResponse = await request.get("/api/profile/me", {
    headers: { Authorization: token },
  });

  let user = { email: creds.email };
  if (profileResponse.ok()) {
    const profileData = await profileResponse.json();
    user = profileData.data || user;
  }

  // Return formatted localStorage map
  return {
    origin: baseURL || "http://localhost:5173",
    localStorage: {
       "token": token,
       "refresh_token": refreshToken,
       "user": JSON.stringify(user)
    }
  };
};

/**
 * Performs a high-speed API login and saves the authentication state to a file.
 */
export const apiLoginAndSaveState = async (request: APIRequestContext, baseURL: string, authFilePath: string) => {
  const state = await getApiSessionState(request, baseURL);
  
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: state.origin,
        localStorage: Object.entries(state.localStorage).map(([name, value]) => ({ name, value }))
      },
    ],
  };

  const dir = path.dirname(authFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(authFilePath, JSON.stringify(storageState, null, 2));
};

/**
 * Executes UI login using the POM.
 */
export const executeLogin = async (page: Page) => {
  const loginPage = new LoginPage(page);
  const data = getCredentials();
  await loginPage.login(data.email, data.password);
  await expect(page).toHaveURL(/\/dashboard/);
};

/**
 * Executes Logout and verifies redirection.
 */
export const executeLogout = async (page: Page) => {
  // Use a more robust selector for the logout button if .logout is ambiguous
  const logoutBtn = page.locator('.logout-btn').first().isVisible() 
    ? page.locator('.logout-btn') 
    : page.locator('.logout');
    
  await logoutBtn.click();
  await expect(page).toHaveURL(/\/login/);
};
