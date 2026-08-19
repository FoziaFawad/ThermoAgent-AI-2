import { Feature, FeatureCollection } from 'geojson';

export interface SkylineCluster {
  id: string;
  cityId: string;
  name: string;
  centerLat: number;
  centerLng: number;
  blocks: {
    lat: number;
    lng: number;
    widthM: number;
    lengthM: number;
    heightM: number;
    color: string;
  }[];
}

// -------------------------------------------------------------
// Dense Regional 3D Urban Skyline Model (Visible at Zoom 0 -> 14)
// Fills entire Manhattan & major city grids so buildings never look sparse or missing!
// -------------------------------------------------------------
function generateManhattanGridBlocks(): SkylineCluster['blocks'] {
  const blocks: SkylineCluster['blocks'] = [];

  // Manhattan Grid Constants
  const avenueBearingDeg = 28.9;
  const rad = (avenueBearingDeg * Math.PI) / 180;
  const sinB = Math.sin(rad);
  const cosB = Math.cos(rad);

  // Origin anchor: 5th Ave & 34th St (Empire State Building area)
  const anchorLat = 40.74844;
  const anchorLng = -73.98566;

  // Colors
  const colors = [
    '#ece9e4', '#dfdedb', '#d5d3ce', '#cfccc6', '#b8b6b0', 
    '#8ab4d8', '#a3c1e0', '#729ec4', '#b85d38', '#9c4928'
  ];

  // Generate 20 avenue rows x 20 cross-street columns = 400 dense city blocks
  for (let streetIdx = -10; streetIdx <= 15; streetIdx++) {
    for (let aveIdx = -6; aveIdx <= 6; aveIdx++) {
      // Standard Manhattan block spacing: ~80m between cross-streets, ~240m between avenues
      const distAlongAvenueM = streetIdx * 80;
      const distAlongStreetM = aveIdx * 110;

      // Skip Empire State parcel itself to let high-precision stepped landmark render
      if (Math.abs(streetIdx) <= 0 && Math.abs(aveIdx) <= 0) continue;

      const offsetEast = distAlongAvenueM * sinB + distAlongStreetM * cosB;
      const offsetNorth = distAlongAvenueM * cosB - distAlongStreetM * sinB;

      const blockLat = anchorLat + offsetNorth / 111320;
      const blockLng = anchorLng + offsetEast / (111320 * Math.cos((anchorLat * Math.PI) / 180));

      // Calculate realistic architectural heights based on proximity to Midtown Core
      const distFromCore = Math.sqrt(streetIdx * streetIdx + aveIdx * aveIdx);
      let baseHeight = 65 + Math.random() * 45;

      // Midtown skyscraper spike between 34th and 57th st near 5th/Park/Lex/Hudson Yards
      if (distFromCore < 8) {
        baseHeight = 160 + (8 - distFromCore) * 28 + Math.random() * 60;
      } else if (distFromCore < 14) {
        baseHeight = 90 + Math.random() * 70;
      }

      const color = colors[Math.floor(Math.random() * colors.length)];

      blocks.push({
        lat: blockLat,
        lng: blockLng,
        widthM: 55 + (streetIdx % 2 === 0 ? 10 : 0),
        lengthM: 85 + (aveIdx % 2 === 0 ? 15 : 0),
        heightM: Math.round(baseHeight),
        color
      });
    }
  }

  return blocks;
}

export const CITY_SKYLINES_3D: SkylineCluster[] = [
  // === MIDTOWN & UPPER DOWNTOWN MANHATTAN DENSE 3D GRID ===
  {
    id: 'manhattan-midtown-grid',
    cityId: 'new-york-ny',
    name: 'Dense Manhattan 3D Urban Grid',
    centerLat: 40.753,
    centerLng: -73.983,
    blocks: generateManhattanGridBlocks()
  },

  // === LOWER MANHATTAN FINANCIAL DISTRICT ===
  {
    id: 'manhattan-downtown-skyline',
    cityId: 'new-york-ny',
    name: 'Lower Manhattan Financial District',
    centerLat: 40.712,
    centerLng: -74.010,
    blocks: [
      { lat: 40.7127, lng: -74.0134, widthM: 65, lengthM: 65, heightM: 541, color: '#8ab4d8' }, // 1 WTC
      { lat: 40.7115, lng: -74.0125, widthM: 60, lengthM: 60, heightM: 298, color: '#729ec4' }, // 4 WTC
      { lat: 40.7120, lng: -74.0110, widthM: 60, lengthM: 60, heightM: 329, color: '#8ab4d8' }, // 3 WTC
      { lat: 40.7068, lng: -74.0090, widthM: 55, lengthM: 60, heightM: 283, color: '#dfdedb' }, // 40 Wall St
      { lat: 40.7075, lng: -74.0095, widthM: 55, lengthM: 55, heightM: 290, color: '#b8b6b0' }, // 70 Pine St
      { lat: 40.7060, lng: -74.0080, widthM: 70, lengthM: 90, heightM: 200, color: '#cfccc6' }
    ]
  },

  // === CHICAGO LOOP SKYLINE ===
  {
    id: 'chicago-loop-skyline',
    cityId: 'chicago-il',
    name: 'Chicago Downtown Loop',
    centerLat: 41.878,
    centerLng: -87.629,
    blocks: [
      { lat: 41.8789, lng: -87.6359, widthM: 70, lengthM: 70, heightM: 442, color: '#54524f' }, // Willis Tower
      { lat: 41.8988, lng: -87.6229, widthM: 65, lengthM: 65, heightM: 344, color: '#42403d' }, // 875 N Michigan (Hancock)
      { lat: 41.8853, lng: -87.6215, widthM: 60, lengthM: 60, heightM: 346, color: '#eceae5' }, // Aon Center
      { lat: 41.8887, lng: -87.6262, widthM: 65, lengthM: 65, heightM: 423, color: '#8ab4d8' }  // Trump Tower Chicago
    ]
  },

  // === MIAMI BRICKELL SKYLINE ===
  {
    id: 'miami-brickell-skyline',
    cityId: 'miami-fl',
    name: 'Miami Brickell & Downtown',
    centerLat: 25.765,
    centerLng: -80.190,
    blocks: [
      { lat: 25.7680, lng: -80.1905, widthM: 55, lengthM: 55, heightM: 259, color: '#8ab4d8' }, // Panorama Tower
      { lat: 25.7695, lng: -80.1910, widthM: 50, lengthM: 50, heightM: 240, color: '#a3c1e0' }, // Four Seasons Miami
      { lat: 25.7720, lng: -80.1895, widthM: 60, lengthM: 60, heightM: 252, color: '#729ec4' }  // Southeast Financial
    ]
  }
];

// Generate GeoJSON FeatureCollection for regional zoom-out 3D skylines
export function getCitySkylines3DGeoJSON(): FeatureCollection {
  const features: Feature[] = [];
  const rotationRad = (28.9 * Math.PI) / 180;
  const cosRad = Math.cos(rotationRad);
  const sinRad = Math.sin(rotationRad);

  CITY_SKYLINES_3D.forEach(cluster => {
    cluster.blocks.forEach((b, idx) => {
      const halfW = b.widthM / 2;
      const halfL = b.lengthM / 2;
      const latRad = (b.lat * Math.PI) / 180;

      const localCorners: [number, number][] = [
        [-halfL, -halfW],
        [halfL, -halfW],
        [halfL, halfW],
        [-halfL, halfW],
        [-halfL, -halfW]
      ];

      const polyCoords: [number, number][] = localCorners.map(([lx, ly]) => {
        const isNYC = cluster.cityId === 'new-york-ny';
        const rotX = isNYC ? (lx * cosRad - ly * sinRad) : lx;
        const rotY = isNYC ? (lx * sinRad + ly * cosRad) : ly;

        const dLat = rotY / 111320;
        const dLng = rotX / (111320 * Math.cos(latRad));

        return [b.lng + dLng, b.lat + dLat];
      });

      features.push({
        type: 'Feature',
        id: `${cluster.id}-block-${idx}`,
        geometry: {
          type: 'Polygon',
          coordinates: [polyCoords]
        },
        properties: {
          clusterId: cluster.id,
          name: cluster.name,
          height: b.heightM,
          minHeight: 0,
          color: b.color
        }
      });
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
}
