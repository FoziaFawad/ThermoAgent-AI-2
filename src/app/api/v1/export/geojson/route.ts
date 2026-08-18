import { NextRequest, NextResponse } from 'next/server';
import { FortyGuardService } from '../../../../../server/services/fortyguard-service';
import { OSMService } from '../../../../../server/services/osm-service';
import { CITY_PRESETS } from '../../../../../lib/map-presets';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get('city') || 'abu-dhabi';
  const preset = CITY_PRESETS.find(p => p.id === cityId) || CITY_PRESETS[0];

  try {
    const feed = await FortyGuardService.get2mThermalFeed(cityId);
    const buildings = await OSMService.getBuildingsForHotspots(
      cityId,
      preset.coordinates.latitude,
      preset.coordinates.longitude,
      feed.readings.filter(r => r.isHotspot).map(r => r.h3Index)
    );

    const geojson = {
      type: 'FeatureCollection',
      features: [
        ...feed.readings.map(r => ({
          type: 'Feature',
          id: r.h3Index,
          geometry: {
            type: 'Point',
            coordinates: [r.lng, r.lat]
          },
          properties: {
            layer: 'fortyguard_2m_ambient',
            temp2mF: r.temp2mF,
            surfaceTempF: r.surfaceTempF,
            isHotspot: r.isHotspot
          }
        })),
        ...buildings.map(b => ({
          type: 'Feature',
          id: b.id,
          geometry: {
            type: 'Point',
            coordinates: [b.lng, b.lat]
          },
          properties: {
            layer: 'audited_building_envelope',
            name: b.name,
            roofAreaSqm: b.roofAreaSqm,
            albedo: b.currentAlbedo,
            priorityScore: b.priorityScore
          }
        }))
      ]
    };

    return NextResponse.json(geojson, {
      headers: {
        'Content-Disposition': `attachment; filename="thermoagent_mitigation_${cityId}.geojson"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
