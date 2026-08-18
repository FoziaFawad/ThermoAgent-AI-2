import os
from dotenv import load_dotenv

# Load the environment variables from .env.local in the root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env.local"))

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import json
import asyncio

from backend.agents.graph import app_graph
from backend.models.state import BoundingBox

app = FastAPI(title="ThermoAgent-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/run-supervisor-stream")
async def run_supervisor_stream(bbox: BoundingBox):
    """
    Kicks off the LangGraph multi-agent workflow and streams the state transitions 
    via Server-Sent Events (SSE) back to the Next.js UI.
    """
    
    async def event_generator():
        initial_state = {
            "bbox": bbox,
            "messages": []
        }
        
        try:
            # For each step in the graph stream, yield an update
            for step in app_graph.stream(initial_state, stream_mode="updates"):
                for node_name, node_state in step.items():
                    
                    # Extract the latest message content safely
                    msg_content = ""
                    if 'messages' in node_state and len(node_state['messages']) > 0:
                        msg_content = node_state['messages'][-1].content
                    
                    payload = {
                        "agent": node_name,
                        "status": "completed",
                        "message": msg_content,
                        "state_diff": {k: v for k, v in node_state.items() if k != 'messages'}
                    }
                    
                    yield {
                        "event": "message",
                        "id": "message_id",
                        "retry": 15000,
                        "data": json.dumps(payload)
                    }
                    await asyncio.sleep(1.0)
                    
            # Send completion event
            yield {
                "event": "done",
                "data": json.dumps({"status": "workflow_complete"})
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)})
            }
            
    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
