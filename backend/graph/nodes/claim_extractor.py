import os
import uuid
import re
from backend.graph.state import GraphState, Claim
from backend.cost.tracker import call_llm
from backend.config import settings

def claim_extractor_node(state: GraphState) -> GraphState:
    """Parse raw paper text and extract citation-backed claims."""
    raw_text = state.get("raw_text", "")
    prompt_path = os.path.join("backend", "prompts", "claim_extractor.txt")
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    # Find paragraphs containing citation markers e.g. [1], [2], (Author, 2020)
    paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip()]
    candidate_paragraphs = [
        p for p in paragraphs 
        if re.search(r"\[\d+\]|\([A-Za-z]+\s+et\s+al\.,?\s*\d{4}\)", p)
    ]
    
    if not candidate_paragraphs:
        # If regex missed, check top paragraphs
        candidate_paragraphs = paragraphs[:3]

    extracted_claims = []
    
    for idx, para in enumerate(candidate_paragraphs[:5]):  # Process up to 5 paragraphs
        prompt = prompt_template.replace("{paragraph_text}", para)
        res = call_llm(settings.UTILITY_MODEL_NAME, prompt, "claim_extractor", state)
        
        raw_claims = res.get("claims", [])
        for c in raw_claims:
            marker = c.get("citation_marker", "[1]")
            claim_obj: Claim = {
                "id": f"claim-{uuid.uuid4().hex[:8]}",
                "claim_text": c.get("claim_text", ""),
                "citation_marker": marker,
                "citation_key": marker,
                "location": f"Paragraph {idx + 1}",
                "surrounding_context": para[:250] + "..."
            }
            extracted_claims.append(claim_obj)

    # Deduplicate claims
    seen_texts = set()
    unique_claims = []
    for c in extracted_claims:
        if c["claim_text"] not in seen_texts:
            seen_texts.add(c["claim_text"])
            unique_claims.append(c)

    state["claims"] = unique_claims
    state["current_claim_index"] = 0
    
    if "trace_events" not in state:
        state["trace_events"] = []
    state["trace_events"].append({
        "node": "claim_extractor",
        "summary": f"Extracted {len(unique_claims)} citation-backed claims from paper.",
        "timestamp": os.getenv("CURRENT_TIME", "")
    })
    
    return state
