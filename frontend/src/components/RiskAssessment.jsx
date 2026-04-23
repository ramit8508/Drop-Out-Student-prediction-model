import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar
} from 'recharts';
import './RiskAssessment.css';

// Animated counter hook
const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(Math.round(end));
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

// Custom donut center label
const CenterLabel = ({ score, prediction }) => {
  const color = prediction === 'Dropout' ? 'var(--danger)' : 'var(--sage)';
  return (
    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'var(--font-heading)' }}>
      <tspan x="50%" dy="-4" fontSize="2.2rem" fontWeight="700" fill={color}>{score}%</tspan>
      <tspan x="50%" dy="26" fontSize="0.7rem" fill="#8a8a8a" fontWeight="500" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risk Score</tspan>
    </text>
  );
};

// Custom bar tooltip
const FactorTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-name">{d.fullName}</p>
        <p className="chart-tooltip-value">Impact: <strong>{d.impact}%</strong></p>
        <p className="chart-tooltip-meta">Value: {d.value}</p>
      </div>
    );
  }
  return null;
};

const RiskAssessment = ({ riskLevel, riskScore, factors, hasAnalyzed, prediction, message, onStartOver }) => {
  const animatedScore = useCountUp(riskScore);

  const getRiskText = () => {
    switch (riskLevel) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  const getRiskMessage = () => {
    if (prediction === 'Dropout') {
      if (riskLevel === 'high') return 'Immediate intervention recommended.';
      if (riskLevel === 'medium') return 'Proactive monitoring advised.';
      return 'Low-level support suggested.';
    }
    if (prediction === 'Graduate') return 'Continue current support strategies.';
    return 'Review individual factors.';
  };

  if (!hasAnalyzed) return null;

  const isDropout = prediction === 'Dropout';
  const mainColor = isDropout ? '#b44a3f' : '#6b8f71';
  const softColor = isDropout ? '#e8a59f' : '#a3c4a8';
  const bgColor = isDropout ? '#fdeeed' : '#eef5ef';

  // Donut data
  const donutData = [
    { name: 'Risk', value: riskScore },
    { name: 'Safe', value: 100 - riskScore }
  ];

  // Factor bar chart data (truncate names for display)
  const barData = factors.map((f, i) => ({
    name: f.name.length > 18 ? f.name.substring(0, 16) + '…' : f.name,
    fullName: f.name,
    impact: f.impact,
    value: f.value,
    severity: f.severity,
    fill: f.severity === 'high' ? '#b44a3f' : f.severity === 'medium' ? '#c49b3c' : '#6b8f71'
  }));

  // Severity distribution for mini donut
  const sevHigh = factors.filter(f => f.severity === 'high').length;
  const sevMed = factors.filter(f => f.severity === 'medium').length;
  const sevLow = factors.filter(f => f.severity === 'low').length;
  const severityData = [
    { name: 'High', value: sevHigh, color: '#b44a3f' },
    { name: 'Medium', value: sevMed, color: '#c49b3c' },
    { name: 'Low', value: sevLow, color: '#6b8f71' },
  ].filter(d => d.value > 0);

  return (
    <div className="risk-assessment">

      {/* ---- Top: Verdict + Gauge ---- */}
      <div className={`verdict-card verdict-${riskLevel}`}>
        <div className="verdict-layout">
          
          {/* Left: Donut Gauge */}
          <div className="gauge-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1200}
                >
                  <Cell fill={mainColor} />
                  <Cell fill="#efe9e0" />
                </Pie>
                <CenterLabel score={animatedScore} prediction={prediction} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Verdict Info */}
          <div className="verdict-info">
            <div className={`verdict-icon icon-${riskLevel}`}>
              {isDropout ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              )}
            </div>
            <h2 className={`verdict-title ${isDropout ? 'text-dropout' : 'text-graduate'}`}>
              {isDropout ? 'At Risk' : 'On Track'}
            </h2>
            <p className="verdict-subtitle">
              {isDropout ? 'Dropout predicted' : 'Graduation predicted'}
            </p>
            <span className={`verdict-label label-${riskLevel}`}>
              {getRiskText()}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Stats Row ---- */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-visual" style={{ background: bgColor, color: mainColor }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/>
            </svg>
          </div>
          <div className="stat-card-label">Prediction</div>
          <div className="stat-card-value" style={{ color: mainColor }}>{prediction}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-visual" style={{ background: '#f1f5f9', color: '#64748b' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="stat-card-label">Risk Level</div>
          <div className="stat-card-value">{getRiskText()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-visual" style={{ background: '#fdf7eb', color: '#c49b3c' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div className="stat-card-label">Factors</div>
          <div className="stat-card-value">{factors.length}</div>
        </div>
      </div>

      {/* ---- Factor Impact Chart ---- */}
      {factors.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Factor Impact</h3>
            <span className="chart-card-badge">{factors.length} factors</span>
          </div>
          <div className="chart-bar-wrapper">
            <ResponsiveContainer width="100%" height={Math.max(180, factors.length * 42)}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
                barSize={16}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={130}
                  tick={{ fontSize: 12, fill: '#5a5a5a', fontFamily: 'var(--font-body)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<FactorTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]} animationDuration={1000}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Bottom Row: Severity + Recommendation ---- */}
      <div className="bottom-row">
        {/* Severity Distribution */}
        {severityData.length > 0 && (
          <div className="chart-card chart-card-small">
            <h3>Severity Split</h3>
            <div className="severity-chart-wrapper">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={800}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`sev-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="severity-legend">
                {severityData.map((d, i) => (
                  <div key={i} className="severity-legend-item">
                    <span className="severity-dot" style={{ background: d.color }}></span>
                    <span>{d.name}</span>
                    <strong>{d.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="chart-card chart-card-small recommendation-card">
          <h3>Recommendation</h3>
          <p className="recommendation-text">{getRiskMessage()}</p>
          {message && <p className="model-output-text">{message}</p>}
        </div>
      </div>

      {/* ---- Start Over ---- */}
      {onStartOver && (
        <div className="results-actions">
          <button className="restart-btn" onClick={onStartOver}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Analyze another student
          </button>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
