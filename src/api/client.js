const API_BASE = '/api';

export async function createRun(formData) {
  const res = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Failed to initiate citation verification run');
  }
  return res.json();
}

export async function getRunStatus(runId) {
  const res = await fetch(`${API_BASE}/runs/${runId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch run status');
  }
  return res.json();
}

export async function getRunTrace(runId) {
  const res = await fetch(`${API_BASE}/runs/${runId}/trace`);
  if (!res.ok) {
    throw new Error('Failed to fetch trace events');
  }
  return res.json();
}

export async function getReport(runId) {
  const res = await fetch(`${API_BASE}/reports/${runId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch trust report');
  }
  return res.json();
}

export async function getCostBreakdown(runId) {
  const res = await fetch(`${API_BASE}/reports/${runId}/cost`);
  if (!res.ok) {
    throw new Error('Failed to fetch cost breakdown');
  }
  return res.json();
}
