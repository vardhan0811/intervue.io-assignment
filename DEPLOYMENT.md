# Live Polling System - Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All code tested locally
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Build successful
- [ ] Socket.io connections working

## 🚀 Backend Deployment

### Option 1: Render (Recommended)

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Service**
   - **Name:** `polling-system-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Set Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy the service URL (e.g., `https://polling-system-backend.onrender.com`)

### Option 2: Railway

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Add environment variables
   - Set root directory to `backend`
   - Deploy

### Option 3: Heroku

```bash
cd backend
heroku create polling-system-backend
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com
git push heroku main
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `frontend` directory

3. **Configure Build**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Set Environment Variable**
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Netlify

1. **Create Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Choose your repository
   - Set base directory to `frontend`

3. **Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

4. **Environment Variables**
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**

## 🔧 Post-Deployment Configuration

### Update CORS Settings

After deploying frontend, update backend `.env`:

```
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

Redeploy backend for changes to take effect.

### Test Deployment

1. **Open Frontend URL**
2. **Test Teacher Flow:**
   - Select "I'm a Teacher"
   - Create a poll
   - Verify it appears

3. **Test Student Flow (in new tab/window):**
   - Select "I'm a Student"
   - Enter name
   - Answer poll
   - Verify results appear

4. **Test Real-time Features:**
   - Open multiple student tabs
   - Verify live updates work
   - Test chat functionality

## 🐛 Troubleshooting

### WebSocket Connection Failed

**Problem:** Students/Teacher can't connect

**Solution:**
1. Check backend URL in frontend `.env`
2. Verify CORS settings in backend
3. Check browser console for errors
4. Ensure WebSocket support on hosting platform

### Environment Variables Not Working

**Problem:** App shows connection errors

**Solution:**
1. Rebuild frontend after changing env vars
2. Restart backend service
3. Clear browser cache
4. Check env var names (must start with `VITE_` for frontend)

### Build Failures

**Problem:** Deployment fails during build

**Solution:**
1. Test build locally: `npm run build`
2. Check Node.js version compatibility
3. Verify all dependencies in package.json
4. Check build logs for specific errors

## 📊 Monitoring

### Backend Health Check

```
GET https://your-backend-url.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

### Frontend Health Check

Simply visit your frontend URL - should load the welcome page.

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. Push to GitHub main branch
2. Services automatically detect changes
3. Rebuild and redeploy
4. Live in 2-5 minutes

## 💰 Cost Estimation

### Free Tier Limits

**Render (Backend):**
- 750 hours/month free
- Sleeps after 15 min inactivity
- Cold start: 30-60 seconds

**Vercel (Frontend):**
- 100 GB bandwidth/month
- Unlimited deployments
- Always on (no sleep)

### Recommendations

For production use:
- Upgrade Render to paid plan ($7/month) to prevent sleep
- Consider Railway ($5/month) for better performance
- Vercel free tier is sufficient for most use cases

## 📝 Deployment Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] WebSocket connections working
- [ ] Tested with multiple users
- [ ] Chat functionality working
- [ ] Poll creation and answering working
- [ ] Timer working correctly
- [ ] Student removal working
- [ ] Poll history accessible
- [ ] Mobile responsive
- [ ] Error handling tested

## 🎉 Success!

Your Live Polling System is now deployed and ready to use!

**Share your links:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`

## 📞 Support

For issues:
1. Check browser console for errors
2. Check backend logs on Render/Railway
3. Verify environment variables
4. Test locally first
5. Check Socket.io connection status
