interface EmployeeCardProps {
  name: string
  risk: 'Low' | 'Medium' | 'High' | string
  department: string
}

export default function EmployeeCard({ name, risk, department }: EmployeeCardProps) {
  const badge =
    risk === 'High'
      ? 'badge-risk badge-risk-high'
      : risk === 'Medium'
      ? 'badge-risk badge-risk-medium'
      : 'badge-risk badge-risk-low'

  return (
    <div className="card-employee">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
            {name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {department} • Full-time
          </p>
        </div>

        <span className={badge}>{risk}</span>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Last check: 2h ago</span>
        <span className="h-1 w-1 rounded-full bg-slate-400" />
        <span>Trend: Stable</span>
      </div>
    </div>
  )
}
