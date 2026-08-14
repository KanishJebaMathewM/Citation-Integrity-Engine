import uuid
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import Optional

from backend.api.schemas import RunCreateResponse, RunStatusResponse, TraceResponse
from backend.db.models import save_run, get_run
from backend.parsing.pdf_parser import parse_pdf_bytes, fetch_arxiv_text_and_refs
from backend.graph.build_graph import build_citation_graph

router = APIRouter(prefix="/api/runs", tags=["runs"])
citation_app = build_citation_graph()

def execute_pipeline(run_id: str, raw_text: str, references: dict):
    save_run(run_id, {
        "run_id": run_id,
        "status": "running",
        "current_step": "extract_claims",
        "claims_total": 0,
        "claims_processed": 0,
        "trace_events": [],
        "cost_log": [],
        "trust_report": None
    })
    
    initial_state = {
        "paper_id": run_id,
        "raw_text": raw_text,
        "references": references,
        "claims": [],
        "current_claim_index": 0,
        "claim_results": [],
        "cost_log": [],
        "trust_report": None,
        "trace_events": []
    }
    
    try:
        final_state = citation_app.invoke(initial_state)
        save_run(run_id, {
            "run_id": run_id,
            "status": "completed",
            "current_step": "completed",
            "claims_total": len(final_state.get("claims", [])),
            "claims_processed": len(final_state.get("claim_results", [])),
            "trace_events": final_state.get("trace_events", []),
            "cost_log": final_state.get("cost_log", []),
            "trust_report": final_state.get("trust_report", {})
        })
    except Exception as e:
        print(f"Run {run_id} failed: {e}")
        save_run(run_id, {
            "run_id": run_id,
            "status": "failed",
            "current_step": f"error: {str(e)}",
            "claims_total": 0,
            "claims_processed": 0,
            "trace_events": [{"node": "error", "summary": str(e)}],
            "cost_log": [],
            "trust_report": None
        })

@router.post("", response_model=RunCreateResponse)
async def create_run(
    background_tasks: BackgroundTasks,
    input_type: str = Form(...),
    arxiv_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    run_id = f"run-{uuid.uuid4().hex[:8]}"
    
    if input_type == "arxiv_id" and arxiv_id:
        raw_text, references = fetch_arxiv_text_and_refs(arxiv_id)
    elif input_type == "pdf" and file:
        content = await file.read()
        raw_text, references = parse_pdf_bytes(content)
    else:
        # Default sample run text
        raw_text, references = fetch_arxiv_text_and_refs("sample")
        
    background_tasks.add_task(execute_pipeline, run_id, raw_text, references)
    
    save_run(run_id, {
        "run_id": run_id,
        "status": "queued",
        "current_step": "queued",
        "claims_total": 0,
        "claims_processed": 0,
        "trace_events": [],
        "cost_log": [],
        "trust_report": None
    })
    
    return {"run_id": run_id, "status": "queued"}

@router.get("/{run_id}", response_model=RunStatusResponse)
async def get_run_status(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return {
        "run_id": run["run_id"],
        "status": run["status"],
        "current_step": run["current_step"],
        "claims_total": run.get("claims_total", 0),
        "claims_processed": run.get("claims_processed", 0)
    }

@router.get("/{run_id}/trace", response_model=TraceResponse)
async def get_run_trace(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return {
        "run_id": run_id,
        "events": run.get("trace_events", [])
    }
