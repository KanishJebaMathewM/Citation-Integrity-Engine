from backend.graph.nodes.entailment_critic import entailment_critic_node
from backend.graph.nodes.adversarial_redteam import adversarial_redteam_node

def test_critic_and_redteam_nodes():
    state = {
        "claims": [{
            "id": "c1",
            "claim_text": "Self-attention completely eliminates positional recurrence.",
            "citation_marker": "[2]",
            "citation_key": "[2]",
            "location": "p1",
            "surrounding_context": ""
        }],
        "current_claim_index": 0,
        "current_evidence": {
            "matched_passage": "Self-attention replaces recurrence but positional encodings are required for sequence order."
        },
        "cost_log": []
    }
    
    state_critic = entailment_critic_node(state)
    verdict_c = state_critic.get("current_critic_verdict")
    assert verdict_c["agent"] == "critic"
    assert verdict_c["label"] in ["ENTAILS", "PARTIAL", "CONTRADICTS", "UNADDRESSED"]

    state_redteam = adversarial_redteam_node(state_critic)
    verdict_r = state_redteam.get("current_redteam_verdict")
    assert verdict_r["agent"] == "redteam"
    assert verdict_r["label"] in ["ENTAILS", "PARTIAL", "CONTRADICTS", "UNADDRESSED"]
