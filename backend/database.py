# database.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    burnout_results = db.relationship('BurnoutResult', backref='employee', lazy=True)

class BurnoutResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    label = db.Column(db.String(20), nullable=False)  # High, Medium, Low
    work_hours = db.Column(db.Integer)
    stress_level = db.Column(db.Integer)
    hedera_txid = db.Column(db.String(100))
    orchestrate_status = db.Column(db.String(20), default='pending')
    watson_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'employee_name': self.employee.name,
            'department': self.employee.department,
            'risk_score': self.risk_score,
            'label': self.label,
            'work_hours': self.work_hours,
            'stress_level': self.stress_level,
            'hedera_txid': self.hedera_txid,
            'orchestrate_status': self.orchestrate_status,
            'watson_timestamp': self.watson_timestamp.isoformat()
        }