import { Feature, FeatureCollection, Polygon } from 'geojson';

export interface Landmark3DStructure {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  tiers: {
    minHeight: number;
    maxHeight: number;
    widthMeters: number;
    lengthMeters: number;
    color: string;
    description: string;
  }[];
}

// -------------------------------------------------------------
// High-Precision Architectural 3D Stepped Meshes for Iconic Landmarks
// -------------------------------------------------------------
export const ICONIC_LANDMARKS_3D: Landmark3DStructure[] = [
  // === EMPIRE STATE BUILDING, NYC ===
  // Indiana Limestone Art Deco stepped skyscraper (Total height: 443m to spire tip)
  {
    id: 'nyc-empire-state',
    name: 'Empire State Building',
    centerLat: 40.74844,
    centerLng: -73.98566,
    tiers: [
      // Tier 1: Ground Base (Floors 1-5, Podium)
      {
        minHeight: 0,
        maxHeight: 28,
        widthMeters: 62,
        lengthMeters: 130,
        color: '#e5e7eb', // Indiana Limestone Base
        description: 'Art Deco Granite & Indiana Limestone Podium Base'
      },
      // Tier 2: Lower Tower Setback (Floors 6-21)
      {
        minHeight: 28,
        maxHeight: 92,
        widthMeters: 48,
        lengthMeters: 92,
        color: '#d6d3d1',
        description: 'Lower Setback with Cast Aluminum Spandrels'
      },
      // Tier 3: Main Tower Shaft (Floors 22-85)
      {
        minHeight: 92,
        maxHeight: 320,
        widthMeters: 32,
        lengthMeters: 58,
        color: '#e2e8f0',
        description: 'Main Limestone Tower Shaft with Stainless Steel Mullions'
      },
      // Tier 4: Observation Deck & Crown (Floors 86-102)
      {
        minHeight: 320,
        maxHeight: 381,
        widthMeters: 20,
        lengthMeters: 26,
        color: '#cbd5e1',
        description: '86th & 102nd Floor Glass Observation Galleries'
      },
      // Tier 5: Mooring Mast Base
      {
        minHeight: 381,
        maxHeight: 405,
        widthMeters: 11,
        lengthMeters: 11,
        color: '#94a3b8',
        description: 'Art Deco Mooring Mast & Light Beacon'
      },
      // Tier 6: Crown Broadcast Spire & Antenna (405m to 443.2m)
      {
        minHeight: 405,
        maxHeight: 443,
        widthMeters: 3.5,
        lengthMeters: 3.5,
        color: '#f8fafc', // Bright Illuminated Spire Needle
        description: 'Broadcasting Antenna & Lightning Rod Tip'
      }
    ]
  },

  // === CHRYSLER BUILDING, NYC ===
  // Art Deco Terraced Crown & Spire (Total height: 319m)
  {
    id: 'nyc-chrysler',
    name: 'Chrysler Building',
    centerLat: 40.7516,
    centerLng: -73.9755,
    tiers: [
      { minHeight: 0, maxHeight: 45, widthMeters: 60, lengthMeters: 60, color: '#e5e7eb', description: 'Base' },
      { minHeight: 45, maxHeight: 220, widthMeters: 38, lengthMeters: 38, color: '#d6d3d1', description: 'Tower' },
      { minHeight: 220, maxHeight: 280, widthMeters: 22, lengthMeters: 22, color: '#cbd5e1', description: 'Gargoyle Setbacks' },
      { minHeight: 280, maxHeight: 319, widthMeters: 6, lengthMeters: 6, color: '#f8fafc', description: 'Sunburst Steel Crown & Spire' }
    ]
  },

  // === ONE WORLD TRADE CENTER, NYC ===
  // 541m (1776 ft) Tapered Octagonal Glass Tower
  {
    id: 'nyc-one-wtc',
    name: 'One World Trade Center',
    centerLat: 40.7127,
    centerLng: -74.0134,
    tiers: [
      { minHeight: 0, maxHeight: 58, widthMeters: 61, lengthMeters: 61, color: '#cbd5e1', description: 'Concrete Safety Base' },
      { minHeight: 58, maxHeight: 417, widthMeters: 46, lengthMeters: 46, color: '#93c5fd', description: 'Tapering Glass Curtain Wall' },
      { minHeight: 417, maxHeight: 541, widthMeters: 4, lengthMeters: 4, color: '#f8fafc', description: 'Communication Spire' }
    ]
  }
];

// Helper to convert landmark tiers into GeoJSON FeatureCollection with 3D extrusion heights & bases
export function getLandmark3DGeoJSON(): FeatureCollection {
  const features: Feature[] = [];

  ICONIC_LANDMARKS_3D.forEach(landmark => {
    landmark.tiers.forEach((tier, idx) => {
      // Convert meter dimensions to lat/lng offsets at given latitude
      const latOffset = (tier.widthMeters / 111320) / 2;
      const lngOffset = (tier.lengthMeters / (111320 * Math.cos(landmark.centerLat * Math.PI / 180))) / 2;

      const poly = [
        [landmark.centerLng - lngOffset, landmark.centerLat - latOffset],
        [landmark.centerLng + lngOffset, landmark.centerLat - latOffset],
        [landmark.centerLng + lngOffset, landmark.centerLat + latOffset],
        [landmark.centerLng - lngOffset, landmark.centerLat + latOffset],
        [landmark.centerLng - lngOffset, landmark.centerLat - latOffset]
      ];

      features.push({
        type: 'Feature',
        id: `${landmark.id}-tier-${idx}`,
        geometry: {
          type: 'Polygon',
          coordinates: [poly]
        },
        properties: {
          landmarkId: landmark.id,
          name: landmark.name,
          minHeight: tier.minHeight,
          height: tier.maxHeight,
          color: tier.color,
          description: tier.description
        }
      });
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
}
