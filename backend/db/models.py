from typing import Dict, Any, Optional

# Simple thread-safe in-memory/JSON run storage for CIE runs
_RUNS_DB: Dict[str, Dict[str, Any]] = {}

def save_run(run_id: str, data: Dict[str, Any]) -> None:
    _RUNS_DB[run_id] = data

def get_run(run_id: str) -> Optional[Dict[str, Any]]:
    return _RUNS_DB.get(run_id)

def list_runs() -> Dict[str, Dict[str, Any]]:
    return _RUNS_DB
