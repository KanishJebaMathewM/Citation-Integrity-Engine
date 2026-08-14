import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes_runs import router as runs_router
from backend.api.routes_reports import router as reports_router
from backend.config import settings

app = FastAPI(
    title="Citation Integrity Engine (CIE) API",
    description="Multi-agent citation verification platform with adversarial Red-Team and LangGraph state machine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(runs_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "name": "Citation Integrity Engine API",
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.BACKEND_PORT, reload=True)
