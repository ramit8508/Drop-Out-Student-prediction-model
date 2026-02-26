import React from 'react';
import './AttendanceTracking.css';

const AttendanceTracking = ({ data, onUpdate, isEditable = true }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="metric-card attendance-card">
      <div className="card-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div className="card-title">
          <h3>Attendance Tracking</h3>
          <p>Student attendance and participation</p>
        </div>
      </div>

      <div className="card-content">
        <div className="metric-item">
          <label>Attendance Rate (%)</label>
          <input
            type="number"
            value={data.attendanceRate}
            onChange={(e) => handleChange('attendanceRate', e.target.value)}
            min="0"
            max="100"
            placeholder="Enter attendance rate"
            disabled={!isEditable}
          />
        </div>

        <div className="metric-item">
          <label>Tardy Instances</label>
          <input
            type="number"
            value={data.tardyInstances}
            onChange={(e) => handleChange('tardyInstances', e.target.value)}
            min="0"
            placeholder="Enter tardy count"
            disabled={!isEditable}
          />
        </div>

        <div className="metric-item">
          <label>Total Absences</label>
          <input
            type="number"
            value={data.totalAbsences}
            onChange={(e) => handleChange('totalAbsences', e.target.value)}
            min="0"
            placeholder="Enter total absences"
            disabled={!isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;
