/**
 * Centralized credential loader.
 *
 * Priority (highest to lowest):
 *   1. Environment variables  → used in CI/CD (GitHub Actions Secrets)
 *   2. data/login.json        → used locally (gitignored, never committed)
 *
 * This file is the ONLY place that reads credentials.
 * All test files must import from here instead of directly requiring login.json.
 */

let _cache: { email: string; password: string } | null = null;

export const getCredentials = (): { email: string; password: string } => {
  if (_cache) return _cache;

  // 1. Try environment variables first (CI/CD path)
  if (process.env.TEST_EMAIL && process.env.TEST_PASSWORD) {
    _cache = {
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    };
    return _cache;
  }

  // 2. Fall back to local JSON file (local dev path)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require("../../../data/login.json");
    _cache = { email: data.email, password: data.password };
    return _cache;
  } catch {
    throw new Error(
      "❌ Credentials not found.\n" +
      "  • In CI:    Set TEST_EMAIL and TEST_PASSWORD as GitHub Secrets.\n" +
      "  • Locally:  Create Test_cases/data/login.json with your email and password."
    );
  }
};
