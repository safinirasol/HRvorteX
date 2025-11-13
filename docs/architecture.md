# VorteX WellMind – Architecture Overview

## System Components

### 1. Frontend (React + Tailwind)
- **SurveyForm**: Employee burnout self-assessment
- **Dashboard**: HR analytics with KPIs, charts, employee table
- **ChartCard**: Risk trend visualization (recharts)

### 2. Backend (Flask + PostgreSQL)
- **API Routes**:
  - `POST /api/survey` – Accept employee data
  - `POST /api/analyze` – Trigger AI analysis + blockchain + orchestrate
  - `GET /api/dashboard` – Return stats for HR
  - `GET /api/employees` – List all employees with status

### 3. AI Layer (IBM watsonx.ai)
- **Service**: `watsonx_service.py`
- **Model**: Granite or custom fine-tuned burnout detector
- **Fallback**: Heuristic scoring (hours, stress, workload, support, sleep)

### 4. Workflow Automation (IBM watsonx Orchestrate)
- **Service**: `orchestrate_service.py`
- **Workflows**:
  - Email HR for high/urgent risk
  - Create follow-up tasks
  - Send Slack alerts
  - Wellness nudges to employees

### 5. Blockchain Audit (Hedera Hashgraph)
- **Service**: `hedera_service.py`
- **Purpose**: Immutable audit trail of all burnout predictions
- **Storage**: SHA-256 hash of result stored on testnet

### 6. Database (PostgreSQL)
- **Tables**:
  - `employees` (id, name, department, email)
  - `burnout_results` (id, employee_id, risk_score, label, hedera_txid, orchestrate_status)

## Data Flow

```
Employee → Survey Form → Flask /api/analyze
                           ↓
                    watsonx.ai analysis
                           ↓
                  PostgreSQL save result
                           ↓
                  Hedera store hash
                           ↓
                  Orchestrate trigger workflow
                           ↓
                  HR Dashboard updates
```

## Deployment

### Local Development
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

### Docker Compose
```bash
docker-compose up --build
```

Accesses:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: postgresql://localhost:5432/wellmind

## Security & Privacy
- Employee data encrypted at rest (PostgreSQL SSL)
- Blockchain provides tamper-proof audit trail
- HIPAA-compliant data handling (future)
- Role-based access control (HR vs Employee views)

## Scalability
- Horizontal scaling via Docker/Kubernetes
- Async job queue for AI inference (Celery)
- Redis cache for dashboard metrics
- CDN for frontend assets
