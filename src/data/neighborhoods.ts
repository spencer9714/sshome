// Public business locations and deliberately rounded neighborhood centers only.
// Never add home addresses, exact home coordinates, or routes starting at a home.
export const neighborhoodCheckedOn = '2026-11-03';

export type NearbyPlace = {
  name: string;
  latitude: number;
  longitude: number;
  category: 'shopping' | 'shopping-gas' | 'charging';
  address: string;
  source: string;
  // Road-routing estimates from the rounded area center, not from the home.
  travel?: { miles: number; minutes: number };
};

const charging: NearbyPlace = {
  name: 'EVgo · Downtown parking garage',
  latitude: 36.32944,
  longitude: -119.28944,
  category: 'charging',
  address: '320 E Acequia Ave, Visalia, CA',
  source: 'https://www.evgo.com/find-a-charger/ca/visalia/132/',
};

export const neighborhoods = {
  family: {
    area: { latitude: 36.36, longitude: -119.30 },
    bounds: { west: -119.375, east: -119.265, north: 36.38, south: 36.32 },
    places: [
      { name: 'Target · Visalia North', latitude: 36.35888, longitude: -119.29517, category: 'shopping', address: '3308 N Dinuba Blvd, Visalia, CA', source: 'https://www.target.com/sl/visalia-north/2469', travel: { miles: 1, minutes: 3 } },
      { name: 'Costco · North Visalia + Gas', latitude: 36.35659, longitude: -119.35911, category: 'shopping-gas', address: '6610 W Riggin Ave, Visalia, CA', source: 'https://www.costco.com/warehouse-locations/warehouse-1741.html', travel: { miles: 3.5, minutes: 7 } },
      { name: 'Walmart Neighborhood Market', latitude: 36.34142, longitude: -119.33001, category: 'shopping', address: '1320 N Demaree St, Visalia, CA', source: 'https://www.walmart.com/store/5635-visalia-ca', travel: { miles: 3.2, minutes: 6 } },
      { ...charging, travel: { miles: 2.7, minutes: 6 } },
    ] as NearbyPlace[],
  },
  desert: {
    area: { latitude: 36.31, longitude: -119.28 },
    bounds: { west: -119.345, east: -119.25, north: 36.345, south: 36.275 },
    places: [
      { name: 'Target · Visalia', latitude: 36.29223, longitude: -119.31678, category: 'shopping', address: '4247 S Mooney Blvd, Visalia, CA', source: 'https://www.target.com/sl/visalia--target-store/1805', travel: { miles: 3.4, minutes: 9 } },
      { name: 'Costco · Visalia + Gas', latitude: 36.29269, longitude: -119.30652, category: 'shopping-gas', address: '1405 W Cameron Ave, Visalia, CA', source: 'https://www.costco.com/warehouse-locations/warehouse-1017.html', travel: { miles: 2.7, minutes: 8 } },
      { name: 'Walmart Supercenter · E Noble', latitude: 36.32461, longitude: -119.27304, category: 'shopping', address: '1819 E Noble Ave, Visalia, CA', source: 'https://www.walmart.com/store/1826-visalia-ca', travel: { miles: 1.9, minutes: 5 } },
      { ...charging, travel: { miles: 1.9, minutes: 5 } },
    ] as NearbyPlace[],
  },
};

export function publicPlaceMapUrl(place: NearbyPlace) {
  // Destination-only search: no residential origin or guest location is included.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;
}

export const mapZoom = 13;
export function mapPoint(latitude: number, longitude: number) {
  const scale = 256 * 2 ** mapZoom;
  const sin = Math.sin(latitude * Math.PI / 180);
  return { x: (longitude + 180) / 360 * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale };
}
