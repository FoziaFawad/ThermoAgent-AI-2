from typing import List, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    min_lat: float = 24.8000
    max_lat: float = 24.9500
    min_lon: float = 67.0000
    max_lon: float = 67.1500

class HotspotCluster(BaseModel):
    cluster_id: str
    location_name: str
    latitude: float
    longitude: float
    ambient_temp_2m_c: float
    baseline_temp_c: float
    anomaly_delta_f: float
    status: str

class BuildingAuditData(BaseModel):
    asset_id: str
    asset_type: str
    roof_area_sqm: float
    baseline_albedo: float
    canopy_coverage_50m: float
    is_under_construction: bool = False
    priority_score: float

class SimulationRequest(BaseModel):
    location_name: str = "Karachi District Central Corridor"
    ambient_temp_2m_c: float = 41.8
    roof_area_sqm: float = 4500.0
    baseline_albedo: float = 0.18
    target_albedo: float = 0.85
    added_trees_count: int = 40
    solar_irradiance_w_m2: float = 950.0
    electricity_cost_per_kwh: float = 0.16
    concrete_volume_m3: Optional[float] = 350.0
    relative_humidity_percent: Optional[float] = 32.0
    wind_speed_kmh: Optional[float] = 16.0

class SimulationResults(BaseModel):
    temp_drop_cool_roof_c: float
    temp_drop_canopy_c: float
    total_ambient_temp_drop_c: float
    total_ambient_temp_drop_f: float
    annual_energy_savings_kwh: float
    annual_cost_savings_usd: float
    estimated_retrofit_capex_usd: float
    payback_period_years: float
    co2_avoided_tons_per_year: float

class ConcreteThermalAdvisory(BaseModel):
    evaporation_rate_kg_m2_hr: float
    risk_level: str
    curing_hazard_description: str
    recommended_pour_window: str
    required_admixtures: List[str]
    curing_methodology: str
    estimated_avoided_penalty_usd: float
    constructor_guidance_summary: str

class CompleteWorkflowResponse(BaseModel):
    timestamp: str
    detection_results: List[HotspotCluster]
    analysis_results: BuildingAuditData
    simulation_results: SimulationResults
    civil_advisory_results: ConcreteThermalAdvisory
