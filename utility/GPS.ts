type HallWithCoords = {
  id: number;
  name: string;
  latitude?: unknown;
  longitude?: unknown;
};

export class GPS {
  static getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

function parseCoord(coord: number | string | null | undefined): number | null {
  if (coord === null || coord === undefined) return null;
  const str = String(coord).trim().replace(',', '.');
  const num = Number(str);
  return isNaN(num) ? null : num;
}

export function findNearbyHalls<T extends HallWithCoords>(
  userLat: number,
  userLng: number,
  radiusInKm: number,
  halls: T[],
): T[] {
  return halls.filter((hall) => {
    const hallLat = parseCoord(hall.latitude as number | string);
    const hallLng = parseCoord(hall.longitude as number | string);
    if (hallLat === null || hallLng === null) {
      return false;
    }
    const distance = GPS.getDistanceFromLatLonInKm(userLat, userLng, hallLat, hallLng);
    return distance <= radiusInKm;
  });
}
