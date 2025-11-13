// WellMind – VorteX HR Automation
// File: frontend/src/api/client.js
// Description: API client for backend communication
// Author: Team VorteX
// License: MIT

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!response.ok) throw new Error(`API error: ${response.statusText}`)
  return response.json()
}

export const submitSurvey = (data) => 
  apiCall('/api/survey', { method: 'POST', body: JSON.stringify(data) })

export const analyzeBurnout = (data) => 
  apiCall('/api/analyze', { method: 'POST', body: JSON.stringify(data) })

export const getDashboardData = () => 
  apiCall('/api/dashboard')

export const getEmployees = () => 
  apiCall('/api/employees')
