import * as h3 from 'h3-js';
import { FortyGuardReading } from '../../types/fortyguard';

export class H3Service {
  /**
   * Generates a grid of H3 hexagons around a center point
   */
  static generateGridAroundCenter(
    lat: number,
    lng: number,
    radiusRings: number = 3,
    resolution: number = 9
  ): string[] {
    try {
      const centerHex = h3.latLngToCell(lat, lng, resolution);
      return h3.gridDisk(centerHex, radiusRings);
    } catch {
      // Fallback for older h3-js API syntax if needed
      try {
        const centerHex = (h3 as any).geoToH3(lat, lng, resolution);
        return (h3 as any).kRing(centerHex, radiusRings);
      } catch {
        return [];
      }
    }
  }

  /**
   * Converts an H3 hexagon index to GeoJSON Polygon coordinates [[lng, lat], ...]
   */
  static cellToGeoJSONPolygon(h3Index: string): number[][] {
    try {
      // latLngToCellBoundary returns [[lat, lng], ...]
      const boundary = (h3 as any).cellToBoundary 
        ? (h3 as any).cellToBoundary(h3Index, true) // true gives [lng, lat]
        : (h3 as any).h3ToGeoBoundary(h3Index, true);
      
      // Close the loop if not closed
      if (boundary.length > 0) {
        const first = boundary[0];
        const last = boundary[boundary.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          boundary.push([first[0], first[1]]);
        }
      }
      return boundary;
    } catch {
      return [];
    }
  }

  /**
   * Generates realistic 2m ambient vs surface microclimate readings
   */
  static generateThermalTwinReadings(
    cityId: string,
    centerLat: number,
    centerLng: number,
    baseAirTempF: number,
    baseSurfaceTempF: number
  ): FortyGuardReading[] {
    const hexes = this.generateGridAroundCenter(centerLat, centerLng, 3, 9);
    const readings: FortyGuardReading[] = [];

    hexes.forEach((hex, idx) => {
      let lat = centerLat;
      let lng = centerLng;
      try {
        const center = (h3 as any).cellToLatLng ? (h3 as any).cellToLatLng(hex) : (h3 as any).h3ToGeo(hex);
        lat = center[0] || centerLat;
        lng = center[1] || centerLng;
      } catch {}

      // Pseudo-random deterministic spatial variance
      const seed = Math.sin(idx * 997 + lat * 100 + lng * 100);
      const isAnomalyCore = idx % 5 === 0 || idx === 0 || idx === 4 || idx === 8;
      
      // Anomaly hotspot gets +3.5°F to +7.2°F spike above baseline
      const spike = isAnomalyCore ? 3.5 + Math.abs(seed) * 3.8 : (seed * 1.8);
      const airTempF = Number((baseAirTempF + spike).toFixed(1));
      const airTempC = Number(((airTempF - 32) * (5 / 9)).toFixed(1));

      // Satellite LST surface skin temperature is often 12°F - 25°F hotter than 2m air
      const surfaceSpike = spike * 1.6 + (Math.abs(seed) * 6.0);
      const surfaceTempF = Number((baseSurfaceTempF + surfaceSpike).toFixed(1));
      const surfaceTempC = Number(((surfaceTempF - 32) * (5 / 9)).toFixed(1));

      const disparityF = Number((surfaceTempF - airTempF).toFixed(1));

      readings.push({
        h3Index: hex,
        lat,
        lng,
        temp2mF: airTempF,
        temp2mC: airTempC,
        surfaceTempF,
        surfaceTempC,
        disparityF,
        humidity: Math.round(28 + Math.abs(seed) * 22),
        windSpeedKmh: Number((12 + Math.abs(seed) * 14).toFixed(1)),
        solarRadiationWm2: Math.round(750 + Math.abs(seed) * 220),
        timestamp: new Date().toISOString(),
        isHotspot: spike >= 3.5,
        spikeDeltaF: Number(spike.toFixed(1))
      });
    });

    return readings;
  }
}
