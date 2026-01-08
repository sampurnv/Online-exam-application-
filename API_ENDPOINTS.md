# API Endpoints Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication Endpoints

### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

### POST /api/auth/login
User login

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

### GET /api/auth/me
Get current user profile (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## User Management Endpoints (Admin Only)

### GET /api/users
Get all users (Admin only)

**Query Parameters:**
- `role` (optional): Filter by role (admin/teacher/student)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  },
  "users": [...]
}
```

### GET /api/users/:id
Get user by ID (Admin only)

### PUT /api/users/:id
Update user (Admin only)

### DELETE /api/users/:id
Delete user (Admin only)

### PUT /api/users/:id/approve
Approve instructor (Admin only)

### PUT /api/users/:id/block
Block user (Admin only)

## Exam Endpoints

### POST /api/exams
Create exam (Teacher/Admin only)

**Request Body:**
```json
{
  "title": "Mathematics Final Exam",
  "description": "Final examination for Mathematics course",
  "subject": "Mathematics",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "instructions": "Read all questions carefully",
  "settings": {
    "randomizeQuestions": true,
    "showResultsImmediately": false,
    "allowReview": true,
    "negativeMarking": true,
    "negativeMarkingValue": 0.25,
    "questionsPerPage": 1
  },
  "questions": ["questionId1", "questionId2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Exam created successfully",
  "exam": {...}
}
```

### GET /api/exams
Get all exams

**Query Parameters:**
- `status` (optional): published/draft
- `createdBy` (optional): Teacher ID
- `page`, `limit`: Pagination

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "exams": [...]
}
```

### GET /api/exams/:id
Get exam by ID

### PUT /api/exams/:id
Update exam (Teacher/Admin only)

### DELETE /api/exams/:id
Delete exam (Teacher/Admin only)

### PUT /api/exams/:id/publish
Publish exam (Teacher/Admin only)

### PUT /api/exams/:id/unpublish
Unpublish exam (Teacher/Admin only)

### GET /api/exams/:id/start
Start exam (Student only) - Returns questions

**Response (200):**
```json
{
  "success": true,
  "exam": {
    "id": "examId",
    "title": "Mathematics Final Exam",
    "duration": 120,
    "totalMarks": 100,
    "questions": [...]
  },
  "attemptId": "attemptId"
}
```

## Question Endpoints

### POST /api/questions
Create question (Teacher/Admin only)

**Request Body:**
```json
{
  "type": "mcq",
  "question": "What is 2 + 2?",
  "options": ["2", "3", "4", "5"],
  "correctAnswer": "4",
  "marks": 2,
  "negativeMarks": 0.5,
  "subject": "Mathematics",
  "topic": "Basic Arithmetic",
  "difficulty": "easy",
  "explanation": "Addition of two numbers"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Question created successfully",
  "question": {...}
}
```

### GET /api/questions
Get all questions

**Query Parameters:**
- `type`: mcq/true-false/short/long
- `subject`, `topic`, `difficulty`
- `page`, `limit`

### GET /api/questions/:id
Get question by ID

### PUT /api/questions/:id
Update question (Teacher/Admin only)

### DELETE /api/questions/:id
Delete question (Teacher/Admin only)

### POST /api/questions/bulk
Bulk import questions (CSV/JSON)

## Submission Endpoints

### POST /api/submissions
Submit exam (Student only)

**Request Body:**
```json
{
  "examId": "examId",
  "attemptId": "attemptId",
  "answers": [
    {
      "questionId": "q1",
      "answer": "4"
    },
    {
      "questionId": "q2",
      "answer": "True"
    }
  ],
  "timeTaken": 95
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "submission": {
    "id": "submissionId",
    "status": "evaluating"
  }
}
```

### POST /api/submissions/auto-save
Auto-save answers during exam

**Request Body:**
```json
{
  "attemptId": "attemptId",
  "answers": [...]
}
```

### GET /api/submissions/:id
Get submission by ID

### GET /api/submissions/exam/:examId
Get all submissions for an exam (Teacher/Admin only)

### GET /api/submissions/student/:studentId
Get all submissions by student

### PUT /api/submissions/:id/evaluate
Manual evaluation (Teacher/Admin only)

**Request Body:**
```json
{
  "questionId": "q1",
  "marksAwarded": 8,
  "feedback": "Good answer but missing some details"
}
```

## Result Endpoints

### GET /api/results/:submissionId
Get result by submission ID

**Response (200):**
```json
{
  "success": true,
  "result": {
    "submissionId": "submissionId",
    "examId": "examId",
    "studentId": "studentId",
    "totalMarks": 100,
    "marksObtained": 85,
    "percentage": 85,
    "grade": "A",
    "status": "pass",
    "timeTaken": 95,
    "correctAnswers": 42,
    "wrongAnswers": 6,
    "unattempted": 2,
    "evaluation": {
      "autoGraded": 40,
      "manuallyGraded": 10
    }
  }
}
```

### GET /api/results/exam/:examId
Get all results for an exam (Teacher/Admin only)

### GET /api/results/student/:studentId
Get all results for a student

### GET /api/results/exam/:examId/statistics
Get exam statistics (Teacher/Admin only)

**Response (200):**
```json
{
  "success": true,
  "statistics": {
    "totalAttempts": 50,
    "averageScore": 72.5,
    "highestScore": 98,
    "lowestScore": 35,
    "passPercentage": 82,
    "averageTime": 105
  }
}
```

### GET /api/results/exam/:examId/export
Export results (CSV/PDF) (Teacher/Admin only)

**Query Parameters:**
- `format`: csv/pdf

## Dashboard Endpoints

### GET /api/dashboard/admin
Admin dashboard statistics

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 500,
    "totalStudents": 450,
    "totalTeachers": 45,
    "totalExams": 120,
    "activeExams": 15,
    "totalSubmissions": 5000,
    "pendingApprovals": 5
  }
}
```

### GET /api/dashboard/teacher
Teacher dashboard statistics

### GET /api/dashboard/student
Student dashboard statistics

## Python Integration Endpoints

### POST /api/evaluate/subjective
Evaluate subjective answers (Internal - called by Node.js)

**Request Body:**
```json
{
  "question": "Explain photosynthesis",
  "answer": "Student's answer text...",
  "modelAnswer": "Expected answer text...",
  "maxMarks": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "marksAwarded": 7.5,
  "feedback": "Good understanding, missing some key points",
  "similarity": 0.75
}
```

### POST /api/evaluate/plagiarism
Check for plagiarism

**Request Body:**
```json
{
  "text": "Student's answer text...",
  "compareWith": ["other answer 1", "other answer 2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "plagiarismDetected": false,
  "similarity": 0.15,
  "matchedWith": []
}
```

### POST /api/analytics/performance
Get performance analytics

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (not authorized)
- **404**: Not Found
- **409**: Conflict (duplicate entry)
- **500**: Internal Server Error

## Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes
- Other endpoints: 100 requests per 15 minutes

## Pagination

Default pagination for list endpoints:
- `page`: 1
- `limit`: 10
- `maxLimit`: 100
