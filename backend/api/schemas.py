from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class RunCreateRequest(BaseModel):
    input_type: str  # "pdf" or "arxiv_id"
    arxiv_id: Optional[str] = None
    file_name: Optional[str] = None

class RunCreateResponse(BaseModel):
    run_id: str
    status: str

class RunStatusResponse(BaseModel):
    run_id: str
    status: str  # "queued", "running", "completed", "failed"
    current_step: str
    claims_total: int
    claims_processed: int

class TraceResponse(BaseModel):
    run_id: str
    events: List[Dict[str, Any]]
