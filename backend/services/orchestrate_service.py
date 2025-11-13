# WellMind – VorteX HR Automation
# File: backend/services/orchestrate_service.py
# Description: Triggers IBM watsonx Orchestrate workflows for HR alerts and actions
# Author: Ahmad Yasser (Technical Architecture)
# License: MIT

import os
import requests

def trigger_workflow(record):
    """
    Trigger Watson Orchestrate workflow based on burnout risk level
    
    Args:
        record (dict): BurnoutResult with employee_id, risk_score, label
    
    Returns:
        dict: Orchestrate API response
    """
    
    orchestrate_url = os.getenv('ORCHESTRATE_URL')
    orchestrate_key = os.getenv('ORCHESTRATE_API_KEY')
    
    if not orchestrate_url or not orchestrate_key:
        print("Orchestrate not configured, simulating workflow trigger")
        return _simulate_workflow(record)
    
    try:
        payload = {
            'employee_id': record.get('employee_id'),
            'employee_name': record.get('employee_name', 'Unknown'),
            'risk_score': record.get('risk_score'),
            'label': record.get('label'),
            'timestamp': record.get('timestamp')
        }
        
        headers = {
            'Authorization': f'Bearer {orchestrate_key}',
            'Content-Type': 'application/json'
        }
        
        resp = requests.post(orchestrate_url, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        
        result = resp.json()
        print(f"Orchestrate workflow triggered: {result}")
        return result
        
    except Exception as e:
        print(f"Orchestrate API error: {e}, falling back to simulation")
        return _simulate_workflow(record)

def _simulate_workflow(record):
    """Simulate workflow trigger for demo/testing"""
    risk_score = record.get('risk_score', 0)
    label = record.get('label', 'Low')
    
    actions = []
    
    if risk_score > 80:
        actions.append('urgent_hr_alert')
        actions.append('manager_notification')
        actions.append('schedule_1on1')
    elif risk_score > 60:
        actions.append('hr_notification')
        actions.append('wellness_resources_email')
    elif risk_score > 40:
        actions.append('wellness_nudge')
    
    return {
        'workflow_id': f'sim_{record.get("id", "unknown")}',
        'status': 'triggered',
        'actions': actions,
        'level': label
    }
