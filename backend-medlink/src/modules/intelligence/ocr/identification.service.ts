import { Medicine } from '../medicines/medicine.model';

export interface MedicineMatch {
  medicineId: string;
  name: string;
  genericName: string;
  strength?: string;
  form: string;
  score: number;
  matchedOn: string[];
}

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length >= 3);

/**
 * Matches free text (OCR output or typed input) against the catalogue by token
 * overlap. Returns ranked candidates with scores rather than a single answer -
 * identification is a suggestion that a human confirms, never an assertion.
 */
export const identifyFromText = async (text: string, limit = 5): Promise<MedicineMatch[]> => {
  const tokens = tokenize(text);
  if (!tokens.length) return [];

  const candidates = await Medicine.find({ searchTokens: { $in: tokens } })
    .select('name genericName brandNames strength form searchTokens isVerified')
    .limit(100)
    .lean();

  const scored = candidates.map((medicine) => {
    const matched = medicine.searchTokens.filter((t) => tokens.includes(t));
    const coverage = matched.length / Math.max(1, medicine.searchTokens.length);
    const recall = matched.length / tokens.length;
    const score = Number((0.6 * coverage + 0.4 * recall + (medicine.isVerified ? 0.05 : 0)).toFixed(3));
    return {
      medicineId: String(medicine._id),
      name: medicine.name,
      genericName: medicine.genericName,
      strength: medicine.strength,
      form: medicine.form,
      score,
      matchedOn: matched,
    };
  });

  return scored.filter((m) => m.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
};
