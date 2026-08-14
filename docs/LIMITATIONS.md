# Known Limitations & Honest Scoping Statement

1. **Retrieval Scope**: CIE v1 retrieves source passages from **arXiv** and **PubMed Central Open Access (PMC OA)** APIs. Paywalled or un-indexed publications are flagged as `UNVERIFIABLE` rather than false positives/negatives.
2. **Passage Matching**: Uses TF-IDF / sentence-embedding passage matching over available abstracts or full-text sections. Disclosed per-claim via `retrieval_confidence`.
3. **Implicit Claims**: Targets explicitly citation-marked sentences (`[\d+]` or `(Author, Year)`). Implicit or multi-paragraph narrative citations are out of scope for v1.
4. **Adversarial Human-in-the-loop**: Claims where Critic and Red-Team disagree are routed to a `FLAGGED` human-review state by design, acknowledging LLM uncertainty.
