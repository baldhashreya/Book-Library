import path from 'path';
import fs from 'fs';

/**
 * Senior-Level Dynamic Config Loader
 * Loads environment-specific JSON configurations based on the ENV variable.
 * Fallback: Uses environment variables if the file is missing (ideal for CI/CD).
 */

export interface AppConfig {
  baseURL: string;
  apiUrl: string;
  timeout: number;
  [key: string]: any;
}

let _configCache: AppConfig | null = null;

export const getConfig = (): AppConfig => {
  if (_configCache) return _configCache;

  const env = (process.env.ENV || 'dev').toLowerCase();
  const configPath = path.resolve(__dirname, `../../../data/config.${env}.json`);

  // Default values
  let config: AppConfig = {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    timeout: Number(process.env.TEST_TIMEOUT) || 30000,
  };

  try {
    if (fs.existsSync(configPath)) {
      console.log(`[Config] Loading configuration from file: config.${env}.json`);
      const fileContent = fs.readFileSync(configPath, 'utf-8');
      const fileConfig = JSON.parse(fileContent);
      config = { ...config, ...fileConfig };
    } else {
      console.log(`[Config] Config file missing. Using Environment Variables for ${env}.`);
    }
  } catch (error) {
    console.warn(`[Config] Error reading config file. Using defaults/env vars.`);
  }

  // Final check: Ensure essential fields are present
  if (!config.baseURL) {
    throw new Error("❌ Configuration error: baseURL is missing from both file and environment.");
  }

  _configCache = config;
  return _configCache!;
};
