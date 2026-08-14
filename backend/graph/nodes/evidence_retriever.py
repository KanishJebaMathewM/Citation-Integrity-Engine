from backend.graph.state import GraphState, Evidence
from backend.retrieval.arxiv_client import fetch_arxiv_passage
from backend.retrieval.pmc_client import fetch_pmc_passage
from backend.retrieval.passage_matcher import match_passage

def evidence_retriever_node(state: GraphState) -> GraphState:
    """Retrieve cited source passage for the current active claim."""
    idx = state["current_claim_index"]
    claims = state["claims"]
    
    if idx >= len(claims):
        return state
        
    current_claim = claims[idx]
    citation_key = current_claim["citation_key"]
    references = state.get("references", {})
    ref_text = references.get(citation_key, f"Reference string for {citation_key}")

    # Attempt arXiv lookup first, then PMC API
    retrieval_data = fetch_arxiv_passage(citation_key, ref_text)
    if retrieval_data["status"] != "found":
        retrieval_data = fetch_pmc_passage(citation_key, ref_text)

    # Match passage using TF-IDF similarity matcher
    source_raw = retrieval_data.get("raw_source_text", "")
    matched_p, confidence = match_passage(current_claim["claim_text"], source_raw, ref_text)

    evidence: Evidence = {
        "claim_id": current_claim["id"],
        "source_title": retrieval_data.get("source_title", f"Cited paper for {citation_key}"),
        "source_url": retrieval_data.get("source_url", "https://arxiv.org"),
        "matched_passage": matched_p,
        "retrieval_method": retrieval_data.get("retrieval_method", "reference_match"),
        "retrieval_confidence": confidence,
        "status": "found" if matched_p else "retrieval_failed"
    }

    if "current_evidence" not in state:
        state["current_evidence"] = {}
    state["current_evidence"] = evidence

    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "evidence_retriever",
        "summary": f"Retrieved passage for {citation_key} via {evidence['retrieval_method']} (confidence {confidence}).",
        "timestamp": ""
    })

    return state
