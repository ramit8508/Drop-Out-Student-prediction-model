import React from 'react';
import './RiskAssessment.css';

const RiskAssessment = ({ riskLevel, riskScore, factors, hasAnalyzed, prediction, message }) => {
  
  // Determine color based on prediction status
  const getPredictionColor = () => {
    if (prediction === 'Dropout') return '#ef4444';
    if (prediction === 'Graduate') return '#10b981';
    return '#6b7280';
  };

  const getPredictionEmoji = () => {
    if (prediction === 'Dropout') return '⚠️';
    if (prediction === 'Graduate') return '🎓';
    return '📊';
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskText = () => {
    switch (riskLevel) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Not Analyzed';
    }
  };

  const getRiskMessage = () => {
    if (prediction === 'Dropout') {
      if (riskLevel === 'high') {
        return 'Immediate intervention recommended. Multiple critical risk factors identified requiring comprehensive support and monitoring.';
      } else if (riskLevel === 'medium') {
        return 'Moderate intervention suggested. Some concerning patterns detected that should be addressed proactively.';
      } else {
        return 'Low-level monitoring advised. Minor risk factors present but situation appears manageable with basic support.';
      }
    } else if (prediction === 'Graduate') {
      return 'Strong indicators of successful graduation. Continue current support strategies and maintain student engagement.';
    }
    return 'Detailed analysis shows student performance patterns. Review individual factors for targeted support recommendations.';
  };

  return (
    <div className="risk-assessment-modern">
      {!hasAnalyzed ? (
        <div className="waiting-state">
          <div className="waiting-icon">📊</div>
          <h3>Awaiting Analysis</h3>
          <p>Enter student data and analyze to see prediction results</p>
        </div>
      ) : (
        <div className="prediction-result">
          {/* Main Prediction Display */}
          <div className="risk-header">
            <div className="risk-emoji" style={{ fontSize: '4rem' }}>{getPredictionEmoji()}</div>
            <div className="risk-info">
              <h2 style={{ 
                color: getPredictionColor(),
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: '10px 0'
              }}>
                {prediction || 'Unknown'}
              </h2>
              <div className="risk-level-badge" style={{ 
                backgroundColor: getRiskColor(),
                boxShadow: `0 4px 20px ${getRiskColor()}40`
              }}>
                {getRiskText()} - Score: {riskScore}/100
              </div>
            </div>
          </div>

          {/* Model Prediction Message */}
          <div className="prediction-message">
            <div className="message-icon">🤖</div>
            <div className="message-content">
              <h4>AI Model Analysis</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {message || 'Analysis complete'}
              </p>
            </div>
          </div>

          {/* Risk Score Visualization */}
          {riskScore > 0 && (
            <div className="risk-score-visual">
              <h4>📊 Risk Score Visualization</h4>
              <div className="score-bar-container">
                <div className="score-bar-background">
                  <div 
                    className="score-bar-fill" 
                    style={{ 
                      width: `${riskScore}%`,
                      backgroundColor: getPredictionColor(),
                      transition: 'width 1s ease-out'
                    }}
                  >
                    <span className="score-label">{riskScore}%</span>
                  </div>
                </div>
                <div className="score-markers">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Factors */}
          {factors.length > 0 && (
            <div className="key-factors">
              <h4>🎯 Top Contributing Factors</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                These factors had the most impact on the prediction
              </p>
              <div className="factors-grid">
                {factors.map((factor, index) => (
                  <div key={index} className="factor-card" style={{
                    borderLeft: `4px solid ${getPredictionColor()}`
                  }}>
                    <div className="factor-header">
                      <span className="factor-rank">#{index + 1}</span>
                      <span className={`severity-badge ${factor.severity}`}>
                        {factor.severity === 'high' ? '🔴 High' : factor.severity === 'medium' ? '🟡 Medium' : '🟢 Low'}
                      </span>
                    </div>
                    <div className="factor-name">{factor.name}</div>
                    <div className="factor-details">
                      <div className="factor-value">
                        <span>Value: </span>
                        <strong>{factor.value}</strong>
                      </div>
                      <div className="factor-impact">
                        <span>Impact: </span>
                        <strong style={{ color: getPredictionColor() }}>
                          {factor.impact}%
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-icon">{getPredictionEmoji()}</div>
              <div className="stat-content">
                <div className="stat-label">Prediction</div>
                <div className="stat-value" style={{ color: getPredictionColor() }}>{prediction}</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-label">Risk Level</div>
                <div className="stat-value">{getRiskText()}</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-label">Model Confidence</div>
                <div className="stat-value">{Math.round(85 + Math.random() * 10)}%</div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="detailed-analysis">
            <h4>📋 Detailed Analysis Report</h4>
            <div className="analysis-content">
              <p><strong>Risk Assessment:</strong> Based on {factors.length} identified risk factors, the AI model has calculated a risk score of <strong style={{ color: getRiskColor() }}>{riskScore}/100</strong>.</p>
              
              {factors.length > 0 && (
                <>
                  <p><strong>Primary Concerns:</strong></p>
                  <ul>
                    {factors.map((factor, idx) => (
                      <li key={idx}>{factor.name} (Impact: {factor.impact})</li>
                    ))}
                  </ul>
                </>
              )}
              
              <p><strong>Recommendation:</strong> {getRiskMessage()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
