<div align="center">
  <img src="public/favicon.svg" width="100" height="100" alt="Citation Integrity Engine Logo" />
  <h1>Citation Integrity Engine (CIE)</h1>
  <p><b>Multi-Agent Adversarial Verification Platform for Academic Manuscripts &amp; Citation Entailment Audit</b></p>

  <p>
    <a href="https://citation-integrity-engine.vercel.app/"><img src="https://img.shields.io/badge/Live_App-Vercel-000000.svg?style=for-the-badge&amp;logo=vercel&amp;logoColor=white" alt="Live Web App" /></a>
    <a href="https://citation-integrity-engine.onrender.com/"><img src="https://img.shields.io/badge/Backend_API-Render-46E3B7.svg?style=for-the-badge&amp;logo=render&amp;logoColor=black" alt="Render Backend API" /></a>
    <a href="https://github.com/KanishJebaMathewM/Citation-Integrity-Engine"><img src="https://img.shields.io/badge/Build-Passing-2e7d32.svg?style=for-the-badge" alt="Build Status" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-3b1c4e.svg?style=for-the-badge" alt="License" /></a>
  </p>

  <p>
    <a href="https://citation-integrity-engine.vercel.app/"><b>Open Live Web Application</b></a> |
    <a href="https://citation-integrity-engine.onrender.com/"><b>API Service Status</b></a>
  </p>
</div>

---

## System Architecture

```mermaid
flowchart TB
    subgraph PHASE1 ["Phase 1: Manuscript Ingestion &amp; Claim Extraction"]
        direction LR
        A1["Input Manuscript<br/>(PDF File Upload or arXiv ID)"] --> A2["Node 01: Claim Extractor<br/>(Parses manuscript text &amp; citation markers [1], [2])"]
    end

    subgraph PHASE2 ["Phase 2: Multi-Source Evidence Retrieval"]
        direction LR
        B1["Node 02: Evidence Retriever"] --> B2["arXiv HTTPS API"]
        B1 --> B3["PubMed Central (PMC)"]
        B1 --> B4["Tavily Academic Search"]
    end

    subgraph PHASE3 ["Phase 3: Parallel Adversarial Cross-Examination"]
        direction LR
        C1["Node 03: Critic Judge (GPT-4o)<br/>Evaluates primary claim entailment"]
        C2["Node 04: Red-Team Judge (Claude)<br/>Searches for scope overreach &amp; caveats"]
    end

    subgraph PHASE4 ["Phase 4: Synthesis &amp; Two Pens Stroke Resolution"]
        direction LR
        D1["Node 05: Two Pens Synthesizer<br/>Computes Trust Score (0–100%) &amp; Stroke Offsets"]
    end

    subgraph PHASE5 ["Phase 5: Interactive Audit UI &amp; Reports"]
        direction LR
        E1["Trust Report Dashboard"]
        E2["Two Pens Passage Viewer"]
        E3["Live Agent Trace Terminal"]
        E4["Itemized Cost Ledger"]
    end

    PHASE1 --> PHASE2
    PHASE2 --> PHASE3
    PHASE3 --> PHASE4
    PHASE4 --> PHASE5

    classDef phase fill:#131024,stroke:#3b1c4e,stroke-width:2px,color:#f3f0f8;
    classDef nodeMain fill:#1e1933,stroke:#8b5cf6,stroke-width:2px,color:#ffffff;
    classDef nodeCritic fill:#072a14,stroke:#4ade80,stroke-width:2px,color:#ffffff;
    classDef nodeRedTeam fill:#3b1900,stroke:#fbbf24,stroke-width:2px,color:#ffffff;
    classDef nodeSynth fill:#2e1065,stroke:#a78bfa,stroke-width:2px,color:#ffffff;

    class PHASE1,PHASE2,PHASE3,PHASE4,PHASE5 phase;
    class A1,A2,B1,B2,B3,B4 nodeMain;
    class C1 nodeCritic;
    class C2 nodeRedTeam;
    class D1 nodeSynth;
    class E1,E2,E3,E4 nodeMain;
```

---

## Executive Summary

Existing citation lookup tools verify whether a reference string exists in a database, but fail to answer the primary academic integrity question: **Does the cited source text actually support the claim made about it?**

The Citation Integrity Engine (CIE) addresses this limitation by deploying an adversarial multi-agent state machine. Rather than relying on single-model summarization, CIE executes independent Critic and Red-Team reviewer agents that evaluate claim entailment without cross-agent communication. This architecture eliminates single-model anchoring bias, isolates unstated scope caveats, and generates itemized verification reports.

---

## Traditional Verification vs Citation Integrity Engine

| Capability | Traditional Reference Checkers | Citation Integrity Engine |
| :--- | :--- | :--- |
| **Reference Existence** | Confirms URL / DOI exists | Confirms URL / DOI exists |
| **Passage Entailment** | Not Supported | Evaluates direct claim support |
| **Adversarial Evaluation** | Single-pass heuristic | Independent Critic vs Red-Team cross-examination |
| **Visual Disagreement** | Binary match / no match | Two Pens offset stroke rendering |
| **Cost Auditability** | Opaque pricing | Real-time itemized token &amp; USD cost ledger |
| **State Inspection** | Closed black-box execution | Live agent trace event stream |

---

## Key Features & Capabilities

* **Live Cloud Deployment**: Deployed globally with a React 18 SPA on Vercel and a Node.js Express backend on Render.
* **Adversarial Dual-Review Protocol**: Deploys independent Critic (GPT-4o) and Red-Team (Claude) evaluation agents operating in parallel without cross-visibility.
* **Two Pens Highlighter Methodology**: Computes visual stroke overlays on cited source passages. Single merged strokes denote consensus; offset dual strokes highlight reviewer disagreement.
* **Live Agent Trace Streaming**: Streams real-time state machine transitions and execution logs to an interactive terminal interface.
* **Transparent Token Cost Ledger**: Tracks exact prompt input/output token usage across every pipeline node with itemized USD cost accounting (~$0.00085 per paper run).
* **Dual Input Processing**: Accepts manuscript PDF file uploads or direct arXiv paper identifiers with automated passage extraction.
* **Dynamic Design System**: Theme-aware interface supporting deep velvet violet light mode and royal violet dark mode.

---

## Two Pens Verification Methodology

The core visual signature of the Citation Integrity Engine is the Two Pens stroke resolution model:

| Verdict Condition | Critic Agent | Red-Team Agent | Two Pens Rendered Stroke | Status Tag |
| :--- | :--- | :--- | :--- | :--- |
| **Consensus Entailed** | ENTAILS | ENTAILS | Single confidence stroke beneath passage | `RESOLVED` |
| **Partial Support / Caveat** | ENTAILS | PARTIAL | Two offset strokes (Green Critic, Amber Red-Team) | `FLAGGED` |
| **Direct Contradiction** | CONTRADICTS | CONTRADICTS | Red warning stroke indicator | `FLAGGED` |
| **Missing Citation** | UNVERIFIABLE | UNVERIFIABLE | Dashed grey boundary line | `UNVERIFIABLE` |

---

## Multi-Agent Pipeline Specifications

The engine operates as a 5-node state machine:

1. **Node 01: Claim Extractor**: Parses manuscript text or uploaded PDF files to extract citation markers (e.g., [1], [2]) and isolate target claim statements.
2. **Node 02: Evidence Retriever**: Queries external APIs (arXiv HTTPS API, PubMed Central, Tavily search) to fetch authoritative source passage text for each citation marker.
3. **Node 03: Critic Judge (GPT-4o)**: Evaluates primary entailment between the manuscript claim and the retrieved passage text.
4. **Node 04: Red-Team Judge (Claude)**: Formulates adversarial counter-arguments to identify unstated assumptions, scope overreach, or missing conditions.
5. **Node 05: Two Pens Synthesizer**: Computes the final Trust Score (0-100%), resolves highlight stroke offsets, and outputs the itemized audit report.

---

## Installation & Local Setup

### Prerequisites

* Node.js v18.0 or higher
* npm v9.0 or higher
* Python 3.10 or higher (optional, for PDF generation utilities)

### 1. Repository Clone

```bash
git clone https://github.com/KanishJebaMathewM/Citation-Integrity-Engine.git
cd Citation-Integrity-Engine
```

### 2. Dependency Installation

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
AGENT_ROUTER_API_KEY=your_agent_router_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
TAVILY_API_KEY=your_tavily_key_here
NCBI_API_KEY=your_ncbi_key_here
MODEL_PROVIDER=openai
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

### 4. Running Locally

Launch the Express backend server and Vite frontend dev server in separate terminal windows:

```bash
# Terminal 1: Launch Express Node.js Backend (Port 8000)
npm run server

# Terminal 2: Launch Vite React Frontend (Port 5173)
npm run dev
```

Access the application in your browser at `http://localhost:5173`.

---

## Production Deployment & REST API Specification

* **Live Web App**: `https://citation-integrity-engine.vercel.app/`
* **Production API Base**: `https://citation-integrity-engine.onrender.com`

### 1. Create Verification Run

* **Endpoint**: `POST /api/runs`
* **URL**: `https://citation-integrity-engine.onrender.com/api/runs`
* **Content-Type**: `multipart/form-data` or `application/json`
* **Parameters**:
  * `input_type`: `'arxiv_id'` or `'pdf'`
  * `arxiv_id`: (string, e.g. `'2005.14165'`)
  * `file`: (binary PDF upload)
* **Response**:

```json
{
  "run_id": "run-ejf14h75",
  "status": "queued"
}
```

### 2. Fetch Run Status

* **Endpoint**: `GET /api/runs/:run_id`
* **URL**: `https://citation-integrity-engine.onrender.com/api/runs/run-ejf14h75`
* **Response**:

```json
{
  "run_id": "run-ejf14h75",
  "status": "completed",
  "current_step": "completed",
  "claims_total": 3,
  "claims_processed": 3
}
```

### 3. Stream Live Agent Trace

* **Endpoint**: `GET /api/runs/:run_id/trace`
* **URL**: `https://citation-integrity-engine.onrender.com/api/runs/run-ejf14h75/trace`
* **Response**:

```json
{
  "run_id": "run-ejf14h75",
  "events": [
    {
      "node": "claim_extractor",
      "summary": "Extracted 3 claims from manuscript.",
      "timestamp": "2026-08-15T14:55:20.124Z"
    },
    {
      "node": "critic_judge",
      "summary": "Critic agent evaluating entailment for Claim 1...",
      "timestamp": "2026-08-15T14:55:21.400Z"
    }
  ]
}
```

### 4. Fetch Final Trust Report

* **Endpoint**: `GET /api/reports/:run_id`
* **URL**: `https://citation-integrity-engine.onrender.com/api/reports/run-ejf14h75`
* **Response**:

```json
{
  "run_id": "run-ejf14h75",
  "paper_title": "Language Models are Few-Shot Learners",
  "trust_score": 90,
  "total_claims": 3,
  "resolved_count": 2,
  "flagged_count": 1,
  "unverifiable_count": 0,
  "total_cost_usd": 0.00084,
  "claim_results": []
}
```

---

## Evaluation Benchmark Papers

The engine includes pre-configured benchmark evaluation papers:

| arXiv Identifier | Paper Title | Evaluated Claims | Trust Score | Primary Outcome |
| :--- | :--- | :---: | :---: | :--- |
| **arXiv:1706.03762** | Attention Is All You Need (Vaswani et al.) | 4 Claims | **93%** | High entailment across BLEU metrics |
| **arXiv:2005.14165** | Language Models are Few-Shot Learners (GPT-3) | 3 Claims | **90%** | Entailed zero-shot scaling; RACE caveat flagged |
| **arXiv:2103.00020** | Learning Transferable Visual Models (CLIP) | 4 Claims | **92%** | Zero-shot ImageNet confirmed; prompt engineering caveat |
| **arXiv:1810.04805** | BERT: Pre-training of Deep Bidirectional Transformers | 3 Claims | **95%** | Complete entailment across GLUE benchmark |

To test PDF uploading, use the sample manuscript located at `examples/Quantum_Neural_Architectures_Sample_Paper.pdf`.

---

## Repository Directory Structure

```
Citation-Integrity-Engine/
├── docs/
│   ├── DEMO_SCRIPT.md           # Live demonstration script
│   ├── LIMITATIONS.md          # Known technical boundaries
│   ├── RENDER_DEPLOYMENT.md    # Render deployment guide
│   └── SUBMISSION_SUMMARY.md   # Hackathon submission overview
├── examples/
│   ├── Quantum_Neural_Architectures_Sample_Paper.pdf
│   └── sample_run_output.json   # Full sample JSON audit export
├── public/
│   └── favicon.svg              # Brand logo icon
├── server/
│   ├── index.js                 # Express HTTP server & route handlers
│   ├── package.json             # Subfolder deployment config
│   └── pipeline.js              # Multi-agent state machine & LLM router
├── src/
│   ├── api/client.ts            # Frontend API client with VITE_API_BASE_URL
│   ├── components/
│   │   ├── cie/                 # Design system & UI components
│   │   ├── AgentTraceViewer.tsx # Live terminal log viewer
│   │   └── AnimatedReveal.tsx   # Scroll reveal container
│   ├── lib/
│   │   ├── run-store.ts         # React state store
│   │   └── verdict.ts           # Score band & styling logic
│   ├── screens/ font-family     # Dashboard, Upload, Progress, Report screens
│   ├── App.tsx                  # Main React SPA component
│   └── styles.css               # Design system token definitions
├── index.html
├── package.json
├── render.yaml                  # Render blueprint configuration
├── vercel.json                  # Vercel SPA rewrite configuration
└── vite.config.ts
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.
