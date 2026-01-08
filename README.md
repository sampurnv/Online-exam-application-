# Online Examination Application

A comprehensive full-stack online examination system with role-based access control for Admin, Teachers, and Students.

## 🚀 Features

### User Roles
- **Admin**: System management, user approval, view all exams and results
- **Teacher**: Create exams, manage questions, evaluate submissions, view analytics
- **Student**: Take exams, view results, track performance

### Core Features
- JWT-based authentication and authorization
- Role-based access control (RBAC)
- Real-time exam timer with auto-submit
- Multiple question types (MCQ, True/False, Short, Long Answer)
- Automatic evaluation for objective questions
- AI-powered evaluation for subjective answers using Python NLP
- Plagiarism detection
- Performance analytics and insights
- Exam settings (randomization, negative marking, time limits)
- Auto-save answers during exam
- Comprehensive dashboard for each role
- Results with detailed feedback

## 🛠 Tech Stack

### Frontend
- **React** (with Hooks)
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- Security packages (helmet, cors, rate-limit, mongo-sanitize)

### Python Microservice
- **Flask** web framework
- **NLTK** for natural language processing
- **scikit-learn** for text analysis and ML
- **NumPy** for numerical computations

## 📁 Project Structure

```
Online-exam-application/
├── backend/                 # Node.js Express Backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── python-service/         # Python Microservice
│   ├── src/
│   │   ├── routes/        # Flask routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper utilities
│   ├── app.py             # Flask app entry point
│   ├── requirements.txt
│   └── .env.example
│
├── ARCHITECTURE.md         # System architecture
├── API_ENDPOINTS.md        # API documentation
├── DATABASE_SCHEMA.md      # MongoDB schema
└── README.md              # This file
```

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Online-exam-application-
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI (MongoDB connection string)
# - JWT_SECRET (Your secret key)
# - PORT (default: 5000)
# - PYTHON_SERVICE_URL (default: http://localhost:5001)

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Python Microservice Setup

```bash
cd python-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Create .env file
cp .env.example .env

# Edit .env if needed (default PORT: 5001)

# Start the Python service
python app.py
```

Python service will run on `http://localhost:5001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the React development server
npm start
```

Frontend will run on `http://localhost:3000`

### 5. MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB and start the service
mongod --dbpath /path/to/your/data
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get the connection string
4. Update `MONGODB_URI` in backend `.env` file

## 🎯 Usage

### Initial Setup

1. **Start all services:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`
   - Python: `http://localhost:5001`
   - MongoDB: Running locally or on Atlas

2. **Create Admin User:**
   Register a user and manually update their role to 'admin' in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin", isApproved: true } }
   )
   ```

3. **Register as Teacher/Student:**
   - Teachers need admin approval before accessing the system
   - Students are auto-approved

### User Workflows

**Admin Workflow:**
1. Login to admin dashboard
2. Approve/block teachers
3. View system statistics
4. Manage all users

**Teacher Workflow:**
1. Register and wait for admin approval
2. Login to teacher dashboard
3. Create questions
4. Create exams and add questions
5. Publish exams
6. View submissions and evaluate

**Student Workflow:**
1. Register as student (auto-approved)
2. Login to student dashboard
3. View available exams
4. Start and complete exams
5. View results and analytics

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- MongoDB injection prevention
- Rate limiting to prevent brute force
- CORS configuration
- Helmet for security headers
- Environment variables for sensitive data

## 📊 API Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation.

### Key Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Users**: `/api/users` (Admin only)
- **Exams**: `/api/exams`
- **Questions**: `/api/questions`
- **Submissions**: `/api/submissions`
- **Results**: `/api/results`
- **Dashboard**: `/api/dashboard/{role}`

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

### Collections
- **users**: User accounts and profiles
- **exams**: Exam configurations
- **questions**: Question bank
- **submissions**: Student submissions
- **results**: Evaluation results
- **logs**: Audit logs

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture.

The application follows a 3-tier architecture:
- **Frontend**: React SPA
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB
- **Microservice**: Python Flask for AI/NLP features

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Backend (Node.js)
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

Recommended platforms: Heroku, AWS EC2, DigitalOcean, Render

### Frontend (React)
```bash
cd frontend
npm run build
```

Deploy the `build` folder to: Vercel, Netlify, AWS S3

### Python Service
```bash
cd python-service
pip install gunicorn
gunicorn app:app
```

### Database
Use MongoDB Atlas for production

### Environment Variables
Set all environment variables on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License

## 🔮 Future Enhancements

- Real-time proctoring with WebRTC
- Video question support
- Mobile application (React Native)
- Advanced analytics with charts
- Integration with Learning Management Systems
- Email notifications
- Question import from CSV/Excel
- Bulk user management
- Advanced plagiarism detection
- Multi-language support

## 📞 Support

For support, create an issue in the repository.

## 🙏 Acknowledgments

- NLTK for NLP capabilities
- MongoDB for database
- React community
- Node.js community