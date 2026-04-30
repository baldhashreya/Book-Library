import path from 'path';
import fs from 'fs';

/**
 * Senior-Level Dynamic Config Loader
 * Loads environment-specific JSON configurations based on the ENV variable.
 * Default: dev -> config.dev.json
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

  console.log(`[Config] Loading configuration for environment: ${env}`);
  console.log(`[Config] Path: ${configPath}`);

  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const fileContent = fs.readFileSync(configPath, 'utf-8');
    _configCache = JSON.parse(fileContent);
    return _configCache!;
  } catch (error) {
    console.error(`❌ Failed to load config for ${env}:`, error);
    // Fallback or re-throw
    throw error;
  }
};
