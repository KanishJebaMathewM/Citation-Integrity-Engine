# Deploying Citation Integrity Engine Backend to Render.com

This guide provides step-by-step instructions for deploying the Express Node.js backend to Render as a free Web Service.

---

## Quick Deployment Steps

### 1. Push to GitHub
Ensure all latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `KanishJebaMathewM/Citation-Integrity-Engine`.

### 3. Service Configuration
Render will automatically detect `render.yaml` or you can manually enter these settings:

| Parameter | Value |
| :--- | :--- |
| **Name** | `citation-integrity-engine-backend` |
| **Environment** | `Node` |
| **Region** | Select closest region (e.g. Singapore / Oregon) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` |
| **Health Check Path** | `/` |

---

## Environment Variables Configuration

In your Render Web Service dashboard, go to **Environment** and add the following keys from your local `.env`:

```env
OPENAI_API_KEY=your_openai_key_here
AGENT_ROUTER_API_KEY=your_agent_router_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
TAVILY_API_KEY=your_tavily_key_here
NCBI_API_KEY=your_ncbi_key_here
NODE_ENV=production
```

---

## Verification

Once deployment completes, Render will provide a public URL (e.g. `https://citation-integrity-engine-backend.onrender.com`).

You can test the health endpoint in your browser or terminal:
```bash
curl https://citation-integrity-engine-backend.onrender.com/
```

Expected Response:
```json
{
  "name": "Citation Integrity Engine (Express Node.js Backend)",
  "status": "online",
  "version": "1.0.0"
}
```

---

## Connecting the Vercel / Netlify Frontend

When deploying the React frontend on Vercel or Netlify, add this environment variable to your frontend build settings:

```env
VITE_API_BASE_URL=https://citation-integrity-engine-backend.onrender.com
```
