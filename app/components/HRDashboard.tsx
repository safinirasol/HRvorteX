// components/HRDashboard.tsx
'use client'
import { useState, useEffect } from 'react'

interface DashboardData {
  summary: {
    total_employees: number
    total_surveys: number
    high_risk_count: number
    medium_risk_count: number
    low_risk_count: number
    average_risk: number
    average_hours: number
    average_stress: number
  }
  departments: Array<{
    department: string
    count: number
    avg_risk: number
  }>
  recent_submissions: Array<any>
}

interface Employee {
  id: number
  name: string
  department: string
  email: string
  latest_risk_score: number
  latest_risk_label: string
  work_hours: number
  stress_level: number
  last_submission: string
  hedera_verified: boolean
}

export default function HRDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'employees'>('overview')

  useEffect(() => {
    fetchDashboardData()
    fetchEmployees()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees')
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLabel = (score: number) => {
    return score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-600">Employee Burnout Monitoring</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employees ({employees.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Total Employees</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData?.summary?.total_employees ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Surveys Submitted</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData?.summary?.total_surveys ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">High Risk Cases</h3>
              <p className="text-3xl font-bold text-red-600">{dashboardData?.summary?.high_risk_count ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Avg Risk Score</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData?.summary?.average_risk ?? 0}</p>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-medium">High Risk</span>
                  <span className="font-bold">{dashboardData?.summary?.high_risk_count ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-medium">Medium Risk</span>
                  <span className="font-bold">{dashboardData?.summary?.medium_risk_count ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Low Risk</span>
                  <span className="font-bold">{dashboardData?.summary?.low_risk_count ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
              <div className="space-y-3">
                {dashboardData?.departments?.map((dept) => (
                  <div key={dept.department} className="flex justify-between items-center">
                    <span className="font-medium">{dept.department}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{dept.count} surveys</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(getRiskLabel(dept.avg_risk))}`}>
                        {dept.avg_risk}
                      </span>
                    </div>
                  </div>
                )) ?? (
                  <div className="text-center text-gray-500 py-4">
                    No department data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData?.recent_submissions?.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {submission.employee_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{submission.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(submission.label)}`}>
                          {submission.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{submission.risk_score}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{submission.work_hours}h</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{submission.stress_level}/10</td>
                    </tr>
                  )) ?? (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                        No recent submissions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Submission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{employee.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(employee.latest_risk_label)}`}>
                          {employee.latest_risk_label} {employee.latest_risk_score && `(${employee.latest_risk_score})`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {employee.last_submission ? new Date(employee.last_submission).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        {employee.hedera_verified ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}