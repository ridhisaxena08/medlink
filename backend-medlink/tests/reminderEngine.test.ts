import { computeNextTrigger, proposeSchedule } from '../src/modules/intelligence/reminders/reminder.engine';

describe('reminder engine', () => {
  it('spreads twice-daily dosing across waking hours', () => {
    const result = proposeSchedule('BD', { wakeTime: '08:00', sleepTime: '22:00' });
    expect(result.doses.map((d) => d.time)).toEqual(['08:00', '22:00']);
    expect(result.needsHumanInput).toBe(false);
  });

  it('prefers explicit dose times recorded with the medication', () => {
    const result = proposeSchedule('tds', { explicitTimings: ['07:30', '13:30', '19:30'] });
    expect(result.doses.map((d) => d.time)).toEqual(['07:30', '13:30', '19:30']);
  });

  it('refuses to invent a schedule for as-needed medicines', () => {
    const result = proposeSchedule('SOS');
    expect(result.doses).toHaveLength(0);
    expect(result.needsHumanInput).toBe(true);
  });

  it('flags an uninterpretable frequency instead of guessing', () => {
    const result = proposeSchedule('take when the pain is bad');
    expect(result.needsHumanInput).toBe(true);
    expect(result.doses).toHaveLength(0);
  });

  it('computes the next trigger later the same day', () => {
    const from = new Date('2026-03-02T07:00:00');
    const next = computeNextTrigger([{ time: '09:00' }, { time: '21:00' }], [], from);
    expect(next?.getHours()).toBe(9);
    expect(next?.getDate()).toBe(2);
  });

  it('rolls to the next allowed weekday', () => {
    const monday = new Date('2026-03-02T23:00:00'); // Monday
    const next = computeNextTrigger([{ time: '09:00' }], [3], monday); // Wednesdays only
    expect(next?.getDay()).toBe(3);
  });

  it('returns null once the schedule has ended', () => {
    const from = new Date('2026-03-02T07:00:00');
    const next = computeNextTrigger([{ time: '09:00' }], [], from, new Date('2026-03-01T00:00:00'));
    expect(next).toBeNull();
  });
});
