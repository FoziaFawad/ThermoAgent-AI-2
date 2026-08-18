import { NextRequest, NextResponse } from 'next/server';
import { calculateConcreteEvaporationRate } from '../../../../lib/thermal-math';
import { ConstructionAuditReport, PourScheduleSlot, AdmixtureRecommendation } from '../../../../types/construction';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const ambientTempC = body.ambientTempC ?? 39.5;
  const concreteMixTempC = body.concreteMixTempC ?? 32.0;
  const relativeHumidityPct = body.relativeHumidityPct ?? 32;
  const windSpeedKmh = body.windSpeedKmh ?? 18.0;
  const siteName = body.siteName || 'Abu Dhabi Infrastructure Package 4A';

  const { evaporationRateKgM2Hr, riskLevel } = calculateConcreteEvaporationRate(
    ambientTempC,
    concreteMixTempC,
    relativeHumidityPct,
    windSpeedKmh
  );

  // Generate 24-hour pour schedule windows
  const scheduleSlots: PourScheduleSlot[] = [
    {
      time: '00:00 - 04:00',
      date: 'Tonight',
      expectedTempC: 28.0,
      expectedHumidityPct: 58,
      evaporationRateKgM2Hr: 0.28,
      riskLevel: 'LOW',
      recommendation: 'Optimal pour window. Minimal plastic shrinkage risk.',
      isSafeWindow: true
    },
    {
      time: '04:00 - 08:00',
      date: 'Early Morning',
      expectedTempC: 30.5,
      expectedHumidityPct: 49,
      evaporationRateKgM2Hr: 0.42,
      riskLevel: 'LOW',
      recommendation: 'Safe window. Standard curing compound required upon finish.',
      isSafeWindow: true
    },
    {
      time: '08:00 - 12:00',
      date: 'Morning Transition',
      expectedTempC: 36.0,
      expectedHumidityPct: 38,
      evaporationRateKgM2Hr: 0.78,
      riskLevel: 'HIGH',
      recommendation: 'Elevated evaporation. Windbreaks and sunshades mandatory.',
      isSafeWindow: false
    },
    {
      time: '12:00 - 16:00',
      date: 'Peak Solar Heat',
      expectedTempC: 41.2,
      expectedHumidityPct: 24,
      evaporationRateKgM2Hr: 1.35,
      riskLevel: 'CRITICAL',
      recommendation: 'HALT SLAB PLACEMENT. Exceeds ACI 305R critical threshold (1.0 kg/m²/hr). Severe micro-crack propagation.',
      isSafeWindow: false
    },
    {
      time: '16:00 - 20:00',
      date: 'Evening Cooling',
      expectedTempC: 35.0,
      expectedHumidityPct: 36,
      evaporationRateKgM2Hr: 0.65,
      riskLevel: 'MODERATE',
      recommendation: 'Pouring permissible with fog misting and chilled batch water.',
      isSafeWindow: true
    },
    {
      time: '20:00 - 24:00',
      date: 'Night Shift',
      expectedTempC: 31.0,
      expectedHumidityPct: 52,
      evaporationRateKgM2Hr: 0.35,
      riskLevel: 'SAFE',
      recommendation: 'High-quality curing conditions. Recommended primary shift.',
      isSafeWindow: true
    }
  ];

  const admixtures: AdmixtureRecommendation[] = [
    {
      type: 'Batch Water Chilling (Liquid Nitrogen / Ice Flakes)',
      dosage: 'Target concrete placement temp ≤ 28°C',
      impact: 'Reduces hydration peak exotherm by 4.2°C, cutting thermal gradient cracking.',
      estimatedCostUsd: 1450,
      savingsFromRemediationAvoidanceUsd: 38000
    },
    {
      type: 'Evaporation Retarder Spray (Monofilm)',
      dosage: 'Apply immediately post-screeding (1L / 25 m²)',
      impact: 'Reduces surface moisture loss by 78% during critical bleed period.',
      estimatedCostUsd: 650,
      savingsFromRemediationAvoidanceUsd: 22000
    },
    {
      type: 'Extended Set Retarding Admixture (ASTM C494 Type D)',
      dosage: '180 mL per 100 kg cementitious material',
      impact: 'Maintains 90-minute slump life under ambient temperatures > 38°C.',
      estimatedCostUsd: 820,
      savingsFromRemediationAvoidanceUsd: 15000
    }
  ];

  const waterChillingRequiredC = Math.max(0, Number((concreteMixTempC - 28.0).toFixed(1)));

  const report: ConstructionAuditReport = {
    zoneId: 'h3_zone_masdar_4a',
    siteName,
    currentEvaporationRate: evaporationRateKgM2Hr,
    riskLevel,
    plasticShrinkageIndex: Math.min(100, Math.round(evaporationRateKgM2Hr * 75)),
    safeWindows: scheduleSlots,
    admixtures,
    waterChillingRequiredC,
    summaryNote: riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
      ? `CRITICAL ALERT: Current ambient conditions produce an evaporation rate of ${evaporationRateKgM2Hr} kg/m²/hr, exceeding the ACI 305R threshold. Restrict pours to the designated safe night window (20:00 - 06:00).`
      : `Conditions currently within manageable limits. Standard curing protocols apply.`
  };

  return NextResponse.json(report);
}
