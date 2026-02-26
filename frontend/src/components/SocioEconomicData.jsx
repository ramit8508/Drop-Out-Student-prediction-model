import React from 'react';
import './SocioEconomicData.css';

const SocioEconomicData = ({ data, onUpdate, isEditable = true }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="metric-card socioeconomic-card">
      <div className="card-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="card-title">
          <h3>Socio-Economic Data</h3>
          <p>Background and family information</p>
        </div>
      </div>

      <div className="card-content">
        <div className="metric-item">
          <label>Household Income ($)</label>
          <input
            type="number"
            value={data.householdIncome}
            onChange={(e) => handleChange('householdIncome', e.target.value)}
            min="0"
            placeholder="Enter household income"
            disabled={!isEditable}
          />
        </div>

        <div className="metric-item">
          <label>Parent Education Level</label>
          <select
            value={data.parentEducation}
            onChange={(e) => handleChange('parentEducation', e.target.value)}
            disabled={!isEditable}
          >
            <option value="">Select level</option>
            <option value="elementary">Elementary School</option>
            <option value="highschool">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>

        <div className="metric-item">
          <label>Family Size</label>
          <input
            type="number"
            value={data.familySize}
            onChange={(e) => handleChange('familySize', e.target.value)}
            min="1"
            placeholder="Enter family size"
            disabled={!isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default SocioEconomicData;
