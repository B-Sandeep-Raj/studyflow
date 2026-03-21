# StudyFlow - Smart Study Tracking Platform

A modern, responsive web application to help students track their daily study time, subjects, topics, progress, and streaks with a clean dashboard UI.

## 🎯 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Subject Management**: Create, edit, and manage subjects with custom colors
- **Study Logging**: Log study sessions with duration, topic, and status
- **Dashboard**: Real-time analytics with total hours, streak counter, and daily summary
- **Analytics**: Weekly, daily, and subject-wise progress visualization
- **Charts**: Interactive charts (Bar, Line, Pie, Doughnut) using Chart.js
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Glassmorphism UI**: Modern frosted glass effect on cards and components
- **⏱️ Timer System Integration**: Unified duration tracking with pause/resume support
- **📊 Session Analytics**: Detailed session tracking with export capabilities

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Styling**: Custom CSS with Glassmorphism

## 📁 Project Structure

```
studyflow/
├── server.js                           # Main Express server
├── package.json                        # Dependencies
├── .env                               # Environment variables
├── config/
│   └── db.js                          # MongoDB connection
├── models/
│   ├── User.js                        # User schema
│   ├── Subject.js                     # Subject schema
│   └── StudyLog.js                    # StudyLog schema
├── routes/
│   ├── authRoutes.js                  # Auth endpoints
│   ├── subjectRoutes.js               # Subject CRUD endpoints
│   └── studyRoutes.js                 # Study log endpoints
├── middleware/
│   └── authMiddleware.js              # JWT verification
├── utils/
│   ├── durationTracker.js             # Duration tracking utility
│   └── timerSystemBridge.js           # Timer system integration
├── public/
│   ├── index.html                     # Main HTML file
│   ├── css/
│   │   └── style.css                  # All styles
│   ├── js/
│   │   ├── auth.js                    # Auth logic
│   │   ├── dashboard.js               # Dashboard & CRUD logic
│   │   └── charts.js                  # Chart initialization
│   └── timer/
│       ├── index.html                 # Timer UI (refactored desktop layout)
│       ├── css/
│       │   ├── timer.css              # Timer styles
│       │   └── DESKTOP-FIX.css        # Desktop optimizations
│       └── js/
│           └── timer.js               # Timer logic
└── TIMER_SYSTEM_INTEGRATION.md        # Timer system integration guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd studyflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/studyflow
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRATION=7d
   NODE_ENV=development
   ```

   For MongoDB Atlas (cloud):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyflow
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Subjects
- `GET /api/subjects` - Get all subjects (protected)
- `POST /api/subjects` - Create subject (protected)
- `PUT /api/subjects/:id` - Update subject (protected)
- `DELETE /api/subjects/:id` - Delete subject (protected)

### Study Logs
- `GET /api/study-logs` - Get all logs (protected)
- `GET /api/study-logs/today/logs` - Get today's logs (protected)
- `GET /api/study-logs/week/logs` - Get week's logs (protected)
- `GET /api/study-logs/analytics/dashboard` - Get analytics (protected)
- `POST /api/study-logs` - Create log (protected)
- `PUT /api/study-logs/:id` - Update log (protected)
- `DELETE /api/study-logs/:id` - Delete log (protected)

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with each protected request.

Request format:
```
Authorization: Bearer <token>
```

## ⏱️ Timer System Integration

### Overview
StudyFlow includes a professional timer system for accurate duration tracking with pause/resume support.

### Components

**DurationTracker** (`utils/durationTracker.js`)
- Start, pause, resume, and end sessions
- Millisecond-based duration calculation
- localStorage persistence
- Today's statistics aggregation

**TimerSystemBridge** (`utils/timerSystemBridge.js`)
- Syncs timer events with duration tracker
- Provides analytics and reporting
- Exports data (JSON, CSV)
- Subject and notes tracking

### Key Features
✅ Accurate Timing (timestamps, not intervals)  
✅ Pause/Resume support  
✅ Auto-persist to localStorage  
✅ Subject-wise analytics  
✅ Export as JSON or CSV  
✅ Works offline  

### Quick Usage
```javascript
const tracker = new DurationTracker();
tracker.startSession('Mathematics', 'Chapter 5');
// ... studying ...
tracker.endSession();
const stats = tracker.getTodayStats();
```

For detailed documentation, see [TIMER_SYSTEM_INTEGRATION.md](./TIMER_SYSTEM_INTEGRATION.md)

## 📊 Dashboard Features

- **Stats Cards**: Total hours, streak, subjects, today's study
- **Weekly Progress**: Bar chart showing study hours per day
- **Subject Distribution**: Pie chart showing time per subject
- **Quick Add**: Fast logging from dashboard
- **Navigation**: Sidebar with quick access to all sections

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effect
- **Smooth Animations**: Transitions and interactions
- **Dark Mode**: Click moon icon in sidebar to toggle
- **Responsive Layout**: Works on desktop, tablet, mobile
- **Card-based Interface**: Clean, organized information display
- **Color-coded Subjects**: Each subject has unique color for easy identification

## 📈 Analytics Page

- **Daily Study Pattern**: Line chart of study trends
- **Subject Distribution**: Pie chart of time allocation
- **Statistics Table**: Average daily study, total sessions, most active subject, weekly average

## 🔄 Workflow

1. **Register/Login** - Create account or login
2. **Add Subjects** - Create subjects you want to track
3. **Log Study Sessions** - Record study time for each subject
4. **View Dashboard** - Check your progress and analytics
5. **Track Streaks** - Maintain daily study consistency

## 💾 Data Storage

All data is stored in MongoDB:
- User profiles with hashed passwords
- Subject information with custom colors
- Study logs with duration, topic, and status
- All timestamps for tracking consistency

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication
- **Protected Routes**: All data endpoints require valid token
- **Input Validation**: Server-side validation on all inputs
- **CORS**: Configured for secure cross-origin requests

## 🌙 Dark Mode

Click the moon icon in the sidebar to toggle between light and dark themes. Preference is saved in localStorage.

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar + content layout
- **Tablet**: Optimized grid layouts
- **Mobile**: Stacked layouts, horizontal scrolling for nav

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Deploy to Railway/Render
1. Connect your Git repository
2. Set environment variables
3. Deploy automatically

## 🐛 Troubleshooting

**MongoDB connection error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access for Atlas

**Port already in use**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

**Charts not showing**
- Check browser console for errors
- Ensure data is loaded
- Verify Chart.js is loaded

## 📝 Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRATION` - Token expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

## 🎯 Future Enhancements

- Export study reports as PDF
- AI-powered study tips
- Goal setting (daily hours target)
- Push notifications and reminders
- Social features (share progress)
- Study session timer
- Break reminders
- Leaderboards
- Mobile app

## 👨‍💻 Author

**B. Sandeep Raj**  
Aspiring Software Developer passionate about building real-world applications using MERN Stack and Java.

🔗 GitHub: https://github.com/B-Sandeep-Raj  
🌐 Portfolio: https://sandeeprajportfolio.netlify.app/
---

**Happy Studying! 📚✨**
