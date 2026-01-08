# System Architecture - Online Examination Application

## Overview
The Online Examination Application follows a modern **3-tier architecture** with a clear separation between Frontend, Backend, and Python Microservices.

## Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 3000)                     │ │
│  │  - Role-based Dashboards (Admin/Teacher/Student)           │ │
│  │  - Exam Interface with Timer                               │ │
│  │  - Authentication UI                                        │ │
│  │  - Results & Analytics View                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/REST API
                            │ (Axios)
┌───────────────────────────▼─────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Node.js + Express Backend (Port 5000)            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  API Routes                                           │ │ │
│  │  │  - /api/auth (Login, Register, JWT)                  │ │ │
│  │  │  - /api/users (User Management)                      │ │ │
│  │  │  - /api/exams (CRUD Operations)                      │ │ │
│  │  │  - /api/questions (Question Bank)                    │ │ │
│  │  │  - /api/submissions (Exam Submissions)               │ │ │
│  │  │  - /api/results (Results & Analytics)                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Middleware                                           │ │ │
│  │  │  - JWT Authentication                                 │ │ │
│  │  │  - Role-based Authorization                          │ │ │
│  │  │  - Input Validation                                   │ │ │
│  │  │  - Error Handler                                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Business Logic (Controllers & Services)             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
          ┌─────────────────┴──────────────────┐
          │                                    │
          ▼                                    ▼
┌─────────────────────┐           ┌────────────────────────────┐
│   DATABASE LAYER    │           │   PYTHON MICROSERVICE      │
│                     │           │      (Port 5001)           │
│  MongoDB            │           │                            │
│  - Users            │           │  - Auto Evaluation         │
│  - Exams            │           │  - Plagiarism Detection    │
│  - Questions        │           │  - Performance Analytics   │
│  - Submissions      │           │  - AI-based Grading        │
│  - Results          │           │                            │
│  - Logs             │           │  Flask/FastAPI REST API    │
└─────────────────────┘           └────────────────────────────┘
```

## Component Description

### 1. Frontend (React)
- **Technology**: React with Hooks, HTML5, CSS3, Axios
- **Responsibilities**:
  - User Interface rendering
  - Client-side routing
  - State management
  - API communication
  - Form validation
  - Real-time exam timer

### 2. Backend (Node.js + Express)
- **Technology**: Node.js, Express.js, Mongoose
- **Responsibilities**:
  - RESTful API endpoints
  - Business logic processing
  - Authentication & Authorization (JWT)
  - Database operations
  - Request validation
  - Error handling
  - Communication with Python service

### 3. Database (MongoDB)
- **Technology**: MongoDB with Mongoose ODM
- **Responsibilities**:
  - Data persistence
  - User data storage
  - Exam configuration
  - Submissions tracking
  - Results storage
  - Audit logs

### 4. Python Microservice
- **Technology**: Python (Flask/FastAPI)
- **Responsibilities**:
  - Auto-evaluation of subjective answers
  - Plagiarism detection using NLP
  - Performance analytics computation
  - AI-based grading (optional)
  - Statistical analysis

## Data Flow

### Authentication Flow
1. User submits credentials via React form
2. Frontend sends POST request to /api/auth/login
3. Backend validates credentials against MongoDB
4. Backend generates JWT token
5. Token returned to frontend and stored (localStorage/cookie)
6. Subsequent requests include JWT in Authorization header

### Exam Taking Flow
1. Student selects exam from dashboard
2. Frontend fetches exam details from /api/exams/:id
3. Exam interface loads with timer
4. Answers auto-saved to backend every 30 seconds
5. On submit/timeout, final submission sent to /api/submissions
6. Backend stores submission and triggers Python evaluation
7. Python service evaluates and returns scores
8. Results stored in database

### Evaluation Flow
1. Submission received by Node.js backend
2. MCQ/True-False auto-graded immediately
3. Subjective answers sent to Python microservice
4. Python performs NLP-based evaluation
5. Combined scores calculated
6. Results stored in MongoDB
7. Student notified via dashboard

## Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Middleware checks user roles
- **Input Validation**: Express-validator for request validation
- **CORS Configuration**: Restricted origins
- **Rate Limiting**: Prevent brute force attacks
- **Environment Variables**: Sensitive data in .env files
- **MongoDB Injection Prevention**: Mongoose sanitization
- **XSS Protection**: Input sanitization
- **HTTPS**: SSL/TLS in production

## Scalability Considerations

- **Stateless Backend**: JWT enables horizontal scaling
- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequently accessed data (optional)
- **Load Balancing**: Multiple backend instances
- **Microservice Architecture**: Python service can scale independently
- **CDN**: Static assets delivery
- **Connection Pooling**: Database connection management

## Communication Patterns

### Node.js ↔ MongoDB
- Mongoose ODM with connection pooling
- Async/await for non-blocking operations

### Frontend ↔ Backend
- REST API with JSON payloads
- Axios with interceptors for auth tokens

### Node.js ↔ Python
- REST API calls (HTTP)
- JSON data exchange
- Async request handling

## Deployment Architecture

```
Production Environment:
- Frontend: Vercel/Netlify (Static hosting)
- Backend: AWS EC2/Heroku/DigitalOcean
- Database: MongoDB Atlas (Cloud)
- Python Service: AWS Lambda/EC2
- Environment: Docker containers (optional)
```

## Development Workflow

1. **Local Development**:
   - MongoDB running locally or MongoDB Atlas
   - Backend on localhost:5000
   - Frontend on localhost:3000
   - Python service on localhost:5001

2. **Version Control**: Git with feature branches
3. **Environment Management**: .env files for different stages
4. **Testing**: Unit and integration tests
5. **CI/CD**: Automated deployment pipeline

## Technology Justification

- **React**: Modern, component-based, large ecosystem
- **Node.js**: JavaScript full-stack, async I/O, NPM ecosystem
- **Express**: Lightweight, flexible, middleware support
- **MongoDB**: Flexible schema, JSON-like documents, scalability
- **JWT**: Stateless auth, mobile-friendly
- **Python**: Rich libraries for NLP and analytics

## Future Enhancements

- Real-time proctoring with WebRTC
- Advanced plagiarism detection
- Machine learning for adaptive testing
- Mobile application (React Native)
- Video question support
- Integration with LMS platforms
