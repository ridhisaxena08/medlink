import { env } from '../../config/environment';
import { DrugInteraction } from './interactions/interaction.model';
import { Medicine } from './medicines/medicine.model';

/**
 * Versioned, read-only bundles the mobile app downloads so medicine lookup,
 * explanations and interaction checks keep working with no connectivity.
 * Clients send the version they hold and receive only what changed.
 */
export const getVersion = async () => {
  const [medicineCount, interactionCount, latestMedicine, latestInteraction] = await Promise.all([
    Medicine.countDocuments({ isVerified: true }),
    DrugInteraction.countDocuments({ isActive: true }),
    Medicine.findOne({ isVerified: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    DrugInteraction.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
  ]);

  const timestamps = [latestMedicine?.updatedAt, latestInteraction?.updatedAt]
    .filter(Boolean)
    .map((d) => (d as Date).getTime());

  return {
    dataVersion: env.offlineDataVersion,
    medicines: { count: medicineCount },
    interactions: { count: interactionCount },
    lastUpdatedAt: timestamps.length ? new Date(Math.max(...timestamps)) : null,
    endpoints: {
      medicines: '/api/offline-data/medicines',
      interactions: '/api/offline-data/interactions',
    },
  };
};

export const getMedicineBundle = async (sinceVersion = 0, limit = 1000, cursor?: string) => {
  const filter: Record<string, unknown> = { isVerified: true, dataVersion: { $gt: sinceVersion } };
  if (cursor) filter._id = { $gt: cursor };

  const items = await Medicine.find(filter)
    .select('name genericName brandNames form strength ingredients prescriptionRequired explanation searchTokens dataVersion')
    .sort({ _id: 1 })
    .limit(limit)
    .lean();

  return {
    dataVersion: env.offlineDataVersion,
    count: items.length,
    nextCursor: items.length === limit ? String(items[items.length - 1]._id) : null,
    items,
  };
};

export const getInteractionBundle = async (sinceVersion = 0, limit = 2000, cursor?: string) => {
  const filter: Record<string, unknown> = { isActive: true, dataVersion: { $gt: sinceVersion } };
  if (cursor) filter._id = { $gt: cursor };

  const items = await DrugInteraction.find(filter)
    .select('ingredientA ingredientB severity effect advice mechanism dataVersion')
    .sort({ _id: 1 })
    .limit(limit)
    .lean();

  return {
    dataVersion: env.offlineDataVersion,
    count: items.length,
    nextCursor: items.length === limit ? String(items[items.length - 1]._id) : null,
    items,
  };
};
