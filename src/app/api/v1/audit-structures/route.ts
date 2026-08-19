import { NextRequest, NextResponse } from 'next/server';
import { OSMService } from '../../../../server/services/osm-service';
import { CITY_PRESETS } from '../../../../lib/map-presets';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const cityId = body.cityId || 'new-york-ny';
  const hotspotHexes = body.hotspotHexes || [];
  const preset = CITY_PRESETS.find(p => p.id === cityId);

  const targetLat = body.lat ?? (preset ? preset.coordinates.latitude : 40.7484);
  const targetLng = body.lng ?? (preset ? preset.coordinates.longitude : -73.9851);
  const cityName = body.cityName || (preset ? preset.name : cityId);

  try {
    const buildings = await OSMService.getBuildingsForHotspots(
      cityId,
      targetLat,
      targetLng,
      hotspotHexes
    );
    return NextResponse.json({
      city: cityName,
      totalBuildingsAudited: buildings.length,
      buildings
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
