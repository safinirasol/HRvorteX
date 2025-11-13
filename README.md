# Burnout Detector — Next.js Starter

This is a hackathon-ready starter template for:
**AI-powered Employee Burnout Detection** integrated with **IBM Watson Orchestrate** and **Hedera**.

What’s included:
- Next.js (App Router + TypeScript) minimal frontend
- API routes for /api/predict, /api/watson, /api/hedera
- Mock AI prediction (local rule-based)
- Watson Orchestrate placeholder call
- Hedera SDK testnet example (requires env vars)
- Tailwind CSS setup (minimal)

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with keys (see `.env.local.example`).

3. Run development server:
```bash
npm run dev
```

Open http://localhost:3000

## Run the backend (optional)

If you want the Next.js API to forward prediction requests to a local Flask AI backend, run the backend alongside the frontend.

On Windows PowerShell:

```powershell
# create a virtual environment
python -m venv .venv
# activate the venv (PowerShell)
.\.venv\Scripts\Activate.ps1
# install requirements
pip install -r ai-backend\requirements.txt
# run the Flask app
python ai-backend\app.py
```

Then set `AI_BACKEND_URL` in your `.env.local` (at the project root) so the Next.js server forwards to the backend. Example:

```
AI_BACKEND_URL=http://localhost:5000/predict
NEXT_PUBLIC_URL=http://localhost:3000
```

By default the frontend uses a built-in mock predictor if `AI_BACKEND_URL` is not set.


## Run the backend (optional)

If you want the Next.js API to forward prediction requests to a local Flask AI backend, run the backend alongside the frontend.

On Windows PowerShell:

```powershell
# create a virtual environment
python -m venv .venv
# activate the venv (PowerShell)
.\.venv\Scripts\Activate.ps1
# install requirements
pip install -r ai-backend\requirements.txt
# run the Flask app
python ai-backend\app.py
```

Then set `AI_BACKEND_URL` in your `.env.local` (at the project root) so the Next.js server forwards to the backend. Example:

```
AI_BACKEND_URL=http://localhost:5000/predict
```

By default the frontend will use a built-in mock predictor if `AI_BACKEND_URL` is not set.

