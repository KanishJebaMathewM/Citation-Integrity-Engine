# 3-Minute Hackathon Demo Script (Shot-by-Shot)

**0:00–0:20 — Problem Framing**
> "Existing citation tools check if a paper exists. They don't check if the cited paper *actually supports* what's claimed. That gap is Citation Integrity Engine (CIE)."

**0:20–0:40 — Architecture & LangGraph State Machine**
> "CIE uses an explicit LangGraph state machine with 5 nodes: Extraction, Retrieval via arXiv/PMC, and an adversarial Critic vs Red-Team agent pair that must agree before a claim is verified."

**0:40–2:00 — Live Run & Comparative Audit**
> Upload arXiv ID `1706.03762`.
> Watch live agent trace stream.
> Land on Trust Report dashboard: Show Trust Score Gauge (80/100).
> Click into FLAGGED claim: Show side-by-side Critic (`PARTIAL`) vs Red-Team (`CONTRADICTS`) justifications quoting positional encoding details.

**2:00–2:35 — Cost & Token Accounting**
> Open Cost Breakdown Screen.
> Highlight token usage table: ~$0.00089 per paper by reserving primary models strictly for judgment tasks.

**2:35–3:00 — Honest Scope & Closing**
> Highlight open access retrieval boundaries (`UNVERIFIABLE` for paywalls) and human-in-the-loop auditability.
