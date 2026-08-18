export interface FortyGuardReading {
  h3Index: string;
  lat: number;
  lng: number;
  temp2mC: number;
  temp2mF: number;
  surfaceTempC: number;
  surfaceTempF: number;
  disparityF: number; // 2m ambient vs Satellite surface disparity
  humidity: number;
  windSpeedKmh: number;
  solarRadiationWm2: number;
  timestamp: string;
  isHotspot: boolean;
  spikeDeltaF: number;
}

export interface FortyGuardFeedResponse {
  regionId: string;
  city: string;
  baselineTempF: number;
  baselineTempC: number;
  hotspotThresholdF: number;
  totalHexagons: number;
  hotspotCount: number;
  readings: FortyGuardReading[];
  source: 'fortyguard_api_live' | 'fortyguard_2m_cache' | 'synthetic_thermal_twin';
}

export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}
