import { useState } from 'react';
import './App.css';
import Logo from './components/Logo';
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

  const calculateRisk = () => {
    
    // ENCODE DATA: Convert strings to numbers
   
    const encodedData = encodeStudentData(studentData);
    
    // Convert to array format for 28 input parameters
    const modelInput = [];
    for (let i = 0; i < 28; i++) {
      modelInput.push(encodedData[`field${i}`] || 0);
    }
    
    console.log('Original Data:', studentData);
    console.log('Encoded Data (object format):', encodedData);
    console.log('Model Input Array:', modelInput);
    console.log('Model Input JSON:', JSON.stringify(modelInput));
    
    // ============================================
    // YOUR MODEL INTEGRATION - SEND AS JSON
    // ============================================
    /*
    // Option 1: Send as pure array [0, 12, 1, ...]
    const response = await fetch('YOUR_MODEL_API_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelInput)  // Sends: [0, 12, 1, 9500, ...]
    });
    
    // Option 2: Send as object with "data" key
    const response = await fetch('YOUR_MODEL_API_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: modelInput })  // Sends: {"inputs": [0, 12, 1, ...]}
    });
    
    const modelResult = await response.json();
    
    // Expected model response format:
    // {
    //   riskScore: 75,
    //   riskLevel: 2,
    //   factors: [...]
    // }
    */
    
    // ============================================
    // DEMO: Simulate model response
    // ============================================
    let riskScore = 0;
    let factors = [];

    // Use encoded numerical values
    const gpa = encodedData.field0 || 0;
    const gender = encodedData.field1 || 0;
    const testScore = encodedData.field2 || 0;
    const studyHours = encodedData.field3 || 0;
    const householdIncome = encodedData.field10 || 0;
    const parentEducation = encodedData.field11 || 0;
    const stressLevel = encodedData.field18 || 0;

    // Calculate risk based on encoded values
    if (gpa < 2.5) {
      const impact = Math.round((2.5 - gpa) * 20);
      riskScore += impact;
      factors.push({
        name: 'Low GPA',
        impact: impact,
        severity: gpa < 2.0 ? 'high' : 'medium'
      });
    }

    if (testScore < 70) {
      const impact = Math.round((70 - testScore) / 2);
      riskScore += impact;
      factors.push({
        name: 'Low Test Scores',
        impact: impact,
        severity: testScore < 60 ? 'high' : 'medium'
      });
    }

    if (studyHours < 10) {
      const impact = 10;
      riskScore += impact;
      factors.push({
        name: 'Insufficient Study Time',
        impact: impact,
        severity: 'medium'
      });
    }

    if (householdIncome < 30000) {
      const impact = 15;
      riskScore += impact;
      factors.push({
        name: 'Financial Constraints',
        impact: impact,
        severity: 'high'
      });
    }

    if (parentEducation < 2) {  // Less than High School
      const impact = 12;
      riskScore += impact;
      factors.push({
        name: 'Low Parent Education',
        impact: impact,
        severity: 'medium'
      });
    }

    if (stressLevel > 7) {
      const impact = 15;
      riskScore += impact;
      factors.push({
        name: 'High Stress Level',
        impact: impact,
        severity: 'high'
      });
    }

    // Determine risk level
    let level = 'low';
    if (riskScore > 50) level = 'high';
    else if (riskScore > 25) level = 'medium';

    setRiskData({
      level,
      score: Math.min(riskScore, 100),
      factors
    });
  };

  const handleDataUpdate = (newData) => {
    setStudentData(newData);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <Logo size={56} />
          <div className="header-text">
            <h1>Student Dropout Risk Prediction System</h1>
            <p className='format'>AI-Powered Early Warning System</p>
          </div>
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
        {quizCompleted && !hasAnalyzed && (
          <div className="analysis-ready-section">
            <div className="ready-card">
              <div className="checkmark">✓</div>
              <h2>All Questions Answered!</h2>
              <p>Ready to analyze your data with AI</p>
              <button 
                className="start-analysis-button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  '🚀 Start AI Analysis'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Awaiting Analysis State */}
        {isAnalyzing && (
          <div className="awaiting-analysis">
            <div className="analysis-loader">
              <div className="loader-circle"></div>
              <h2>⏳ Awaiting Analysis...</h2>
              <p>AI model is processing your data</p>
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
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
