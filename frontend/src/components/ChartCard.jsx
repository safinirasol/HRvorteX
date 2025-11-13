// WellMind – VorteX HR Automation
// File: frontend/src/components/ChartCard.jsx
// Description: Risk trend line chart using recharts
// Author: Team VorteX
// License: MIT

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ChartCard({ data }) {
  const chartData = data.map(r => ({
    name: new Date(r.timestamp).toLocaleDateString(),
    risk: r.risk_score
  }))

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-bold mb-4">Risk Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="risk" stroke="#0ea5e9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
