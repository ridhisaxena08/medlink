import { GeoPoint } from '../types';

export const toGeoPoint = (longitude: number, latitude: number): GeoPoint => ({
  type: 'Point',
  coordinates: [longitude, latitude],
});

export const isValidCoordinates = (longitude: number, latitude: number): boolean =>
  Number.isFinite(longitude) && Number.isFinite(latitude) &&
  longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;

const EARTH_RADIUS_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export const haversineKm = (a: [number, number], b: [number, number]): number => {
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};
