import React, { useState } from 'react';
import './InterventionPanel.css';

const InterventionPanel = ({ interventions, riskLevel, hasAnalyzed }) => {
  const [expandedIntervention, setExpandedIntervention] = useState(null);

  const toggleIntervention = (index) => {
    setExpandedIntervention(expandedIntervention === index ? null : index);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'academic':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        );
      case 'counseling':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        );
      case 'financial':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        );
      case 'urgent':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
      case 'preventive':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        );
      case 'monitoring':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="analysis-card intervention-card">
      <div className="card-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="card-title">
          <h3>Recommended Interventions</h3>
          <p>Actionable steps to prevent dropout</p>
        </div>
      </div>

      {!hasAnalyzed ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <h4>No Interventions Yet</h4>
          <p>Complete the analysis to get personalized intervention recommendations</p>
        </div>
      ) : (
        <div className="card-content">
          {interventions.length === 0 ? (
            <div className="no-interventions">
              <p>No specific interventions needed. Student is on track!</p>
            </div>
          ) : (
            <div className="interventions-list">
              {interventions.map((intervention, index) => (
                <div 
                  key={index} 
                  className={`intervention-item ${getPriorityClass(intervention.priority)} ${expandedIntervention === index ? 'expanded' : ''}`}
                >
                  <div 
                    className="intervention-header"
                    onClick={() => toggleIntervention(index)}
                  >
                    <div className="intervention-icon">
                      {getIcon(intervention.type)}
                    </div>
                    <div className="intervention-info">
                      <h4>{intervention.title}</h4>
                      <p>{intervention.description}</p>
                    </div>
                    <div className="intervention-expand">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points={expandedIntervention === index ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
                      </svg>
                    </div>
                  </div>
                  
                  {expandedIntervention === index && intervention.actions && (
                    <div className="intervention-actions">
                      <h5>📋 Action Steps for Student:</h5>
                      <ul>
                        {intervention.actions.map((action, actionIndex) => (
                          <li key={actionIndex}>
                            <span className="action-number">{actionIndex + 1}</span>
                            <span className="action-text">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="intervention-priority">
                    <span className={`priority-badge ${intervention.priority}`}>
                      {intervention.priority === 'high' && '🔴 High Priority'}
                      {intervention.priority === 'medium' && '🟡 Medium Priority'}
                      {intervention.priority === 'low' && '🟢 Low Priority'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Study Tips Section */}
          {hasAnalyzed && (
            <div className="study-tips-section">
              <h4>💡 General Study & Focus Tips</h4>
              <div className="tips-grid">
                <div className="tip-card">
                  <span className="tip-icon">🎯</span>
                  <h5>Set Clear Goals</h5>
                  <p>Define specific, measurable goals for each study session</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">⏰</span>
                  <h5>Time Management</h5>
                  <p>Use the Pomodoro technique: 25 min focus, 5 min break</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🤝</span>
                  <h5>Find Support</h5>
                  <p>Join study groups and connect with mentors</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">💪</span>
                  <h5>Self-Care</h5>
                  <p>Sleep 7-8 hours, exercise regularly, eat healthy</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterventionPanel;
