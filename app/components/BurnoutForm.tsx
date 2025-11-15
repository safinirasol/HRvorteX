// burnoutform.tsx
'use client'
import { useState } from 'react'
import { useToast } from './Toast'

export default function BurnoutForm() {
  const { push } = useToast()
  const [data, setData] = useState({ 
    name: '', 
    email: '', 
    department: '', 
    work_hours: '', 
    stress: '' 
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }
// In burnoutform.tsx, update the fetch URLs:
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)
  try {
    // Call Flask backend directly
    const res = await fetch('http://localhost:5000/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || `Server error: ${res.status}`)
    }
    
    const result = await res.json()
    
    // Get prediction from Flask
    const predictRes = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!predictRes.ok) {
      throw new Error(`Prediction failed: ${predictRes.status}`)
    }
    
    const predictResult = await predictRes.json()
    
    push({
      title: 'Survey Submitted',
      message: `Thank you ${data.name}! Your burnout risk: ${predictResult.risk}. Employee ID: ${result.employee_id}`,
      type: predictResult.risk === 'High' ? 'error' : predictResult.risk === 'Medium' ? 'info' : 'success'
    })
    
    // Reset form
    setData({ name: '', email: '', department: '', work_hours: '', stress: '' })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    push({ 
      title: 'Submission error', 
      message: `Unable to submit survey: ${errorMessage}`, 
      type: 'error' 
    })
    console.error('Form submission error:', err)
  } finally {
    setLoading(false)
  }
}

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="form-field">
        <label htmlFor="name">Full Name *</label>
        <input 
          id="name" 
          className="form-input" 
          placeholder="Jane Doe" 
          value={data.name} 
          onChange={e => handleChange('name', e.target.value)} 
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email *</label>
        <input 
          id="email" 
          className="form-input" 
          type="email" 
          placeholder="jane.doe@company.com" 
          value={data.email} 
          onChange={e => handleChange('email', e.target.value)} 
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="department">Department *</label>
        <select 
          id="department" 
          className="form-input" 
          value={data.department} 
          onChange={e => handleChange('department', e.target.value)} 
          required
        >
          <option value="">Select Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="hours">Work Hours / week</label>
        <input 
          id="hours" 
          className="form-input" 
          type="number" 
          min={0} 
          max={120} 
          placeholder="e.g. 45" 
          value={data.work_hours} 
          onChange={e => handleChange('work_hours', e.target.value)} 
        />
      </div>
      <div className="form-field">
        <label htmlFor="stress">Stress Level (1 - 10)</label>
        <input 
          id="stress" 
          className="form-input" 
          type="number" 
          min={1} 
          max={10} 
          placeholder="e.g. 6" 
          value={data.stress} 
          onChange={e => handleChange('stress', e.target.value)} 
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
          {loading ? 'Submitting…' : 'Submit Survey'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setData({ name: '', email: '', department: '', work_hours: '', stress: '' })}>
          Reset
        </button>
      </div>
    </form>
  )
}