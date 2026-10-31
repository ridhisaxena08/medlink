import { identifyFromText } from '../ocr/identification.service';

export interface ParsedItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  timings: string[];
  durationDays?: number;
  instructions?: string;
  confidence: number;
  candidates: { medicineId: string; name: string; score: number }[];
  /** Everything the parser could not interpret, kept for human review. */
  rawLine: string;
}

export interface ParseResult {
  items: ParsedItem[];
  unparsedLines: string[];
  /** Always false from the parser: a human must verify before anything is actionable. */
  verified: boolean;
}

const FORM_PREFIX = /^(tab|tabs|tablet|cap|capsule|syp|syrup|inj|injection|oint|drop|drops|susp)\.?\s+/i;
const STRENGTH = /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|%))/i;
const SLOT_PATTERN = /\b([01½\d])\s*-\s*([01½\d])\s*-\s*([01½\d])(?:\s*-\s*([01½\d]))?\b/;
const DURATION = /(?:x|for)\s*(\d+)\s*(day|days|week|weeks|month|months)/i;
const FREQ_WORDS: { pattern: RegExp; frequency: string; timings: string[] }[] = [
  { pattern: /\bod\b|once\s+(?:a\s+)?daily|\b1\s*x\s*1\b/i, frequency: 'once daily', timings: ['09:00'] },
  { pattern: /\bbd\b|\bbid\b|twice\s+(?:a\s+)?daily/i, frequency: 'twice daily', timings: ['09:00', '21:00'] },
  { pattern: /\btds\b|\btid\b|three\s+times/i, frequency: 'three times daily', timings: ['09:00', '14:00', '21:00'] },
  { pattern: /\bqid\b|four\s+times/i, frequency: 'four times daily', timings: ['08:00', '12:00', '16:00', '20:00'] },
  { pattern: /\bhs\b|at\s+night|bedtime/i, frequency: 'at bedtime', timings: ['21:00'] },
  { pattern: /\bsos\b|as\s+needed|prn/i, frequency: 'as needed', timings: [] },
];
const SLOT_TIMES = ['08:00', '14:00', '20:00', '22:00'];

const toDays = (value: number, unit: string): number => {
  const u = unit.toLowerCase();
  if (u.startsWith('week')) return value * 7;
  if (u.startsWith('month')) return value * 30;
  return value;
};

const parseLine = (line: string): Omit<ParsedItem, 'candidates'> | null => {
  const trimmed = line.trim();
  if (trimmed.length < 3) return null;
  // Lines that are clearly headers/footers carry no dosing information.
  if (/^(dr\.?|clinic|hospital|date|patient|age|sex|rx|advice|signature)\b/i.test(trimmed)) return null;

  let confidence = 0.3;
  let working = trimmed.replace(FORM_PREFIX, '');

  const strengthMatch = STRENGTH.exec(working);
  const dosage = strengthMatch?.[1]?.replace(/\s+/g, '') ?? '';
  if (dosage) confidence += 0.2;

  let frequency = '';
  let timings: string[] = [];

  const slots = SLOT_PATTERN.exec(working);
  if (slots) {
    const values = slots.slice(1).filter((v) => v !== undefined) as string[];
    timings = values
      .map((v, i) => (v === '0' ? null : SLOT_TIMES[i]))
      .filter((t): t is string => Boolean(t));
    frequency = `${timings.length} time(s) daily (${slots[0]})`;
    confidence += 0.25;
  } else {
    const word = FREQ_WORDS.find((f) => f.pattern.test(working));
    if (word) {
      frequency = word.frequency;
      timings = word.timings;
      confidence += 0.25;
    }
  }

  const durationMatch = DURATION.exec(working);
  const durationDays = durationMatch ? toDays(Number(durationMatch[1]), durationMatch[2]) : undefined;
  if (durationDays) confidence += 0.1;

  // The medicine name is what remains once dosing syntax is stripped out.
  const medicineName = working
    .replace(SLOT_PATTERN, ' ')
    .replace(DURATION, ' ')
    .replace(STRENGTH, ' ')
    .replace(/\b(od|bd|bid|tds|tid|qid|hs|sos|prn)\b/gi, ' ')
    .replace(/[^\w\s/+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!medicineName || medicineName.length < 3) return null;
  if (!frequency && !dosage) return null;

  const instructions = /after\s+food|before\s+food|empty\s+stomach|with\s+water|with\s+milk/i.exec(working)?.[0];

  return {
    medicineName,
    dosage: dosage || 'as directed',
    frequency: frequency || 'as directed',
    timings,
    durationDays,
    instructions,
    confidence: Math.min(0.95, Number(confidence.toFixed(2))),
    rawLine: trimmed,
  };
};

/**
 * Converts prescription text into structured, clearly-unverified items.
 * Every item carries a confidence score and candidate catalogue matches so a
 * clinician or the patient can correct it before it drives anything.
 */
export const parsePrescriptionText = async (rawText: string): Promise<ParseResult> => {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items: ParsedItem[] = [];
  const unparsedLines: string[] = [];

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) {
      unparsedLines.push(line);
      continue;
    }
    const candidates = (await identifyFromText(parsed.medicineName, 3)).map((c) => ({
      medicineId: c.medicineId,
      name: c.name,
      score: c.score,
    }));
    items.push({ ...parsed, candidates });
  }

  return { items, unparsedLines, verified: false };
};
