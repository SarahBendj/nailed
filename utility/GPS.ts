type Salon = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

export class GPS {
  static getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
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

/**
 * Find salons within the radius defined by the user
 * @param userLat - user latitude
 * @param userLng - user longitude
 * @param radiusInKm - user chosen radius (in km)
 * @param salons - list of all salons
 * @returns array of salons within radius
 */
export function findNearbySalons(
  userLat: number,
  userLng: number,
  radiusInKm: number,
  salons: Salon[]
): Salon[] {
  return salons.filter((salon) => {
    const distance = GPS.getDistanceFromLatLonInKm(userLat, userLng, salon.latitude, salon.longitude);
    console.log('distancex', distance);
    console.log('radiusInKm', radiusInKm);
    return distance <= radiusInKm;
  });
}
