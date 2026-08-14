from backend.graph.state import GraphState, Evidence
from backend.retrieval.arxiv_client import fetch_arxiv_passage
from backend.retrieval.pmc_client import fetch_pmc_passage
from backend.retrieval.tavily_client import fetch_tavily_passage
from backend.retrieval.passage_matcher import match_passage

def evidence_retriever_node(state: GraphState) -> GraphState:
    """Retrieve cited source passage using multi-tier paper search (arXiv -> PubMed -> Tavily)."""
    idx = state["current_claim_index"]
    claims = state["claims"]
    
    if idx >= len(claims):
        return state
        
    current_claim = claims[idx]
    citation_key = current_claim["citation_key"]
    references = state.get("references", {})
    ref_text = references.get(citation_key, f"Reference string for {citation_key}")

    # 1. Attempt arXiv lookup (Free, no API key required)
    retrieval_data = fetch_arxiv_passage(citation_key, ref_text)
    
    # 2. Attempt NCBI / PubMed Central lookup if arXiv didn't find the passage
    if retrieval_data.get("status") != "found":
        retrieval_data = fetch_pmc_passage(citation_key, ref_text)

    # 3. Attempt Tavily deep academic web search if still not found
    if retrieval_data.get("status") != "found":
        tavily_data = fetch_tavily_passage(citation_key, ref_text)
        if tavily_data.get("status") == "found":
            retrieval_data = tavily_data

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
