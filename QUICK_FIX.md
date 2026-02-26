# ⚡ QUICK FIX - Do This Right Now!

## Your Error: "Failed to get prediction. Make sure the API server is running on http://localhost:8000"

### 🎯 Solution (5 minutes):

#### Step 1: Go to Vercel
1. Open: https://vercel.com/dashboard
2. Click your project: **drop-out-student-prediction-model**
3. Click **Settings** → **Environment Variables**

#### Step 2: Add This Variable
```
Name:  VITE_API_URL
Value: [YOUR_RENDER_URL_HERE]
```

**Example:** If your Render URL is `https://dropout-api-abc123.onrender.com`, use exactly that.

**⚠️ Important:** 
- NO trailing slash at the end
- Include `https://`
- Check "Production" checkbox

#### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait 30 seconds

#### Step 4: Test
Refresh your Vercel app and try again! ✅

---

## Where to Find Your Render URL?

1. Go to: https://dashboard.render.com/
2. Click your backend service
3. Copy the URL at the top (looks like: `https://your-app-name.onrender.com`)

---

## Still Not Working?

### Check Render Backend:
1. Go to your Render dashboard
2. Click your service
3. Check if it says "Live" (green)
4. If it says "Sleeping", refresh the page - it will wake up

### Check Vercel Logs:
1. Vercel Dashboard → Your Project
2. Click latest deployment
3. Click "View Function Logs"
4. Look for error messages

---

**Need the detailed guide?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
