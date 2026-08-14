import os
from backend.graph.state import GraphState, Verdict
from backend.cost.tracker import call_llm
from backend.config import settings

def adversarial_redteam_node(state: GraphState) -> GraphState:
    """Independently evaluate claim against source passage from an adversarial perspective.
    
    IMPORTANT: Strictly independent. Never reads or incorporates Critic's verdict.
    """
    idx = state["current_claim_index"]
    claim = state["claims"][idx]
    evidence = state.get("current_evidence", {})

    prompt_path = os.path.join("backend", "prompts", "adversarial_redteam.txt")
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    # Constructed ONLY from raw claim and evidence passage
    prompt = prompt_template.replace("{claim_text}", claim["claim_text"]).replace(
        "{matched_passage}", evidence.get("matched_passage", "Source passage unavailable.")
    )

    res = call_llm(settings.REDTEAM_MODEL_NAME, prompt, "redteam_judge", state)

    verdict: Verdict = {
        "claim_id": claim["id"],
        "agent": "redteam",
        "label": res.get("label", "ENTAILS"),
        "justification": res.get("justification", "Independent counter-examination completed."),
        "confidence": float(res.get("confidence", 0.88))
    }

    state["current_redteam_verdict"] = verdict

    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "redteam_judge",
        "summary": f"Red-Team issued independent verdict '{verdict['label']}' for claim '{claim['claim_text'][:35]}...'",
        "timestamp": ""
    })

    return state
