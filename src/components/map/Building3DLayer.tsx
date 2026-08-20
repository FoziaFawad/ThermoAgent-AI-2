import { LayerSpecification } from 'maplibre-gl';

/**
 * Photorealistic Google Earth 3D Building Styling Engine
 * Real-world architectural materials, vertical lighting gradients, and ambient occlusion
 */

// -------------------------------------------------------------
// Natural Urban Material Palette (Derived from real-world photogrammetry)
// -------------------------------------------------------------
export const URBAN_PALETTE = {
  // Architectural Façades & Glazing
  supertallGlass: '#38586f',        // Supertall Skyscraper (>200m) - Reflective architectural glass
  highriseGlazing: '#4e6270',       // High-rise Commercial (90m-200m) - Modern glazing & composite panels
  curtainWallBlue: '#415e75',       // Alternative commercial blue-grey reflective glass
  darkSteelMullion: '#29323a',      // Structural steel & metallic mullions
  
  // Mid-Rise & Institutional Masonry
  midriseLimestone: '#c4b39e',      // Mid-rise Mixed-use (35m-90m) - Sandstone, granite & limestone
  precastConcrete: '#cfc4b4',       // Warm precast architectural concrete
  lightGranite: '#b8ab9a',          // Light granite & travertine
  
  // Low-Rise & Residential
  weatheredBrick: '#99735d',        // Low-rise Residential / Heritage (<35m) - Weathered terracotta & brick
  deepTerracotta: '#824e3c',        // Urban red / brown brick
  weatheredWood: '#9e6d54',         // Natural cedar & weathered timber
  
  // Roofs & Environmental Accents
  asphaltTarRoof: '#383d44',        // Dark asphalt / gravel roof surface
  concreteGravelRoof: '#6e757d',    // Mineral-surfaced concrete roof
  coolRoofReflective: '#e8edf2',    // High-albedo cool roof membrane
  
  // Interactive State Highlights
  selectedBuilding: '#00e5ff',      // Cyan glow for user-selected building
  hotspotBuilding: '#ff334b'        // Red-orange heat anomaly alert
};

// -------------------------------------------------------------
// Photorealistic 3D Building Vector Layer Specification
// -------------------------------------------------------------
export const CITY_3D_BUILDINGS_LAYER: LayerSpecification = {
  id: 'city-3d-buildings',
  type: 'fill-extrusion',
  source: 'openmaptiles',
  'source-layer': 'building',
  minzoom: 9,
  maxzoom: 24,
  filter: [
    'all',
    // Suppress generic flat boxes for iconic landmarks to let high-precision stepped textured models render
    ['!=', ['coalesce', ['get', 'render_height'], 0], 381],
    ['!=', ['coalesce', ['get', 'height'], 0], 381],
    ['!=', ['coalesce', ['get', 'levels'], 0], 102],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Empire State Building'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Empire State Building'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Chrysler Building'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Chrysler Building'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'One World Trade Center'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'One World Trade Center'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Flatiron Building'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Flatiron Building'],
    ['!=', ['coalesce', ['get', 'name'], ''], "St. Patrick's Cathedral"],
    ['!=', ['coalesce', ['get', 'name:en'], ''], "St. Patrick's Cathedral"],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Grand Central Terminal'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Grand Central Terminal'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Willis Tower'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Willis Tower'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'John Hancock Center'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'John Hancock Center'],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Panorama Tower'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Panorama Tower'],
    ['!=', ['coalesce', ['get', 'render_height'], 0], 319],
    ['!=', ['coalesce', ['get', 'height'], 0], 319],
    ['!=', ['coalesce', ['get', 'render_height'], 0], 541],
    ['!=', ['coalesce', ['get', 'height'], 0], 541],
    ['!=', ['coalesce', ['get', 'height'], 0], 442],
    ['!=', ['coalesce', ['get', 'height'], 0], 344]
  ],
  paint: {
    // Multi-Material Building & Roof Shader derived from height, area, and building types
    'fill-extrusion-color': [
      'case',
      // Selected / Active Thermal Audit Buildings: Keep highlighting intact
      ['boolean', ['feature-state', 'selected'], false], URBAN_PALETTE.selectedBuilding,
      ['boolean', ['feature-state', 'hotspot'], false], URBAN_PALETTE.hotspotBuilding,

      // Valid non-black OSM building:colour
      [
        'all',
        ['has', 'building:colour'],
        ['!=', ['get', 'building:colour'], '#000000'],
        ['!=', ['get', 'building:colour'], '#000'],
        ['!=', ['get', 'building:colour'], 'black']
      ],
      ['get', 'building:colour'],

      // Explicit Material-based physical rendering
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'brick'], URBAN_PALETTE.deepTerracotta,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'glass'], URBAN_PALETTE.supertallGlass,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'mirror'], URBAN_PALETTE.supertallGlass,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'stone'], URBAN_PALETTE.midriseLimestone,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'concrete'], URBAN_PALETTE.precastConcrete,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'wood'], URBAN_PALETTE.weatheredWood,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'metal'], URBAN_PALETTE.highriseGlazing,

      // Supertall Skyscraper (>200m) - Reflective architectural glass / steel
      ['>=', ['coalesce', ['get', 'render_height'], ['get', 'height'], ['*', ['get', 'levels'], 3.5], 0], 200], URBAN_PALETTE.supertallGlass,

      // High-rise Commercial (90m - 200m) - Modern glazing & composite panels
      ['>=', ['coalesce', ['get', 'render_height'], ['get', 'height'], ['*', ['get', 'levels'], 3.5], 0], 90], URBAN_PALETTE.highriseGlazing,

      // Mid-rise Mixed-use (35m - 90m) - Sandstone, granite, and limestone
      ['>=', ['coalesce', ['get', 'render_height'], ['get', 'height'], ['*', ['get', 'levels'], 3.5], 0], 35], URBAN_PALETTE.midriseLimestone,

      // Low-rise Residential / Heritage (<35m) - Weathered terracotta and urban brick
      URBAN_PALETTE.weatheredBrick
    ],
    'fill-extrusion-height': [
      'coalesce',
      ['get', 'render_height'],
      ['get', 'height'],
      ['*', ['get', 'levels'], 3.5],
      12
    ],
    'fill-extrusion-base': [
      'coalesce',
      ['get', 'render_min_height'],
      ['get', 'min_height'],
      0
    ],
    'fill-extrusion-opacity': 0.95,
    // Eliminates flat-shading artifacts and creates realistic vertical shadow gradient
    'fill-extrusion-vertical-gradient': true
  }
};
