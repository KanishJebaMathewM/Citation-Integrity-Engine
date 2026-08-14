# Citation Integrity Engine (CIE) — 200-Word Project Summary

The **Citation Integrity Engine (CIE)** is a multi-agent research verification system designed to solve citation misrepresentation in academic literature. Traditional reference tools only verify citation existence and formatting. CIE evaluates semantic entailment — determining whether a cited source passage genuinely supports the specific factual assertion made about it.

Built as an explicit **LangGraph state machine**, CIE orchestrates five specialized agent nodes: Claim Extraction, arXiv/PMC Passage Retrieval, Entailment Critic, Adversarial Red-Team, and Synthesis. To prevent self-confirmation bias, an independent Red-Team agent cross-examines every claim without seeing the Critic's verdict. When agents disagree, the claim is not averaged away or hallucinated; it is routed to a `FLAGGED` state for human review.

CIE features real-time agent trace streaming, a transparent token/USD cost accounting system ($<0.001 per paper run), an intuitive Trust Score formula (0–100), and a side-by-side comparative UI highlighting quoted source passages. By providing verifiable, inspectable evidence chains, CIE empowers researchers, journal editors, and peer reviewers to audit scientific literature with speed, rigor, and complete transparency.
