// src/lib/logger.js
// Console wrapper with levels

const log = console;

export const logger = {
  info: (...args) => log.log('[INFO]', ...args),
  warn: (...args) => log.warn('[WARN]', ...args),
  error: (...args) => log.error('[ERROR]', ...args),
  success: (...args) => log.log('[SUCCESS]', ...args),
  debug: (...args) => log.debug('[DEBUG]', ...args),
  child: (meta) => {
    return {
      info: (...args) => log.log(`[${meta.module || 'app'}]`, '[INFO]', ...args),
      warn: (...args) => log.warn(`[${meta.module || 'app'}]`, '[WARN]', ...args),
      error: (...args) => log.error(`[${meta.module || 'app'}]`, '[ERROR]', ...args),
      success: (...args) => log.log(`[${meta.module || 'app'}]`, '[SUCCESS]', ...args),
      debug: (...args) => log.debug(`[${meta.module || 'app'}]`, '[DEBUG]', ...args),
    };
  }
};


