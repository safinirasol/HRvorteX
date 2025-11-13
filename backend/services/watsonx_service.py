# WellMind – VorteX HR Automation
# File: backend/services/watsonx_service.py
# Description: Connects to IBM watsonx.ai to analyze burnout survey responses
# Author: Ahmad Yasser (Technical Architecture)
# License: MIT

import os
import requests

def analyze_text_responses(responses):
    """
    Analyze employee survey responses using IBM watsonx.ai
    
    Args:
        responses (dict): Survey responses with keys like work_hours, stress, workload, support
    
    Returns:
        dict: { 'risk': int (0-100), 'label': str ('Low'|'Medium'|'High'|'Urgent') }
    """
    
    # Check if Watson API is configured
    watson_url = os.getenv('WATSONX_URL')
    watson_key = os.getenv('WATSONX_API_KEY')
    watson_model = os.getenv('WATSON_MODEL', 'wellmind-burnout-detector')
    
    if watson_url and watson_key:
        try:
            headers = {
                'Authorization': f'Bearer {watson_key}',
                'Content-Type': 'application/json'
            }
            payload = {
                'inputs': responses,
                'model': watson_model
            }
            resp = requests.post(watson_url, json=payload, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            
            # Extract score from watsonx response
            score = round(data.get('score', 0.5) * 100)
            label = _get_risk_label(score)
            
            return {'risk': score, 'label': label}
        except Exception as e:
            print(f"Watson API error: {e}, falling back to heuristic")
    
    # Fallback: Simple heuristic scoring
    return _heuristic_analysis(responses)

def _heuristic_analysis(responses):
    """
    Fallback burnout risk scoring when watsonx.ai is unavailable
    Uses weighted scoring of survey responses
    """
    work_hours = int(responses.get('work_hours', 40))
    stress = int(responses.get('stress', 5))
    workload = int(responses.get('workload', 5))
    support = int(responses.get('support', 5))
    sleep = int(responses.get('sleep', 7))
    
    # Weighted scoring formula
    hours_score = min((work_hours / 40) * 35, 35)
    stress_score = (stress / 10) * 30
    workload_score = (workload / 10) * 20
    support_penalty = max(0, (10 - support) / 10 * 10)
    sleep_penalty = max(0, (7 - sleep) / 7 * 5)
    
    risk = round(hours_score + stress_score + workload_score + support_penalty + sleep_penalty)
    risk = min(max(risk, 0), 100)  # clamp 0-100
    
    label = _get_risk_label(risk)
    
    return {'risk': risk, 'label': label}

def _get_risk_label(score):
    """Map risk score to label"""
    if score > 80:
        return 'Urgent'
    elif score > 60:
        return 'High'
    elif score > 40:
        return 'Medium'
    else:
        return 'Low'
