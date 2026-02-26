import React from 'react';
import './AcademicGrades.css';

const AcademicGrades = ({ data, onUpdate, isEditable = true }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="metric-card academic-card">
      <div className="card-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="card-title">
          <h3>Academic Grades</h3>
          <p>Current academic performance metrics</p>
        </div>
      </div>

      <div className="card-content">
        <div className="metric-item">
          <label>GPA (0.0 - 4.0)</label>
          <input
            type="number"
            value={data.gpa}
            onChange={(e) => handleChange('gpa', e.target.value)}
            min="0"
            max="4"
            step="0.1"
            placeholder="Enter GPA"
            disabled={!isEditable}
          />
        </div>

        <div className="metric-item">
          <label>Average Test Score (%)</label>
          <input
            type="number"
            value={data.avgTestScore}
            onChange={(e) => handleChange('avgTestScore', e.target.value)}
            min="0"
            max="100"
            placeholder="Enter score"
            disabled={!isEditable}
          />
        </div>

        <div className="metric-item">
          <label>Assignment Completion (%)</label>
          <input
            type="number"
            value={data.assignmentCompletion}
            onChange={(e) => handleChange('assignmentCompletion', e.target.value)}
            min="0"
            max="100"
            placeholder="Enter completion"
            disabled={!isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicGrades;
