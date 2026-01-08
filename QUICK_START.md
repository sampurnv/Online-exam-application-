# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js v14+ installed
- [ ] MongoDB v4.4+ installed (or MongoDB Atlas account)
- [ ] Python 3.8+ installed
- [ ] npm or yarn installed

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone and Setup Backend (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/online-exam
# JWT_SECRET=your_secret_key_change_this
# PYTHON_SERVICE_URL=http://localhost:5001
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 2: Setup Python Service (2 minutes)
```bash
cd python-service
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
cp .env.example .env
python app.py
```
✅ Python service running on http://localhost:5001

### Step 3: Setup Frontend (1 minute)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env:
# REACT_APP_API_URL=http://localhost:5000/api
npm start
```
✅ Frontend running on http://localhost:3000

## 📝 First Time Setup

### Create Admin User
1. Register at http://localhost:3000/register
2. Use MongoDB shell or Compass:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isApproved: true } }
)
```

### Test the Application

**As Admin:**
1. Login with admin credentials
2. View dashboard statistics
3. Approve teacher accounts

**As Teacher:**
1. Register with teacher role
2. Wait for admin approval (or approve yourself if you're admin)
3. Create a sample exam
4. Add questions
5. Publish the exam

**As Student:**
1. Register as student
2. View available exams
3. Start an exam
4. Complete and submit
5. View results

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod --version`
- Check if port 5000 is available
- Verify .env file exists with correct values

### Python service errors
- Ensure virtual environment is activated
- Check if NLTK data is downloaded
- Verify port 5001 is available

### Frontend won't connect
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Clear browser cache and restart

### MongoDB connection failed
- Start MongoDB: `mongod` or `brew services start mongodb-community`
- Or use MongoDB Atlas connection string
- Check firewall settings

## 🎯 Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/health
- **Python Service**: http://localhost:5001
- **Python Health**: http://localhost:5001/health

## 📱 Test Accounts

Create these for testing:

**Admin**
- Email: admin@test.com
- Password: admin123
- Role: admin (set in DB)

**Teacher**
- Email: teacher@test.com
- Password: teacher123
- Role: teacher

**Student**
- Email: student@test.com
- Password: student123
- Role: student

## 🛑 Common Issues

### Issue: "Module not found" in backend
**Solution**: `cd backend && npm install`

### Issue: NLTK data not found
**Solution**: 
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Issue: CORS errors in frontend
**Solution**: Check backend CORS_ORIGIN matches frontend URL

### Issue: JWT token invalid
**Solution**: Logout and login again, or check JWT_SECRET matches

### Issue: MongoDB connection timeout
**Solution**: 
- Check MongoDB is running
- Verify connection string
- Check network/firewall

## 💡 Development Tips

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on changes with nodemon
```

### Frontend Development
```bash
cd frontend
npm start  # Hot reload enabled
```

### Python Development
```bash
cd python-service
# Set FLASK_ENV=development in .env
python app.py  # Manual restart needed
```

### Testing API
Use tools like:
- Postman
- Thunder Client (VS Code)
- curl commands

Example:
```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 📚 Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Review [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API reference
4. See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database design
5. Explore [FRONTEND_COMPONENTS.md](./FRONTEND_COMPONENTS.md) for frontend details

## 🎓 Learning Path

If you're new to the stack:

1. **Learn MongoDB**: MongoDB University (free)
2. **Learn Express**: Express.js documentation
3. **Learn React**: Official React tutorial
4. **Learn Python/Flask**: Flask mega-tutorial

## 🤝 Getting Help

- Check the README for detailed documentation
- Review code comments in source files
- Check console logs for errors
- Use browser DevTools for frontend debugging
- Check MongoDB logs for database issues

## ✨ Success Criteria

Your setup is successful when:
- ✅ Backend server shows "MongoDB Connected" message
- ✅ Python service shows "Starting Python microservice" message
- ✅ Frontend loads at http://localhost:3000
- ✅ You can register a new user
- ✅ You can login successfully
- ✅ Dashboard displays correctly based on role

---

**Enjoy building with the Online Examination Application! 🎉**
