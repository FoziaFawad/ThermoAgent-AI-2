export interface CityPreset {
  id: string;
  name: string;
  country: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  baselineAirTempF: number;
  baselineSurfaceTempF: number;
  description: string;
}

export const CITY_PRESETS: CityPreset[] = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi (Masdar City / Corniche)',
    country: 'United Arab Emirates',
    coordinates: {
      longitude: 54.6186,
      latitude: 24.4267,
      zoom: 14.5,
      pitch: 55,
      bearing: -20
    },
    baselineAirTempF: 104.2,
    baselineSurfaceTempF: 122.5,
    description: 'High solar irradiance desert microclimate with heavy urban albedo trapping and active construction projects.'
  },
  {
    id: 'dubai',
    name: 'Dubai (Downtown / Business Bay)',
    country: 'United Arab Emirates',
    coordinates: {
      longitude: 55.2708,
      latitude: 25.1972,
      zoom: 14.2,
      pitch: 58,
      bearing: 35
    },
    baselineAirTempF: 102.8,
    baselineSurfaceTempF: 119.4,
    description: 'Dense high-rise corridor with extreme urban canyon heat trapping and high chiller electricity load.'
  },
  {
    id: 'new-york',
    name: 'New York (Midtown Manhattan)',
    country: 'United States',
    coordinates: {
      longitude: -73.9851,
      latitude: 40.7484,
      zoom: 14.0,
      pitch: 50,
      bearing: -15
    },
    baselineAirTempF: 88.5,
    baselineSurfaceTempF: 105.0,
    description: 'High-density asphalt corridor with severe 2m pedestrian thermal disparities during heatwave events.'
  },
  {
    id: 'riyadh',
    name: 'Riyadh (KAFD / Olaya)',
    country: 'Saudi Arabia',
    coordinates: {
      longitude: 46.6575,
      latitude: 24.7645,
      zoom: 14.2,
      pitch: 52,
      bearing: 10
    },
    baselineAirTempF: 109.1,
    baselineSurfaceTempF: 129.3,
    description: 'Hyper-arid metropolitan basin with critical concrete curing evaporation rates and massive cool roof ROI.'
  }
];

// Open raster style definitions that require zero API tokens
export const OPEN_SATELLITE_STYLE: any = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

export const OPEN_DARK_STYLE: any = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© CARTO © OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

// Color ramp interpolation for 2m ambient thermal heatmaps
export function getThermalColorRgba(tempF: number, minF: number = 85, maxF: number = 115): [number, number, number, number] {
  const normalized = Math.min(1, Math.max(0, (tempF - minF) / (maxF - minF)));
  
  if (normalized < 0.35) {
    const t = normalized / 0.35;
    return [Math.round(0 + t * 144), Math.round(180 + t * 44), Math.round(216 - t * 156), 190];
  } else if (normalized < 0.7) {
    const t = (normalized - 0.35) / 0.35;
    return [Math.round(144 + t * 111), Math.round(224 - t * 66), Math.round(60 - t * 60), 205];
  } else {
    const t = (normalized - 0.7) / 0.3;
    return [Math.round(255 - t * 47), Math.round(158 - t * 158), Math.round(0), 220];
  }
}
