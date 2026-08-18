import { NextRequest, NextResponse } from 'next/server';
import { OSMService } from '../../../../server/services/osm-service';
import { CITY_PRESETS } from '../../../../lib/map-presets';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const cityId = body.cityId || 'abu-dhabi';
  const hotspotHexes = body.hotspotHexes || [];
  const preset = CITY_PRESETS.find(p => p.id === cityId) || CITY_PRESETS[0];

  try {
    const buildings = await OSMService.getBuildingsForHotspots(
      cityId,
      preset.coordinates.latitude,
      preset.coordinates.longitude,
      hotspotHexes
    );
    return NextResponse.json({
      city: preset.name,
      totalBuildingsAudited: buildings.length,
      buildings
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
