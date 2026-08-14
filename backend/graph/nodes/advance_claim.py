from backend.graph.state import GraphState

def advance_claim_node(state: GraphState) -> GraphState:
    """Increment claim iteration index."""
    state["current_claim_index"] = state.get("current_claim_index", 0) + 1
    return state
