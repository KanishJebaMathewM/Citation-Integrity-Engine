# Citation Integrity Engine (CIE)

> **Research Agents Hackathon (IIT Madras / DoraHacks)** — Citation Verification Track

A multi-agent research verification platform built with **LangGraph**, **FastAPI**, **arXiv & PubMed Central (PMC) APIs**, and **React + Vite**.

Instead of merely checking whether a citation *exists*, CIE evaluates **semantic entailment** — checking whether the cited source passage *actually supports* the claim made about it using an adversarial **Critic vs Red-Team agent cross-examination pattern**.

---

## 🌟 Key Features

- **Adversarial Multi-Agent Verification**: Independent Critic and Red-Team agents evaluate claims simultaneously without seeing each other's verdicts to prevent anchoring bias.
- **Explicit LangGraph State Machine**: Inspectable pipeline with conditional routing (`RESOLVED`, `FLAGGED`, `UNVERIFIABLE`).
- **Live Agent Trace Streaming**: Visual real-time stream of node execution logs.
- **Transparent Token & Cost Accounting**: Tracks input/output tokens and USD costs per agent call (~$0.00089 per paper run).
- **Interactive Trust Score Dashboard**: Custom SVG gauge (0–100) with filterable claim cards and side-by-side agent comparison modals.

---

## 🏗 System Architecture

```
[ Input: PDF / arXiv ID ] ──► [ Claim Extractor Node ]
                                      │
                                      ▼
                           [ Evidence Retriever (arXiv/PMC) ]
                                      │
                                      ▼
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
            [ Entailment Critic ]       [ Adversarial Red-Team ]
                        └─────────────┬─────────────┘
                                      ▼
                           [ Resolution Router ]
                           (Agree -> RESOLVED | Disagree -> FLAGGED)
                                      │
                                      ▼
                           [ Synthesizer Node ]
                                      │
                                      ▼
                           [ Trust Report & Cost UI ]
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables (optional: add your API key)
cp .env.example .env

# Run pytest verification suite
python -m pytest backend/tests

# Launch FastAPI backend (default port 8000)
python -m backend.main
```

### 3. Frontend Setup
```bash
# Install npm dependencies
npm install

# Start Vite dev server (default port 5173)
npm run dev
```

---

## 📂 Project Structure

```
Citation Engine/
├── backend/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── config.py                # Environment configuration
│   ├── graph/
│   │   ├── state.py             # LangGraph state TypedDict definitions
│   │   ├── build_graph.py        # LangGraph StateGraph builder
│   │   └── nodes/               # Extractor, Retriever, Critic, RedTeam, Router, Synthesizer
│   ├── retrieval/               # arXiv API, PMC API & Passage similarity matcher
│   ├── parsing/                 # PyMuPDF parser & reference extractor
│   ├── cost/                    # Token counter & USD cost calculator
│   └── tests/                   # Pytest unit & graph integration suite
├── frontend/
│   ├── src/                     # React + Vite dashboard components & screens
│   ├── index.html
│   └── vite.config.js
├── examples/                    # Sample execution trace output JSON
├── docs/                        # Submission summary, limitations, & demo script
└── plan.md                      # Master build plan specification
```

---

## 🧪 Evaluation Data & Demo Papers

- **arXiv:1706.03762** — *Attention Is All You Need* (Vaswani et al.)
- **arXiv:2005.14165** — *Language Models are Few-Shot Learners* (Brown et al.)
- **arXiv:1810.04805** — *BERT Pre-training for Deep Bidirectional Transformers* (Devlin et al.)

---

## 📄 License

MIT License — see [LICENSE](file:///c:/Users/Admin/Desktop/Citation%20Engine/LICENSE) for details.
