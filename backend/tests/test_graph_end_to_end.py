from backend.graph.build_graph import build_citation_graph
from backend.parsing.pdf_parser import fetch_arxiv_text_and_refs

def test_graph_end_to_end():
    graph = build_citation_graph()
    raw_text, refs = fetch_arxiv_text_and_refs("sample")
    
    initial_state = {
        "paper_id": "test-run-1",
        "raw_text": raw_text,
        "references": refs,
        "claims": [],
        "current_claim_index": 0,
        "claim_results": [],
        "cost_log": [],
        "trust_report": None,
        "trace_events": []
    }
    
    final_state = graph.invoke(initial_state)
    
    assert "trust_report" in final_state
    report = final_state["trust_report"]
    assert report["total_claims"] > 0
    assert 0 <= report["trust_score"] <= 100
    assert len(report["cost_log"]) > 0
    assert report["total_cost_usd"] >= 0.0
