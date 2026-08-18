import { AuditedBuilding } from '../../types/simulation';
import { calculateStructuralPriorityScore } from '../../lib/thermal-math';

export class OSMService {
  /**
   * Generates or queries OpenStreetMap building footprint geometries within the thermal hotspot zones
   */
  static async getBuildingsForHotspots(
    cityId: string,
    centerLat: number,
    centerLng: number,
    hotspotHexes: string[]
  ): Promise<AuditedBuilding[]> {
    // Generate realistic OSM building envelopes around the hotspot coordinates
    const buildingTypes = [
      { name: 'Logistics Distribution Hub #4', area: 4200, albedo: 0.12, canopy: 4, height: 14 },
      { name: 'Commercial Plaza & Office Complex', area: 2850, albedo: 0.18, canopy: 8, height: 38 },
      { name: 'Metropolitan Transit Terminal', area: 5100, albedo: 0.14, canopy: 2, height: 18 },
      { name: 'Industrial Warehouse B-12', area: 3600, albedo: 0.10, canopy: 1, height: 12 },
      { name: 'Residential High-Rise Block A', area: 1900, albedo: 0.22, canopy: 14, height: 55 },
      { name: 'Municipal Hospital Annex', area: 3100, albedo: 0.16, canopy: 6, height: 26 },
    ];

    return buildingTypes.map((b, idx) => {
      // Offset slightly from center
      const latOffset = (idx % 2 === 0 ? 1 : -1) * (0.002 + idx * 0.0015);
      const lngOffset = (idx > 2 ? 1 : -1) * (0.003 + idx * 0.0012);
      const lat = centerLat + latOffset;
      const lng = centerLng + lngOffset;
      
      const priorityScore = calculateStructuralPriorityScore(b.area, b.albedo, b.canopy);
      // Sizing penalty: ~0.045 kW extra cooling load per m² of dark roof under extreme ambient heat
      const hvacPenaltyKw = Number((b.area * 0.045 * (1 - b.albedo)).toFixed(1));
      
      const hexZone = hotspotHexes[idx % (hotspotHexes.length || 1)] || '892a1008983ffff';

      let recommendedAction: 'Cool Roof Coating' | 'Green Roof' | 'Canopy Buffer' | 'Dual Retrofit' = 'Cool Roof Coating';
      if (b.canopy < 5 && b.area > 3000) recommendedAction = 'Dual Retrofit';
      else if (b.height > 40) recommendedAction = 'Cool Roof Coating';
      else if (b.canopy < 5) recommendedAction = 'Canopy Buffer';

      return {
        id: `osm_bldg_${cityId}_${idx + 101}`,
        name: b.name,
        lat,
        lng,
        heightMeters: b.height,
        roofAreaSqm: b.area,
        currentAlbedo: b.albedo,
        canopy50mCoveragePct: b.canopy,
        priorityScore,
        h3ZoneId: hexZone,
        hvacPenaltyKw,
        recommendedAction
      };
    });
  }
}
