# CITATION INTEGRITY ENGINE (CIE)
## Master Build Plan — Research Agents Hack (IIT Madras / DoraHacks)
 
> Feed this entire file to your coding agent (Claude Code, Cursor, etc.) as the project spec.
> It is organized so an agent can work section-by-section, top to bottom, and check off
> each phase before moving to the next. Every section is self-contained enough to be
> handed over independently if you split work across teammates.
 
---
 
# TABLE OF CONTENTS
 
1. Executive Summary
2. Problem Statement & Why It Matters
3. Hackathon Fit Checklist (mapped to judging rubric)
4. System Overview (one-paragraph mental model)
5. High-Level Architecture Diagram (ASCII)
6. Agent Roster (roles, inputs, outputs, failure modes)
7. LangGraph State Machine Design
8. Data Models / Schemas
9. Tech Stack (full, with justification per choice)
10. Repository Structure
11. Environment & Configuration
12. Backend Design — Module by Module
13. Frontend Design — Screens & UX
14. API Contracts (REST endpoints)
15. Agent Prompts (verbatim, ready to paste)
16. Retrieval Layer Design (arXiv / PubMed Central)
17. Entailment Verdict Taxonomy
18. Adversarial Disagreement & Routing Logic
19. Cost & Token Accounting System
20. Trust Score Formula
21. Error Handling & Recovery Design
22. Testing Strategy
23. Evaluation Dataset (test papers)
24. Demo Script (3-minute video, shot by shot)
25. Submission Package Checklist
26. Day-by-Day Build Plan (4 days, hour-level)
27. Known Limitations & Honest Scoping Statement
28. Stretch Goals (only if time remains)
29. Risk Log & Fallback Plans
30. Glossary
---
 
# 1. EXECUTIVE SUMMARY
 
**Project name:** Citation Integrity Engine (CIE)
 
**One-liner:** A multi-agent system that doesn't just check whether a citation *exists* —
it checks whether the cited source *actually supports* the claim made about it, using an
adversarial two-agent verification pattern (a Critic and a Red-Team agent that must agree
before a claim is marked "verified"), orchestrated as an explicit, inspectable LangGraph
state machine.
 
**Track:** Citation Verification
 
**Core novelty:** Existing citation tools check *existence* and *retrievability*. CIE checks
*semantic entailment* — does the source passage actually say what the paper claims it says —
and does so through adversarial cross-examination between two independent agents rather than
a single LLM call producing a confidence score. Disagreement between the two agents is not
hidden or averaged away; it is surfaced as a first-class output ("flagged for human review"),
which is the auditability judges are explicitly told to look for.
 
**Target users:** Researchers doing literature review, peer reviewers, journal editors,
grad students building on prior work, and anyone auditing a paper's evidentiary chain
before relying on it.
 
**Deliverables required by the hackathon:**
- Public GitHub repo with source + setup instructions
- 3-minute demo video (YouTube unlisted or Loom)
- 200-word project summary
- Reproducibility section: models, APIs, datasets, estimated run cost, known limitations
---
 
# 2. PROBLEM STATEMENT & WHY IT MATTERS
 
Citations are the trust infrastructure of science. A reader who sees "[12]" after a claim
assumes, without checking, that source 12 actually supports that claim. In practice this
assumption is frequently wrong:
 
- Claims get **overstated** relative to their source ("X causes Y" cited to a paper that
  only found correlation).
- Claims get **cherry-picked** from a source that also reports contradicting findings.
- Citations get **copied forward** through citation chains, drifting further from the
  original evidence at each hop (a cites b, which actually got the number from c, and by
  the time it reaches a it's wrong).
- **Context stripping** — a caveated, narrow finding gets cited as a general, unqualified one.
No widely available automated tool checks this at the *semantic* level. Reference managers
check formatting. Citation-count tools check existence and popularity. Plagiarism checkers
check text reuse. None of them ask: "does source X, read in full, actually justify the
sentence that cites it?"
 
This is a real, well-defined, high-value research bottleneck — which directly satisfies the
30%-weighted "Research utility" judging criterion.
 
---
 
# 3. HACKATHON FIT CHECKLIST (mapped to judging rubric)
 
| Judging criterion | Weight | How CIE satisfies it |
|---|---|---|
| Research utility | 30% | Solves a documented, real problem (citation misrepresentation) with a concrete time-saving use case: auditing a paper's citations before relying on them. |
| Agent collaboration | 25% | 5 agents with strictly distinct roles; adversarial Critic vs Red-Team pattern is genuine collaboration/conflict, not a linear prompt chain; LangGraph conditional routing on disagreement demonstrates "recover from errors." |
| Working demo | 20% | Runs live end-to-end on a real published paper with a documented citation issue (see Section 23). |
| Cost efficiency | 15% | Explicit token/cost accounting per agent per claim; cheap model for retrieval/parsing, stronger model reserved only for entailment judgment. |
| Originality | 10% | Semantic entailment + adversarial cross-examination + explicit disagreement-routing is not "a generic research chatbot." |
 
Submission requirements checklist:
- [ ] Public repo (GitHub) with README, setup instructions, architecture diagram
- [ ] 3-minute demo video, unlisted YouTube or Loom
- [ ] 200-word project summary (problem, architecture, evidence sources, expected impact)
- [ ] Reproducibility section: models used, APIs, datasets, estimated run cost, limitations
- [ ] Architecture diagram (LangGraph exported graph, not hand-drawn)
- [ ] Agent execution trace (log of a real run, included in repo as example output)
- [ ] Evidence citations shown in output (quoted passage backing each verdict)
- [ ] Cost table (tokens + $ per run)
- [ ] At least one failure-case demo (a claim where Critic and Red-Team disagree)
---
 
# 4. SYSTEM OVERVIEW (mental model)
 
Input: a research paper (PDF or arXiv ID).
 
Step 1 — **Extract**: pull every citation-backed factual claim and its inline marker.
Step 2 — **Retrieve**: for each claim, fetch the actual cited source and locate the specific
passage (not just "the paper" — the paragraph/sentence that the citation should map to).
Step 3 — **Judge (Critic)**: an agent reads claim + passage and produces a verdict:
`ENTAILS`, `PARTIAL`, `CONTRADICTS`, or `UNADDRESSED`, with a justification quote.
Step 4 — **Challenge (Red-Team)**: a second, independently-prompted agent is given the same
claim + passage and told to argue the *opposite* position from whatever the Critic concluded,
producing its own verdict + justification.
Step 5 — **Route**: if Critic and Red-Team agree → claim is resolved automatically. If they
disagree → claim is routed to a `FLAGGED` state for human review, and both arguments are kept.
Step 6 — **Synthesize**: aggregate all per-claim verdicts into a paper-level Trust Report,
compute a Trust Score, and produce a cost/run log.
 
Output: a structured report (JSON + rendered HTML/UI) showing, per claim: the claim text,
the source passage, both agents' verdicts and justifications, final status, and — for the
paper as a whole — an aggregate trust score, a list of flagged claims needing human review,
and a full cost breakdown.
 
---
 
# 5. HIGH-LEVEL ARCHITECTURE DIAGRAM (ASCII)
 
```
                         ┌─────────────────────────┐
                         │   Input: PDF / arXiv ID  │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 1: Claim Extractor      │
                      │   (parses paper, extracts      │
                      │   claim + citation marker      │
                      │   pairs)                        │
                      └────────────┬───────────────────┘
                                      │  List[Claim]
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 2: Evidence Retriever    │
                      │   (fetches cited source,        │
                      │   locates matching passage)     │
                      └────────────┬───────────────────┘
                                      │  Claim + Evidence
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 3: Entailment Critic     │
                      │   (verdict + justification)     │
                      └────────────┬───────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 4: Adversarial Red-Team  │
                      │   (independent counter-verdict) │
                      └────────────┬───────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                          ▼
                 ┌───────────────┐         ┌──────────────────┐
                 │ Agree → RESOLVED │       │ Disagree → FLAGGED│
                 └───────┬───────┘         └─────────┬─────────┘
                         │                            │
                         └────────────┬───────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 5: Synthesizer           │
                      │   (trust score, cost log,       │
                      │   final report)                 │
                      └────────────┬───────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Output: JSON report + UI      │
                      └───────────────────────────────┘
```
 
This is implemented as an explicit **LangGraph `StateGraph`** with conditional edges at the
Critic/Red-Team comparison point — see Section 7.
 
---
 
# 6. AGENT ROSTER
 
## Agent 1 — Claim Extractor
- **Input:** raw paper text (post-PDF-parsing)
- **Output:** `List[Claim]` — each with `claim_text`, `citation_marker`, `citation_key`,
  `location` (page/section), `surrounding_context`
- **Model:** small/cheap model (e.g. Llama 4 8B-class or DeepSeek V4 lite tier)
- **Failure mode handled:** if no clear citation-bearing sentences found, returns empty list
  with a `status: "no_claims_found"` flag rather than hallucinating claims.
## Agent 2 — Evidence Retriever
- **Input:** one `Claim` (specifically its `citation_key`)
- **Output:** `Evidence` object — `source_title`, `source_url`, `matched_passage`,
  `retrieval_method`, `retrieval_confidence`
- **Tooling:** arXiv API, PubMed Central API (see Section 16). Not a pure LLM call — this
  agent has real tool access and must handle retrieval failure explicitly.
- **Failure mode handled:** source not found / paywalled / no matching passage located →
  returns `status: "retrieval_failed"`, claim is marked `UNVERIFIABLE`, not silently dropped.
## Agent 3 — Entailment Critic
- **Input:** `Claim` + `Evidence`
- **Output:** `Verdict` — one of `ENTAILS / PARTIAL / CONTRADICTS / UNADDRESSED`, plus a
  `justification` (quoted span from the passage) and a `confidence` (0-1, but see Section 20
  for why raw self-reported confidence is treated with skepticism)
- **Model:** the strongest model in your budget (this is the one place quality matters most)
## Agent 4 — Adversarial Red-Team
- **Input:** same `Claim` + `Evidence` as Agent 3, **not** shown Agent 3's verdict
  (independence matters — see Section 18 for why)
- **Output:** its own independent `Verdict` + `justification`
- **Model:** same tier as Critic, but can be a *different* model if budget allows (adds
  genuine diversity of judgment, strengthens the adversarial framing for judges)
## Agent 5 — Synthesizer
- **Input:** all resolved/flagged claims for a paper + full cost log
- **Output:** `TrustReport` — paper-level trust score, list of flagged claims, cost table,
  human-readable summary
- **Model:** small/cheap model — this is a formatting/aggregation task, not a judgment task
---
 
# 7. LANGGRAPH STATE MACHINE DESIGN
 
## State schema (shared across the graph)
 
```python
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
    claims: List[Claim]
    current_claim_index: int
    claim_results: List[ClaimResult]
    cost_log: List[CostEntry]
    trust_report: Optional[dict]
```
 
## Graph construction (pseudocode, ready to translate into `langgraph`)
 
```python
from langgraph.graph import StateGraph, END
 
graph = StateGraph(GraphState)
 
graph.add_node("extract_claims", claim_extractor_node)
graph.add_node("retrieve_evidence", evidence_retriever_node)
graph.add_node("critic_judge", entailment_critic_node)
graph.add_node("redteam_judge", adversarial_redteam_node)
graph.add_node("resolve_claim", resolve_claim_node)      # compares critic vs redteam
graph.add_node("advance_or_finish", advance_claim_node)  # loop control
graph.add_node("synthesize", synthesizer_node)
 
graph.set_entry_point("extract_claims")
 
graph.add_edge("extract_claims", "retrieve_evidence")
graph.add_edge("retrieve_evidence", "critic_judge")
graph.add_edge("critic_judge", "redteam_judge")
graph.add_edge("redteam_judge", "resolve_claim")
graph.add_edge("resolve_claim", "advance_or_finish")
 
# conditional: loop back to next claim, or move to synthesis if all claims processed
graph.add_conditional_edges(
    "advance_or_finish",
    lambda state: "retrieve_evidence" if state["current_claim_index"] < len(state["claims"]) else "synthesize",
    {
        "retrieve_evidence": "retrieve_evidence",
        "synthesize": "synthesize",
    },
)
 
graph.add_edge("synthesize", END)
 
app = graph.compile()
```
 
**Why this satisfies "genuine agent collaboration, recover from errors":**
- `resolve_claim` is the conditional-routing decision point — this is where you show judges
  a real branching decision based on agent disagreement, not a fixed pipeline.
- `retrieve_evidence` failure doesn't crash the graph — it routes the claim to
  `UNVERIFIABLE` and continues, which is your "recover from errors" evidence.
- Export the compiled graph's visualization (`app.get_graph().draw_mermaid_png()` or similar)
  and use it directly as your architecture diagram — this is *literally* the diagram judges
  asked for, generated from the real running system, not hand-drawn.
---
 
# 8. DATA MODELS / SCHEMAS
 
(Full JSON Schema versions of the TypedDicts above — for API contracts and frontend typing.)
 
### `claim.schema.json`
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "claim_text": { "type": "string" },
    "citation_marker": { "type": "string" },
    "citation_key": { "type": "string" },
    "location": { "type": "string" },
    "surrounding_context": { "type": "string" }
  },
  "required": ["id", "claim_text", "citation_marker", "citation_key"]
}
```
 
### `evidence.schema.json`
```json
{
  "type": "object",
  "properties": {
    "claim_id": { "type": "string" },
    "source_title": { "type": "string" },
    "source_url": { "type": "string" },
    "matched_passage": { "type": "string" },
    "retrieval_method": { "type": "string", "enum": ["arxiv_api", "pmc_api", "manual_upload"] },
    "retrieval_confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "status": { "type": "string", "enum": ["found", "retrieval_failed"] }
  }
}
```
 
### `verdict.schema.json`
```json
{
  "type": "object",
  "properties": {
    "claim_id": { "type": "string" },
    "agent": { "type": "string", "enum": ["critic", "redteam"] },
    "label": { "type": "string", "enum": ["ENTAILS", "PARTIAL", "CONTRADICTS", "UNADDRESSED"] },
    "justification": { "type": "string" },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
  }
}
```
 
### `trust_report.schema.json`
```json
{
  "type": "object",
  "properties": {
    "paper_id": { "type": "string" },
    "paper_title": { "type": "string" },
    "trust_score": { "type": "number", "minimum": 0, "maximum": 100 },
    "total_claims": { "type": "integer" },
    "resolved_count": { "type": "integer" },
    "flagged_count": { "type": "integer" },
    "unverifiable_count": { "type": "integer" },
    "claim_results": { "type": "array", "items": { "$ref": "claim_result.schema.json" } },
    "cost_log": { "type": "array", "items": { "$ref": "cost_entry.schema.json" } },
    "total_cost_usd": { "type": "number" },
    "generated_at": { "type": "string", "format": "date-time" }
  }
}
```
 
---
 
# 9. TECH STACK (full, with justification)
 
| Layer | Choice | Why |
|---|---|---|
| Agent orchestration | **LangGraph** | Explicit state machine, conditional routing, exportable graph diagram — matches hackathon's named platform tech and directly demonstrates the judging criteria. |
| Primary reasoning model (Critic, Red-Team) | **DeepSeek V4** (or Llama 4, whichever you have quota/cost budget for) | Open-weight, cost-trackable, satisfies cost-efficiency judging criterion with real numbers. |
| Cheap/utility model (Extractor, Synthesizer) | Smaller tier of same family | Keeps cost log honest — don't use your best model for formatting tasks. |
| PDF parsing | **PyMuPDF (fitz)** or **pdfplumber** | Reliable text + layout extraction from research PDFs. |
| Source retrieval | **arXiv API**, **PubMed Central (PMC) OA API** | Both are free, open-access, no auth required, directly relevant to "research" theme. |
| Backend framework | **FastAPI** (Python) | Async-friendly, plays well with LangGraph, quick to stand up REST endpoints. |
| Frontend | **React + Vite** (or Next.js if you prefer SSR) | Fast to build a clean multi-screen UI; use Tailwind for styling. |
| State/data fetching (frontend) | **React Query** | Simplifies polling a long-running graph run. |
| Database (run history, cost logs) | **SQLite** (hackathon scope) — swappable to Postgres later | Zero setup, good enough for a 4-day build. |
| Task queue (optional, if pipeline is slow) | **Python `asyncio`** background tasks, or **Celery + Redis** if you have time | Keep it simple first; only add Celery if synchronous execution is too slow for the demo. |
| Deployment (for demo) | **Local run + screen recording**, optionally deployed to **Render/Railway/Fly.io free tier** | Judges watch a video — don't burn a day on deployment infra unless it's trivial. |
| Version control | **GitHub** (public repo, required) | Hackathon requirement. |
| Demo recording | **Loom** or **OBS + YouTube unlisted** | Hackathon requirement. |
 
---
 
# 10. REPOSITORY STRUCTURE
 
```
citation-integrity-engine/
├── README.md
├── ARCHITECTURE.md
├── LICENSE
├── .env.example
├── .gitignore
├── requirements.txt
├── package.json  (if frontend in same repo)
│
├── backend/
│   ├── main.py                     # FastAPI app entrypoint
│   ├── config.py                   # env/config loading
│   ├── graph/
│   │   ├── __init__.py
│   │   ├── state.py                 # GraphState + all TypedDicts
│   │   ├── build_graph.py           # StateGraph construction (Section 7)
│   │   └── nodes/
│   │       ├── claim_extractor.py
│   │       ├── evidence_retriever.py
│   │       ├── entailment_critic.py
│   │       ├── adversarial_redteam.py
│   │       ├── resolve_claim.py
│   │       ├── advance_claim.py
│   │       └── synthesizer.py
│   ├── retrieval/
│   │   ├── arxiv_client.py
│   │   ├── pmc_client.py
│   │   └── passage_matcher.py       # locate matching passage within source text
│   ├── parsing/
│   │   └── pdf_parser.py
│   ├── prompts/
│   │   ├── claim_extractor.txt
│   │   ├── entailment_critic.txt
│   │   ├── adversarial_redteam.txt
│   │   └── synthesizer.txt
│   ├── cost/
│   │   └── tracker.py               # token counting + $ estimation
│   ├── db/
│   │   ├── models.py
│   │   └── session.py
│   ├── api/
│   │   ├── routes_runs.py           # POST /runs, GET /runs/{id}
│   │   ├── routes_reports.py        # GET /reports/{id}
│   │   └── schemas.py               # pydantic request/response models
│   └── tests/
│       ├── test_claim_extractor.py
│       ├── test_evidence_retriever.py
│       ├── test_entailment_critic.py
│       ├── test_graph_end_to_end.py
│       └── fixtures/
│           └── sample_paper.pdf
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/client.ts
│   │   ├── screens/
│   │   │   ├── UploadScreen.tsx
│   │   │   ├── RunProgressScreen.tsx
│   │   │   ├── TrustReportScreen.tsx
│   │   │   ├── ClaimDetailScreen.tsx
│   │   │   └── CostBreakdownScreen.tsx
│   │   ├── components/
│   │   │   ├── ClaimCard.tsx
│   │   │   ├── VerdictBadge.tsx
│   │   │   ├── AgentTraceViewer.tsx
│   │   │   ├── TrustScoreGauge.tsx
│   │   │   └── CostTable.tsx
│   │   └── styles/
│   │       └── globals.css
│
├── examples/
│   ├── sample_run_output.json       # a real logged run (agent execution trace)
│   └── sample_graph_diagram.png     # exported LangGraph diagram
│
└── docs/
    ├── DEMO_SCRIPT.md
    ├── LIMITATIONS.md
    └── SUBMISSION_SUMMARY.md
```
 
---
 
# 11. ENVIRONMENT & CONFIGURATION
 
`.env.example`
```
# Model provider
MODEL_PROVIDER=deepseek        # or "llama", "openai" (fallback), etc.
MODEL_API_KEY=your_key_here
CRITIC_MODEL_NAME=deepseek-v4
REDTEAM_MODEL_NAME=deepseek-v4
UTILITY_MODEL_NAME=deepseek-v4-lite
 
# Retrieval
ARXIV_API_BASE=http://export.arxiv.org/api/query
PMC_API_BASE=https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.cgi
 
# App
DATABASE_URL=sqlite:///./cie.db
BACKEND_PORT=8000
FRONTEND_PORT=5173
 
# Cost accounting (USD per 1K tokens — update to your actual provider rates)
INPUT_TOKEN_COST_PER_1K=0.0002
OUTPUT_TOKEN_COST_PER_1K=0.0006
```
 
---
 
# 12. BACKEND DESIGN — MODULE BY MODULE
 
### `parsing/pdf_parser.py`
- Accepts PDF bytes or arXiv ID (auto-download from arXiv if ID given)
- Extracts raw text preserving paragraph boundaries
- Extracts a reference list (map of citation keys → reference strings) — needed by the
  Evidence Retriever to know *what* to fetch for each `citation_key`
- Returns `(raw_text: str, references: dict[str, str])`
### `graph/nodes/claim_extractor.py`
- Splits `raw_text` into candidate sentences containing a citation marker (regex pass first:
  `\[\d+\]`, `\(\w+ et al\.,? \d{4}\)`, etc., to cut LLM cost)
- For each candidate sentence, calls the Extractor LLM with the prompt in Section 15 to
  confirm it's a real factual claim (not a section header, not "as discussed in [3]")
  and extract clean `claim_text`
- Deduplicates claims mapping to the same citation with near-identical text
### `graph/nodes/evidence_retriever.py`
- Looks up `citation_key` in the `references` dict from parsing stage
- Attempts arXiv API lookup by title/author match; falls back to PMC OA API
- On success: downloads/fetches source abstract + available full text, runs
  `passage_matcher.py` to find the best-matching paragraph via embedding similarity
  (cheap sentence-embedding model, not the big LLM) between claim and candidate passages
- On failure: sets `status: "retrieval_failed"`, still returns a partial `Evidence` object
  so the graph state stays well-formed
### `graph/nodes/entailment_critic.py` / `adversarial_redteam.py`
- Both call the same underlying LLM wrapper but with different prompts (Section 15)
- Red-Team node explicitly does **not** receive the Critic's verdict — enforce this by
  constructing its prompt from raw `Claim` + `Evidence` only, never from graph state fields
  containing Critic's output
- Each records a `CostEntry` in `cost_log` immediately after the call
### `graph/nodes/resolve_claim.py`
- Compares `critic_verdict.label` and `redteam_verdict.label`
- Same label → `RESOLVED`
- Different label → `FLAGGED`
- If either agent's underlying `Evidence.status == "retrieval_failed"` → `UNVERIFIABLE`
  (short-circuits the comparison, both verdicts still stored for transparency)
### `graph/nodes/synthesizer.py`
- Aggregates all `ClaimResult`s
- Computes `trust_score` (formula in Section 20)
- Produces a human-readable summary paragraph (small LLM call, cheap)
- Assembles final `cost_log` totals
### `cost/tracker.py`
- Wraps every LLM call; records model name, input/output token counts (use the
  provider's tokenizer or `tiktoken`-equivalent for the chosen model family), computes
  `estimated_cost_usd` from `.env` rate config
- Exposes `get_run_cost_summary(run_id)` for the API layer
---
 
# 13. FRONTEND DESIGN — SCREENS & UX
 
## Screen 1 — Upload Screen
- Drag-and-drop PDF upload, or text input for an arXiv ID
- "Run Verification" button
- Small "How this works" collapsible panel with a 3-agent illustration (static, for
  first-time users)
## Screen 2 — Run Progress Screen
- Real-time (polling) progress: "Extracting claims… (12 found)" → "Verifying claim 3 of 12…"
- Live mini-log showing each node firing (this doubles as your agent execution trace for
  judges, and looks great in the demo video)
- Cancel button
## Screen 3 — Trust Report Screen (main results screen)
- Big trust score gauge (0–100) at top
- Summary stats: total claims, resolved, flagged, unverifiable
- Filterable list of claims (filter by verdict / status)
- Each claim row: claim text (truncated), citation, status badge (green=RESOLVED,
  yellow=FLAGGED, gray=UNVERIFIABLE), click to expand
## Screen 4 — Claim Detail Screen (modal or expanded row)
- Full claim text + surrounding context
- Source title + link
- Matched passage (quoted, highlighted)
- Critic verdict + justification
- Red-Team verdict + justification
- Side-by-side layout if they disagree, so the adversarial framing is visually obvious —
  this is your best "originality" visual for the demo video
## Screen 5 — Cost Breakdown Screen
- Table: node/agent, model used, input tokens, output tokens, cost
- Total cost for the run, and cost-per-claim
- Small note: "Utility agents use [cheap model]; judgment agents use [primary model]" —
  make the cost-efficiency reasoning visible, don't make judges infer it
### Component notes
- `VerdictBadge.tsx` — color-coded pill component reused everywhere (ENTAILS=green,
  PARTIAL=amber, CONTRADICTS=red, UNADDRESSED=gray)
- `AgentTraceViewer.tsx` — collapsible raw JSON/log viewer, for judges who want to verify
  you're not faking output
- `TrustScoreGauge.tsx` — simple SVG arc gauge, no heavy chart library needed
---
 
# 14. API CONTRACTS (REST endpoints)
 
```
POST /runs
  body: { "input_type": "pdf" | "arxiv_id", "file"?: <binary>, "arxiv_id"?: string }
  returns: { "run_id": string, "status": "queued" }
 
GET /runs/{run_id}
  returns: {
    "run_id": string,
    "status": "queued" | "running" | "completed" | "failed",
    "current_step": string,
    "progress": { "claims_total": int, "claims_processed": int }
  }
 
GET /runs/{run_id}/trace
  returns: { "events": [ { "node": string, "timestamp": string, "summary": string } ] }
 
GET /reports/{run_id}
  returns: TrustReport   # see schema in Section 8
 
GET /reports/{run_id}/cost
  returns: { "cost_log": [CostEntry], "total_cost_usd": number }
```
 
---
 
# 15. AGENT PROMPTS (verbatim, ready to paste)
 
## Claim Extractor prompt (`prompts/claim_extractor.txt`)
 
```
You are a precise research-claim extractor. You will be given a paragraph from an academic
paper that contains at least one citation marker (e.g. "[12]" or "(Smith et al., 2023)").
 
Your task:
1. Identify every distinct factual claim in the paragraph that is attributed to a citation.
2. For each claim, extract:
   - claim_text: the specific factual assertion, rewritten as a clean standalone sentence
     if needed for clarity, but WITHOUT changing its meaning or adding information not
     present in the original text.
   - citation_marker: the exact marker as it appears (e.g. "[12]").
3. Do NOT extract: section headers, statements not attributed to any citation, the paper's
   own novel claims (only claims attributed to OTHER cited work), or vague references like
   "as discussed above."
4. If no genuine citation-backed factual claims are present, return an empty list.
 
Output strictly as JSON:
{
  "claims": [
    { "claim_text": "...", "citation_marker": "..." }
  ]
}
 
Paragraph:
"""
{paragraph_text}
"""
```
 
## Entailment Critic prompt (`prompts/entailment_critic.txt`)
 
```
You are a rigorous fact-checking agent evaluating whether a source passage actually
supports a claim made about it. You must be skeptical and precise — many claims in
research papers subtly overstate, cherry-pick, or misrepresent their sources.
 
Claim: "{claim_text}"
 
Source passage (from the cited work):
"""
{matched_passage}
"""
 
Evaluate the relationship between the claim and the source passage. Choose exactly one
label:
- ENTAILS: the passage fully and directly supports the claim as stated, with no
  meaningful overstatement.
- PARTIAL: the passage supports part of the claim, but the claim overstates, generalizes
  beyond, or adds nuance/confidence not present in the source.
- CONTRADICTS: the passage's content is inconsistent with or opposite to the claim.
- UNADDRESSED: the passage does not address the claim's subject matter at all.
 
Provide a justification quoting the specific part of the passage (under 25 words) that
informed your verdict, and a confidence score from 0 to 1 reflecting how certain you are.
 
Be especially alert to: claims that state certainty ("proves", "demonstrates") when the
source only suggests or correlates; claims that generalize a narrow/specific finding;
claims that omit stated caveats or limitations from the source.
 
Output strictly as JSON:
{
  "label": "ENTAILS" | "PARTIAL" | "CONTRADICTS" | "UNADDRESSED",
  "justification": "...",
  "confidence": 0.0
}
```
 
## Adversarial Red-Team prompt (`prompts/adversarial_redteam.txt`)
 
```
You are an adversarial fact-checking agent. Your job is to independently and skeptically
evaluate the same claim-passage pair another agent has already reviewed — but you must
form your own judgment from scratch. You have NOT been shown the other agent's verdict,
and you should not assume it agrees with you.
 
Actively look for reasons the claim might NOT be well-supported: overstatement, missing
caveats, cherry-picking, misattribution, or the passage simply not addressing the claim.
Argue your position as if you were trying to find a flaw a careless reader would miss.
 
Claim: "{claim_text}"
 
Source passage (from the cited work):
"""
{matched_passage}
"""
 
Choose exactly one label:
- ENTAILS: the passage fully and directly supports the claim as stated.
- PARTIAL: the passage supports part of the claim, but the claim overstates or adds
  unsupported nuance.
- CONTRADICTS: the passage is inconsistent with the claim.
- UNADDRESSED: the passage does not address the claim's subject matter.
 
Provide a justification quoting the specific part of the passage (under 25 words) and a
confidence score from 0 to 1.
 
Output strictly as JSON:
{
  "label": "ENTAILS" | "PARTIAL" | "CONTRADICTS" | "UNADDRESSED",
  "justification": "...",
  "confidence": 0.0
}
```
 
## Synthesizer prompt (`prompts/synthesizer.txt`)
 
```
You are summarizing the results of a citation integrity analysis for a research paper.
You will be given a list of claim results (each with its resolution status and both
agents' verdicts). Write a concise, plain-language summary (under 150 words) covering:
- Overall citation health of the paper
- The most notable flagged disagreement, if any, described in plain terms
- Any claims that were unverifiable and why
 
Do not invent claims or statistics not present in the input data.
 
Input claim results:
"""
{claim_results_json}
"""
 
Output strictly as JSON:
{ "summary": "..." }
```
 
---
 
# 16. RETRIEVAL LAYER DESIGN (arXiv / PubMed Central)
 
## arXiv client (`retrieval/arxiv_client.py`)
- Use arXiv's public API (`http://export.arxiv.org/api/query`) — search by title/author
  extracted from the reference string
- Parse Atom XML response; extract `summary` (abstract) at minimum
- If full text is needed and available, arXiv also exposes source (LaTeX/PDF) — for hackathon
  scope, **abstract-level matching is an acceptable, honestly-disclosed limitation** (state
  this explicitly in `LIMITATIONS.md` — judges reward disclosed scope decisions)
## PubMed Central client (`retrieval/pmc_client.py`)
- Use PMC's Open Access subset API — only OA-licensed articles are fetchable, which is a
  hard constraint you should state up front, not discover mid-demo
- Fetch full text XML when available; extract relevant section text
## Passage matcher (`retrieval/passage_matcher.py`)
- Given `claim_text` and a candidate source document (abstract or full text), split source
  into paragraphs/sentences
- Compute embedding similarity (use a small, cheap sentence-embedding model — do NOT use
  your primary LLM for this step; this is a clear, demonstrable cost-efficiency decision)
- Return top-1 or top-2 matching passages as `matched_passage`
- If max similarity is below a threshold, set `retrieval_confidence` low and consider it a
  weak match — surface this to the Critic/Red-Team prompts if relevant
**Explicit scoping decision (state this in your submission, don't hide it):** CIE v1 only
retrieves from arXiv and PubMed Central OA sources. Paywalled or non-indexed sources result
in `UNVERIFIABLE` claims rather than false negatives. This is a deliberate, disclosed
limitation, not an oversight.
 
---
 
# 17. ENTAILMENT VERDICT TAXONOMY
 
| Label | Meaning | Example |
|---|---|---|
| `ENTAILS` | Source fully, directly supports the claim as stated | Claim: "X reduces latency by 20%." Source: "We observed a 20% latency reduction using X." |
| `PARTIAL` | Source supports part of the claim but claim overstates/generalizes | Claim: "X always reduces latency." Source: "X reduced latency in our specific test setup." |
| `CONTRADICTS` | Source content is inconsistent with the claim | Claim: "X has no effect on latency." Source: "X significantly reduced latency." |
| `UNADDRESSED` | Source doesn't discuss the claim's subject at all | Claim cites a paper about latency, but the matched passage is about memory usage |
 
---
 
# 18. ADVERSARIAL DISAGREEMENT & ROUTING LOGIC
 
Why independence matters: if the Red-Team agent sees the Critic's verdict first, it will
tend to anchor on it (a well-documented LLM behavior), which defeats the purpose of having
two agents. Enforce independence at the code level, not just the prompt level — construct
the Red-Team's input strictly from `Claim` + `Evidence`, never touching `critic_verdict` in
graph state when building its prompt.
 
Routing rule (implemented in `resolve_claim.py`):
```python
def resolve_claim(critic: Verdict, redteam: Verdict, evidence: Evidence) -> str:
    if evidence["status"] == "retrieval_failed":
        return "UNVERIFIABLE"
    if critic["label"] == redteam["label"]:
        return "RESOLVED"
    return "FLAGGED"
```
 
For the demo video, deliberately pick a test paper where at least one claim triggers
`FLAGGED` — this is your strongest piece of evidence for the "agent collaboration" and
"recover from errors" criteria, so don't let it be accidental. Curate it.
 
---
 
# 19. COST & TOKEN ACCOUNTING SYSTEM
 
Every LLM call goes through a single wrapper function so cost tracking can't be
accidentally skipped:
 
```python
def call_llm(model_name: str, prompt: str, node_name: str, state: GraphState) -> dict:
    response = provider_client.generate(model=model_name, prompt=prompt)
    input_tokens = count_tokens(prompt)
    output_tokens = count_tokens(response.text)
    cost = (
        (input_tokens / 1000) * INPUT_TOKEN_COST_PER_1K +
        (output_tokens / 1000) * OUTPUT_TOKEN_COST_PER_1K
    )
    state["cost_log"].append({
        "node": node_name,
        "model": model_name,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "estimated_cost_usd": cost,
    })
    return parse_json_response(response.text)
```
 
Report, per run: total cost, cost per claim, cost broken down by node — put this front and
center in the Cost Breakdown Screen and in the reproducibility section of your submission.
 
---
 
# 20. TRUST SCORE FORMULA
 
Keep this simple, explainable, and defensible in a live Q&A — judges will ask how it's
computed, and "an LLM just said a number" is a weak answer. Use a transparent formula
instead:
 
```
per_claim_score:
  ENTAILS        -> 100
  PARTIAL        -> 60
  CONTRADICTS    -> 0
  UNADDRESSED    -> 30
  (FLAGGED claims use the average of critic_score and redteam_score)
  (UNVERIFIABLE claims excluded from the average, but counted/reported separately)
 
paper_trust_score = average(per_claim_score for all RESOLVED + FLAGGED claims)
```
 
Report `unverifiable_count` alongside the score so it's never misleading — a paper with
many unverifiable claims should visibly show that caveat, not get an artificially clean
score.
 
---
 
# 21. ERROR HANDLING & RECOVERY DESIGN
 
| Failure point | Handling |
|---|---|
| PDF fails to parse | Return clear error to user, do not proceed; log reason |
| No claims extracted | Graph completes with `trust_report.total_claims == 0` and a clear message, not a crash |
| Source retrieval fails | Claim marked `UNVERIFIABLE`, graph continues to next claim |
| LLM returns malformed JSON | Retry once with a stricter "output only valid JSON" reminder; if still malformed, mark that verdict as `agent: "critic"/"redteam", label: "UNADDRESSED", justification: "parse_error"` and flag for review — never silently drop a claim |
| LLM API timeout/rate limit | Exponential backoff retry (max 3 attempts), then mark node as failed and continue graph with partial results |
| Passage matcher finds no good match | `retrieval_confidence` set low, still passed to Critic/Red-Team with a note in the prompt that the match may be weak |
 
This entire table doubles as documentation for the "recover from errors" judging criterion
— include a trimmed version of it in `ARCHITECTURE.md`.
 
---
 
# 22. TESTING STRATEGY
 
- **Unit tests** per node (`tests/test_*.py`) — mock the LLM calls, test the
  parsing/routing logic in isolation (this is fast, doesn't burn API budget)
- **Integration test** (`test_graph_end_to_end.py`) — run the full graph on one small
  fixture paper with a known, hand-verified expected outcome (at least one ENTAILS, one
  PARTIAL, one intentionally-flaggable disagreement case if you can construct one)
- **Manual test pass** on the real curated demo paper (Section 23) before recording video
- Keep a `sample_run_output.json` in `examples/` from a real successful run — this serves
  double duty as documentation and as your "agent execution trace" submission requirement
---
 
# 23. EVALUATION DATASET (test papers)
 
Pick 2–3 real papers, not synthetic ones, prioritizing:
1. **One paper with a documented citation problem** — search retraction databases or
   post-publication peer review sites for papers with known, publicly-discussed citation
   misrepresentation. This is your headline demo case.
2. **One "clean" paper** where citations are well-supported — shows your tool doesn't just
   flag everything (important for credibility; a tool that flags nothing or everything is
   equally useless).
3. **One paper likely to trigger `UNVERIFIABLE`** cases (e.g., cites a paywalled or
   non-indexed source) — shows honest handling of retrieval limits, not overclaiming.
Store minimal metadata for each in `tests/fixtures/` and reference them in `docs/DEMO_SCRIPT.md`.
 
---
 
# 24. DEMO SCRIPT (3-minute video, shot by shot)
 
**0:00–0:20 — Problem framing**
"Citations get checked for existing. They don't get checked for whether the source actually
says what the paper claims. That gap is Citation Integrity Engine."
 
**0:20–0:30 — Architecture (2-agent adversarial framing)**
Show the exported LangGraph diagram. "Five agents: extraction, retrieval, and two
independent judges — a Critic and a Red-Team — that must agree before a claim is verified."
 
**0:30–2:00 — Live run on the curated real paper**
- Upload the paper
- Show progress screen briefly (don't linger)
- Land on Trust Report screen
- Click into the flagged disagreement claim — show Critic vs Red-Team justifications
  side by side, quoting the actual source passage
- This is the single most important 60 seconds of the video — do not rush it
**2:00–2:30 — Cost breakdown**
Show the Cost Breakdown Screen: "$X.XX per paper, using a cheap model for extraction and
retrieval, reserving the stronger model only for judgment calls."
 
**2:30–2:50 — Honest limitations**
"v1 only retrieves from arXiv and PubMed Central open-access sources — paywalled citations
are marked unverifiable rather than guessed at."
 
**2:50–3:00 — Close**
Repo link on screen, one-sentence recap of impact.
 
---
 
# 25. SUBMISSION PACKAGE CHECKLIST
 
- [ ] `README.md` — problem, architecture summary, setup instructions, how to run
- [ ] `ARCHITECTURE.md` — full diagram + node descriptions + error-handling table
- [ ] `docs/LIMITATIONS.md` — retrieval scope, model limitations, known edge cases
- [ ] `docs/SUBMISSION_SUMMARY.md` — the 200-word project summary, written last, after the
      system is stable, so it accurately reflects what was actually built
- [ ] `examples/sample_run_output.json` — real logged trace
- [ ] `examples/sample_graph_diagram.png` — exported from LangGraph, not hand-drawn
- [ ] Cost table with real numbers from an actual run, not estimates
- [ ] Demo video uploaded (unlisted YouTube or Loom), link in README
- [ ] Repo set to public, license added
- [ ] Verify repo runs from a clean clone following only the README instructions
      (do this on a fresh machine/venv if possible — this is where submissions quietly fail)
---
 
# 26. DAY-BY-DAY BUILD PLAN (4 days, hour-level)
 
## DAY 1 — Core pipeline skeleton
- Hour 1–2: Repo scaffold, env setup, FastAPI skeleton, LangGraph installed, empty graph
  that just passes state through
- Hour 3–4: PDF parser + reference extraction working on one real paper
- Hour 5–6: Claim Extractor node working, producing real `Claim` objects on that paper
- Hour 7–8: arXiv client working, basic retrieval + passage matcher returning a passage
  for at least a few claims
- **End-of-day checkpoint:** one claim flows from PDF → extracted claim → retrieved
  evidence, printed to console. If this isn't working, nothing else matters yet — do not
  move to Day 2 tasks until this checkpoint passes.
## DAY 2 — The hard/impressive part
- Hour 1–2: PMC client added as fallback retrieval source
- Hour 3–4: Entailment Critic node — prompt working, structured output parsing solid
- Hour 5–6: Adversarial Red-Team node — verify independence (no leakage of Critic's verdict)
- Hour 7–8: `resolve_claim` conditional routing wired into the actual LangGraph graph;
  confirm both RESOLVED and FLAGGED paths actually occur on real data
- **End-of-day checkpoint:** full graph runs end-to-end on one full real paper, producing
  at least one RESOLVED and ideally one FLAGGED claim. Export the LangGraph diagram now,
  while you have quiet time — don't leave it for Day 4.
## DAY 3 — Reliability, cost tracking, UI
- Hour 1–2: Cost tracker wired into every LLM call; Synthesizer node producing TrustReport
- Hour 3–4: Error handling pass — deliberately break things (bad PDF, unfindable source,
  malformed LLM JSON) and confirm graceful handling per Section 21's table
- Hour 5–7: Frontend — Upload screen, Run Progress screen, Trust Report screen (skip
  fancy styling, get data flowing correctly first)
- Hour 8: Claim Detail screen with side-by-side Critic/Red-Team view — this is your demo
  centerpiece, don't shortcut it
- **End-of-day checkpoint:** you can run the full flow through the UI, not just the API,
  on your curated real demo paper (Section 23).
## DAY 4 — Polish, demo, submission
- Hour 1–2: Cost Breakdown screen; run your 3 evaluation papers, save
  `sample_run_output.json`
- Hour 3: Write `LIMITATIONS.md`, `ARCHITECTURE.md`, `SUBMISSION_SUMMARY.md` (200 words)
- Hour 4: Fresh-clone test — does setup actually work from scratch? Fix anything broken
- Hour 5: Record demo video following the shot list in Section 24, 2–3 takes
- Hour 6: Final repo cleanup, push, make public, verify links
- Hour 7–8: Buffer — something will go wrong; this buffer is not optional, protect it
---
 
# 27. KNOWN LIMITATIONS & HONEST SCOPING STATEMENT
 
State these explicitly in `docs/LIMITATIONS.md` — disclosed limitations are rewarded by
the judging rubric, not penalized:
 
- Retrieval is limited to arXiv and PubMed Central open-access sources; paywalled or
  non-indexed citations are marked `UNVERIFIABLE`, not guessed at.
- Passage matching uses embedding similarity over full source text where available, or
  abstract-only text when full text isn't accessible (arXiv abstracts vs PMC full text
  differ in granularity — this affects match quality and is disclosed per-claim via
  `retrieval_confidence`).
- Entailment judgment is performed by LLMs, which — despite the adversarial cross-check —
  are not infallible; `FLAGGED` disagreements are explicitly routed to human review rather
  than auto-resolved, by design.
- Claim extraction currently targets clearly citation-marked sentences; implicit or
  multi-sentence claims spanning paragraphs are out of scope for v1.
---
 
# 28. STRETCH GOALS (only if Day 4 buffer time remains)
 
- Citation chain tracing (claim → source A → source A's own citation of source B) —
  genuinely hard, only attempt if core system is rock solid and demo-ready already
- Batch mode: run against an entire reference list / bibliography at once
- Browser extension shim that highlights flagged citations directly on an arXiv HTML page
- Second LLM family for Red-Team specifically (model diversity strengthens the adversarial
  story) — only if API budget allows
Do not start any stretch goal unless Section 26's Day 4 checkpoint items are all done.
 
---
 
# 29. RISK LOG & FALLBACK PLANS
 
| Risk | Likelihood | Fallback |
|---|---|---|
| LangGraph conditional routing bugs out under time pressure | Medium | Fall back to two agents running independently with a simple confidence-delta score shown side by side — still real collaboration, just less elaborate routing |
| arXiv/PMC retrieval too unreliable for demo paper | Medium | Pre-cache retrieval results for your 2–3 curated evaluation papers so the live demo doesn't depend on live API uptime during recording |
| Cost/token counting inaccurate for chosen model provider | Low-Medium | Use provider's official token-counting utility if available; otherwise document your estimation method explicitly rather than presenting it as exact |
| Frontend eats too much time | Medium-High | A clean, unstyled but functional UI beats a beautiful but broken one — prioritize Trust Report + Claim Detail screens only if time runs short, cut Cost Breakdown to a simple table |
| No genuine disagreement occurs naturally in test papers | Medium | It's fine to note in `LIMITATIONS.md` that disagreement is rare on well-cited papers, and specifically curate a paper/claim known to be borderline so at least one real flagged case appears in the demo |
 
---
 
# 30. GLOSSARY
 
- **Claim** — a factual assertion in a paper attributed to a specific citation.
- **Evidence** — the retrieved source content believed to correspond to a claim's citation.
- **Entailment** — whether a source passage logically supports a claim.
- **RESOLVED** — Critic and Red-Team agents agree on a verdict.
- **FLAGGED** — Critic and Red-Team disagree; routed for human review.
- **UNVERIFIABLE** — source could not be retrieved or matched; no verdict possible.
- **Trust Score** — paper-level aggregate score (0–100) derived from per-claim verdicts.
---
 
## FINAL NOTE FOR THE BUILDING AGENT
 
Build in the order given in Section 26. Do not build the frontend before the backend graph
runs end-to-end on real data — a good-looking UI over a broken pipeline is worse than a
plain UI over a working one, and the judging rubric weights "working demo" and "research
utility" far higher than visual polish. When in doubt, cut UI scope before cutting pipeline
correctness or cost/error-handling instrumentation — those are the parts judges specifically
said they'd check for.