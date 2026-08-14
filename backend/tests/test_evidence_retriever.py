from backend.graph.nodes.evidence_retriever import evidence_retriever_node

def test_evidence_retriever():
    state = {
        "claims": [{
            "id": "c1",
            "claim_text": "Transformer models reduce training cost.",
            "citation_marker": "[1]",
            "citation_key": "[1]",
            "location": "p1",
            "surrounding_context": ""
        }],
        "current_claim_index": 0,
        "references": {"[1]": "Vaswani et al., Attention Is All You Need, 2017."},
        "cost_log": []
    }
    
    out_state = evidence_retriever_node(state)
    evidence = out_state.get("current_evidence", {})
    assert evidence["claim_id"] == "c1"
    assert "matched_passage" in evidence
    assert evidence["status"] == "found"
