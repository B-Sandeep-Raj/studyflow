# StudyFlow - Quick Setup Guide

## ✅ Installation Complete!

All files have been generated. Here's what you need to do:

### 1️⃣ **Ensure MongoDB is Running**

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env`

### 2️⃣ **Install Dependencies** (if not done already)
```bash
cd studyflow
npm install
```

### 3️⃣ **Update Environment Variables**

Edit `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyflow
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRATION=7d
NODE_ENV=development
```

### 4️⃣ **Start the Server**

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected successfully
```

### 5️⃣ **Open in Browser**

Go to: `http://localhost:5000`

### 6️⃣ **Create Your Account**

1. Click "Register here" on the login page
2. Enter your name, email, and password
3. Click Register
4. You'll be automatically logged in to the dashboard

## 🎯 How to Use

### Dashboard
- View your total study hours and current streak
- See weekly progress chart
- Quick-add study sessions
- Navigate to other sections

### Subjects
- Click "Add Subject" to create new subjects
- Assign custom colors to each subject
- Edit or delete subjects as needed

### Study Logs
- Log your study sessions with subject, duration, and topic
- Filter logs by today, this week, or all time
- View detailed information for each session

### Analytics
- See your daily study pattern (line chart)
- View subject distribution (pie chart)
- Check statistics like average daily study and weekly average

## 📁 Project Structure

```
studyflow/
├── server.js              ← Main Express server
├── package.json          ← Dependencies
├── .env                  ← Configuration (⚠️ Keep secret!)
├── config/db.js          ← MongoDB connection
├── models/               ← Database schemas (User, Subject, StudyLog)
├── routes/               ← API endpoints (auth, subjects, study-logs)
├── middleware/           ← JWT authentication
└── public/
    ├── index.html        ← Main UI
    ├── css/style.css     ← All styling (glassmorphism)
    └── js/
        ├── auth.js       ← Login/Register
        ├── dashboard.js  ← CRUD operations
        └── charts.js     ← Chart.js integration
```

## 🔧 API Endpoints

All endpoints (except auth/register and auth/login) require JWT token:

```
POST /api/auth/register              - Register new user
POST /api/auth/login                 - Login user
GET  /api/auth/me                    - Get current user (protected)

GET  /api/subjects                   - Get all subjects (protected)
POST /api/subjects                   - Create subject (protected)
PUT  /api/subjects/:id               - Update subject (protected)
DELETE /api/subjects/:id             - Delete subject (protected)

GET  /api/study-logs                 - Get all logs (protected)
GET  /api/study-logs/today/logs      - Get today's logs (protected)
GET  /api/study-logs/week/logs       - Get week's logs (protected)
GET  /api/study-logs/analytics/dashboard - Get analytics (protected)
POST /api/study-logs                 - Create log (protected)
PUT  /api/study-logs/:id             - Update log (protected)
DELETE /api/study-logs/:id           - Delete log (protected)
```

## 🎨 Features Included

✅ Modern Glassmorphism UI
✅ Dark/Light Mode Toggle
✅ Fully Responsive (Mobile, Tablet, Desktop)
✅ JWT Authentication with bcrypt
✅ Subject Management
✅ Study Session Logging
✅ Analytics & Charts
✅ Streak Counter
✅ Weekly Progress
✅ Subject-wise Distribution
✅ Input Validation
✅ Error Handling
✅ Toast Notifications

## 🚀 Development Commands

```bash
# Start server with auto-reload
npm run dev

# Start server normally
npm start

# Install dependencies
npm install

# Run audits
npm audit
npm audit fix
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure mongod is running
- Check MONGODB_URI in .env
- Verify your IP is whitelisted (if using Atlas)

### "Port 5000 already in use"
- Change PORT in .env to 5001, 5002, etc.
- Or kill the process using that port

### "Charts not showing"
- Check browser console (F12) for errors
- Ensure you have added at least one subject
- Log a study session first

### "Login/Register not working"
- Check browser console for errors
- Verify server is running
- Check network tab in DevTools

## 📚 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Styling**: Custom CSS (Glassmorphism)

## 🔐 Security Notes

⚠️ **IMPORTANT**: Before deploying to production:
1. Change JWT_SECRET in .env to a strong random string
2. Set NODE_ENV to "production"
3. Use MongoDB Atlas instead of local DB
4. Enable HTTPS
5. Add rate limiting
6. Use environment variable manager

## 📝 Example Workflow

1. Register with your email
2. Add "Mathematics" subject (blue color)
3. Add "English" subject (green color)
4. Log "Algebra Practice" for Mathematics - 60 minutes
5. Log "Essay Writing" for English - 45 minutes
6. View dashboard to see stats
7. Check analytics for charts
8. Toggle dark mode and responsive design

## 🎉 You're All Set!

The StudyFlow application is now ready to use. Start tracking your study sessions and watch your progress grow! 📚✨

For questions or improvements, check the code comments and README.md for more details.

---

**Happy Studying! 🚀**
