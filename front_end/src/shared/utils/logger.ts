const isDev = import.meta.env.MODE === 'development';

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, meta || '');
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
};
