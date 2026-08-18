import { NextRequest, NextResponse } from 'next/server';
import { CITY_PRESETS } from '../../../../../lib/map-presets';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get('city') || 'abu-dhabi';
  const preset = CITY_PRESETS.find(p => p.id === cityId) || CITY_PRESETS[0];

  const brief = {
    title: `ThermoAgent-AI Executive Resilience Brief: ${preset.name}`,
    generatedAt: new Date().toISOString(),
    jurisdiction: preset.name,
    microclimateBaseline: {
      ambientAir2mF: preset.baselineAirTempF,
      surfaceSkinLSTF: preset.baselineSurfaceTempF,
      disparityF: (preset.baselineSurfaceTempF - preset.baselineAirTempF).toFixed(1)
    },
    standardsComplied: [
      'CRRC-1 Cool Roof Rating Council Standard',
      'ASHRAE 90.1 Energy Standard for Commercial Buildings',
      'USDA UFORE Urban Forest Evapotranspiration Model',
      'ACI 305R Guide to Hot Weather Concreting'
    ],
    status: 'DEPLOYMENT_READY'
  };

  return NextResponse.json(brief);
}
