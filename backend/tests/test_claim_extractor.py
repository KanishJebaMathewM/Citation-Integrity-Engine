from backend.parsing.pdf_parser import fetch_arxiv_text_and_refs
from backend.graph.nodes.claim_extractor import claim_extractor_node

def test_claim_extractor():
    text, refs = fetch_arxiv_text_and_refs("sample")
    state = {
        "paper_id": "test-paper",
        "raw_text": text,
        "references": refs,
        "claims": [],
        "cost_log": []
    }
    
    out_state = claim_extractor_node(state)
    claims = out_state.get("claims", [])
    assert len(claims) > 0
    assert "claim_text" in claims[0]
    assert "citation_marker" in claims[0]
