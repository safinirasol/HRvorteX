// app/hr/page.tsx
import HRDashboard from '../components/HRDashboard'

export default function HRPage() {
  return (
    <section className="pt-28 md:pt-32">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="hero-title mb-4">HR Burnout Dashboard</h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            Monitor employee burnout risk across your organization with real-time insights, 
            department analytics, and blockchain-verified audit trails.
          </p>
        </div>
        <HRDashboard />
      </div>
    </section>
  )
}