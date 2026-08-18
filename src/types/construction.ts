export type CuringRiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE';

export interface ConcreteCuringConditions {
  ambientAirTempC: number;
  concreteMixTempC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  solarRadiationWm2: number;
}

export interface PourScheduleSlot {
  time: string; // e.g. "02:00 - 06:00"
  date: string;
  expectedTempC: number;
  expectedHumidityPct: number;
  evaporationRateKgM2Hr: number;
  riskLevel: CuringRiskLevel;
  recommendation: string;
  isSafeWindow: boolean;
}

export interface AdmixtureRecommendation {
  type: string;
  dosage: string;
  impact: string;
  estimatedCostUsd: number;
  savingsFromRemediationAvoidanceUsd: number;
}

export interface ConstructionAuditReport {
  zoneId: string;
  siteName: string;
  currentEvaporationRate: number; // ACI 305R kg/m2/hr (threshold 1.0 kg/m2/hr)
  riskLevel: CuringRiskLevel;
  plasticShrinkageIndex: number;
  safeWindows: PourScheduleSlot[];
  admixtures: AdmixtureRecommendation[];
  waterChillingRequiredC: number;
  summaryNote: string;
}
