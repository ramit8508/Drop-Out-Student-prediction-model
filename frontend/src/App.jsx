import { useState } from 'react';
import './App.css';
import DataInputFields from './components/DataInputFields';
import RiskAssessment from './components/RiskAssessment';
import { encodeStudentData } from './utils/fieldEncodings';

function App() {
  // Initialize 28 input fields (Target is model output)
  const initialData = {};
  for (let i = 0; i < 28; i++) {
    initialData[`field${i}`] = '';
  }
  
  const [studentData, setStudentData] = useState(initialData);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [riskData, setRiskData] = useState({
    level: '',
    score: 0,
    factors: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // Encode data for model
      const encodedData = encodeStudentData(studentData);
      
      // Convert to array format for API (28 user inputs)
      const modelInput = [];
      for (let i = 0; i < 28; i++) {
        modelInput.push(encodedData[`field${i}`] || 0);
      }
      
      // Calculate Credit Failure Rate for 1st semester (field 28)
      // Formula: Curricular units enrolled - Curricular units approved
      // field17 = 1st sem enrolled, field19 = 1st sem approved
      const creditFailRate1stSem = (encodedData.field17 || 0) - (encodedData.field19 || 0);
      modelInput.push(creditFailRate1stSem);
      
      // Calculate Credit Failure Rate for 2nd semester (field 29)
      // Formula: Curricular units enrolled - Curricular units approved
      // field21 = 2nd sem enrolled, field23 = 2nd sem approved
      const creditFailRate2ndSem = (encodedData.field21 || 0) - (encodedData.field23 || 0);
      modelInput.push(creditFailRate2ndSem);
      
      console.log('Field 17 (1st sem enrolled):', encodedData.field17);
      console.log('Field 19 (1st sem approved):', encodedData.field19);
      console.log('Credit Failure Rate 1st Sem:', creditFailRate1stSem);
      console.log('Field 21 (2nd sem enrolled):', encodedData.field21);
      console.log('Field 23 (2nd sem approved):', encodedData.field23);
      console.log('Credit Failure Rate 2nd Sem:', creditFailRate2ndSem);
      console.log('Total parameters:', modelInput.length);
      console.log('Sending to API:', modelInput);
      
      // Call the API with environment variable
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: modelInput })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Fix API's risk_score bug: when status is "Dropout", the risk_score is inverted
      // It returns prediction_prob * 100 instead of dropout probability
      const actualRiskScore = result.status === 'Dropout' 
        ? 100 - result.risk_score  // Fix: if prediction_prob is 0.12, risk should be 88% not 12%
        : result.risk_score;
      
      // Convert feature impacts to factors format
      const factors = result.feature_impacts ? result.feature_impacts.map(feature => ({
        name: feature.feature_name,
        impact: feature.importance,
        value: feature.feature_value,
        severity: feature.importance > 15 ? 'high' : feature.importance > 8 ? 'medium' : 'low'
      })) : [];
      
      // Update risk data with API response
      setRiskData({
        level: actualRiskScore > 50 ? 'high' : actualRiskScore > 25 ? 'medium' : 'low',
        score: actualRiskScore,
        factors: factors,
        prediction: result.status,
        message: result.message,
        predictionScore: result.prediction_score
      });
      
      setHasAnalyzed(true);
    } catch (error) {
      console.error('Error calling API:', error);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      alert(`Failed to get prediction. Make sure the API server is running on ${apiUrl}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDataUpdate = (newData) => {
    setStudentData(newData);
  };

  const handleStartOver = () => {
    const freshData = {};
    for (let i = 0; i < 28; i++) {
      freshData[`field${i}`] = '';
    }
    setStudentData(freshData);
    setQuizCompleted(false);
    setHasAnalyzed(false);
    setIsAnalyzing(false);
    setRiskData({ level: '', score: 0, factors: [] });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>EduGuard</h1>
              <p>Student Dropout Prediction</p>
            </div>
          </div>
          <span className="header-badge">Research Tool</span>
        </div>
      </header>

      <main className="dashboard">
        {/* Quiz - Show until completed */}
        {!quizCompleted && (
          <DataInputFields 
            data={studentData} 
            onUpdate={handleDataUpdate}
            isEditable={!isAnalyzing}
            onComplete={handleQuizComplete}
          />
        )}

        {/* Analysis Section - Show after quiz completion */}
        {quizCompleted && !hasAnalyzed && !isAnalyzing && (
          <div className="analysis-ready-section">
            <div className="ready-card">
              <div className="checkmark-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>All set.</h2>
              <p>We've captured all 28 data points. Ready to run the prediction model on your student profile.</p>
              <button 
                className="start-analysis-button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 16 16 12 12 8"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Run Prediction
              </button>
            </div>
          </div>
        )}

        {/* Awaiting Analysis State */}
        {isAnalyzing && (
          <div className="awaiting-analysis">
            <div className="analysis-loader">
              <div className="loader-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h2>Analyzing profile...</h2>
              <p>Processing 30 parameters through the prediction model</p>
            </div>
          </div>
        )}
        
        {/* Output Section - Show after analysis */}
        {hasAnalyzed && !isAnalyzing && (
          <div className="output-section">
            <RiskAssessment 
              riskLevel={riskData.level}
              riskScore={riskData.score}
              factors={riskData.factors}
              hasAnalyzed={hasAnalyzed}
              prediction={riskData.prediction}
              message={riskData.message}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
