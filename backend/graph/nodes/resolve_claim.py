from backend.graph.state import GraphState, ClaimResult

def resolve_claim_node(state: GraphState) -> GraphState:
    """Compare Critic and Red-Team verdicts and route claim resolution status."""
    idx = state["current_claim_index"]
    claim = state["claims"][idx]
    evidence = state.get("current_evidence", {})
    critic_v = state.get("current_critic_verdict", {})
    redteam_v = state.get("current_redteam_verdict", {})

    if evidence.get("status") == "retrieval_failed":
        resolution = "UNVERIFIABLE"
    elif critic_v.get("label") == redteam_v.get("label"):
        resolution = "RESOLVED"
    else:
        resolution = "FLAGGED"

    result: ClaimResult = {
        "claim": claim,
        "evidence": evidence,
        "critic_verdict": critic_v,
        "redteam_verdict": redteam_v,
        "resolution": resolution
    }

    if "claim_results" not in state:
        state["claim_results"] = []
    state["claim_results"].append(result)

    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "resolve_claim",
        "summary": f"Claim '{claim['claim_text'][:35]}...' resolved as [{resolution}] (Critic: {critic_v.get('label')}, RedTeam: {redteam_v.get('label')}).",
        "timestamp": ""
    })

    return state
