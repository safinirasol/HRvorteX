// WellMind – VorteX HR Automation
// File: frontend/src/pages/SurveyForm.jsx
// Description: Employee burnout survey form component
// Author: Team VorteX
// License: MIT

import { useState } from 'react'
import { submitSurvey, analyzeBurnout } from '../api/client'

export default function SurveyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    work_hours: 40,
    stress: 5,
    workload: 5,
    support: 5,
    sleep: 7
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Step 1: Submit survey
      const surveyResp = await submitSurvey({
        name: formData.name,
        email: formData.email,
        department: formData.department
      })

      // Step 2: Analyze responses
      const analyzeResp = await analyzeBurnout({
        employee_id: surveyResp.employee_id,
        responses: {
          work_hours: formData.work_hours,
          stress: formData.stress,
          workload: formData.workload,
          support: formData.support,
          sleep: formData.sleep
        }
      })

      setResult(analyzeResp)
    } catch (err) {
      console.error(err)
      alert('Error submitting survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-card p-8">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent" style={{backgroundImage:'var(--gradient-brand)'}}>
          Employee Wellness Survey
        </h2>
        
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input 
                id="name" 
                className="form-input" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                className="form-input" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="department">Department</label>
              <select 
                id="department" 
                className="form-input"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Sales</option>
                <option>HR</option>
                <option>Operations</option>
                <option>Marketing</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="hours">Work Hours per Week: {formData.work_hours}h</label>
              <input 
                id="hours" 
                type="range" 
                min="20" 
                max="80" 
                className="w-full"
                value={formData.work_hours}
                onChange={e => setFormData({...formData, work_hours: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="stress">Stress Level (1-10): {formData.stress}</label>
              <input 
                id="stress" 
                type="range" 
                min="1" 
                max="10" 
                className="w-full"
                value={formData.stress}
                onChange={e => setFormData({...formData, stress: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="workload">Workload Intensity (1-10): {formData.workload}</label>
              <input 
                id="workload" 
                type="range" 
                min="1" 
                max="10" 
                className="w-full"
                value={formData.workload}
                onChange={e => setFormData({...formData, workload: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="support">Team Support (1-10): {formData.support}</label>
              <input 
                id="support" 
                type="range" 
                min="1" 
                max="10" 
                className="w-full"
                value={formData.support}
                onChange={e => setFormData({...formData, support: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label htmlFor="sleep">Sleep Hours per Night: {formData.sleep}h</label>
              <input 
                id="sleep" 
                type="range" 
                min="3" 
                max="10" 
                className="w-full"
                value={formData.sleep}
                onChange={e => setFormData({...formData, sleep: parseInt(e.target.value)})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
            >
              {loading ? 'Analyzing...' : 'Submit Survey'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold mb-4 ${
              result.label === 'Urgent' ? 'bg-red-100 text-red-700' :
              result.label === 'High' ? 'bg-orange-100 text-orange-700' :
              result.label === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {result.label} Risk
            </div>
            <p className="text-4xl font-bold mb-2">{result.risk}/100</p>
            <p className="text-slate-600 mb-4">Burnout Risk Score</p>
            <p className="text-sm text-slate-500 mb-6">
              ✓ Blockchain verified: {result.hedera_tx}<br/>
              ✓ Workflow status: {result.orchestrate}
            </p>
            <button onClick={() => setResult(null)} className="btn btn-secondary">
              Take Another Survey
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
