# Database Flow Testing Guide 🧪

## Quick Start Checklist

### 1️⃣ Verify Flask Backend is Running
```powershell
cd c:\Users\User\Desktop\HACKATHON\vorteX\HRvorteX\backend
python app.py
```

**Expected Output:**
```
[DATABASE] Connecting to: sqlite:///C:\Users\User\Desktop\HACKATHON\vorteX\HRvorteX\backend\wellmind.db
[DATABASE] Tables created. Employee count: X, Results count: Y
 * Running on http://0.0.0.0:5000
```

### 2️⃣ Test Flask Endpoints Directly

**Test Health Check:**
```powershell
$res = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
$res.Content | ConvertFrom-Json
```

**Test Survey Submission:**
```powershell
$body = @{
    name = "Test Employee"
    email = "test@company.com"
    department = "Engineering"
    work_hours = "50"
    stress = "8"
} | ConvertTo-Json

$res = Invoke-WebRequest -Uri "http://localhost:5000/api/survey" -Method POST -ContentType "application/json" -Body $body
$res.Content | ConvertFrom-Json
```

**Expected Output:**
```json
{
  "employee_id": 1,
  "result_id": 1,
  "risk": "High",
  "score": 90,
  "message": "Survey submitted successfully"
}
```

**Test Dashboard Data:**
```powershell
$res = Invoke-WebRequest -Uri "http://localhost:5000/api/dashboard" -Method GET
$res.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Output Should Include:**
```
total_employees: 1
total_surveys: 1
high_risk_count: 1
```

### 3️⃣ Verify SQLite Database File

**Check if database file exists:**
```powershell
ls c:\Users\User\Desktop\HACKATHON\vorteX\HRvorteX\backend\wellmind.db
```

**Query database directly:**
```powershell
# Install sqlite3 if needed, then:
sqlite3 c:\Users\User\Desktop\HACKATHON\vorteX\HRvorteX\backend\wellmind.db
# Inside sqlite3 prompt:
> .tables
> SELECT * FROM employee;
> SELECT * FROM burnout_result;
> .quit
```

### 4️⃣ Test Frontend Form Submission

1. Open browser: `http://localhost:3000`
2. Fill in the Burnout Form with test data
3. Click "Submit Survey"
4. Check:
   - ✅ Toast notification appears
   - ✅ Flask console shows `✓ Survey saved: Employee X, Result Y`
   - ✅ Database file size increases

### 5️⃣ Verify Dashboard Updates

1. Click on "HR Dashboard"
2. Check:
   - ✅ "Total Employees" > 0
   - ✅ "Surveys Submitted" > 0
   - ✅ "Recent Submissions" shows your test data

---

## Common Issues & Solutions

### ❌ Dashboard shows "0" for all metrics

**Problem:** Next.js API not forwarding to Flask
**Solution:** Check that `/api/dashboard` and `/api/employees` routes call Flask backend

**Verify with:**
```powershell
# Check Next.js console for errors
# Check Flask console for incoming requests
# Try Flask endpoint directly: http://localhost:5000/api/dashboard
```

### ❌ Form submission fails silently

**Problem:** BurnoutForm not calling Flask correctly
**Solution:** Check form handler is calling `http://localhost:5000/api/survey`

**Verify with:**
```powershell
# Check browser console (F12) for errors
# Check Flask console for incoming POST requests
```

### ❌ Database file not created/data not saved

**Problem:** SQLite path issue
**Solution:** Check that Flask has write permissions to backend directory

**Verify with:**
```powershell
# Check Flask startup logs show correct database path
# Check file exists: ls backend\wellmind.db
# Test write permissions
```

---

## File Locations Summary

| Component | Path |
|-----------|------|
| Flask Backend | `backend/app.py` |
| Database | `backend/wellmind.db` (created on first run) |
| Form Component | `app/components/BurnoutForm.tsx` |
| Dashboard Component | `app/components/HRDashboard.tsx` |
| Next.js API Routes | `app/api/dashboard/route.ts`, `app/api/employees/route.ts` |
| Environment Config | `.env` |

---

## Database Schema

```
Employee Table:
- id (int, primary key)
- name (string)
- email (string, unique)
- department (string)
- created_at (datetime)

BurnoutResult Table:
- id (int, primary key)
- employee_id (int, foreign key → Employee.id)
- risk_score (int)
- label (string: High/Medium/Low)
- work_hours (int)
- stress_level (int)
- hedera_txid (string, nullable)
- orchestrate_status (string)
- watson_timestamp (datetime)
```
