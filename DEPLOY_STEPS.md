# 🚀 Intervue.io Deployment - Step by Step

Follow these steps to deploy the Intervue polling system to production.

## Step 1: Prepare Your Code

### 1.1 Push to GitHub
```powershell
# Navigate to project directory
cd c:\Users\CyberBot\Desktop\Projects\intervue.io

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Full Intervue polling system"

# Add remote and push (replace with your GitHub repo)
git remote add origin https://github.com/YOUR_USERNAME/intervue.git
git branch -M main
git push -u origin main
```

### 1.2 Ensure .env files are set up
```
Backend (.env or .env.example):
- PORT=5000
- NODE_ENV=development
- FRONTEND_URL=http://localhost:5173

Frontend: Uses VITE_BACKEND_URL environment variable
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Authorize Render to access your repos

### 2.2 Create Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Select `intervue` repository
5. Configure:
   - **Name:** `intervue-backend`
   - **Environment:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for always-on)

### 2.3 Set Environment Variables
In Render dashboard, go to your service → Environment:
```
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://your-app.vercel.app
```

### 2.4 Deploy
Click "Create Web Service"
- Wait 3-5 minutes for deployment
- Copy your backend URL: `https://intervue-backend.onrender.com`

**⚠️ Note:** Free tier sleeps after 15 minutes. Upgrade for production use.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Authorize Vercel

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select your `intervue` repository
4. Click Import

### 3.3 Configure Project
1. **Root Directory:** `frontend`
2. **Framework Preset:** `Vite`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### 3.4 Set Environment Variables
In Vercel, go to Settings → Environment Variables:
```
VITE_BACKEND_URL = https://intervue-backend.onrender.com
```

### 3.5 Deploy
Click "Deploy"
- Wait 2-3 minutes
- Get your frontend URL: `https://intervue.vercel.app`

---

## Step 4: Update Backend for Frontend URL

### 4.1 Update Render Environment
Now that you have your Vercel URL, update the backend:

1. Go to Render → Your `intervue-backend` service
2. Go to Settings → Environment
3. Update `FRONTEND_URL` to your actual Vercel URL
4. Redeploy the service (it will auto-redeploy)

---

## Step 5: Test Your Deployment

### 5.1 Test Backend Health
```
Visit: https://intervue-backend.onrender.com/health

Should see:
{
  "status": "ok",
  "timestamp": 1234567890
}
```

### 5.2 Test Frontend
1. Open https://intervue.vercel.app
2. You should see the Welcome page
3. Select "I'm a Teacher" or "I'm a Student"
4. Test creating a poll
5. Test student joining and answering
6. Verify real-time updates work

### 5.3 Test Real-time Features
- Open frontend in two windows (teacher + student)
- Teacher creates poll
- Student sees poll in real-time
- Student answers → teacher sees results in real-time
- Test chat functionality
- Test participant list and kick-out

---

## Step 6: Share Your Deployment

**Frontend URL:**
```
https://intervue.vercel.app
```

**Backend URL (for reference):**
```
https://intervue-backend.onrender.com
```

---

## 📋 Deployment Checklist

Before considering deployment complete:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] Backend health check working
- [ ] Frontend loads without errors
- [ ] WebSocket connections working
- [ ] Teacher can create polls
- [ ] Students can join and answer
- [ ] Real-time updates working
- [ ] Chat functionality working
- [ ] Participant list showing
- [ ] Kick-out functionality working
- [ ] Poll history accessible
- [ ] Mobile responsive (test on phone)

---

## 🔄 Future Updates

After deployment, whenever you push to GitHub main branch:

1. **Render** automatically detects changes and redeploys backend (3-5 min)
2. **Vercel** automatically detects changes and redeploys frontend (2-3 min)

No manual intervention needed!

---

## 🐛 Troubleshooting

### Students can't connect
- Check FRONTEND_URL in Render matches your Vercel domain
- Check browser console for WebSocket errors
- Verify CORS is enabled on backend

### Frontend shows connection error
- Check VITE_BACKEND_URL in Vercel is correct
- Redeploy frontend after updating env var
- Clear browser cache (Ctrl+Shift+Del)

### Real-time features not working
- Verify WebSocket support (should work on Render + Vercel)
- Check that both services are deployed and running
- Check browser console for errors

### Render service sleeping
- Upgrade to paid plan ($7/month) to prevent sleep
- Or use Railway ($5/month) as alternative

---

## 💡 Pro Tips

1. **Monitor your deployment:**
   - Render: Dashboard shows logs in real-time
   - Vercel: Analytics tab shows traffic

2. **Use custom domain:**
   - Vercel: Settings → Domains → Add your domain
   - Render: Similar process

3. **Auto-redeploy on code push:**
   - Both Render and Vercel support this by default
   - Just push to main branch

4. **Environment variables:**
   - Never commit .env files
   - Always set in deployment platform dashboard

---

## ✅ You're Live!

Your Intervue polling system is now deployed and accessible to the world! 🎉

Share the link and start using it!

