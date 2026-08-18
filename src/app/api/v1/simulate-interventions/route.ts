import { NextRequest, NextResponse } from 'next/server';
import { calculateTotalCoolingDelta, calculateEnergyAndROI } from '../../../../lib/thermal-math';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const totalRoofAreaSqm = body.totalRoofAreaSqm || 15000;
  const currentAlbedo = body.currentAlbedo || 0.15;
  const targetAlbedo = body.targetAlbedo || 0.85;
  const addedCanopyAreaSqm = body.addedCanopyAreaSqm || 5000;

  const cooling = calculateTotalCoolingDelta(
    totalRoofAreaSqm,
    currentAlbedo,
    targetAlbedo,
    addedCanopyAreaSqm
  );

  const roi = calculateEnergyAndROI(
    totalRoofAreaSqm,
    addedCanopyAreaSqm
  );

  return NextResponse.json({
    cooling,
    roi,
    timestamp: new Date().toISOString()
  });
}
