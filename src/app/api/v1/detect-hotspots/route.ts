import { NextRequest, NextResponse } from 'next/server';
import { FortyGuardService } from '../../../../server/services/fortyguard-service';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const city = body.city || 'abu-dhabi';
  try {
    const feed = await FortyGuardService.get2mThermalFeed(city);
    const hotspots = feed.readings.filter(r => r.isHotspot);
    return NextResponse.json({
      city: feed.city,
      baselineTempF: feed.baselineTempF,
      hotspotCount: hotspots.length,
      hotspots
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
