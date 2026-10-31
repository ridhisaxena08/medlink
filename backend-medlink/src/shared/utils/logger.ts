/* Minimal structured logger - swap for pino/winston without touching call sites. */
type Level = 'debug' | 'info' | 'warn' | 'error';

const emit = (level: Level, message: string, meta?: unknown) => {
  const line = { ts: new Date().toISOString(), level, message, ...(meta ? { meta } : {}) };
  const serialized = JSON.stringify(line, (_k, v) => (v instanceof Error ? { name: v.name, message: v.message, stack: v.stack } : v));
  if (level === 'error') console.error(serialized);
  else if (level === 'warn') console.warn(serialized);
  else console.log(serialized);
};

export const logger = {
  debug: (m: string, meta?: unknown) => emit('debug', m, meta),
  info: (m: string, meta?: unknown) => emit('info', m, meta),
  warn: (m: string, meta?: unknown) => emit('warn', m, meta),
  error: (m: string, meta?: unknown) => emit('error', m, meta),
};
