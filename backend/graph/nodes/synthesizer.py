import os
import json
from datetime import datetime
from backend.graph.state import GraphState
from backend.cost.tracker import call_llm
from backend.config import settings

LABEL_SCORES = {
    "ENTAILS": 100,
    "PARTIAL": 60,
    "UNADDRESSED": 30,
    "CONTRADICTS": 0
}

def synthesizer_node(state: GraphState) -> GraphState:
    """Aggregate per-claim verdicts, compute paper Trust Score, and generate final report."""
    results = state.get("claim_results", [])
    
    total_claims = len(results)
    resolved_count = 0
    flagged_count = 0
    unverifiable_count = 0
    
    scores = []
    
    for r in results:
        res_status = r["resolution"]
        if res_status == "UNVERIFIABLE":
            unverifiable_count += 1
            continue
            
        critic_score = LABEL_SCORES.get(r["critic_verdict"].get("label", "UNADDRESSED"), 30)
        redteam_score = LABEL_SCORES.get(r["redteam_verdict"].get("label", "UNADDRESSED"), 30)
        
        if res_status == "RESOLVED":
            resolved_count += 1
            scores.append(critic_score)
        elif res_status == "FLAGGED":
            flagged_count += 1
            scores.append((critic_score + redteam_score) / 2.0)
            
    paper_trust_score = round(sum(scores) / max(1, len(scores)), 1) if scores else 0.0
    
    # Run synthesizer prompt for summary
    prompt_path = os.path.join("backend", "prompts", "synthesizer.txt")
    summary_text = "Analysis completed. Evaluation details included in report."
    
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()
        
        prompt = prompt_template.replace("{claim_results_json}", json.dumps(results[:5]))
        res = call_llm(settings.UTILITY_MODEL_NAME, prompt, "synthesizer", state)
        summary_text = res.get("summary", summary_text)
    except Exception as e:
        print(f"Synthesizer call failed: {e}")

    cost_log = state.get("cost_log", [])
    total_cost_usd = round(sum(item.get("estimated_cost_usd", 0.0) for item in cost_log), 5)

    trust_report = {
        "paper_id": state.get("paper_id", "paper-1"),
        "paper_title": "Citation Integrity Evaluation Paper",
        "trust_score": paper_trust_score,
        "total_claims": total_claims,
        "resolved_count": resolved_count,
        "flagged_count": flagged_count,
        "unverifiable_count": unverifiable_count,
        "summary": summary_text,
        "claim_results": results,
        "cost_log": cost_log,
        "total_cost_usd": total_cost_usd,
        "generated_at": datetime.now().isoformat()
    }

    state["trust_report"] = trust_report

    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "synthesizer",
        "summary": f"Synthesized final Trust Report. Score: {paper_trust_score}/100. Total cost: ${total_cost_usd}.",
        "timestamp": datetime.now().isoformat()
    })

    return state
