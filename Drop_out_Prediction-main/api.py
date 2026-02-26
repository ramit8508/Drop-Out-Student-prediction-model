import xgboost as xgb
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os

app = FastAPI(title="Student Dropout Prediction API")

# Get allowed origins from environment variable
# For production, set ALLOWED_ORIGINS in Render: https://your-frontend.vercel.app
# For development, it defaults to "*" (allow all)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in ALLOWED_ORIGINS else ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = xgb.Booster()
model.load_model("dropout_model.json")

# 30 input parameters (28 from user + 2 calculated)
# 0   Marital status
# 1   Application mode
# 2   Application order
# 3   Course
# 4   Daytime/evening attendance
# 5   Previous qualification
# 6   Previous qualification (grade)
# 7   Mother's qualification
# 8   Father's qualification
# 9   Mother's occupation
# 10  Father's occupation
# 11  Admission grade
# 12  Displaced
# 13  Educational special needs
# 14  Debtor
# 15  Tuition fees up to date
# 16  Gender
# 17  Scholarship holder
# 18  Age at enrollment
# 19  Curricular units 1st sem (enrolled)
# 20  Curricular units 1st sem (evaluations)
# 21  Curricular units 1st sem (approved)
# 22  Curricular units 1st sem (grade)
# 23  Curricular units 1st sem (without evaluations)
# 24  Curricular units 2nd sem (enrolled)
# 25  Curricular units 2nd sem (evaluations)
# 26  Curricular units 2nd sem (approved)
# 27  Curricular units 2nd sem (grade)
# 28  Credit Failure Rate 1st sem (calculated: field19 - field21)
# 29  Credit Failure Rate 2nd sem (calculated: field24 - field26)

class StudentData(BaseModel):
    data: List[float]  # Array of 30 values

@app.post("/predict")
def predict_status(student: StudentData):
    # Verify we have 30 parameters
    if len(student.data) != 30:
        return {
            "error": f"Expected 30 parameters, received {len(student.data)}",
            "status": "Error"
        }
    
    # Field names for reference
    FIELD_NAMES = [
        'Marital status', 'Application mode', 'Choice of college', 'Course',
        'Daytime/evening', 'Previous qualification', "Mother's qualification",
        "Father's qualification", "Mother's occupation", "Father's occupation",
        'Displaced', 'Debtor', 'Tuition fees paid', 'Gender', 'Scholarship',
        'Age at enrollment', 'International', '1st sem enrolled', '1st sem evaluations',
        '1st sem approved', '1st sem grade', '2nd sem enrolled', '2nd sem evaluations',
        '2nd sem approved', '2nd sem grade', 'Unemployment rate', 'Inflation rate',
        'GDP', 'Credit Failure 1st sem', 'Credit Failure 2nd sem'
    ]
    
    # Convert input array to DataFrame with 30 columns
    df = pd.DataFrame([student.data])
    
    # Create DMatrix for XGBoost
    dmatrix = xgb.DMatrix(df)

    # Get prediction from model
    prediction_prob = model.predict(dmatrix)[0]
    
    # Get feature importance (gain-based)
    importance_dict = model.get_score(importance_type='gain')
    
    # Create feature importance list with percentages
    feature_impacts = []
    total_importance = sum(importance_dict.values()) if importance_dict else 1
    
    for i in range(30):
        feature_key = f'f{i}'
        importance_value = importance_dict.get(feature_key, 0)
        impact_percentage = (importance_value / total_importance * 100) if total_importance > 0 else 0
        
        feature_impacts.append({
            "feature_id": i,
            "feature_name": FIELD_NAMES[i],
            "feature_value": float(student.data[i]),
            "importance": round(impact_percentage, 2)
        })
    
    # Sort by importance (highest first)
    feature_impacts.sort(key=lambda x: x['importance'], reverse=True)
    
    # Logic: 0 = Dropout, 1 = Graduate
    status = "Graduate" if prediction_prob > 0.5 else "Dropout"
    risk_score = int((1 - prediction_prob) * 100) if prediction_prob > 0.5 else int(prediction_prob * 100)
    
    return {
        "prediction_score": float(prediction_prob),
        "status": status,
        "risk_score": risk_score,
        "message": f"The student is likely to {status}",
        "feature_impacts": feature_impacts[:10]  # Return top 10 most important features
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)