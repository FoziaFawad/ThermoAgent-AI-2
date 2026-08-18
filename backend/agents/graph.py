from langgraph.graph import StateGraph, START, END
from backend.models.state import ThermoAgentState
from backend.agents.nodes import (
    supervisor_node,
    sentinel_node,
    auditor_node,
    physicist_node,
    synthesizer_node
)

def build_graph() -> StateGraph:
    """
    Constructs the LangGraph workflow for ThermoAgent-AI.
    Linear pipeline: Supervisor -> Sentinel -> Auditor -> Physicist -> Synthesizer -> END
    """
    workflow = StateGraph(ThermoAgentState)
    
    # Add nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("sentinel", sentinel_node)
    workflow.add_node("auditor", auditor_node)
    workflow.add_node("physicist", physicist_node)
    workflow.add_node("synthesizer", synthesizer_node)
    
    # Add edges
    workflow.add_edge(START, "supervisor")
    workflow.add_edge("supervisor", "sentinel")
    workflow.add_edge("sentinel", "auditor")
    workflow.add_edge("auditor", "physicist")
    workflow.add_edge("physicist", "synthesizer")
    workflow.add_edge("synthesizer", END)
    
    return workflow.compile()

# The compiled application
app_graph = build_graph()
