import { CONSENT_SCOPES, ROLES } from '../../../shared/constants';
import { AuthenticatedUser } from '../../../shared/types';
import { ApiError } from '../../../shared/utils/ApiError';
import { assertPatientAccess } from '../../../shared/services/access.service';
import { auditAsync } from '../../../shared/services/audit.service';
import { Medicine } from '../medicines/medicine.model';
import { activeIngredientsFor } from '../medicines/medicines.service';
import { DrugInteraction, InteractionSeverity } from './interaction.model';

const SEVERITY_ORDER: Record<InteractionSeverity, number> = {
  minor: 1,
  moderate: 2,
  major: 3,
  contraindicated: 4,
};

export interface CheckInput {
  ingredients: string[];
  medicineIds: string[];
  includePatientMedications: boolean;
  patient?: string;
  lang: 'en' | 'hi';
}

const resolveIngredients = async (medicineIds: string[]): Promise<string[]> => {
  if (!medicineIds.length) return [];
  const medicines = await Medicine.find({ _id: { $in: medicineIds } })
    .select('genericName ingredients')
    .lean();
  const names = new Set<string>();
  medicines.forEach((m) => {
    if (m.genericName) names.add(m.genericName.toLowerCase());
    m.ingredients?.forEach((i) => names.add(i.name.toLowerCase()));
  });
  return Array.from(names);
};

/**
 * Rule-based pairwise check against the reviewed interaction table.
 * Deterministic by design: no model inference decides clinical risk here.
 */
export const checkInteractions = async (actor: AuthenticatedUser, input: CheckInput) => {
  const names = new Set<string>(input.ingredients.map((i) => i.trim().toLowerCase()).filter(Boolean));
  (await resolveIngredients(input.medicineIds)).forEach((n) => names.add(n));

  if (input.includePatientMedications) {
    const patientId = input.patient ?? actor.id;
    if (patientId !== actor.id) {
      await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICATIONS, 'interaction_check');
    } else if (actor.role !== ROLES.PATIENT) {
      throw ApiError.badRequest('patient is required to include patient medications');
    }
    (await activeIngredientsFor(patientId)).forEach((n) => names.add(n));
  }

  const list = Array.from(names);
  if (list.length < 2) {
    return { checked: list, interactions: [], highestSeverity: null, unknownIngredients: [], disclaimer: DISCLAIMER[input.lang] };
  }

  const matches = await DrugInteraction.find({
    isActive: true,
    ingredientA: { $in: list },
    ingredientB: { $in: list },
  }).lean();

  const interactions = matches
    .filter((m) => m.ingredientA !== m.ingredientB)
    .map((m) => ({
      pair: [m.ingredientA, m.ingredientB],
      severity: m.severity,
      mechanism: m.mechanism,
      effect: m.effect[input.lang] || m.effect.en,
      advice: m.advice[input.lang] || m.advice.en,
      references: m.references,
    }))
    .sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]);

  const known = await Medicine.distinct('genericName', { genericName: { $in: list } });
  const knownLower = new Set((known as string[]).map((k) => k.toLowerCase()));
  const unknownIngredients = list.filter((n) => !knownLower.has(n));

  auditAsync({
    actor,
    action: 'read',
    resourceType: 'interaction_check',
    subject: input.patient ?? (actor.role === ROLES.PATIENT ? actor.id : null),
    metadata: { ingredientCount: list.length, found: interactions.length },
  });

  return {
    checked: list,
    interactions,
    highestSeverity: interactions[0]?.severity ?? null,
    /** Names the catalogue does not recognise - absence of a hit is not safety. */
    unknownIngredients,
    disclaimer: DISCLAIMER[input.lang],
  };
};

const DISCLAIMER = {
  en: 'Rule-based check against reviewed interaction data. An empty result does not guarantee safety. Always confirm with a doctor or pharmacist.',
  hi: 'यह जाँच समीक्षित नियमों पर आधारित है। कोई परिणाम न मिलना सुरक्षा की गारंटी नहीं है। डॉक्टर या फार्मासिस्ट से अवश्य पुष्टि करें।',
} as const;
