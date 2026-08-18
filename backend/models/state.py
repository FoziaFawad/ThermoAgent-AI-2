from typing import List, Dict, Any, Optional, Annotated
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
import operator

class BoundingBox(BaseModel):
    min_lon: float
    min_lat: float
    max_lon: float
    max_lat: float

class BuildingMetrics(BaseModel):
    id: str
    area_sqm: float
    albedo: float
    canopy_coverage_pct: float

class PhysicsResults(BaseModel):
    ambient_cooling_f: float
    hvac_savings_usd: float
    payback_years: float

class ThermoAgentState(TypedDict):
    """
    The state dictionary for the LangGraph multi-agent workflow.
    """
    messages: Annotated[list, add_messages]
    bbox: Optional[BoundingBox]
    
    # Sentinel Output
    h3_anomalies: List[str]
    regional_baseline_f: Optional[float]
    
    # Auditor Output
    building_metrics: List[BuildingMetrics]
    
    # Physicist Output
    physics_results: Optional[PhysicsResults]
    
    # Synthesizer Output
    executive_summary: Optional[str]
    mitigation_geojson: Optional[Dict[str, Any]]
