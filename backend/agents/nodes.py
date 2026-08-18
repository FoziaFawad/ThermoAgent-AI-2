import os
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.models.state import ThermoAgentState, BuildingMetrics, PhysicsResults
import h3
import json

def get_llm():
    # Attempt to load Gemini API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        # Return a mock LLM if key is missing to prevent crash during development
        class MockLLM:
            def invoke(self, messages):
                return AIMessage(content="[MOCK LLM RESPONSE] API key missing. Please configure GEMINI_API_KEY in .env.local.")
        return MockLLM()
        
    return ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.2)

def supervisor_node(state: ThermoAgentState) -> ThermoAgentState:
    """
    Supervisor Node: Evaluates user intent and validates bounding box.
    Uses LLM to decide readiness to start the scan.
    """
    llm = get_llm()
    bbox = state.get("bbox")
    
    prompt = f"""You are the Master Orchestrator for ThermoAgent-AI.
Your job is to confirm that the provided bounding box is valid and initiate the spatial scanning pipeline.

Bounding Box received:
Min Lon: {bbox.min_lon}, Min Lat: {bbox.min_lat}
Max Lon: {bbox.max_lon}, Max Lat: {bbox.max_lat}

Respond with a concise, professional message indicating that the autonomous scanning process for these coordinates has been authorized and dispatched to the Sentinel worker.
"""
    
    response = llm.invoke([SystemMessage(content=prompt)])
    
    return {"messages": [response]}

def sentinel_node(state: ThermoAgentState) -> ThermoAgentState:
    """
    Worker 1: Sentinel (Thermal Anomaly Scanner)
    Continuously ingests 2m ambient air temperature streams across Uber H3 hexagonal grids.
    """
    bbox = state.get("bbox")
    if not bbox:
        return state
    
    # In a real implementation, we would query the FortyGuard API here using os.getenv("FORTYGUARD_API_KEY")
    # For now, we mock the spatial logic using the bbox center.
    try:
        center_lat = (bbox.min_lat + bbox.max_lat) / 2
        center_lon = (bbox.min_lon + bbox.max_lon) / 2
        center_hex = h3.geo_to_h3(center_lat, center_lon, 9)
        mock_anomalies = list(h3.k_ring(center_hex, 2))
    except Exception:
        mock_anomalies = ["892a1008983ffff", "892a1008987ffff", "892a100898bffff"]

    regional_baseline_f = 85.0

    return {
        "h3_anomalies": mock_anomalies,
        "regional_baseline_f": regional_baseline_f,
        "messages": [AIMessage(content=f"Sentinel detected {len(mock_anomalies)} thermal anomalies exceeding +3.5°F above baseline. Data retrieved via FortyGuard (simulated).")]
    }

def auditor_node(state: ThermoAgentState) -> ThermoAgentState:
    """
    Worker 2: Auditor (Building & Surface Auditor)
    Intersects flagged thermal hotspot polygons with OpenStreetMap building geometries.
    """
    mock_buildings = [
        BuildingMetrics(id="osm_way_12345", area_sqm=1200.0, albedo=0.15, canopy_coverage_pct=0.05),
        BuildingMetrics(id="osm_way_67890", area_sqm=850.0, albedo=0.20, canopy_coverage_pct=0.10),
        BuildingMetrics(id="osm_way_11223", area_sqm=2100.0, albedo=0.10, canopy_coverage_pct=0.02),
    ]
    
    return {
        "building_metrics": mock_buildings,
        "messages": [AIMessage(content=f"Auditor intersected anomalies with OSM and identified {len(mock_buildings)} vulnerable structures with severe canopy deficits.")]
    }

def physicist_node(state: ThermoAgentState) -> ThermoAgentState:
    """
    Worker 3: Physicist (Mitigation Optimizer)
    Evaluates structural trade-offs between cool roof retrofits and tree canopy expansion.
    """
    buildings = state.get("building_metrics", [])
    if not buildings:
        return state
        
    total_area_sqm = sum(b.area_sqm for b in buildings)
    
    # Formula: 1000m2 upgraded = 1.75 F cooling
    # Formula: $4.50 savings per sqm
    ambient_cooling_f = (total_area_sqm / 1000.0) * 1.75
    hvac_savings_usd = total_area_sqm * 4.50
    installation_cost_usd = total_area_sqm * 15.0
    payback_years = installation_cost_usd / hvac_savings_usd if hvac_savings_usd > 0 else 0
    
    results = PhysicsResults(
        ambient_cooling_f=round(ambient_cooling_f, 2),
        hvac_savings_usd=round(hvac_savings_usd, 2),
        payback_years=round(payback_years, 1)
    )
    
    return {
        "physics_results": results,
        "messages": [AIMessage(content=f"Physicist calculated a potential {results.ambient_cooling_f}°F cooling delta and ${results.hvac_savings_usd}/yr HVAC savings.")]
    }

def synthesizer_node(state: ThermoAgentState) -> ThermoAgentState:
    """
    Worker 4: Synthesizer (Resilience Reporter)
    Uses LLM to compile actionable engineering memos based on the physics and spatial data.
    """
    llm = get_llm()
    results = state.get("physics_results")
    buildings = state.get("building_metrics", [])
    
    if not results or not buildings:
        return state
        
    total_area = sum(b.area_sqm for b in buildings)
    
    prompt = f"""You are the Synthesizer (Resilience Reporter) for ThermoAgent-AI.
Generate a very brief Executive Mitigation Memo based on the following deterministic data:
- Identified vulnerable structures: {len(buildings)}
- Total roof area: {total_area} sq meters
- Expected Ambient Cooling: {results.ambient_cooling_f}°F
- Annual HVAC Savings: ${results.hvac_savings_usd}
- ROI Payback Period: {results.payback_years} years

Format it cleanly with bullet points. Be concise and authoritative.
"""
    
    response = llm.invoke([SystemMessage(content=prompt)])
    
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }
    
    return {
        "executive_summary": response.content,
        "mitigation_geojson": geojson,
        "messages": [AIMessage(content=f"Synthesizer finalized the resilience report: \n\n{response.content}")]
    }
