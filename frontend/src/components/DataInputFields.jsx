import React, { useState } from 'react';
import './DataInputFields.css';
import { getFieldInputType } from '../utils/fieldEncodings';

// ============================================
// 28 FIELD NAMES - Matches model parameters exactly
// NOTE: Features 28 & 29 (Credit Failure Rates) are calculated by frontend
// ============================================
const FIELD_NAMES = [
  'Marital Status',                           // 0
  'Application mode',                         // 1
  'Choice of this college (1-9)',             // 2
  'Course',                                   // 3
  'Daytime/evening attendance',               // 4
  'Previous qualification',                   // 5
  "Mother's qualification",                   // 6
  "Father's qualification",                   // 7
  "Mother's occupation",                      // 8
  "Father's occupation",                      // 9
  'Displaced',                                // 10
  'Debtor',                                   // 11
  'Tuition fees up to date',                  // 12
  'Gender',                                   // 13
  'Scholarship holder',                       // 14
  'Age at enrollment',                        // 15
  'International',                            // 16
  'Curricular units 1st sem (enrolled)',      // 17
  'Curricular units 1st sem (evaluations)',   // 18
  'Curricular units 1st sem (approved)',      // 19
  'Curricular units 1st sem (grade)',         // 20
  'Curricular units 2nd sem (enrolled)',      // 21
  'Curricular units 2nd sem (evaluations)',   // 22
  'Curricular units 2nd sem (approved)',      // 23
  'Curricular units 2nd sem (grade)',         // 24
  'Unemployment rate',                        // 25
  'Inflation rate',                           // 26
  'GDP'                                       // 27
];

const FIELD_DESCRIPTIONS = [
  'Current relationship status of the student',                                           // 0
  'How the student applied to this institution',                                          // 1
  'Student\'s preference ranking for this college (1 = first choice, 9 = last choice)',   // 2
  'The academic program enrolled in',                                                     // 3
  'Whether classes are attended during day or evening shift',                             // 4
  'Highest educational qualification before enrolling',                                   // 5
  'Mother\'s highest educational qualification',                                          // 6
  'Father\'s highest educational qualification',                                          // 7
  'Mother\'s current occupation category',                                                // 8
  'Father\'s current occupation category',                                                // 9
  'Whether student had to relocate from home for studies',                                // 10
  'Whether student owes tuition or fees to the institution',                              // 11
  'Whether all tuition payments are current and up-to-date',                              // 12
  'Student\'s gender',                                                                    // 13
  'Whether student receives any scholarship or financial aid',                            // 14
  'Student\'s age when first enrolled in the program',                                    // 15
  'Whether student is an international/foreign student',                                  // 16
  'Number of course units enrolled in during first semester',                             // 17
  'Number of exams/evaluations taken in first semester',                                  // 18
  'Number of course units successfully passed in first semester',                         // 19
  'Average grade obtained in first semester (0-20 scale)',                                // 20
  'Number of course units enrolled in during second semester',                            // 21
  'Number of exams/evaluations taken in second semester',                                 // 22
  'Number of course units successfully passed in second semester',                        // 23
  'Average grade obtained in second semester (0-20 scale)',                               // 24
  'National unemployment rate at time of enrollment (%)',                                 // 25
  'National inflation rate at time of enrollment (%)',                                    // 26
  'National GDP at time of enrollment (economic indicator)'                               // 27
];

// Grouping for section labels
const SECTION_RANGES = [
  { start: 0, label: 'Personal & Application' },
  { start: 3, label: 'Academic Program' },
  { start: 6, label: 'Family Background' },
  { start: 10, label: 'Financial Status' },
  { start: 13, label: 'Demographics' },
  { start: 17, label: '1st Semester Performance' },
  { start: 21, label: '2nd Semester Performance' },
  { start: 25, label: 'Economic Indicators' },
];

const getCurrentSection = (questionIndex) => {
  for (let i = SECTION_RANGES.length - 1; i >= 0; i--) {
    if (questionIndex >= SECTION_RANGES[i].start) {
      return SECTION_RANGES[i].label;
    }
  }
  return '';
};

const DataInputFields = ({ data, onUpdate, isEditable, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const totalQuestions = FIELD_NAMES.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = Object.values(data).filter(v => v !== '').length;

  const handleChange = (value) => {
    const newData = { ...data };
    newData[`field${currentQuestion}`] = value;
    onUpdate(newData);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle Enter key to advance
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isCurrentAnswered) {
      handleNext();
    }
  };

  const renderCurrentInput = () => {
    const fieldId = `field${currentQuestion}`;
    const inputConfig = getFieldInputType(fieldId);
    const currentValue = data[fieldId] || '';

    if (inputConfig.type === 'select') {
      return (
        <select
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={!isEditable}
          className="quiz-select"
          onKeyDown={handleKeyDown}
          id={`question-${currentQuestion}`}
        >
          <option value="">Choose an option...</option>
          {inputConfig.options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="number"
          step="any"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={!isEditable}
          placeholder="Type your answer..."
          className="quiz-input"
          onKeyDown={handleKeyDown}
          id={`question-${currentQuestion}`}
          autoFocus
        />
      );
    }
  };

  const isCurrentAnswered = data[`field${currentQuestion}`] && data[`field${currentQuestion}`] !== '';
  const sectionLabel = getCurrentSection(currentQuestion);

  return (
    <div className="quiz-container">
      {/* Section Label */}
      <div className="quiz-section-label">
        <span className="section-number">{sectionLabel}</span>
        <div className="section-line"></div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress">
        <div className="progress-header">
          <span className="progress-label">{answeredCount} of {totalQuestions} answered</span>
          <span className="progress-count">{currentQuestion + 1}/{totalQuestions}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-question-card">
        <div className="question-number">Question {currentQuestion + 1}</div>
        <h2 className="question-title">{FIELD_NAMES[currentQuestion]}</h2>
        <p className="question-description">{FIELD_DESCRIPTIONS[currentQuestion]}</p>
        
        <div className="quiz-input-wrapper">
          {renderCurrentInput()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="quiz-navigation">
        <button 
          className="nav-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Previous
        </button>
        
        <button 
          className="nav-btn next-btn"
          onClick={handleNext}
          disabled={!isCurrentAnswered}
        >
          {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Continue'}
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {currentQuestion === totalQuestions - 1 
              ? <polyline points="20 6 9 17 4 12"/>
              : <polyline points="9 18 15 12 9 6"/>
            }
          </svg>
        </button>
      </div>

      {/* Quick Jump Dots */}
      <div className="quiz-dots">
        {FIELD_NAMES.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentQuestion ? 'active' : ''} ${data[`field${index}`] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(index)}
            title={FIELD_NAMES[index]}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DataInputFields;
