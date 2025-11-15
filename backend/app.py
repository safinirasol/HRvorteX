# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, BurnoutResult, Employee
from services.watsonx_service import analyze_text_responses
from services.hedera_service import store_hash_on_hedera
from services.orchestrate_service import trigger_workflow
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Database config
# Use absolute path for SQLite database
db_path = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(os.path.dirname(__file__), 'wellmind.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = db_path
print(f"[DATABASE] Connecting to: {db_path}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    print(f"[DATABASE] Tables created. Employee count: {Employee.query.count()}, Results count: {BurnoutResult.query.count()}")

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'VorteX WellMind Backend'})

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict burnout risk based on form data"""
    data = request.json or {}
    hours = int(data.get('work_hours') or 40)
    stress = int(data.get('stress') or 5)
    score = round((hours / 40) * 50 + (stress / 10) * 50)
    risk = 'High' if score >= 70 else 'Medium' if score >= 40 else 'Low'
    return jsonify({'risk': risk, 'score': score})

@app.route('/api/survey', methods=['POST'])
def submit_survey():
    """Accept employee burnout survey data and store in database"""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'department']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Find or create employee
        employee = Employee.query.filter_by(email=data.get('email')).first()
        if not employee:
            employee = Employee(
                name=data.get('name'),
                department=data.get('department', 'General'),
                email=data.get('email')
            )
            db.session.add(employee)
            db.session.flush()  # Flush to get the ID without committing
        
        # Calculate burnout risk with safe conversion
        try:
            hours = int(data.get('work_hours') or 40)
        except (ValueError, TypeError):
            hours = 40
        
        try:
            stress = int(data.get('stress') or 5)
        except (ValueError, TypeError):
            stress = 5
        
        score = round((hours / 40) * 50 + (stress / 10) * 50)
        risk = 'High' if score >= 70 else 'Medium' if score >= 40 else 'Low'
        
        # Create burnout result
        burnout_result = BurnoutResult(
            employee_id=employee.id,
            risk_score=score,
            label=risk,
            work_hours=hours,
            stress_level=stress,
            orchestrate_status='pending',
            watson_timestamp=datetime.utcnow()
        )
        db.session.add(burnout_result)
        db.session.commit()
        
        print(f"✓ Survey saved: Employee {employee.id}, Result {burnout_result.id}")
    except Exception as e:
        db.session.rollback()
        print(f"✗ Survey submission error: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    
    # Store hash on Hedera
    try:
        tx_id = store_hash_on_hedera(burnout_result.to_dict())
        burnout_result.hedera_txid = tx_id
        db.session.commit()
    except Exception as e:
        print(f"Hedera error: {e}")
        burnout_result.hedera_txid = 'SIMULATED_TX'
        db.session.commit()
    
    return jsonify({
        'employee_id': employee.id,
        'result_id': burnout_result.id,
        'risk': risk,
        'score': score,
        'message': 'Survey submitted successfully'
    })

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    """Provide risk and blockchain data for HR dashboard"""
    total_employees = Employee.query.count()
    total_surveys = BurnoutResult.query.count()
    
    high_risk = BurnoutResult.query.filter(BurnoutResult.risk_score >= 70).count()
    medium_risk = BurnoutResult.query.filter(BurnoutResult.risk_score >= 40, BurnoutResult.risk_score < 70).count()
    low_risk = BurnoutResult.query.filter(BurnoutResult.risk_score < 40).count()
    
    avg_risk = db.session.query(db.func.avg(BurnoutResult.risk_score)).scalar() or 0
    avg_hours = db.session.query(db.func.avg(BurnoutResult.work_hours)).scalar() or 0
    avg_stress = db.session.query(db.func.avg(BurnoutResult.stress_level)).scalar() or 0
    
    # FIXED: Department breakdown - count distinct employees per department
    departments = db.session.query(
        Employee.department,
        db.func.count(db.func.distinct(Employee.id)),  # Count unique employees
        db.func.avg(BurnoutResult.risk_score)
    ).outerjoin(BurnoutResult).group_by(Employee.department).all()
    
    department_data = [
        {'department': dept, 'count': count, 'avg_risk': round(dept_avg_risk or 0, 1)}
        for dept, count, dept_avg_risk in departments
    ]
    
    # Recent submissions
    recent_results = BurnoutResult.query.order_by(BurnoutResult.watson_timestamp.desc()).limit(10).all()
    
    # DEBUG: Check all employees
    all_employees = Employee.query.all()
    print(f"[DEBUG] Total employees in DB: {len(all_employees)}")
    for emp in all_employees:
        submissions = BurnoutResult.query.filter_by(employee_id=emp.id).count()
        print(f"[DEBUG] Employee: {emp.name}, Dept: {emp.department}, Submissions: {submissions}")

    return jsonify({
        'summary': {
            'total_employees': total_employees,
            'total_surveys': total_surveys,
            'high_risk_count': high_risk,
            'medium_risk_count': medium_risk,
            'low_risk_count': low_risk,
            'average_risk': round(avg_risk, 1),
            'average_hours': round(avg_hours, 1),
            'average_stress': round(avg_stress, 1)
        },
        'departments': department_data,
        'recent_submissions': [r.to_dict() for r in recent_results]
    })

@app.route('/api/employees', methods=['GET'])
def list_employees():
    """List all employees with their latest burnout status"""
    employees = Employee.query.all()
    print(f"[DEBUG] Employees endpoint: returning {len(employees)} employees")  # Debug line
    data = []
    for emp in employees:
        latest = BurnoutResult.query.filter_by(employee_id=emp.id).order_by(BurnoutResult.watson_timestamp.desc()).first()
        data.append({
            'id': emp.id,
            'name': emp.name,
            'department': emp.department,
            'email': emp.email,
            'latest_risk_score': latest.risk_score if latest else None,
            'latest_risk_label': latest.label if latest else 'No data',
            'work_hours': latest.work_hours if latest else None,
            'stress_level': latest.stress_level if latest else None,
            'last_submission': latest.watson_timestamp.isoformat() if latest else None,
            'hedera_verified': bool(latest.hedera_txid) if latest else False
        })
    return jsonify(data)

@app.route('/api/employee/<int:employee_id>/history', methods=['GET'])
def employee_history(employee_id):
    """Get submission history for a specific employee"""
    employee = Employee.query.get_or_404(employee_id)
    submissions = BurnoutResult.query.filter_by(employee_id=employee_id).order_by(BurnoutResult.watson_timestamp.desc()).all()
    
    return jsonify({
        'employee': {
            'id': employee.id,
            'name': employee.name,
            'department': employee.department,
            'email': employee.email
        },
        'submissions': [s.to_dict() for s in submissions]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)