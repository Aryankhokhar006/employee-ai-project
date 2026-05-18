import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const AnalyticsChart = ({ candidates }) => {
  // Process data for the chart
  const chartData = candidates.map(c => ({
    name: c.name.split(' ')[0], // First name only
    score: c.performanceScore,
    department: c.department
  })).slice(0, 10); // Show max 10 for clean UI

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ color: 'var(--accent-cyan)', margin: 0 }}>Score: {payload[0].value}</p>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Dept: {payload[0].payload.department}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="card-title" style={{ marginBottom: '0' }}>
        <BarChart3 size={20} className="text-accent-cyan" style={{ color: 'var(--accent-cyan)' }} />
        Performance Analytics
      </h2>
      
      {chartData.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.score >= 80 ? 'var(--accent-green)' : entry.score >= 60 ? 'var(--accent-cyan)' : '#F59E0B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          No data available for analytics
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
