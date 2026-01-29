#!/bin/bash
# StudyFlow - Quick Commands Reference

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 MAIN COMMANDS
# ═══════════════════════════════════════════════════════════════════════════

# START APPLICATION (Production Mode)
npm start

# START APPLICATION (Development Mode - Auto Reload)
npm run dev

# INSTALL DEPENDENCIES
npm install

# UPDATE DEPENDENCIES
npm update

# CHECK FOR SECURITY ISSUES
npm audit

# FIX SECURITY ISSUES
npm audit fix

# ═══════════════════════════════════════════════════════════════════════════
# 📁 DIRECTORY NAVIGATION
# ═══════════════════════════════════════════════════════════════════════════

# Navigate to project
cd C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow

# List all files (excluding node_modules)
dir /s /b | find /V "node_modules"

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 USEFUL COMMANDS
# ═══════════════════════════════════════════════════════════════════════════

# Kill process on port 5000 (Windows PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Kill process on port 5000 (Command Prompt)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Check if MongoDB is running
mongod --version

# Start local MongoDB
mongod

# ═══════════════════════════════════════════════════════════════════════════
# 📊 PROJECT INFORMATION
# ═══════════════════════════════════════════════════════════════════════════

# View package.json
cat package.json

# View installed packages
npm list

# View available npm scripts
npm run

# ═══════════════════════════════════════════════════════════════════════════
# 🌐 BROWSER
# ═══════════════════════════════════════════════════════════════════════════

# Development Server
http://localhost:5000

# Chrome DevTools
F12 or Ctrl+Shift+I

# Console Logging
Open Developer Tools → Console Tab

# Network Tab
Open Developer Tools → Network Tab

# ═══════════════════════════════════════════════════════════════════════════
# 📝 ENVIRONMENT VARIABLES
# ═══════════════════════════════════════════════════════════════════════════

# .env file location
.\studyflow\.env

# Key variables to update:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/studyflow
# JWT_SECRET=your_secret_key
# JWT_EXPIRATION=7d
# NODE_ENV=development

# ═══════════════════════════════════════════════════════════════════════════
# 🔐 MongoDB Commands
# ═══════════════════════════════════════════════════════════════════════════

# Start MongoDB (local)
mongod

# Connect to MongoDB (another terminal)
mongo

# View databases
show dbs

# Use studyflow database
use studyflow

# View collections
show collections

# View all users
db.users.find()

# View all subjects
db.subjects.find()

# View all study logs
db.studylogs.find()

# ═══════════════════════════════════════════════════════════════════════════
# 🧪 API TESTING (with curl or Postman)
# ═══════════════════════════════════════════════════════════════════════════

# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"

# Get All Subjects (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer TOKEN"

# Create Subject
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d "{\"name\":\"Mathematics\",\"color\":\"#3498db\"}"

# Get Analytics
curl -X GET http://localhost:5000/api/study-logs/analytics/dashboard \
  -H "Authorization: Bearer TOKEN"

# ═══════════════════════════════════════════════════════════════════════════
# 📚 FILE LOCATIONS
# ═══════════════════════════════════════════════════════════════════════════

Main Server:        C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\server.js
Configuration:     C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\.env
Frontend HTML:     C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\public\index.html
Frontend CSS:      C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\public\css\style.css
Frontend JS:       C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\public\js\
Models:            C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\models\
Routes:            C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow\routes\

# ═══════════════════════════════════════════════════════════════════════════
# 📖 DOCUMENTATION
# ═══════════════════════════════════════════════════════════════════════════

README.md                    - Full documentation
SETUP_GUIDE.md              - Quick start guide
COMPLETE_FILE_OVERVIEW.md   - Detailed file breakdown
PROJECT_SUMMARY.txt         - Quick reference (this file)

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 WORKFLOW EXAMPLES
# ═══════════════════════════════════════════════════════════════════════════

# 1. Initial Setup
cd C:\Users\bsand\Desktop\SANDEEP_TRACKING\studyflow
npm install

# 2. Start MongoDB
mongod

# 3. Start Application (in another terminal)
npm start

# 4. Open Browser
http://localhost:5000

# 5. Create Account
Register → Fill details → Create account

# 6. Add Subject
Click "Add Subject" → Enter name → Choose color

# 7. Log Study Session
Click "Add Log" → Select subject → Enter details

# 8. View Analytics
Go to Analytics page → See charts and stats

# ═══════════════════════════════════════════════════════════════════════════
# ⚡ COMMON ISSUES & SOLUTIONS
# ═══════════════════════════════════════════════════════════════════════════

# Issue: npm: command not found
# Solution: Install Node.js from https://nodejs.org

# Issue: MongoDB connection refused
# Solution: Start MongoDB with: mongod

# Issue: Port 5000 already in use
# Solution: Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Issue: Cannot find module
# Solution: npm install (from project directory)

# Issue: Charts not showing
# Solution: Add subject → Log study session → Refresh page

# ═══════════════════════════════════════════════════════════════════════════
# 🎉 SUCCESS INDICATORS
# ═══════════════════════════════════════════════════════════════════════════

# ✅ Server Running
🚀 Server running on http://localhost:5000

# ✅ MongoDB Connected
✅ MongoDB connected successfully

# ✅ Can Register
See "Registration successful!" message

# ✅ Can Login
See "Login successful!" message

# ✅ Can View Dashboard
See stats cards and charts

# ✅ Can Add Subject
Subject appears in subjects page

# ✅ Can Log Study
Log appears in Study Logs page

# ═══════════════════════════════════════════════════════════════════════════

Last Updated: January 28, 2026
Version: 1.0.0
Status: ✅ READY TO USE
