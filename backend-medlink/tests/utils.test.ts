import { haversineKm, isValidCoordinates, toGeoPoint } from '../src/shared/utils/geo';
import { minutesToTime, timeToMinutes, weekdayOf } from '../src/shared/utils/dates';
import { countSegments } from '../src/modules/intelligence/sms/sms.service';
import { detectEmergency } from '../src/modules/intelligence/ai/ai.service';
import { EMERGENCY_TRANSITIONS } from '../src/shared/constants';

describe('geo utils', () => {
  it('measures a known distance', () => {
    // Delhi -> Jaipur is roughly 240km.
    const km = haversineKm([77.209, 28.6139], [75.7873, 26.9124]);
    expect(km).toBeGreaterThan(220);
    expect(km).toBeLessThan(260);
  });

  it('rejects out-of-range coordinates', () => {
    expect(isValidCoordinates(77, 28)).toBe(true);
    expect(isValidCoordinates(200, 28)).toBe(false);
    expect(isValidCoordinates(77, 95)).toBe(false);
  });

  it('builds GeoJSON in lng,lat order', () => {
    expect(toGeoPoint(77.2, 28.6)).toEqual({ type: 'Point', coordinates: [77.2, 28.6] });
  });
});

describe('time utils', () => {
  it('round-trips HH:mm', () => {
    expect(minutesToTime(timeToMinutes('14:45'))).toBe('14:45');
  });

  it('rejects malformed times', () => {
    expect(Number.isNaN(timeToMinutes('25:00'))).toBe(true);
    expect(Number.isNaN(timeToMinutes('9:00'))).toBe(true);
  });

  it('names the weekday', () => {
    expect(weekdayOf(new Date('2026-03-02T10:00:00'))).toBe('monday');
  });
});

describe('sms segmentation', () => {
  it('uses 160 characters for plain ASCII', () => {
    expect(countSegments('a'.repeat(160))).toBe(1);
    expect(countSegments('a'.repeat(161))).toBe(2);
  });

  it('drops to 70 characters once Hindi text is present', () => {
    expect(countSegments('दवा'.repeat(30))).toBeGreaterThan(1);
  });
});

describe('assistant safety', () => {
  it('escalates red-flag symptoms in both languages', () => {
    expect(detectEmergency('I have severe chest pain')).toBe(true);
    expect(detectEmergency('सीने में दर्द हो रहा है')).toBe(true);
  });

  it('does not escalate ordinary questions', () => {
    expect(detectEmergency('What is paracetamol used for?')).toBe(false);
  });
});

describe('emergency state machine', () => {
  it('has no transitions out of terminal states', () => {
    expect(EMERGENCY_TRANSITIONS.completed).toHaveLength(0);
    expect(EMERGENCY_TRANSITIONS.cancelled).toHaveLength(0);
  });

  it('cannot skip from created straight to transporting', () => {
    expect(EMERGENCY_TRANSITIONS.created).not.toContain('transporting');
  });
});
