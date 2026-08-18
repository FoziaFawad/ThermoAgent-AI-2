import { FortyGuardFeedResponse, FortyGuardReading, BoundingBox } from '../../types/fortyguard';
import { CITY_PRESETS } from '../../lib/mapbox';
import { H3Service } from './h3-service';

export class FortyGuardService {
  private static apiKey = process.env.FORTYGUARD_API_KEY || '';

  /**
   * Ingests 2-meter ambient air temperature streams for a city or bounding box
   */
  static async get2mThermalFeed(cityId: string = 'abu-dhabi', bbox?: BoundingBox): Promise<FortyGuardFeedResponse> {
    const preset = CITY_PRESETS.find(p => p.id === cityId) || CITY_PRESETS[0];

    // If live API key is configured, query the actual FortyGuard endpoint
    if (this.apiKey && this.apiKey !== 'your_fortyguard_key_here' && this.apiKey.length > 8) {
      try {
        const response = await fetch(`https://api.fortyguard.io/v1/temperature/2m?city=${cityId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          },
          next: { revalidate: 60 }
        });

        if (response.ok) {
          const liveData = await response.json();
          return {
            regionId: cityId,
            city: preset.name,
            baselineTempF: liveData.baselineTempF || preset.baselineAirTempF,
            baselineTempC: Number((((liveData.baselineTempF || preset.baselineAirTempF) - 32) * (5 / 9)).toFixed(1)),
            hotspotThresholdF: 3.5,
            totalHexagons: liveData.readings?.length || 0,
            hotspotCount: (liveData.readings || []).filter((r: any) => r.isHotspot).length,
            readings: liveData.readings,
            source: 'fortyguard_api_live'
          };
        }
      } catch (err) {
        console.warn('FortyGuard Live API call failed, switching to deterministic thermal twin fallback:', err);
      }
    }

    // High-resolution physics-informed deterministic 2m ambient thermal model
    const readings = H3Service.generateThermalTwinReadings(
      preset.id,
      preset.coordinates.latitude,
      preset.coordinates.longitude,
      preset.baselineAirTempF,
      preset.baselineSurfaceTempF
    );

    const hotspotCount = readings.filter(r => r.isHotspot).length;

    return {
      regionId: preset.id,
      city: preset.name,
      baselineTempF: preset.baselineAirTempF,
      baselineTempC: Number(((preset.baselineAirTempF - 32) * (5 / 9)).toFixed(1)),
      hotspotThresholdF: 3.5,
      totalHexagons: readings.length,
      hotspotCount,
      readings,
      source: 'fortyguard_2m_cache'
    };
  }
}
