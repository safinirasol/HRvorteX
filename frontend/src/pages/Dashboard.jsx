// WellMind – VorteX HR Automation
// File: frontend/src/pages/Dashboard.jsx
// Description: HR dashboard with analytics, risk charts, and employee table
// Author: Team VorteX
// License: MIT

import { useState, useEffect } from 'react'
import { getDashboardData, getEmployees } from '../api/client'
import ChartCard from '../components/ChartCard'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [dashData, empData] = await Promise.all([
        getDashboardData(),
        getEmployees()
      ])
      setStats(dashData)
      setEmployees(empData)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">WellMind HR Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold uppercase">Flagged Employees</p>
                <p className="text-4xl font-bold text-red-600">{stats?.flagged_employees || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">🚨</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold uppercase">Average Risk</p>
                <p className="text-4xl font-bold text-orange-600">{stats?.average_risk || 0}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold uppercase">Blockchain Verified</p>
                <p className="text-4xl font-bold text-green-600">{stats?.blockchain_verified || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {stats?.recent_results && <ChartCard data={stats.recent_results} />}

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-card p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Employee Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Latest Risk</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">{emp.name}</td>
                    <td className="py-3 px-4">{emp.department}</td>
                    <td className="py-3 px-4">
                      {emp.latest_risk !== null ? (
                        <span className="font-semibold">{emp.latest_risk}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {emp.latest_label !== 'N/A' ? (
                        <span className={`badge-risk ${
                          emp.latest_label === 'Urgent' ? 'badge-risk-high' :
                          emp.latest_label === 'High' ? 'badge-risk-high' :
                          emp.latest_label === 'Medium' ? 'badge-risk-medium' :
                          'badge-risk-low'
                        }`}>
                          {emp.latest_label}
                        </span>
                      ) : (
                        <span className="text-slate-400">No data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
