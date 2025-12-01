# Live Polling System - Intervue Assignment

A real-time polling system with Teacher and Student personas built with React, Redux, Express.js, and Socket.io.

## 🎯 Features

### Teacher Features
- ✅ Create new polls with 4 options
- ✅ View live polling results with real-time updates
- ✅ See list of connected students and their answer status
- ✅ Remove students from the poll system
- ✅ View poll history (server-side storage)
- ✅ Configure poll time limit (10-300 seconds)
- ✅ Chat with students in real-time

### Student Features
- ✅ Enter unique name on first visit
- ✅ Submit answers to active polls
- ✅ View live polling results after submission
- ✅ 60-second timer (or custom time set by teacher)
- ✅ Auto-submit when timer expires
- ✅ Chat with teacher and other students
- ✅ See other participants

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Vite** - Build tool and dev server
- **Custom CSS** - Styling (following Figma design)

### Backend
- **Express.js** - Web server
- **Socket.io** - WebSocket server for real-time features
- **Node.js** - Runtime environment

## 📁 Project Structure

```
intervue.io/
├── backend/
│   ├── server.js              # Express server with Socket.io
│   ├── socketHandlers.js      # Socket event handlers
│   ├── pollManager.js         # Poll business logic
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ChatPopup.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── PollResults.jsx
│   │   │   ├── PollCreationForm.jsx
│   │   │   ├── ParticipantsList.jsx
│   │   │   ├── PollHistory.jsx
│   │   │   └── KickedScreen.jsx
│   │   ├── pages/             # Main pages
│   │   │   ├── Welcome.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── StudentInterface.jsx
│   │   ├── store/             # Redux store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   ├── services/          # Socket.io service
│   │   │   └── socket.js
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd intervue.io
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - Open multiple tabs/windows to test Teacher and Student flows

## 🎮 How to Use

### As a Teacher
1. Select "I'm a Teacher" on the welcome screen
2. Create a poll by entering:
   - Question text
   - 4 answer options
   - Select the correct answer
   - Set time limit (optional)
3. Click "Ask a new question"
4. Watch live results as students answer
5. View participants in the sidebar
6. Remove students if needed
7. View poll history
8. Chat with students

### As a Student
1. Select "I'm a Student" on the welcome screen
2. Enter your name (must be unique)
3. Wait for teacher to create a poll
4. Select your answer before time runs out
5. View results after submission
6. Wait for next question
7. Chat with teacher and other students

## 🎨 Design

The UI strictly follows the provided Figma design with:
- Purple theme (#6C5CE7 primary color)
- Clean, modern interface
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Inter font family

## 📡 Socket.io Events

### Teacher Events
- `teacher:join` - Teacher connects
- `poll:create` - Create new poll
- `student:remove` - Remove a student
- `poll:history:request` - Request poll history

### Student Events
- `student:join` - Student joins with name
- `poll:answer` - Submit answer

### Broadcast Events
- `poll:new` - New poll created
- `poll:results` - Updated results
- `poll:ended` - Poll ended (timeout or all answered)
- `students:list` - Updated student list
- `chat:message` - New chat message
- `student:kicked` - Student was removed

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Create a new web service**
2. **Set environment variables:**
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ```
3. **Build command:** `npm install`
4. **Start command:** `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set environment variable:**
   ```
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

3. **Deploy the `dist` folder**

## 🧪 Testing

### Manual Testing Checklist
- [ ] Teacher can create polls
- [ ] Students can join with unique names
- [ ] Students can answer questions
- [ ] Results update in real-time
- [ ] Timer counts down correctly
- [ ] Auto-submit works on timeout
- [ ] Teacher can remove students
- [ ] Removed students see kicked screen
- [ ] Chat works between teacher and students
- [ ] Poll history displays correctly
- [ ] Multiple students can answer simultaneously
- [ ] Responsive design works on mobile

## 📝 Notes

- Poll data is stored in-memory (resets on server restart)
- For production, consider adding a database (MongoDB/PostgreSQL)
- Each browser tab is treated as a separate student
- Student names must be unique per session

## 🎯 Assignment Requirements

### Must-Have ✅
- [x] Functional system with all core features
- [x] Teacher can create polls
- [x] Students can answer polls
- [x] Both can view results
- [x] UI follows Figma design
- [x] Ready for hosting

### Good to Have ✅
- [x] Configurable poll time limit
- [x] Option to remove students
- [x] Well-designed user interface

### Bonus Features ✅
- [x] Chat popup for teacher-student interaction
- [x] Teacher can view past poll results (server-side storage)

## 📄 License

MIT

## 👨‍💻 Author

Created for Intervue Assignment
