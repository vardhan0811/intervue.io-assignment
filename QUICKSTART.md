# Quick Start Guide

## 🚀 Fastest Way to Run

### Windows (PowerShell)

```powershell
# Run the quick start script
.\start.ps1
```

Choose option:
1. **First time:** Select option 1 to install dependencies
2. **Run app:** Select option 4 to start both servers
3. **Open:** http://localhost:5173

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # first time only
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # first time only
npm run dev
```

**Open:** http://localhost:5173

## 🧪 Testing the App

### Test as Teacher

1. Open http://localhost:5173
2. Click "I'm a Teacher"
3. Create a poll:
   - Enter question
   - Add 4 options
   - Select correct answer
   - Click "Ask a new question"

### Test as Student

1. Open http://localhost:5173 in a **new tab/window**
2. Click "I'm a Student"
3. Enter your name (e.g., "John Doe")
4. Answer the poll
5. View results

### Test Multiple Students

1. Open 3-4 tabs as different students
2. Use different names for each
3. Answer the poll from each tab
4. Watch live results update in teacher dashboard

### Test Chat

1. Click the chat button (💬) in bottom-right
2. Send messages between teacher and students
3. Switch to "Participants" tab to see all users

### Test Student Removal

1. As teacher, hover over a student in the participants list
2. Click the ✕ button
3. Confirm removal
4. Student tab will show "You've been Kicked out!"

## 📝 Default Credentials

No authentication required - just select your role!

## 🔧 Troubleshooting

### Port Already in Use

**Backend (5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Connection Failed

1. Make sure backend is running on port 5000
2. Check frontend `.env` has correct backend URL
3. Restart both servers

## 📚 More Information

- [Main README](README.md) - Complete documentation
- [Deployment Guide](DEPLOYMENT.md) - How to deploy
- [Walkthrough](walkthrough.md) - Implementation details

## 🎉 Enjoy!

Your Live Polling System is ready to use!
