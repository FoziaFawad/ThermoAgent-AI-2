import { LayerSpecification } from 'maplibre-gl';

/**
 * Photorealistic Google Earth 3D Building Styling Engine
 * Real-world architectural materials, vertical lighting gradients, and ambient occlusion
 */

// -------------------------------------------------------------
// Natural Urban Material Palette (Derived from real-world photogrammetry)
// -------------------------------------------------------------
export const URBAN_PALETTE = {
  // Façades / Walls
  graniteGrey: '#d4d6d8',
  sandstoneBeige: '#e3dac9',
  limestone: '#c8c2bc',
  reflectiveGlass: '#7a8d99',
  brickTerracotta: '#a36854',
  weatheredWood: '#b57c60',
  steelMetal: '#5c5f66',
  
  // Roofs & Accents
  asphaltTar: '#4a4e54',
  concreteGravel: '#888c91',
  coolRoofReflective: '#e8edf2'
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
    // Suppress generic flat boxes for iconic landmarks to let high-precision stepped models render
    ['!=', ['coalesce', ['get', 'render_height'], 0], 381],
    ['!=', ['coalesce', ['get', 'height'], 0], 381],
    ['!=', ['coalesce', ['get', 'levels'], 0], 102],
    ['!=', ['coalesce', ['get', 'name'], ''], 'Empire State Building'],
    ['!=', ['coalesce', ['get', 'name:en'], ''], 'Empire State Building'],
    ['!=', ['coalesce', ['get', 'render_height'], 0], 319],
    ['!=', ['coalesce', ['get', 'height'], 0], 319],
    ['!=', ['coalesce', ['get', 'render_height'], 0], 541],
    ['!=', ['coalesce', ['get', 'height'], 0], 541]
  ],
  paint: {
    // Height & Attribute-Based Realistic Shading with Non-Black Color Fallback
    'fill-extrusion-color': [
      'case',
      // Valid non-black OSM building:colour
      [
        'all',
        ['has', 'building:colour'],
        ['!=', ['get', 'building:colour'], '#000000'],
        ['!=', ['get', 'building:colour'], '#000'],
        ['!=', ['get', 'building:colour'], 'black']
      ],
      ['get', 'building:colour'],

      // Material-based physical rendering
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'brick'], URBAN_PALETTE.brickTerracotta,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'glass'], URBAN_PALETTE.reflectiveGlass,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'mirror'], URBAN_PALETTE.reflectiveGlass,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'stone'], URBAN_PALETTE.limestone,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'concrete'], URBAN_PALETTE.graniteGrey,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'wood'], URBAN_PALETTE.weatheredWood,
      ['==', ['coalesce', ['get', 'building:material'], ['get', 'material'], ''], 'metal'], URBAN_PALETTE.steelMetal,

      // Deterministic realistic height gradient matching Google Earth 3D
      [
        'interpolate', ['linear'], ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
        0, URBAN_PALETTE.sandstoneBeige,     // Warm sandstone / brownstone ground base
        14, URBAN_PALETTE.brickTerracotta,    // Terracotta & brick residential low-rise
        35, URBAN_PALETTE.limestone,          // Indiana limestone & travertine commercial low-rise
        75, URBAN_PALETTE.graniteGrey,        // Subtle granite & architectural concrete mid-rise
        140, URBAN_PALETTE.concreteGravel,    // Cool concrete gravel & brushed steel high-rise
        240, URBAN_PALETTE.reflectiveGlass,   // Reflective tinted glass tower shaft
        420, URBAN_PALETTE.coolRoofReflective // Supertall crown & reflective cool-roof pinnacle
      ]
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
    'fill-extrusion-opacity': 0.98,
    // Eliminates flat-shading artifacts and creates realistic vertical shadow gradient
    'fill-extrusion-vertical-gradient': true
  }
};
