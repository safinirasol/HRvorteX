# WellMind – VorteX HR Automation
# File: backend/database.py
# Description: SQLAlchemy models for Employee and BurnoutResult tables
# Author: Ahmad Yasser (Technical Architecture)
# License: MIT

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    
    # Relationship
    results = db.relationship('BurnoutResult', backref='employee', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'email': self.email
        }

class BurnoutResult(db.Model):
    __tablename__ = 'burnout_results'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)  # 0-100
    label = db.Column(db.String(20), nullable=False)  # Low, Medium, High, Urgent
    watson_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    hedera_txid = db.Column(db.String(200))
    orchestrate_status = db.Column(db.String(20), default='pending')
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'employee_name': self.employee.name if self.employee else 'Unknown',
            'risk_score': self.risk_score,
            'label': self.label,
            'timestamp': self.watson_timestamp.isoformat(),
            'hedera_txid': self.hedera_txid,
            'orchestrate_status': self.orchestrate_status
        }
