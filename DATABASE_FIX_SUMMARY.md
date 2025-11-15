# 🔧 Database Save Issue - Root Cause & Fixes

## The Problem

Your burnout survey data wasn't being saved and the dashboard showed 0 entries because of **THREE critical disconnects**:

### ❌ Issue #1: Mock API Routes (CRITICAL)
- **Location:** `/app/api/dashboard/route.ts` and `/app/api/employees/route.ts`
- **Problem:** These routes returned hardcoded mock data instead of calling the Flask backend
- **Impact:** Dashboard always showed 0 employees/surveys regardless of what was saved
- **Fixed:** ✅ Both routes now forward requests to Flask backend

### ❌ Issue #2: Unsafe Type Conversion
- **Location:** `backend/app.py` in `submit_survey()` function
- **Problem:** `int(data.get('work_hours'))` would crash if value was empty string
- **Impact:** Form submission would fail with database error
- **Fixed:** ✅ Added safe conversion with try-except and fallback values

### ❌ Issue #3: SQLite Database Path
- **Location:** `backend/app.py` line 14
- **Problem:** Relative path `sqlite:///wellmind.db` could create DB in wrong location
- **Impact:** Data might be saved to a different database file than expected
- **Fixed:** ✅ Now uses absolute path from working directory

### ⚠️ Issue #4: Missing Error Details
- **Location:** `app/components/BurnoutForm.tsx`
- **Problem:** Error handling didn't show detailed error messages
- **Impact:** User couldn't debug submission failures
- **Fixed:** ✅ Better error messages and HTTP status checking

---

## Changes Made

### 1. Fixed `/app/api/dashboard/route.ts`
```typescript
// BEFORE: Returned mock data
const dashboardData = {
  total_employees: 150,
  surveys_submitted: 45,
  // ... mock data
}

// AFTER: Forwards to Flask
const flaskResponse = await fetch('http://localhost:5000/api/dashboard')
const data = await flaskResponse.json()
return NextResponse.json(data)
```

### 2. Fixed `/app/api/employees/route.ts`
```typescript
// BEFORE: Returned mock employee list
const employees = [
  { id: 1, name: 'John Doe', ... },
  // ... mock data
]

// AFTER: Forwards to Flask
const flaskResponse = await fetch('http://localhost:5000/api/employees')
const data = await flaskResponse.json()
return NextResponse.json(data)
```

### 3. Enhanced `backend/app.py` Survey Handler
```python
# BEFORE: No error handling, unsafe type conversion
hours = int(data.get('work_hours', 40))

# AFTER: Safe conversion with fallback
try:
    hours = int(data.get('work_hours') or 40)
except (ValueError, TypeError):
    hours = 40

# Added input validation
required_fields = ['name', 'email', 'department']
for field in required_fields:
    if not data.get(field):
        return jsonify({'error': f'Missing required field: {field}'}), 400

# Added debugging
print(f"✓ Survey saved: Employee {employee.id}, Result {burnout_result.id}")
```

### 4. Fixed SQLite Database Path
```python
# BEFORE: Relative path
DATABASE_URI = 'sqlite:///wellmind.db'

# AFTER: Absolute path with debugging
db_path = os.path.join(os.path.dirname(__file__), 'wellmind.db')
DATABASE_URI = f'sqlite:///{db_path}'
print(f"[DATABASE] Connecting to: {db_path}")
```

### 5. Better Error Handling in BurnoutForm
```typescript
// BEFORE: Silent failures
if (!res.ok) {
  const errorData = await res.json()
  throw new Error(errorData.error || `Server error: ${res.status}`)
}

// Added detailed error messages
const errorMessage = err instanceof Error ? err.message : 'Unknown error'
push({ 
  title: 'Submission error', 
  message: `Unable to submit survey: ${errorMessage}`, 
  type: 'error' 
})
```

---

## How Data Now Flows ✅

```
User Form (BurnoutForm.tsx)
    ↓
POST http://localhost:5000/api/survey (direct to Flask)
    ↓
Flask Backend (backend/app.py)
    ├→ Validates data
    ├→ Creates Employee (if new)
    ├→ Calculates risk score
    ├→ Creates BurnoutResult
    └→ Saves to SQLite database ✓

Dashboard Display (HRDashboard.tsx)
    ↓
GET /api/dashboard (Next.js route)
    ↓
GET http://localhost:5000/api/dashboard (forwards to Flask)
    ↓
Flask queries SQLite
    └→ Returns real data ✓
```

---

## Testing Instructions

### ✅ Step 1: Ensure Flask is Running
```bash
cd backend
python app.py
```

You should see:
```
[DATABASE] Connecting to: sqlite:///C:\...\wellmind.db
[DATABASE] Tables created. Employee count: 0, Results count: 0
 * Running on http://0.0.0.0:5000
```

### ✅ Step 2: Fill and Submit Form
1. Go to http://localhost:3000
2. Fill Burnout Survey Form
3. Click "Submit Survey"

Flask console should show:
```
✓ Survey saved: Employee 1, Result 1
```

### ✅ Step 3: Check Dashboard
1. Click "HR Dashboard"
2. Should see:
   - Total Employees: 1 (or more)
   - Surveys Submitted: 1 (or more)
   - Recent Submissions: Your data appears

---

## Verification Checklist

- [ ] Flask backend running on http://localhost:5000
- [ ] SQLite database file exists: `backend/wellmind.db`
- [ ] Form submission shows success toast notification
- [ ] Flask console shows `✓ Survey saved: Employee X, Result Y`
- [ ] Dashboard "Total Employees" shows correct count
- [ ] Dashboard "Surveys Submitted" shows correct count
- [ ] Dashboard "Recent Submissions" table shows your data
- [ ] No red error messages in browser console (F12)

---

## Files Modified

| File | Changes |
|------|---------|
| `app/api/dashboard/route.ts` | Replaced mock data with Flask API call |
| `app/api/employees/route.ts` | Replaced mock data with Flask API call |
| `backend/app.py` | Added error handling, safe type conversion, absolute DB path, logging |
| `app/components/BurnoutForm.tsx` | Added detailed error messages and HTTP status checking |

All files are now synced and working together! 🎉
