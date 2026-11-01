import { minutesToTime, timeToMinutes } from '../../../shared/utils/dates';
import { IReminderDose } from './reminder.model';

export interface ScheduleProposal {
  doses: IReminderDose[];
  frequencyInterpreted: string;
  /** True when the frequency string could not be mapped to a known pattern. */
  needsHumanInput: boolean;
  rationale: string;
}

const PATTERNS: { test: RegExp; perDay: number; label: string }[] = [
  { test: /\bod\b|once\s*(a\s*)?day|1\s*-\s*0\s*-\s*0|daily/i, perDay: 1, label: 'once daily' },
  { test: /\bbd\b|\bbid\b|twice|1\s*-\s*0\s*-\s*1/i, perDay: 2, label: 'twice daily' },
  { test: /\btds\b|\btid\b|thrice|three\s*times|1\s*-\s*1\s*-\s*1/i, perDay: 3, label: 'three times daily' },
  { test: /\bqid\b|four\s*times/i, perDay: 4, label: 'four times daily' },
];

/**
 * Proposes dose times by spreading n doses across the patient's waking hours.
 * This produces a *proposal only* - the reminder stays inactive until the
 * patient approves it.
 */
export const proposeSchedule = (
  frequency: string,
  options: { wakeTime?: string; sleepTime?: string; dosage?: string; explicitTimings?: string[] } = {},
): ScheduleProposal => {
  const dosage = options.dosage;

  if (options.explicitTimings?.length) {
    return {
      doses: options.explicitTimings.map((time) => ({ time, amount: dosage })),
      frequencyInterpreted: frequency,
      needsHumanInput: false,
      rationale: 'Used the dose times recorded with the medication.',
    };
  }

  if (/\bsos\b|as\s*needed|\bprn\b/i.test(frequency)) {
    return {
      doses: [],
      frequencyInterpreted: 'as needed',
      needsHumanInput: true,
      rationale: 'As-needed medicines are not scheduled; the patient decides when to take them.',
    };
  }

  if (/\bhs\b|bedtime|at\s*night/i.test(frequency)) {
    const sleep = timeToMinutes(options.sleepTime ?? '22:00');
    const time = minutesToTime(Math.max(0, (Number.isNaN(sleep) ? 1320 : sleep) - 30));
    return {
      doses: [{ time, label: 'bedtime', amount: dosage }],
      frequencyInterpreted: 'at bedtime',
      needsHumanInput: false,
      rationale: 'Scheduled 30 minutes before the stated sleep time.',
    };
  }

  const matched = PATTERNS.find((p) => p.test.test(frequency));
  if (!matched) {
    return {
      doses: [],
      frequencyInterpreted: frequency,
      needsHumanInput: true,
      rationale: `Could not interpret "${frequency}". Ask the patient or clinician for exact dose times.`,
    };
  }

  const wake = timeToMinutes(options.wakeTime ?? '08:00');
  const sleep = timeToMinutes(options.sleepTime ?? '22:00');
  const start = Number.isNaN(wake) ? 480 : wake;
  const end = Number.isNaN(sleep) ? 1320 : sleep;
  const span = Math.max(60, end - start);

  const doses: IReminderDose[] =
    matched.perDay === 1
      ? [{ time: minutesToTime(start + 60), amount: dosage }]
      : Array.from({ length: matched.perDay }, (_, i) => ({
          time: minutesToTime(Math.round(start + (span / (matched.perDay - 1)) * i)),
          amount: dosage,
        }));

  return {
    doses,
    frequencyInterpreted: matched.label,
    needsHumanInput: false,
    rationale: `Spread ${matched.perDay} dose(s) evenly between ${options.wakeTime ?? '08:00'} and ${options.sleepTime ?? '22:00'}.`,
  };
};

/** Next occurrence of any dose time, honouring the allowed weekdays. */
export const computeNextTrigger = (
  doses: IReminderDose[],
  daysOfWeek: number[],
  from: Date = new Date(),
  endDate?: Date | null,
): Date | null => {
  if (!doses.length) return null;

  for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
    const day = new Date(from.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    if (daysOfWeek.length && !daysOfWeek.includes(day.getDay())) continue;

    const candidates = doses
      .map((dose) => {
        const minutes = timeToMinutes(dose.time);
        if (Number.isNaN(minutes)) return null;
        const at = new Date(day);
        at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
        return at;
      })
      .filter((d): d is Date => d !== null && d.getTime() > from.getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    if (candidates.length) {
      const next = candidates[0];
      if (endDate && next.getTime() > endDate.getTime()) return null;
      return next;
    }
  }
  return null;
};
