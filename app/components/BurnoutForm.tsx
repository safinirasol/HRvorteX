'use client'
import { useState } from 'react'
import { useToast } from './Toast'

export default function BurnoutForm() {
  const { push } = useToast()
  const [data, setData] = useState({ name: '', work_hours: '', stress: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      push({
        title: 'Risk computed',
        message: `${result.risk} risk • score ${result.score}`,
        type: result.risk === 'High' ? 'error' : result.risk === 'Medium' ? 'info' : 'success'
      })
    } catch (err) {
  push({ title: 'API error', message: 'Unable to compute burnout score', type: 'error' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="form-field">
        <label htmlFor="name">Full Name</label>
        <input id="name" className="form-input" placeholder="Jane Doe" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
      </div>
      <div className="form-field">
        <label htmlFor="hours">Work Hours / week</label>
        <input id="hours" className="form-input" type="number" min={0} max={120} placeholder="e.g. 45" value={data.work_hours} onChange={e => setData({ ...data, work_hours: e.target.value })} />
      </div>
      <div className="form-field">
        <label htmlFor="stress">Stress (1 - 10)</label>
        <input id="stress" className="form-input" type="number" min={1} max={10} placeholder="e.g. 6" value={data.stress} onChange={e => setData({ ...data, stress: e.target.value })} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
          {loading ? 'Checking…' : 'Check Burnout'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => { setData({ name: '', work_hours: '', stress: '' }) }}>
          Reset
        </button>
      </div>
    </form>
  )
}
