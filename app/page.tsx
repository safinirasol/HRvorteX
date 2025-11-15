// app/page.tsx
import Link from 'next/link'
import BurnoutForm from './components/BurnoutForm'
import EmployeeCard from './components/EmployeeCard'

const employees = [
  { name: 'Alice', risk: 'Low', department: 'Engineering' },
  { name: 'Bob', risk: 'High', department: 'Marketing' },
  { name: 'Carol', risk: 'Medium', department: 'Sales' },
]

export default function Home() {
  return (
    <>
      <section className="pt-28 md:pt-32">
        <div className="max-w-4xl">
          <h1 className="hero-title mb-6">Real-Time Burnout Intelligence</h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Empower HR & team leads to identify burnout risk early using AI heuristics, 
            ledger-backed audit trails, and orchestration hooks. Actionable insights. Zero friction.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary">Start Free</button>
            <button className="btn btn-secondary">Request Demo</button>
            <Link href="/hr" className="btn btn-care">HR Dashboard</Link>
          </div>
        </div>
      </section>
      <section className="mt-16 grid md:grid-cols-2 gap-10 items-start">
        <div className="glass-panel gradient-border p-6 space-y-5">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-gradient-glow"/>Burnout Risk Scanner
          </h2>
          <BurnoutForm />
          <p className="text-xs text-slate-500">
            Prototype heuristic model. Connect your own model by setting{' '}
            <code className="px-1 py-0.5 bg-slate-800 rounded">AI_BACKEND_URL</code>.
          </p>
        </div>
        <div id="employees" className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight">Live Employee Samples</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {employees.map(e => (
              <EmployeeCard key={e.name} name={e.name} risk={e.risk} department={e.department} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}