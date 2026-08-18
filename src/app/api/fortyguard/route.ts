import { NextRequest, NextResponse } from 'next/server';
import { FortyGuardService } from '../../../server/services/fortyguard-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || 'abu-dhabi';

  try {
    const feed = await FortyGuardService.get2mThermalFeed(city);
    return NextResponse.json(feed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch FortyGuard thermal feed' }, { status: 500 });
  }
}
