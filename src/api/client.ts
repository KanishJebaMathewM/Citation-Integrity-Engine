export type RunCreateResponse = {
  run_id: string;
  status: string;
};

export type RunStatusResponse = {
  run_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  current_step: string;
  claims_total: number;
  claims_processed: number;
};

export type TraceEvent = {
  timestamp?: string;
  node: string;
  summary: string;
  tokens_used?: number;
};

export type TraceResponse = {
  run_id: string;
  events: TraceEvent[];
};

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

export type CostBreakdownResponse = {
  run_id: string;
  cost_log: CostRow[];
  total_cost_usd: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function createRun(formData: FormData): Promise<RunCreateResponse> {
  const res = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to initiate citation verification: ${errorText}`);
  }
  return res.json();
}

export async function getRunStatus(runId: string): Promise<RunStatusResponse> {
  const res = await fetch(`${API_BASE}/runs/${runId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch run status');
  }
  return res.json();
}

export async function getRunTrace(runId: string): Promise<TraceResponse> {
  const res = await fetch(`${API_BASE}/runs/${runId}/trace`);
  if (!res.ok) {
    throw new Error('Failed to fetch trace events');
  }
  return res.json();
}

export async function getReport(runId: string): Promise<Report> {
  const res = await fetch(`${API_BASE}/reports/${runId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch trust report');
  }
  return res.json();
}

export async function getCostBreakdown(runId: string): Promise<CostBreakdownResponse> {
  const res = await fetch(`${API_BASE}/reports/${runId}/cost`);
  if (!res.ok) {
    throw new Error('Failed to fetch cost breakdown');
  }
  return res.json();
}
