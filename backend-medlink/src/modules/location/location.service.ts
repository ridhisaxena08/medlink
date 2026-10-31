import { HospitalProfile } from '../hospital/hospital.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { VERIFICATION_STATUS } from '../../shared/constants';
import { haversineKm, isValidCoordinates } from '../../shared/utils/geo';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Validates a coordinate pair and, when a district/state is declared, checks
 * that the point actually falls near a known facility in that area. This keeps
 * obviously wrong GPS fixes (0,0 or a swapped lat/lng) out of the system.
 */
export const validateLocation = async (input: {
  location: [number, number];
  accuracyMeters?: number;
  expectedDistrict?: string;
  expectedState?: string;
}) => {
  const [lng, lat] = input.location;

  if (!isValidCoordinates(lng, lat)) throw ApiError.badRequest('Coordinates are out of range');

  const issues: string[] = [];
  if (lng === 0 && lat === 0) issues.push('Null Island (0,0) is almost certainly a bad fix');
  if (input.accuracyMeters !== undefined && input.accuracyMeters > 2000) {
    issues.push(`Accuracy of ${input.accuracyMeters}m is too coarse for dispatch`);
  }
  // India's bounding box - a cheap plausibility check for a swapped pair.
  const inIndia = lng >= 68 && lng <= 98 && lat >= 6 && lat <= 38;
  if (!inIndia) issues.push('Point falls outside the served region; check lng/lat ordering');

  let nearestFacility = null;
  if (input.expectedDistrict || input.expectedState) {
    const facility = await HospitalProfile.findOne({
      ...(input.expectedDistrict ? { 'address.district': { $regex: input.expectedDistrict, $options: 'i' } } : {}),
      ...(input.expectedState ? { 'address.state': { $regex: input.expectedState, $options: 'i' } } : {}),
    })
      .select('name address.location address.district')
      .lean();

    if (facility?.address?.location) {
      const distanceKm = Number(
        haversineKm([lng, lat], facility.address.location.coordinates as [number, number]).toFixed(2),
      );
      nearestFacility = { name: facility.name, district: facility.address.district, distanceKm };
      if (distanceKm > 150) issues.push(`Point is ${distanceKm}km from the declared district`);
    }
  }

  return {
    valid: issues.length === 0,
    location: { longitude: lng, latitude: lat },
    accuracyMeters: input.accuracyMeters ?? null,
    issues,
    nearestFacility,
  };
};

export const findNearby = async (query: {
  lng: number; lat: number; radiusKm: number; type: 'hospital' | 'doctor'; limit: number;
}) => {
  const point = { type: 'Point', coordinates: [query.lng, query.lat] };
  const near = { $nearSphere: { $geometry: point, $maxDistance: query.radiusKm * 1000 } };

  if (query.type === 'doctor') {
    const doctors = await DoctorProfile.find({
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      'practiceLocation.location': near,
    })
      .populate('user', 'name')
      .select('specialties experienceYears consultationFee practiceLocation rating')
      .limit(query.limit)
      .lean();

    return doctors.map((d) => ({
      ...d,
      distanceKm: d.practiceLocation?.location
        ? Number(haversineKm([query.lng, query.lat], d.practiceLocation.location.coordinates as [number, number]).toFixed(2))
        : null,
    }));
  }

  const hospitals = await HospitalProfile.find({
    verificationStatus: VERIFICATION_STATUS.VERIFIED,
    'address.location': near,
  })
    .select('name type address contact facilities bedCapacity acceptsEmergencies')
    .limit(query.limit)
    .lean();

  return hospitals.map((h) => ({
    ...h,
    distanceKm: Number(haversineKm([query.lng, query.lat], h.address.location.coordinates as [number, number]).toFixed(2)),
  }));
};
