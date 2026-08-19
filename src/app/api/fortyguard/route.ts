import { NextRequest, NextResponse } from 'next/server';
import { FortyGuardService } from '../../../server/services/fortyguard-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || 'new-york-ny';
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const name = searchParams.get('name') || undefined;
  const tempStr = searchParams.get('temp');

  const options = {
    lat: latStr ? parseFloat(latStr) : undefined,
    lng: lngStr ? parseFloat(lngStr) : undefined,
    name,
    baselineAirTempF: tempStr ? parseFloat(tempStr) : undefined
  };

  try {
    const feed = await FortyGuardService.get2mThermalFeed(city, options);
    return NextResponse.json(feed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch FortyGuard thermal feed' }, { status: 500 });
  }
}
