/**
 * Deterministic Microclimate Thermodynamics & Financial Modeling Engine
 * Reference: Microclimate Urban Morphology (Oke, 1982), EPA UHI Guidelines,
 * CRRC Cool Roof Standards, USDA UFORE Model, DOE Commercial Building Benchmarks,
 * and ACI 305R Hot Weather Concreting.
 */

export function calculateStructuralPriorityScore(
  roofAreaSqm: number,
  currentAlbedo: number,
  canopy50mCoveragePct: number
): number {
  const heatAbsorptionRate = Math.max(0, 1 - currentAlbedo);
  const canopyOffset = Math.max(0.01, canopy50mCoveragePct / 100) + 0.1;
  const rawScore = (roofAreaSqm * heatAbsorptionRate) / canopyOffset;
  // Normalize score between 0 and 100 for intuitive municipal ranking
  return Math.min(100, Math.round((rawScore / 15000) * 100));
}

export function calculateCoolRoofDeltaF(
  roofAreaSqm: number,
  currentAlbedo: number,
  targetAlbedo: number
): number {
  const albedoShift = Math.max(0, targetAlbedo - currentAlbedo);
  // Formula: 2.5°F cooling per 1,000 m² multiplied by net albedo shift
  const deltaF = (roofAreaSqm / 1000) * 2.5 * albedoShift;
  return Number(deltaF.toFixed(2));
}

export function calculateCanopyDeltaF(addedCanopyAreaSqm: number): number {
  if (addedCanopyAreaSqm <= 0) return 0;
  // Formula: 1.0°F baseline shade + 2.2°F per 5,000 m² of evapotranspirative canopy
  const deltaF = 1.0 + (addedCanopyAreaSqm / 5000) * 2.2;
  return Number(deltaF.toFixed(2));
}

export function calculateTotalCoolingDelta(
  roofAreaSqm: number,
  currentAlbedo: number,
  targetAlbedo: number,
  addedCanopyAreaSqm: number
): { totalDeltaF: number; coolRoofDeltaF: number; canopyDeltaF: number } {
  const coolRoofDeltaF = calculateCoolRoofDeltaF(roofAreaSqm, currentAlbedo, targetAlbedo);
  const canopyDeltaF = calculateCanopyDeltaF(addedCanopyAreaSqm);
  // Combined microclimate cooling with slight non-linear diminishing returns overlap factor
  const overlapFactor = addedCanopyAreaSqm > 0 && roofAreaSqm > 0 ? 0.92 : 1.0;
  const totalDeltaF = Number(((coolRoofDeltaF + canopyDeltaF) * overlapFactor).toFixed(2));
  return { totalDeltaF, coolRoofDeltaF, canopyDeltaF };
}

export function calculateEnergyAndROI(
  retrofittedRoofAreaSqm: number,
  addedCanopyAreaSqm: number = 0,
  coolRoofCostPerSqmUsd: number = 14.50,
  annualSavingsPerSqmUsd: number = 4.50
): {
  annualHvacSavingsUsd: number;
  annualKwhSaved: number;
  totalInstallationCostUsd: number;
  paybackPeriodYears: number;
  co2ReductionTonsPerYear: number;
} {
  const annualHvacSavingsUsd = retrofittedRoofAreaSqm * annualSavingsPerSqmUsd;
  // ~30 kWh offset per m² of cool roof per DOE Commercial Building benchmarks
  const annualKwhSaved = retrofittedRoofAreaSqm * 30 + addedCanopyAreaSqm * 12;
  const totalInstallationCostUsd = retrofittedRoofAreaSqm * coolRoofCostPerSqmUsd + addedCanopyAreaSqm * 8.0;
  const paybackPeriodYears = annualHvacSavingsUsd > 0 
    ? Number((totalInstallationCostUsd / annualHvacSavingsUsd).toFixed(1))
    : 0;
  // Carbon intensity: ~0.42 kg CO2 per kWh
  const co2ReductionTonsPerYear = Number(((annualKwhSaved * 0.42) / 1000).toFixed(1));

  return {
    annualHvacSavingsUsd: Math.round(annualHvacSavingsUsd),
    annualKwhSaved: Math.round(annualKwhSaved),
    totalInstallationCostUsd: Math.round(totalInstallationCostUsd),
    paybackPeriodYears,
    co2ReductionTonsPerYear
  };
}

/**
 * ACI 305R Evaporation Rate for Concrete Plastic Shrinkage Cracking
 * E = 5 * ([Tc + 18]^2.5 - r * [Ta + 18]^2.5) * (V + 4) * 10^-6 (kg/m²/hr)
 */
export function calculateConcreteEvaporationRate(
  ambientAirTempC: number,
  concreteTempC: number,
  relativeHumidityPct: number,
  windSpeedKmh: number
): { evaporationRateKgM2Hr: number; riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE' } {
  const r = relativeHumidityPct / 100;
  const term1 = Math.pow(concreteTempC + 18, 2.5);
  const term2 = r * Math.pow(ambientAirTempC + 18, 2.5);
  const windFactor = windSpeedKmh + 4;
  const E = Math.max(0, 5 * (term1 - term2) * windFactor * 1e-6);
  const evaporationRateKgM2Hr = Number(E.toFixed(2));

  let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE' = 'SAFE';
  if (evaporationRateKgM2Hr >= 1.0) riskLevel = 'CRITICAL';
  else if (evaporationRateKgM2Hr >= 0.75) riskLevel = 'HIGH';
  else if (evaporationRateKgM2Hr >= 0.5) riskLevel = 'MODERATE';
  else if (evaporationRateKgM2Hr >= 0.25) riskLevel = 'LOW';

  return { evaporationRateKgM2Hr, riskLevel };
}
