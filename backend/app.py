# WellMind – VorteX HR Automation
# File: backend/app.py
# Description: Main Flask entry point for survey analysis, watsonx AI, orchestrate callbacks, and dashboard
# Author: Ahmad Yasser (Technical Architecture)
# License: MIT

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, BurnoutResult, Employee
from services.watsonx_service import analyze_text_responses
from services.hedera_service import store_hash_on_hedera
from services.orchestrate_service import trigger_workflow
import os

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/wellmind')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'VorteX WellMind Backend'})

@app.route('/api/survey', methods=['POST'])
def submit_survey():
    """Accept employee burnout survey data"""
    data = request.json
    employee = Employee.query.filter_by(email=data.get('email')).first()
    if not employee:
        employee = Employee(
            name=data.get('name'),
            department=data.get('department', 'General'),
            email=data.get('email')
        )
        db.session.add(employee)
        db.session.commit()
    
    return jsonify({
        'employee_id': employee.id,
        'message': 'Survey received, processing...'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Main analysis endpoint:
    1. Call watsonx.ai for burnout prediction
    2. Store result in PostgreSQL
    3. Send hash to Hedera Hashgraph
    4. Trigger Watson Orchestrate workflow
    """
    data = request.json
    employee_id = data.get('employee_id')
    responses = data.get('responses', {})
    
    # Step 1: AI Analysis
    result = analyze_text_responses(responses)
    
    # Step 2: Store in DB
    record = BurnoutResult(
        employee_id=employee_id,
        risk_score=result['risk'],
        label=result['label'],
        orchestrate_status='pending'
    )
    db.session.add(record)
    db.session.commit()
    
    # Step 3: Blockchain audit
    try:
        tx_id = store_hash_on_hedera(record.to_dict())
        record.hedera_txid = tx_id
        db.session.commit()
    except Exception as e:
        print(f"Hedera error: {e}")
        record.hedera_txid = 'SIMULATED_TX'
        db.session.commit()
    
    # Step 4: Trigger orchestrate workflow
    try:
        workflow_resp = trigger_workflow(record.to_dict())
        record.orchestrate_status = 'triggered'
        db.session.commit()
    except Exception as e:
        print(f"Orchestrate error: {e}")
        record.orchestrate_status = 'failed'
        db.session.commit()
    
    return jsonify({
        'risk': result['risk'],
        'label': result['label'],
        'hedera_tx': record.hedera_txid,
        'orchestrate': record.orchestrate_status
    })

@app.route('/api/orchestrate/callback', methods=['POST'])
def orchestrate_callback():
    """Receive workflow status updates from Watson Orchestrate"""
    data = request.json
    result_id = data.get('result_id')
    status = data.get('status')
    
    record = BurnoutResult.query.get(result_id)
    if record:
        record.orchestrate_status = status
        db.session.commit()
    
    return jsonify({'status': 'callback received'})

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    """Provide risk and blockchain data for HR dashboard"""
    results = BurnoutResult.query.order_by(BurnoutResult.watson_timestamp.desc()).limit(50).all()
    flagged = BurnoutResult.query.filter(BurnoutResult.risk_score > 60).count()
    avg_risk = db.session.query(db.func.avg(BurnoutResult.risk_score)).scalar() or 0
    verified = BurnoutResult.query.filter(BurnoutResult.hedera_txid != None).count()
    
    return jsonify({
        'flagged_employees': flagged,
        'average_risk': round(avg_risk, 1),
        'blockchain_verified': verified,
        'recent_results': [r.to_dict() for r in results]
    })

@app.route('/api/employees', methods=['GET'])
def list_employees():
    """List all employees with their latest burnout status"""
    employees = Employee.query.all()
    data = []
    for emp in employees:
        latest = BurnoutResult.query.filter_by(employee_id=emp.id).order_by(BurnoutResult.watson_timestamp.desc()).first()
        data.append({
            'id': emp.id,
            'name': emp.name,
            'department': emp.department,
            'email': emp.email,
            'latest_risk': latest.risk_score if latest else None,
            'latest_label': latest.label if latest else 'N/A'
        })
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
