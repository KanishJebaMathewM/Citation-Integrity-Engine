import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import http from 'http';
import { fetchArxivPaper, executeNodePipeline, runsStore, reportsStore } from './pipeline.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Root
app.get('/', (req, res) => {
  res.json({
    name: 'Citation Integrity Engine (Express Node.js Backend)',
    status: 'online',
    version: '1.0.0'
  });
});

// POST /api/runs - Create new citation verification run
app.post('/api/runs', upload.single('file'), async (req, res) => {
  const runId = `run-${Math.random().toString(36).substring(2, 10)}`;
  const inputType = req.body.input_type || 'arxiv_id';
  const arxivId = req.body.arxiv_id || '2103.00020';

  let paperTitle = 'Citation Integrity Paper';
  let paperText = '';
  let references = {};

  if (inputType === 'arxiv_id' || arxivId) {
    const fetched = await fetchArxivPaper(arxivId);
    paperTitle = fetched.title;
    paperText = fetched.fullText;
    references = fetched.references;
  } else if (req.file) {
    paperTitle = req.file.originalname;
    paperText = req.file.buffer.toString('utf-8');
  }

  // Save initial run status
  runsStore.set(runId, {
    run_id: runId,
    status: 'queued',
    current_step: 'queued',
    claims_total: 0,
    claims_processed: 0,
    trace_events: []
  });

  // Execute pipeline in background
  executeNodePipeline(runId, paperTitle, paperText, references).catch((err) => {
    console.error(`Pipeline execution failed for ${runId}:`, err);
  });

  res.json({
    run_id: runId,
    status: 'queued'
  });
});

// GET /api/runs/:run_id - Get run status
app.get('/api/runs/:run_id', (req, res) => {
  const { run_id } = req.params;
  const run = runsStore.get(run_id);

  if (!run) {
    return res.status(404).json({ detail: 'Run not found' });
  }

  res.json({
    run_id: run.run_id,
    status: run.status,
    current_step: run.current_step,
    claims_total: run.claims_total || 0,
    claims_processed: run.claims_processed || 0
  });
});

// GET /api/runs/:run_id/trace - Get live trace stream
app.get('/api/runs/:run_id/trace', (req, res) => {
  const { run_id } = req.params;
  const run = runsStore.get(run_id);

  if (!run) {
    return res.status(404).json({ detail: 'Run not found' });
  }

  res.json({
    run_id,
    events: run.trace_events || []
  });
});

// GET /api/reports/:run_id - Get final trust report
app.get('/api/reports/:run_id', (req, res) => {
  const { run_id } = req.params;
  const report = reportsStore.get(run_id);

  if (!report) {
    return res.status(404).json({ detail: 'Report not found' });
  }

  res.json(report);
});

// GET /api/reports/:run_id/cost - Get token cost ledger
app.get('/api/reports/:run_id/cost', (req, res) => {
  const { run_id } = req.params;
  const report = reportsStore.get(run_id);

  if (!report) {
    return res.status(404).json({ detail: 'Report not found' });
  }

  res.json({
    run_id,
    cost_log: report.cost_log || [],
    total_cost_usd: report.total_cost_usd || 0.0
  });
});

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Citation Integrity Engine (Node.js + Express) running on http://localhost:${PORT}`);
});
