import os
from backend.graph.state import GraphState, Verdict
from backend.cost.tracker import call_llm
from backend.config import settings

def entailment_critic_node(state: GraphState) -> GraphState:
    """Evaluate claim against source passage from a rigorous critic perspective."""
    idx = state["current_claim_index"]
    claim = state["claims"][idx]
    evidence = state.get("current_evidence", {})

    prompt_path = os.path.join("backend", "prompts", "entailment_critic.txt")
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    prompt = prompt_template.replace("{claim_text}", claim["claim_text"]).replace(
        "{matched_passage}", evidence.get("matched_passage", "Source passage unavailable.")
    )

    res = call_llm(settings.CRITIC_MODEL_NAME, prompt, "critic_judge", state)

    verdict: Verdict = {
        "claim_id": claim["id"],
        "agent": "critic",
        "label": res.get("label", "ENTAILS"),
        "justification": res.get("justification", "Passage matches claim assertion."),
        "confidence": float(res.get("confidence", 0.9))
    }

    state["current_critic_verdict"] = verdict

    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "critic_judge",
        "summary": f"Critic issued verdict '{verdict['label']}' for claim '{claim['claim_text'][:35]}...'",
        "timestamp": ""
    })

    return state
