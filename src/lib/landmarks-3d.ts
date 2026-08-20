import { Feature, FeatureCollection } from 'geojson';

export interface LandmarkTier {
  name: string;
  minHeight: number;
  height: number;
  scale: number;
  color: string;
  description: string;
  isRoofPlate?: boolean;
}

export interface LandmarkDefinition {
  id: string;
  name: string;
  cityId: string;
  parcelCorners: [number, number][]; // Exact ground parcel corners [lng, lat]
  tiers: LandmarkTier[];
}

export interface GoogleEarthPOIBadge {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cityId?: string;
  type: 'camera' | 'zoo' | 'church' | 'university' | 'museum' | 'landmark';
  color: string;
}

// -------------------------------------------------------------
// Iconic City Landmark Badges (Exact Google Earth 3D Badges)
// -------------------------------------------------------------
export const CITY_GOOGLE_EARTH_BADGES: GoogleEarthPOIBadge[] = [
  // NYC
  { id: 'esb', cityId: 'new-york-ny', name: 'Empire State Building', lat: 40.74844, lng: -73.98566, type: 'camera', color: '#9333ea' },
  { id: 'chrysler', cityId: 'new-york-ny', name: 'Chrysler Building', lat: 40.75162, lng: -73.97552, type: 'camera', color: '#9333ea' },
  { id: 'one-wtc', cityId: 'new-york-ny', name: 'One World Trade Center', lat: 40.71274, lng: -74.01338, type: 'camera', color: '#9333ea' },
  { id: 'flatiron', cityId: 'new-york-ny', name: 'Flatiron Building', lat: 40.74110, lng: -73.98970, type: 'landmark', color: '#0284c7' },
  { id: 'st-patricks', cityId: 'new-york-ny', name: "St. Patrick's Cathedral", lat: 40.75846, lng: -73.97599, type: 'church', color: '#0284c7' },
  { id: 'grand-central', cityId: 'new-york-ny', name: 'Grand Central Terminal', lat: 40.75273, lng: -73.97723, type: 'landmark', color: '#0284c7' },
  { id: 'times-square', cityId: 'new-york-ny', name: 'Times Square & Broadway', lat: 40.75800, lng: -73.98550, type: 'camera', color: '#9333ea' },
  { id: 'central-park-zoo', cityId: 'new-york-ny', name: 'Central Park Zoo', lat: 40.76777, lng: -73.97183, type: 'zoo', color: '#16a34a' },
  { id: 'un-hq', cityId: 'new-york-ny', name: 'United Nations Headquarters', lat: 40.74888, lng: -73.96805, type: 'camera', color: '#9333ea' },

  // Chicago
  { id: 'willis-tower', cityId: 'chicago-il', name: 'Willis Tower (Sears)', lat: 41.8789, lng: -87.6359, type: 'camera', color: '#9333ea' },
  { id: 'hancock-center', cityId: 'chicago-il', name: '875 N Michigan (Hancock)', lat: 41.8988, lng: -87.6229, type: 'camera', color: '#9333ea' },
  { id: 'cloud-gate', cityId: 'chicago-il', name: 'Millennium Park & Cloud Gate', lat: 41.8827, lng: -87.6233, type: 'landmark', color: '#0284c7' },

  // Miami
  { id: 'panorama-tower', cityId: 'miami-fl', name: 'Panorama Tower Brickell', lat: 25.7680, lng: -80.1905, type: 'camera', color: '#9333ea' },
  { id: 'se-financial', cityId: 'miami-fl', name: 'Southeast Financial Center', lat: 25.7720, lng: -80.1895, type: 'landmark', color: '#0284c7' }
];

export const NYC_GOOGLE_EARTH_BADGES = CITY_GOOGLE_EARTH_BADGES.filter(b => b.cityId === 'new-york-ny');

// -------------------------------------------------------------
// High-Precision Architectural 3D Stepped Meshes
// Exact Real-World Organic Materials (Limestone, Granite, Terracotta, Glazing, Steel, Spire)
// -------------------------------------------------------------
export const REAL_LANDMARKS: LandmarkDefinition[] = [
  // =========================================================
  // 1. EMPIRE STATE BUILDING, MIDTOWN MANHATTAN, NYC
  // Exact 4 Parcel Corners on 5th Ave between 33rd & 34th St
  // Total Architectural Height: 443.2 m (1,454 ft to needle tip)
  // Real organic Indiana Limestone, Bronze Art Deco Spandrels & Stainless Spire
  // =========================================================
  {
    id: 'nyc-empire-state',
    name: 'Empire State Building',
    cityId: 'new-york-ny',
    parcelCorners: [
      [-73.986345, 40.748722], // NW (34th St West end)
      [-73.985065, 40.748985], // NE (34th St & 5th Ave corner)
      [-73.984530, 40.748305], // SE (33rd St & 5th Ave corner)
      [-73.985810, 40.748042], // SW (33rd St West end)
    ],
    tiers: [
      // Tier 1: Indiana Limestone Base Podium (Floors 1-5, 0-26m)
      { name: 'Podium Base', minHeight: 0, height: 26, scale: 1.00, color: '#c4b39e', description: 'Indiana Limestone Base Podium' },
      // Tier 1 Roof Terrace Plate
      { name: 'Podium Terrace Plate', minHeight: 26, height: 27, scale: 0.98, color: '#383d44', description: 'Gravel Roof Terrace Plate' },
      
      // Tier 2: Lower Tower Setback 1 (Floors 6-12, 27-58m)
      { name: 'Lower Setback 1', minHeight: 27, height: 58, scale: 0.85, color: '#bca994', description: 'Limestone with Dark Bronze Pilasters' },
      // Setback 1 Roof Plate
      { name: 'Setback 1 Roof Plate', minHeight: 58, height: 59, scale: 0.83, color: '#353a40', description: 'Setback 1 Roof Terrace' },

      // Tier 3: Lower Tower Setback 2 (Floors 13-21, 59-88m)
      { name: 'Lower Setback 2', minHeight: 59, height: 88, scale: 0.72, color: '#b5a18c', description: 'Limestone Setback Tower' },
      // Setback 2 Roof Plate
      { name: 'Setback 2 Roof Plate', minHeight: 88, height: 89, scale: 0.70, color: '#353a40', description: 'Setback 2 Roof Terrace' },

      // Tier 4: Mid-Tower Setback (Floors 22-38, 89-180m)
      { name: 'Mid-Tower Setback', minHeight: 89, height: 180, scale: 0.55, color: '#ac9883', description: 'Mid-Tower Limestone Shaft' },
      // Setback 3 Roof Plate
      { name: 'Setback 3 Roof Plate', minHeight: 180, height: 181.5, scale: 0.53, color: '#32373d', description: 'Mid-Tower Setback Terrace' },

      // Tier 5: Main Upper Tower Shaft (Floors 39-65, 181.5-275m)
      { name: 'Main Tower Shaft', minHeight: 181.5, height: 275, scale: 0.42, color: '#a38f7a', description: 'Main Vertical Tower Shaft' },
      
      // Tier 6: High Tower Setback (Floors 66-85, 275-320m)
      { name: 'High Tower Setback', minHeight: 275, height: 320, scale: 0.35, color: '#998571', description: 'High Tower Shaft' },
      // High Setback Roof Terrace
      { name: '85th Floor Terrace', minHeight: 320, height: 321.5, scale: 0.33, color: '#2f343a', description: '85th Floor Roof Deck' },

      // Tier 7: 86th Floor Open-Air Observation Deck (321.5-345m)
      { name: '86th Floor Observation Deck', minHeight: 321.5, height: 345, scale: 0.26, color: '#8d7865', description: '86th Floor Observation Gallery' },
      
      // Tier 8: 102nd Floor Glass Crown & Lantern (Floors 87-102, 345-373m)
      { name: '102nd Floor Glass Crown', minHeight: 345, height: 373, scale: 0.20, color: '#7a6857', description: 'Art Deco Glass Lantern & Observatory' },
      
      // Tier 9: Art Deco Mooring Mast Base (373m -> 395m)
      { name: 'Mooring Mast Base', minHeight: 373, height: 395, scale: 0.14, color: '#5f5446', description: 'Mooring Mast Aluminum Ribs' },
      
      // Tier 10: Mooring Mast Stainless Steel Upper Gallery (395m -> 405m)
      { name: 'Mooring Mast Top', minHeight: 395, height: 405, scale: 0.10, color: '#c5cbd2', description: 'Stainless Steel Mooring Lantern' },
      
      // Tier 11: Broadcast Spire Base & Lattice (405m -> 425m)
      { name: 'Broadcast Spire Base', minHeight: 405, height: 425, scale: 0.05, color: '#dce2e8', description: 'Broadcasting Antenna Truss' },
      
      // Tier 12: Broadcast Antenna Needle & Aviation Beacon Tip (425m -> 443.2m tip)
      { name: 'Antenna Needle Tip', minHeight: 425, height: 443.2, scale: 0.02, color: '#ffffff', description: 'Antenna Needle Summit (443.2m)' }
    ]
  },

  // =========================================================
  // 2. CHRYSLER BUILDING, NYC
  // Lexington Ave & 42nd St (318.9 m)
  // Warm Gray Limestone Base, Buff Brick Shaft, Stainless Nirosta Sunburst Spire
  // =========================================================
  {
    id: 'nyc-chrysler',
    name: 'Chrysler Building',
    cityId: 'new-york-ny',
    parcelCorners: [
      [-73.97598, 40.75185],
      [-73.97510, 40.75205],
      [-73.97485, 40.75138],
      [-73.97573, 40.75118]
    ],
    tiers: [
      // Base & Lower Floors (0-42m)
      { name: 'Marble Base', minHeight: 0, height: 42, scale: 1.00, color: '#c2b3a0', description: 'Georgia White Marble & Granite Base' },
      { name: 'Base Roof Terrace', minHeight: 42, height: 43.5, scale: 0.96, color: '#383d44', description: 'Base Roof Terrace Plate' },

      // Tower Shaft (43.5-195m)
      { name: 'Buff Brick Shaft', minHeight: 43.5, height: 195, scale: 0.65, color: '#b5a38e', description: 'Warm Buff Brick & White Glazed Accents' },
      { name: '31st Floor Radiator Terrace', minHeight: 195, height: 197, scale: 0.63, color: '#353a40', description: 'Winged Radiator Cap Terrace' },

      // Upper Setbacks (197-275m)
      { name: 'Gargoyle Setbacks', minHeight: 197, height: 275, scale: 0.38, color: '#9e8975', description: 'Art Deco Eagle Gargoyle Setbacks' },
      { name: '61st Floor Eagle Terrace', minHeight: 275, height: 277, scale: 0.36, color: '#b8c0c8', description: 'Stainless Steel Eagle Gargoyle Ring' },

      // Iconic 7-Arched Nirosta Stainless Steel Sunburst Spire (277-308m)
      { name: 'Nirosta Sunburst Crown', minHeight: 277, height: 308, scale: 0.22, color: '#dce3ea', description: '7-Arched Nirosta Stainless Steel Sunburst Crown' },
      
      // Sunburst Spire Tip (308-318.9m)
      { name: 'Sunburst Nirosta Needle', minHeight: 308, height: 318.9, scale: 0.05, color: '#ffffff', description: 'Polished Stainless Steel Needle (318.9m)' }
    ]
  },

  // =========================================================
  // 3. ONE WORLD TRADE CENTER, NYC
  // 541.3 m (1,776 ft)
  // Blast-Resistant Titanium Base, Tapering Blue-Cyan Reflective Glass, Communications Spire
  // =========================================================
  {
    id: 'nyc-one-wtc',
    name: 'One World Trade Center',
    cityId: 'new-york-ny',
    parcelCorners: [
      [-74.01385, 40.71305],
      [-74.01290, 40.71325],
      [-74.01265, 40.71245],
      [-74.01360, 40.71225]
    ],
    tiers: [
      // Blast-resistant Titanium-Clad Base (0-57m)
      { name: 'Titanium Base Podium', minHeight: 0, height: 57, scale: 1.00, color: '#889098', description: 'Textured Prismatic Glass & Titanium Blast Base' },
      { name: 'Base Parapet Ring', minHeight: 57, height: 59, scale: 0.97, color: '#2c353d', description: 'Podium Parapet Ring' },

      // Lower Chamfered Glass Tower (59-220m)
      { name: 'Lower Tapering Glass Shaft', minHeight: 59, height: 220, scale: 0.88, color: '#2b4e6b', description: 'Deep Blue-Cyan Low-Iron Reflective Glass' },
      
      // Mid Chamfered Octagonal Tower (220-350m)
      { name: 'Mid Octagonal Glass Shaft', minHeight: 220, height: 350, scale: 0.74, color: '#386383', description: 'Chamfered Octagonal Glass Curtain Wall' },
      
      // 100-102nd Floor Observatory & Parapet (350-417m)
      { name: 'One Dine Observatory Parapet', minHeight: 350, height: 417, scale: 0.60, color: '#4a799d', description: 'Sky Observatory & Mechanical Parapet' },
      { name: 'Rooftop Ring Plate', minHeight: 417, height: 420, scale: 0.58, color: '#27313a', description: 'Communications Base Ring Plate' },

      // Communications Spire Mast (420-541.3m / 1,776 ft)
      { name: 'Communications Spire', minHeight: 420, height: 541.3, scale: 0.04, color: '#f8fafc', description: 'Communications Spire & Beacon Tip (1,776 ft)' }
    ]
  },

  // =========================================================
  // 4. FLATIRON BUILDING, NYC
  // 5th Ave & Broadway at 23rd St (87 m)
  // Iconic Triangular Footprint, Beaux-Arts Limestone, Terracotta, Copper Cornice
  // =========================================================
  {
    id: 'nyc-flatiron',
    name: 'Flatiron Building',
    cityId: 'new-york-ny',
    parcelCorners: [
      [-73.98935, 40.74145], // North Apex at 23rd St
      [-73.98905, 40.74080], // Southeast (5th Ave side)
      [-73.98990, 40.74080], // Southwest (Broadway side)
    ],
    tiers: [
      // Rusticated Limestone Base (0-15m)
      { name: 'Rusticated Limestone Base', minHeight: 0, height: 15, scale: 1.00, color: '#c5b19b', description: 'Rusticated Indiana Limestone Base' },
      
      // Glazed Terracotta Main Body (15-75m)
      { name: 'Renaissance Terracotta Shaft', minHeight: 15, height: 75, scale: 0.95, color: '#b79f87', description: 'Glazed Architectural Terracotta with Ornate Bays' },
      
      // Beaux-Arts Copper Cornice & Roof (75-87m)
      { name: 'Overhanging Copper Cornice', minHeight: 75, height: 87, scale: 0.90, color: '#567262', description: 'Historic Oxidized Copper Roof Cornice' },
      { name: 'Roof Machinery Penthouse', minHeight: 87, height: 90, scale: 0.45, color: '#383c42', description: 'Elevator Overrun & Penthouse' }
    ]
  },

  // =========================================================
  // 5. ST. PATRICK'S CATHEDRAL, NYC
  // 5th Ave between 50th & 51st St (100 m)
  // Neo-Gothic Tuckahoe Marble, Granite Nave, Twin Gothic Spire Towers
  // =========================================================
  {
    id: 'nyc-st-patricks',
    name: "St. Patrick's Cathedral",
    cityId: 'new-york-ny',
    parcelCorners: [
      [-73.97645, 40.75880], // NW
      [-73.97530, 40.75905], // NE
      [-73.97495, 40.75815], // SE
      [-73.97610, 40.75790]  // SW
    ],
    tiers: [
      // Cathedral Nave & Transept (0-34m)
      { name: 'Marble Nave & Portal', minHeight: 0, height: 34, scale: 1.00, color: '#dad4ca', description: 'Tuckahoe White Marble Neo-Gothic Walls' },
      
      // Gothic Slate Roof Pitch (34-44m)
      { name: 'Gothic Slate Roof Pitch', minHeight: 34, height: 44, scale: 0.70, color: '#444d56', description: 'Blue-Gray Slate Steeple Roof' },
      
      // Twin Spire Towers (44-100m)
      { name: 'Twin Gothic Spires', minHeight: 44, height: 100, scale: 0.28, color: '#cec8bd', description: 'Twin 330-ft Neo-Gothic Marble Spires & Cross' }
    ]
  },

  // =========================================================
  // 6. GRAND CENTRAL TERMINAL, NYC
  // 42nd St & Park Ave (48 m)
  // Beaux-Arts Granite, Arched Concourse, "Glory of Commerce" Statuary Crown
  // =========================================================
  {
    id: 'nyc-grand-central',
    name: 'Grand Central Terminal',
    cityId: 'new-york-ny',
    parcelCorners: [
      [-73.97810, 40.75330], // NW
      [-73.97660, 40.75360], // NE
      [-73.97620, 40.75230], // SE
      [-73.97770, 40.75200]  // SW
    ],
    tiers: [
      // Main Concourse & Colonnade Arches (0-38m)
      { name: 'Granite Concourse & Arches', minHeight: 0, height: 38, scale: 1.00, color: '#baae9b', description: 'Beaux-Arts Indiana Limestone & Granite Colonnade' },
      
      // Tiffany Clock & Statuary Crown (38-48m)
      { name: 'Tiffany Clock & Statuary Crown', minHeight: 38, height: 48, scale: 0.65, color: '#5a7c6c', description: 'Oxidized Copper Roof with Glory of Commerce Statues' }
    ]
  },

  // =========================================================
  // 7. WILLIS TOWER (SEARS TOWER), CHICAGO, IL
  // 233 S Wacker Dr (442 m)
  // Anodized Matte Black Steel, Bronze Glass, 9-Tube Bundled Architecture
  // =========================================================
  {
    id: 'chicago-willis-tower',
    name: 'Willis Tower',
    cityId: 'chicago-il',
    parcelCorners: [
      [-87.63645, 41.87930], // NW
      [-87.63535, 41.87930], // NE
      [-87.63535, 41.87850], // SE
      [-87.63645, 41.87850]  // SW
    ],
    tiers: [
      // Tier 1: 9-Tube Base (0-200m)
      { name: '9-Tube Black Steel Base', minHeight: 0, height: 200, scale: 1.00, color: '#1e2227', description: 'Matte Black Anodized Steel & Bronze Glass' },
      { name: 'Tier 1 Roof Setback Plate', minHeight: 200, height: 202, scale: 0.98, color: '#383d44', description: 'Setback Terrace Plate' },

      // Tier 2: 7-Tube Setback (202-260m)
      { name: '7-Tube Mid Shaft', minHeight: 202, height: 260, scale: 0.82, color: '#242930', description: 'Bundled Tube Mid-Rise Setback' },
      { name: 'Tier 2 Roof Setback Plate', minHeight: 260, height: 262, scale: 0.80, color: '#383d44', description: 'Setback Terrace Plate' },

      // Tier 3: 5-Tube Setback (262-350m)
      { name: '5-Tube Upper Shaft', minHeight: 262, height: 350, scale: 0.65, color: '#2a3038', description: 'Upper Bundled Tower Shaft' },
      { name: 'Tier 3 Roof Setback Plate', minHeight: 350, height: 352, scale: 0.63, color: '#383d44', description: 'Skydeck Observation Terrace' },

      // Tier 4: 2-Tube Summit Tower (352-442m)
      { name: '2-Tube Summit Tower', minHeight: 352, height: 442, scale: 0.40, color: '#181b20', description: 'Summit Penthouses & Skydeck' },

      // Twin White Broadcast Antennas (442-527m)
      { name: 'Twin Broadcast Antenna', minHeight: 442, height: 527, scale: 0.04, color: '#f8fafc', description: 'Twin White Broadcast Antenna Masts (527m)' }
    ]
  },

  // =========================================================
  // 8. 875 N MICHIGAN (JOHN HANCOCK CENTER), CHICAGO, IL
  // 875 N Michigan Ave (344 m)
  // Tapered Trapezoidal Dark Steel Frame with Iconic Exterior X-Braces
  // =========================================================
  {
    id: 'chicago-hancock-center',
    name: 'John Hancock Center',
    cityId: 'chicago-il',
    parcelCorners: [
      [-87.62340, 41.89925], // NW
      [-87.62240, 41.89925], // NE
      [-87.62240, 41.89835], // SE
      [-87.62340, 41.89835]  // SW
    ],
    tiers: [
      // Lower Tapering Base (0-120m)
      { name: 'Trapezoidal Base', minHeight: 0, height: 120, scale: 1.00, color: '#22262c', description: 'Charcoal Structural Steel Base' },
      
      // Mid-Rise with X-Braces (120-260m)
      { name: 'X-Braced Mid Tower', minHeight: 120, height: 260, scale: 0.82, color: '#282d35', description: 'Iconic Structural Steel Exterior X-Bracing' },
      
      // 94th Floor 360 Chicago Observatory & Crown (260-344m)
      { name: '360 Chicago Observatory Crown', minHeight: 260, height: 344, scale: 0.65, color: '#1b1f24', description: 'Observation Deck & Trapezoidal Crown' },
      { name: 'Roof Machinery Deck', minHeight: 344, height: 347, scale: 0.63, color: '#383d44', description: 'Roof Mechanical Deck' },

      // Twin White Broadcast Spires (347-457m)
      { name: 'Twin Broadcast Spires', minHeight: 347, height: 457, scale: 0.04, color: '#ffffff', description: 'Twin White Broadcast Antennas (457m)' }
    ]
  },

  // =========================================================
  // 9. PANORAMA TOWER, MIAMI BRICKELL, FL
  // 1101 Brickell Ave (259 m)
  // Azure Reflective Glass, White Balconies, Coastal High-Rise
  // =========================================================
  {
    id: 'miami-panorama-tower',
    name: 'Panorama Tower',
    cityId: 'miami-fl',
    parcelCorners: [
      [-80.19090, 25.76835],
      [-80.19010, 25.76835],
      [-80.19010, 25.76765],
      [-80.19090, 25.76765]
    ],
    tiers: [
      // Base Retail & Parking Podium (0-30m)
      { name: 'White Concrete Podium', minHeight: 0, height: 30, scale: 1.00, color: '#e8edf2', description: 'Architectural White Concrete & Glass Retail Base' },
      { name: 'Podium Pool Deck Terrace', minHeight: 30, height: 32, scale: 0.96, color: '#3a7bd5', description: 'Tropical Pool Deck & Garden Terrace' },

      // Main Azure Glass Residential Tower (32-259m)
      { name: 'Azure Glass Tower Shaft', minHeight: 32, height: 259, scale: 0.75, color: '#2e75b6', description: 'Azure Blue Reflective Glazing with Continuous White Balconies' },
      
      // Illuminated Crown & Mechanical Penthouse (259-265m)
      { name: 'Illuminated Crown Penthouse', minHeight: 259, height: 265, scale: 0.45, color: '#ffffff', description: 'Architectural Lighted Crown & Elevator Penthouse' }
    ]
  }
];

// Helper to convert real parcel landmark tiers into GeoJSON FeatureCollection
export function getLandmark3DGeoJSON(): FeatureCollection {
  const features: Feature[] = [];

  REAL_LANDMARKS.forEach(landmark => {
    const corners = landmark.parcelCorners;
    const centerLng = corners.reduce((acc, c) => acc + c[0], 0) / corners.length;
    const centerLat = corners.reduce((acc, c) => acc + c[1], 0) / corners.length;

    landmark.tiers.forEach((tier, idx) => {
      // Interpolate each parcel corner toward the center based on tier scale
      const poly = corners.map(([lng, lat]) => [
        centerLng + tier.scale * (lng - centerLng),
        centerLat + tier.scale * (lat - centerLat)
      ]);
      poly.push(poly[0]); // Close polygon loop

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
          cityId: landmark.cityId,
          tierName: tier.name,
          minHeight: tier.minHeight,
          height: tier.height,
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
