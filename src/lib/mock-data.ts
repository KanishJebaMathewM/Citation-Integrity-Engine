export type VerdictLabel = "ENTAILS" | "PARTIAL" | "CONTRADICTS" | "UNADDRESSED" | "UNVERIFIABLE";
export type Resolution = "RESOLVED" | "FLAGGED" | "UNVERIFIABLE";

export type Verdict = {
  agent: "critic" | "redteam";
  label: VerdictLabel;
  justification: string;
  confidence: number;
};

export type ClaimResult = {
  claim: {
    id: string;
    claim_text: string;
    citation_marker: string;
    location: string;
  };
  evidence: {
    source_title: string;
    source_url: string;
    matched_passage: string;
    /** substring of matched_passage the pens underline */
    span: string;
    status: "found" | "missing";
  };
  critic_verdict: Verdict;
  redteam_verdict: Verdict;
  resolution: Resolution;
};

export type CostRow = {
  node: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
};

export type Report = {
  run_id: string;
  paper_id: string;
  paper_title: string;
  trust_score: number;
  total_claims: number;
  resolved_count: number;
  flagged_count: number;
  unverifiable_count: number;
  claim_results: ClaimResult[];
  cost_log: CostRow[];
  total_cost_usd: number;
};

export type Run = {
  run_id: string;
  paper_title: string;
  date: string;
  trust_score: number;
  total_claims: number;
  flagged_count: number;
};

export const runs: Run[] = [
  {
    run_id: "r1",
    paper_title: "Scaling Laws for Retrieval-Augmented Generation",
    date: "2026-08-12",
    trust_score: 78,
    total_claims: 12,
    flagged_count: 2,
  },
  {
    run_id: "r2",
    paper_title: "Efficient Transformers: A Survey",
    date: "2026-08-10",
    trust_score: 94,
    total_claims: 8,
    flagged_count: 0,
  },
  {
    run_id: "r3",
    paper_title: "Emergent Abilities Reconsidered",
    date: "2026-08-09",
    trust_score: 52,
    total_claims: 15,
    flagged_count: 4,
  },
];

function claim(
  id: string,
  claim_text: string,
  citation_marker: string,
  location: string,
  source_title: string,
  matched_passage: string,
  span: string,
  critic: [VerdictLabel, string, number],
  redteam: [VerdictLabel, string, number],
  resolution: Resolution,
  status: "found" | "missing" = "found",
): ClaimResult {
  return {
    claim: { id, claim_text, citation_marker, location },
    evidence: {
      source_title,
      source_url: "https://arxiv.org/abs/xxxx.xxxxx",
      matched_passage,
      span,
      status,
    },
    critic_verdict: {
      agent: "critic",
      label: critic[0],
      justification: critic[1],
      confidence: critic[2],
    },
    redteam_verdict: {
      agent: "redteam",
      label: redteam[0],
      justification: redteam[1],
      confidence: redteam[2],
    },
    resolution,
  };
}

const r1Claims: ClaimResult[] = [
  claim(
    "c1",
    "Retrieval augmentation reduces hallucination rates by up to 40% across all tested model sizes.",
    "[14]",
    "Section 3.2",
    "Grounding Language Models via Retrieval",
    "In our largest model configuration, we observed a 40% reduction in hallucination rate; smaller models showed more variable results.",
    "smaller models showed more variable results",
    ["PARTIAL", "reduction was specific to the largest model, not all sizes", 0.81],
    ["CONTRADICTS", "source explicitly says results were variable for smaller models", 0.74],
    "FLAGGED",
  ),
  claim(
    "c2",
    "Dense retrievers outperform BM25 on open-domain question answering benchmarks.",
    "[3]",
    "Section 2.1",
    "Dense Passage Retrieval for Open-Domain QA",
    "Dense retrieval outperforms a strong BM25 baseline by 9%-19% absolute in top-20 passage retrieval accuracy.",
    "outperforms a strong BM25 baseline by 9%-19% absolute",
    ["ENTAILS", "the source states the improvement directly and in the same setting", 0.93],
    ["ENTAILS", "no overstatement found; the benchmark family matches", 0.9],
    "RESOLVED",
  ),
  claim(
    "c3",
    "Retrieval corpora larger than 10M passages yield diminishing returns on answer accuracy.",
    "[22]",
    "Section 4.1",
    "Corpus Scale and Retrieval Quality",
    "Beyond roughly 10M passages, gains in exact-match accuracy fall under one point per doubling of the corpus.",
    "gains in exact-match accuracy fall under one point per doubling",
    ["ENTAILS", "the diminishing-returns threshold matches the cited figure", 0.88],
    ["ENTAILS", "phrasing is faithful to the source's scope", 0.85],
    "RESOLVED",
  ),
  claim(
    "c4",
    "Chunk size interacts with retriever recall more strongly than with generator quality.",
    "[9]",
    "Section 4.2",
    "Chunking Strategies for RAG Pipelines",
    "Recall was highly sensitive to chunk length, while downstream generation scores moved within noise across the same range.",
    "Recall was highly sensitive to chunk length",
    ["ENTAILS", "both halves of the claim are stated in the source", 0.87],
    ["ENTAILS", "the comparison is explicit, not inferred", 0.83],
    "RESOLVED",
  ),
  claim(
    "c5",
    "Reranking adds under 30ms of latency at the 95th percentile.",
    "[17]",
    "Section 5.1",
    "Latency Budgets in Production Retrieval",
    "Our cross-encoder reranker added 27ms at p95 on a single A100 with a batch of eight candidates.",
    "added 27ms at p95 on a single A100",
    ["ENTAILS", "the number and percentile both match", 0.91],
    ["PARTIAL", "source's figure is hardware- and batch-specific", 0.62],
    "RESOLVED",
  ),
  claim(
    "c6",
    "Instruction-tuned generators are more robust to irrelevant retrieved context.",
    "[11]",
    "Section 5.3",
    "Robustness of Instruction-Tuned Models",
    "Instruction-tuned checkpoints degraded less than base checkpoints when distractor passages were injected.",
    "degraded less than base checkpoints when distractor passages were injected",
    ["ENTAILS", "restates the source's finding without extension", 0.9],
    ["ENTAILS", "no scope inflation detected", 0.88],
    "RESOLVED",
  ),
  claim(
    "c7",
    "Hybrid sparse-dense retrieval is now standard practice in production systems.",
    "[28]",
    "Section 2.3",
    "A Survey of Industrial Retrieval Stacks",
    "Several of the surveyed teams reported hybrid sparse-dense pipelines, though a majority still relied on sparse-only retrieval.",
    "a majority still relied on sparse-only retrieval",
    ["PARTIAL", "'standard practice' overstates what the survey reports", 0.79],
    ["PARTIAL", "the source shows adoption, not dominance", 0.76],
    "RESOLVED",
  ),
  claim(
    "c8",
    "Query rewriting improves recall for multi-hop questions.",
    "[6]",
    "Section 3.4",
    "Query Reformulation for Multi-Hop Retrieval",
    "Rewritten queries raised recall@10 on multi-hop sets by 6.4 points over the raw-query baseline.",
    "raised recall@10 on multi-hop sets by 6.4 points",
    ["ENTAILS", "claim matches the measured effect and question type", 0.92],
    ["ENTAILS", "conservative relative to the source", 0.89],
    "RESOLVED",
  ),
  claim(
    "c9",
    "Retrieval-augmented models require fewer parameters to reach a given accuracy.",
    "[14]",
    "Section 6.1",
    "Grounding Language Models via Retrieval",
    "A 7B retrieval-augmented model matched the closed-book accuracy of a 33B model on our evaluation suite.",
    "matched the closed-book accuracy of a 33B model",
    ["ENTAILS", "the parameter-efficiency reading is directly supported", 0.86],
    ["ENTAILS", "scope limited to the same suite, as claimed", 0.82],
    "RESOLVED",
  ),
  claim(
    "c10",
    "Citation-grounded generation reduces user-reported trust failures.",
    "[31]",
    "Section 6.3",
    "User Studies of Grounded Assistants",
    "Participants reported fewer trust breakdowns when responses linked to retrievable sources.",
    "reported fewer trust breakdowns when responses linked to retrievable sources",
    ["ENTAILS", "the user-study finding supports the claim as written", 0.84],
    ["ENTAILS", "no inflation of effect size", 0.81],
    "RESOLVED",
  ),
  claim(
    "c11",
    "Scaling the retriever yields larger gains than scaling the generator below 13B parameters.",
    "[22]",
    "Section 6.4",
    "Corpus Scale and Retrieval Quality",
    "We did not isolate generator scaling in this study; all runs used a fixed 7B generator.",
    "We did not isolate generator scaling in this study",
    ["CONTRADICTS", "the source explicitly did not test generator scaling", 0.77],
    ["PARTIAL", "the comparison is unsupported rather than refuted", 0.68],
    "FLAGGED",
  ),
  claim(
    "c12",
    "Proprietary retrieval indexes contain roughly two trillion tokens.",
    "[40]",
    "Section 7.1",
    "Industry Index Scale (unavailable)",
    "",
    "",
    ["UNVERIFIABLE", "the cited resource could not be retrieved", 0.5],
    ["UNVERIFIABLE", "no accessible source text to review", 0.5],
    "UNVERIFIABLE",
    "missing",
  ),
];

const r2Claims: ClaimResult[] = [
  claim(
    "d1",
    "Sparse attention reduces the quadratic cost of self-attention to near-linear.",
    "[2]",
    "Section 2.1",
    "Longformer: The Long-Document Transformer",
    "Our attention pattern scales linearly with sequence length, replacing the quadratic full-attention cost.",
    "scales linearly with sequence length",
    ["ENTAILS", "claim matches the source's central result", 0.95],
    ["ENTAILS", "no overstatement", 0.93],
    "RESOLVED",
  ),
  claim(
    "d2",
    "Low-rank approximations trade a small accuracy loss for large memory savings.",
    "[5]",
    "Section 2.2",
    "Linformer: Self-Attention with Linear Complexity",
    "Memory use dropped substantially with under one point of accuracy loss on GLUE.",
    "under one point of accuracy loss on GLUE",
    ["ENTAILS", "both the trade and its magnitude are stated", 0.91],
    ["ENTAILS", "faithful summary", 0.9],
    "RESOLVED",
  ),
  claim(
    "d3",
    "Kernel-based attention avoids materializing the attention matrix.",
    "[8]",
    "Section 3.1",
    "Performers: Rethinking Attention with Kernels",
    "The estimator never forms the full attention matrix, which is what removes the quadratic memory term.",
    "never forms the full attention matrix",
    ["ENTAILS", "direct restatement", 0.96],
    ["ENTAILS", "direct restatement", 0.94],
    "RESOLVED",
  ),
  claim(
    "d4",
    "Efficiency benchmarks disagree because they use different sequence-length regimes.",
    "[12]",
    "Section 4.1",
    "Long Range Arena",
    "Rankings shifted markedly between the 1K and 4K length settings.",
    "Rankings shifted markedly between the 1K and 4K length settings",
    ["ENTAILS", "the source attributes disagreement to length regime", 0.88],
    ["ENTAILS", "supported", 0.86],
    "RESOLVED",
  ),
  claim(
    "d5",
    "Hardware-aware kernels can outperform algorithmic approximations at moderate lengths.",
    "[15]",
    "Section 4.3",
    "FlashAttention",
    "Exact attention with IO-aware tiling was faster than several approximate methods up to 4K tokens.",
    "faster than several approximate methods up to 4K tokens",
    ["ENTAILS", "matches the measured regime", 0.9],
    ["ENTAILS", "scope preserved", 0.89],
    "RESOLVED",
  ),
  claim(
    "d6",
    "Recurrent-style state models are competitive on long-sequence tasks.",
    "[19]",
    "Section 5.1",
    "State Space Models for Long Sequences",
    "Our state space model matched or exceeded transformer baselines on all long-range tasks tested.",
    "matched or exceeded transformer baselines",
    ["ENTAILS", "supported by the source", 0.92],
    ["ENTAILS", "supported", 0.91],
    "RESOLVED",
  ),
  claim(
    "d7",
    "Distillation preserves most efficiency gains at inference time.",
    "[23]",
    "Section 5.4",
    "Distilling Efficient Transformers",
    "Distilled students retained 92% of teacher accuracy at a third of the inference cost.",
    "retained 92% of teacher accuracy at a third of the inference cost",
    ["ENTAILS", "figures support the claim", 0.89],
    ["PARTIAL", "'most' is vague but not unfaithful", 0.55],
    "RESOLVED",
  ),
  claim(
    "d8",
    "No single efficient attention variant dominates across all tasks.",
    "[12]",
    "Section 6.1",
    "Long Range Arena",
    "No model was best on every task in the suite.",
    "No model was best on every task in the suite",
    ["ENTAILS", "exact restatement", 0.97],
    ["ENTAILS", "exact restatement", 0.96],
    "RESOLVED",
  ),
];

const r3Claims: ClaimResult[] = [
  claim(
    "e1",
    "Emergent abilities appear abruptly at a specific parameter threshold.",
    "[1]",
    "Section 1.2",
    "Are Emergent Abilities a Mirage?",
    "Apparent abruptness largely disappears when a continuous metric replaces the discontinuous one.",
    "largely disappears when a continuous metric replaces the discontinuous one",
    ["CONTRADICTS", "the source attributes abruptness to metric choice", 0.86],
    ["CONTRADICTS", "directly refuted by the cited work", 0.88],
    "RESOLVED",
  ),
  claim(
    "e2",
    "Chain-of-thought prompting only helps models above 60B parameters.",
    "[4]",
    "Section 2.1",
    "Chain-of-Thought Prompting Elicits Reasoning",
    "Gains became reliable around 100B parameters, with smaller and inconsistent effects below that.",
    "Gains became reliable around 100B parameters",
    ["PARTIAL", "threshold cited is lower than the source's", 0.72],
    ["CONTRADICTS", "the source names a different threshold entirely", 0.7],
    "FLAGGED",
  ),
  claim(
    "e3",
    "Benchmark contamination explains most reported emergence.",
    "[7]",
    "Section 2.4",
    "Data Contamination in LLM Evaluation",
    "Contamination affected a measurable subset of tasks but was not the dominant factor overall.",
    "was not the dominant factor overall",
    ["CONTRADICTS", "'most' is refuted by the source", 0.8],
    ["PARTIAL", "the source allows a partial contribution", 0.66],
    "FLAGGED",
  ),
  claim(
    "e4",
    "Log-linear scaling holds for all downstream tasks studied.",
    "[10]",
    "Section 3.1",
    "Scaling Laws for Neural Language Models",
    "Loss follows a power law; downstream task metrics were not the subject of this analysis.",
    "downstream task metrics were not the subject of this analysis",
    ["CONTRADICTS", "the source studies loss, not downstream tasks", 0.84],
    ["CONTRADICTS", "claim extends the source well past its scope", 0.83],
    "RESOLVED",
  ),
  claim(
    "e5",
    "Instruction tuning removes the need for few-shot examples.",
    "[13]",
    "Section 3.3",
    "Finetuned Language Models Are Zero-Shot Learners",
    "Zero-shot performance improved substantially, though few-shot prompting still helped on many tasks.",
    "few-shot prompting still helped on many tasks",
    ["PARTIAL", "the need is reduced, not removed", 0.78],
    ["CONTRADICTS", "source states few-shot still helps", 0.71],
    "FLAGGED",
  ),
  claim(
    "e6",
    "Smoothed metrics reveal gradual improvement where step functions appeared.",
    "[1]",
    "Section 4.1",
    "Are Emergent Abilities a Mirage?",
    "Under token-level metrics, improvement curves are smooth and predictable.",
    "improvement curves are smooth and predictable",
    ["ENTAILS", "restates the source's method and result", 0.91],
    ["ENTAILS", "supported", 0.9],
    "RESOLVED",
  ),
  claim(
    "e7",
    "Multi-step arithmetic is the clearest case of true emergence.",
    "[16]",
    "Section 4.2",
    "Measuring Arithmetic Reasoning at Scale",
    "Arithmetic accuracy rose sharply under exact-match scoring, which is itself a discontinuous metric.",
    "which is itself a discontinuous metric",
    ["PARTIAL", "the source notes the metric caveat the claim omits", 0.74],
    ["CONTRADICTS", "the caveat undercuts 'clearest case'", 0.69],
    "FLAGGED",
  ),
  claim(
    "e8",
    "Model scale and data scale contribute comparably to capability gains.",
    "[10]",
    "Section 5.1",
    "Scaling Laws for Neural Language Models",
    "Both parameters and data contribute, with exponents of similar order in our fits.",
    "exponents of similar order in our fits",
    ["ENTAILS", "supported by the fitted exponents", 0.85],
    ["ENTAILS", "supported", 0.83],
    "RESOLVED",
  ),
  claim(
    "e9",
    "Evaluation suites underrepresent non-English capabilities.",
    "[21]",
    "Section 5.3",
    "Multilingual Evaluation Gaps",
    "Over 80% of the surveyed benchmarks were English-only.",
    "Over 80% of the surveyed benchmarks were English-only",
    ["ENTAILS", "direct support", 0.93],
    ["ENTAILS", "direct support", 0.92],
    "RESOLVED",
  ),
  claim(
    "e10",
    "Capability forecasts based on emergence claims are unreliable.",
    "[1]",
    "Section 6.1",
    "Are Emergent Abilities a Mirage?",
    "If emergence is metric-induced, forecasts built on it inherit that artifact.",
    "forecasts built on it inherit that artifact",
    ["ENTAILS", "follows the source's own argument", 0.87],
    ["ENTAILS", "supported", 0.85],
    "RESOLVED",
  ),
  claim(
    "e11",
    "Larger models are uniformly better calibrated.",
    "[25]",
    "Section 6.2",
    "Calibration of Large Language Models",
    "Calibration improved with scale before fine-tuning, but RLHF degraded it noticeably.",
    "RLHF degraded it noticeably",
    ["CONTRADICTS", "'uniformly' is refuted by the RLHF result", 0.82],
    ["CONTRADICTS", "the source gives a direct counterexample", 0.81],
    "RESOLVED",
  ),
  claim(
    "e12",
    "Prompt sensitivity decreases as models scale.",
    "[29]",
    "Section 6.4",
    "Prompt Variance Across Model Sizes",
    "Variance across paraphrases narrowed at larger sizes but never approached zero.",
    "narrowed at larger sizes but never approached zero",
    ["ENTAILS", "the directional claim is supported", 0.84],
    ["ENTAILS", "supported as stated", 0.8],
    "RESOLVED",
  ),
  claim(
    "e13",
    "Open models now match closed models on reasoning benchmarks.",
    "[33]",
    "Section 7.1",
    "Open vs Closed Model Evaluations",
    "The gap narrowed to a few points on two of five reasoning suites.",
    "narrowed to a few points on two of five reasoning suites",
    ["PARTIAL", "parity holds only on part of the suite", 0.79],
    ["PARTIAL", "the source shows partial convergence", 0.77],
    "RESOLVED",
  ),
  claim(
    "e14",
    "Human baselines are saturated on most reasoning benchmarks.",
    "[37]",
    "Section 7.2",
    "Human Performance Reference Sets",
    "Human ceilings were reached on three of eleven benchmarks in this collection.",
    "three of eleven benchmarks",
    ["CONTRADICTS", "three of eleven is not 'most'", 0.86],
    ["CONTRADICTS", "the ratio refutes the claim", 0.85],
    "RESOLVED",
  ),
  claim(
    "e15",
    "Internal evaluation logs from frontier labs confirm this pattern.",
    "[41]",
    "Section 7.4",
    "Internal Evaluation Notes (unavailable)",
    "",
    "",
    ["UNVERIFIABLE", "the cited resource is not publicly retrievable", 0.5],
    ["UNVERIFIABLE", "no source text available to review", 0.5],
    "UNVERIFIABLE",
    "missing",
  ),
];

const costLog: CostRow[] = [
  {
    node: "claim_extractor",
    model: "deepseek-v4-lite",
    input_tokens: 1450,
    output_tokens: 320,
    estimated_cost_usd: 0.0007,
  },
  {
    node: "source_retriever",
    model: "deepseek-v4-lite",
    input_tokens: 2380,
    output_tokens: 210,
    estimated_cost_usd: 0.0009,
  },
  {
    node: "entailment_critic",
    model: "deepseek-v4",
    input_tokens: 2100,
    output_tokens: 180,
    estimated_cost_usd: 0.0011,
  },
  {
    node: "redteam_reviewer",
    model: "deepseek-v4",
    input_tokens: 2240,
    output_tokens: 240,
    estimated_cost_usd: 0.0134,
  },
  {
    node: "resolver",
    model: "deepseek-v4",
    input_tokens: 1880,
    output_tokens: 160,
    estimated_cost_usd: 0.0166,
  },
  {
    node: "report_synthesizer",
    model: "deepseek-v4-lite",
    input_tokens: 3100,
    output_tokens: 640,
    estimated_cost_usd: 0.0085,
  },
];

function buildReport(run: Run, paperId: string, claims: ClaimResult[]): Report {
  return {
    run_id: run.run_id,
    paper_id: paperId,
    paper_title: run.paper_title,
    trust_score: run.trust_score,
    total_claims: claims.length,
    resolved_count: claims.filter((c) => c.resolution === "RESOLVED").length,
    flagged_count: claims.filter((c) => c.resolution === "FLAGGED").length,
    unverifiable_count: claims.filter((c) => c.resolution === "UNVERIFIABLE").length,
    claim_results: claims,
    cost_log: costLog,
    total_cost_usd: 0.0412,
  };
}

export const reports: Record<string, Report> = {
  r1: buildReport(runs[0]!, "arxiv:2506.01234", r1Claims),
  r2: buildReport(runs[1]!, "arxiv:2504.09981", r2Claims),
  r3: buildReport(runs[2]!, "arxiv:2503.11220", r3Claims),
};

export function getReport(runId: string): Report | undefined {
  return reports[runId];
}

export const pipelineStages = [
  "Extracting claims",
  "Retrieving sources",
  "Critic reviewing",
  "Red-Team reviewing",
  "Resolving",
  "Synthesizing",
];

export const traceLines = [
  "› loading document · 18 pages",
  "› parsing bibliography · 41 entries",
  "› claim candidates found: 12",
  "› resolving [14] → arxiv:2401.00921",
  "› resolving [3] → arxiv:2004.04906",
  "› critic pass · deepseek-v4",
  "› redteam pass · deepseek-v4",
  "› disagreement on c1 (PARTIAL vs CONTRADICTS)",
  "› disagreement on c11 (CONTRADICTS vs PARTIAL)",
  "› [40] unreachable → marked unverifiable",
  "› resolving verdicts · 12/12",
  "› synthesizing report",
];
