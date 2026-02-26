# 🚀 Deployment Guide - Student Dropout Prediction System

## Quick Fix for Current Error

Your Vercel app is trying to connect to `localhost:8000` instead of your Render backend. Follow these steps:

### Step 1: Get Your Render Backend URL

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click on your backend service
3. Copy the URL (it should look like: `https://your-app-name.onrender.com`)
4. **Important:** Make sure there's NO trailing slash (/)

### Step 2: Add Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **drop-out-student-prediction-model**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Render URL (e.g., `https://dropout-api-abc123.onrender.com`)
   - **Environment:** Select **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click on the **three dots (...)** next to the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~30 seconds)

### Step 4: Test

1. Open your Vercel app
2. Fill out the form
3. Click "Start AI Analysis"
4. Should work now! ✅

---

## Backend Setup (Render)

### Environment Variables for Render

Make sure your Render backend has these environment variables set:

- **ALLOWED_ORIGINS:** `https://drop-out-student-prediction-model.vercel.app,https://*.vercel.app`

### Update Backend CORS Settings

If you're still getting CORS errors, update your `api.py`:

```python
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
```

---

## Testing Locally

### Backend (Terminal 1):
```bash
cd Drop_out_Prediction-main
source ../.venv/bin/activate.fish  # or: source ../.venv/bin/activate
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## Common Issues

### ❌ "Failed to get prediction" error
- **Cause:** Frontend can't reach backend
- **Fix:** Set `VITE_API_URL` in Vercel environment variables

### ❌ CORS errors
- **Cause:** Backend rejecting requests from frontend domain
- **Fix:** Add your Vercel URL to `ALLOWED_ORIGINS` in Render

### ❌ Backend not responding
- **Cause:** Render service might be sleeping (free tier)
- **Fix:** Wait 30-60 seconds for service to wake up

---

## Project Structure

```
├── Drop_out_Prediction-main/    # Backend (FastAPI)
│   ├── api.py                   # Main API endpoint
│   ├── dropout_model.json       # ML model
│   └── requirements.txt         # Python dependencies
└── frontend/                     # Frontend (React + Vite)
    ├── src/
    │   ├── App.jsx              # Main application
    │   ├── components/          # UI components
    │   └── utils/               # Helper functions
    └── vercel.json              # Vercel config
```

---

## Contact

If you're still having issues, check:
1. Browser console (F12) for error messages
2. Vercel deployment logs
3. Render service logs
