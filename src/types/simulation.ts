export interface SimulationParameters {
  targetAlbedo: number; // 0.15 to 0.85
  targetCanopyPct: number; // 0% to 50%
  coolPavementEnabled: boolean;
  selectedZoneIds: string[];
}

export interface SimulationResult {
  baseAirTempF: number;
  simulatedAirTempF: number;
  deltaCoolingF: number;
  coolRoofCoolingF: number;
  canopyCoolingF: number;
  totalRoofAreaSqm: number;
  totalCanopyAreaSqm: number;
  annualHvacSavingsUsd: number;
  annualKwhSaved: number;
  installationCostUsd: number;
  paybackPeriodYears: number;
  co2ReductionTons: number;
}

export interface AuditedBuilding {
  id: string;
  name?: string;
  lat: number;
  lng: number;
  heightMeters: number;
  roofAreaSqm: number;
  currentAlbedo: number;
  canopy50mCoveragePct: number;
  priorityScore: number;
  h3ZoneId: string;
  hvacPenaltyKw: number;
  recommendedAction: 'Cool Roof Coating' | 'Green Roof' | 'Canopy Buffer' | 'Dual Retrofit';
}
