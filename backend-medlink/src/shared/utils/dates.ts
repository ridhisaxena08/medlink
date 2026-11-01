export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const isExpired = (date?: Date | null): boolean => !!date && date.getTime() <= Date.now();

/** "HH:mm" -> minutes since midnight. Returns NaN when malformed. */
export const timeToMinutes = (time: string): number => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
};

export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export const weekdayOf = (date: Date): Weekday => WEEKDAYS[date.getDay()];
