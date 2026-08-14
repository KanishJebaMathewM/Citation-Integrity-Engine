# Citation Integrity Engine (CIE) — System Architecture

The Citation Integrity Engine (CIE) audits academic research papers to evaluate whether cited sources actually support the claims made about them.

---

## High-Level State Machine Diagram

```
                         ┌─────────────────────────┐
                         │   Input: PDF / arXiv ID  │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 1: Claim Extractor     │
                      │   (parses paper, extracts     │
                      │   claim + citation marker     │
                      │   pairs)                      │
                      └────────────┬───────────────────┘
                                      │  List[Claim]
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 2: Evidence Retriever   │
                      │   (fetches cited source,       │
                      │   locates matching passage)    │
                      └────────────┬───────────────────┘
                                      │  Claim + Evidence
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 3: Entailment Critic    │
                      │   (verdict + justification)    │
                      └────────────┬───────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 4: Adversarial Red-Team │
                      │   (independent counter-verdict)│
                      └────────────┬───────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                 ┌───────────────┐        ┌──────────────────┐
                 │ Agree →RESOLVED│       │ Disagree →FLAGGED│
                 └───────┬───────┘        └─────────┬────────┘
                         │                          │
                         └────────────┬─────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │   Node 5: Synthesizer          │
                      │   (trust score, cost log,      │
                      │   final report)                │
                      └────────────┬───────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Output: JSON report + UI    │
                      └───────────────────────────────┘
```

---

## Agent Roster & Scoping

1. **Claim Extractor**: Splits paper into citation-bearing candidate sentences (`[\d+]` or `(Author, Year)`), invokes LLM to extract clean standalone `Claim` assertions.
2. **Evidence Retriever**: Looks up cited works via arXiv API and PubMed Central (PMC) OA API. Uses TF-IDF passage similarity to match paragraphs to claims.
3. **Entailment Critic**: Evaluates claim against passage and returns one of `ENTAILS`, `PARTIAL`, `CONTRADICTS`, or `UNADDRESSED` with quoted justification.
4. **Adversarial Red-Team**: Independently evaluates claim and passage without viewing Critic's verdict.
5. **Resolution Router**: Compares Critic vs Red-Team verdicts (`RESOLVED`, `FLAGGED`, `UNVERIFIABLE`).
6. **Synthesizer**: Computes overall paper Trust Score (0–100) and builds cost & execution trace summary.

---

## Error Handling & Recovery Matrix

| Failure Point | Handling & Recovery |
|---|---|
| PDF Fails to Parse | Returns clean HTTP 400 error, logs root cause. |
| No Claims Found | Graph completes gracefully with `total_claims == 0`, avoiding crashes. |
| Source Retrieval Fails | Claim status set to `UNVERIFIABLE`; pipeline continues to next claim. |
| LLM Malformed Output | Heuristic fallback parser recovers JSON object; retries gracefully. |
| Rate Limit / Timeout | Exponential backoff retry (up to 3 attempts). |
