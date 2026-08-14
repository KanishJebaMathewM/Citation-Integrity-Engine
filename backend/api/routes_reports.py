from fastapi import APIRouter, HTTPException
from backend.db.models import get_run

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/{run_id}")
async def get_report(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Report not found")
    if run["status"] != "completed" or not run.get("trust_report"):
        raise HTTPException(status_code=400, detail="Report is not completed yet")
    return run["trust_report"]

@router.get("/{run_id}/cost")
async def get_report_cost(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    cost_log = run.get("cost_log", [])
    total_cost = sum(item.get("estimated_cost_usd", 0.0) for item in cost_log)
    return {
        "run_id": run_id,
        "cost_log": cost_log,
        "total_cost_usd": round(total_cost, 5)
    }
