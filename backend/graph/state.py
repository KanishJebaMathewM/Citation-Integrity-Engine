from typing import TypedDict, List, Literal, Optional

class Claim(TypedDict):
    id: str
    claim_text: str
    citation_marker: str
    citation_key: str
    location: str
    surrounding_context: str

class Evidence(TypedDict):
    claim_id: str
    source_title: str
    source_url: str
    matched_passage: str
    retrieval_method: str
    retrieval_confidence: float
    status: Literal["found", "retrieval_failed"]

class Verdict(TypedDict):
    claim_id: str
    agent: Literal["critic", "redteam"]
    label: Literal["ENTAILS", "PARTIAL", "CONTRADICTS", "UNADDRESSED"]
    justification: str
    confidence: float

class ClaimResult(TypedDict):
    claim: Claim
    evidence: Evidence
    critic_verdict: Verdict
    redteam_verdict: Verdict
    resolution: Literal["RESOLVED", "FLAGGED", "UNVERIFIABLE"]

class CostEntry(TypedDict):
    node: str
    model: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float

class GraphState(TypedDict):
    paper_id: str
    raw_text: str
    references: dict  # citation_key -> reference string
    claims: List[Claim]
    current_claim_index: int
    claim_results: List[ClaimResult]
    cost_log: List[CostEntry]
    trust_report: Optional[dict]
    trace_events: List[dict]
