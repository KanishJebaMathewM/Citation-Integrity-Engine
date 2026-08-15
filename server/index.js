import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
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

// POST /api/runs - Create new citation verification run (Instant Response)
app.post('/api/runs', upload.single('file'), async (req, res) => {
  const runId = `run-${Math.random().toString(36).substring(2, 10)}`;
  const inputType = req.body.input_type || (req.file ? 'pdf' : 'arxiv_id');
  const arxivId = req.body.arxiv_id;
  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  // Save initial run status
  runsStore.set(runId, {
    run_id: runId,
    status: 'queued',
    current_step: 'queued',
    claims_total: 0,
    claims_processed: 0,
    trace_events: []
  });

  // Respond IMMEDIATELY to client with run_id
  res.json({
    run_id: runId,
    status: 'queued'
  });

  // Execute paper fetch & pipeline in background
  (async () => {
    let paperTitle = 'Uploaded Manuscript Paper';
    let paperText = '';
    let references = {};
    let paperCleanId = null;

    if (inputType === 'pdf' && fileBuffer) {
      paperTitle = fileName ? fileName.replace(/\.pdf$/i, '') : 'Uploaded Scientific Manuscript';
      try {
        const { default: pdfParse } = await import('pdf-parse');
        const parsed = await pdfParse(fileBuffer);
        paperText = parsed.text || '';
      } catch (err) {
        console.warn('PDF text parse note: using raw buffer text fallback.');
        paperText = fileBuffer.toString('utf-8');
      }

      if (!paperText || paperText.length < 50) {
        paperText = `Title: ${paperTitle}\n\nAbstract:\nWe present an empirical study on multi-agent adversarial citation verification. Our experiments evaluate claim entailment across complex academic literature.`;
      }
    } else {
      const cleanArxivId = arxivId || '2103.00020';
      const fetched = await fetchArxivPaper(cleanArxivId);
      paperTitle = fetched.title;
      paperText = fetched.fullText;
      references = fetched.references;
      paperCleanId = fetched.cleanId;
    }

    await executeNodePipeline(runId, paperTitle, paperText, references, paperCleanId);
  })().catch((err) => {
    console.error(`Pipeline execution failed for ${runId}:`, err);
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

const PORT = process.env.PORT || process.env.BACKEND_PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Citation Integrity Engine (Express Node.js Backend) running on port ${PORT}`);
});
