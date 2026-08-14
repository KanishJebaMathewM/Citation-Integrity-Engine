from langgraph.graph import StateGraph, END
from backend.graph.state import GraphState
from backend.graph.nodes.claim_extractor import claim_extractor_node
from backend.graph.nodes.evidence_retriever import evidence_retriever_node
from backend.graph.nodes.entailment_critic import entailment_critic_node
from backend.graph.nodes.adversarial_redteam import adversarial_redteam_node
from backend.graph.nodes.resolve_claim import resolve_claim_node
from backend.graph.nodes.advance_claim import advance_claim_node
from backend.graph.nodes.synthesizer import synthesizer_node

def build_citation_graph():
    """Construct explicit LangGraph StateGraph for Citation Integrity Engine."""
    graph = StateGraph(GraphState)

    graph.add_node("extract_claims", claim_extractor_node)
    graph.add_node("retrieve_evidence", evidence_retriever_node)
    graph.add_node("critic_judge", entailment_critic_node)
    graph.add_node("redteam_judge", adversarial_redteam_node)
    graph.add_node("resolve_claim", resolve_claim_node)
    graph.add_node("advance_or_finish", advance_claim_node)
    graph.add_node("synthesize", synthesizer_node)

    graph.set_entry_point("extract_claims")

    graph.add_edge("extract_claims", "retrieve_evidence")
    graph.add_edge("retrieve_evidence", "critic_judge")
    graph.add_edge("critic_judge", "redteam_judge")
    graph.add_edge("redteam_judge", "resolve_claim")
    graph.add_edge("resolve_claim", "advance_or_finish")

    # Conditional edge: loop back to next claim or advance to synthesis
    def route_next(state: GraphState) -> str:
        idx = state.get("current_claim_index", 0)
        claims = state.get("claims", [])
        if idx < len(claims):
            return "retrieve_evidence"
        return "synthesize"

    graph.add_conditional_edges(
        "advance_or_finish",
        route_next,
        {
            "retrieve_evidence": "retrieve_evidence",
            "synthesize": "synthesize"
        }
    )

    graph.add_edge("synthesize", END)

    return graph.compile()
