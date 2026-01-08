# MongoDB Schema Documentation

## Collections Overview

1. **users** - User accounts and profiles
2. **exams** - Exam configurations
3. **questions** - Question bank
4. **submissions** - Student exam submissions
5. **results** - Evaluation results
6. **logs** - System audit logs

---

## 1. Users Collection

**Collection Name:** `users`

### Schema

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student'
  },
  isApproved: {
    type: Boolean,
    default: true  // false for teachers until admin approves
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  profile: {
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    address: String,
    city: String,
    country: String,
    avatar: String
  },
  // For teachers
  qualification: String,
  specialization: [String],
  // For students
  rollNumber: String,
  class: String,
  section: String,
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ isApproved: 1, isBlocked: 1 })
```

---

## 2. Exams Collection

**Collection Name:** `exams`

### Schema

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  class: String,
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number,  // Duration in minutes
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed', 'archived'],
    default: 'draft'
  },
  settings: {
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeOptions: {
      type: Boolean,
      default: false
    },
    showResultsImmediately: {
      type: Boolean,
      default: false
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    negativeMarking: {
      type: Boolean,
      default: false
    },
    negativeMarkingValue: {
      type: Number,
      default: 0
    },
    questionsPerPage: {
      type: Number,
      default: 1
    },
    allowBackNavigation: {
      type: Boolean,
      default: true
    },
    showTimer: {
      type: Boolean,
      default: true
    },
    autoSubmit: {
      type: Boolean,
      default: true
    },
    proctoring: {
      type: Boolean,
      default: false
    }
  },
  questions: [{
    type: ObjectId,
    ref: 'Question'
  }],
  allowedStudents: [{
    type: ObjectId,
    ref: 'User'
  }],  // Empty array means all students can take
  
  // Statistics
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.exams.createIndex({ createdBy: 1 })
db.exams.createIndex({ status: 1 })
db.exams.createIndex({ subject: 1 })
db.exams.createIndex({ startTime: 1, endTime: 1 })
```

---

## 3. Questions Collection

**Collection Name:** `questions`

### Schema

```javascript
{
  _id: ObjectId,
  type: {
    type: String,
    enum: ['mcq', 'true-false', 'short', 'long'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],  // For MCQ and True/False
  correctAnswer: {
    type: Schema.Types.Mixed  // String for MCQ/True-False, can be flexible for others
  },
  marks: {
    type: Number,
    required: true
  },
  negativeMarks: {
    type: Number,
    default: 0
  },
  subject: {
    type: String,
    required: true
  },
  topic: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  explanation: String,
  imageUrl: String,
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  
  // For subjective questions
  modelAnswer: String,  // Reference answer for evaluation
  keywords: [String],   // Keywords for auto-evaluation
  
  // Metadata
  timesUsed: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.questions.createIndex({ createdBy: 1 })
db.questions.createIndex({ type: 1 })
db.questions.createIndex({ subject: 1, topic: 1 })
db.questions.createIndex({ difficulty: 1 })
```

---

## 4. Submissions Collection

**Collection Name:** `submissions`

### Schema

```javascript
{
  _id: ObjectId,
  examId: {
    type: ObjectId,
    ref: 'Exam',
    required: true
  },
  studentId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  startedAt: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date
  },
  timeTaken: {
    type: Number  // Time in minutes
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'evaluating', 'evaluated', 'timeout'],
    default: 'in-progress'
  },
  answers: [{
    questionId: {
      type: ObjectId,
      ref: 'Question',
      required: true
    },
    answer: Schema.Types.Mixed,  // Can be string, array, etc.
    marksAwarded: {
      type: Number,
      default: 0
    },
    isCorrect: {
      type: Boolean
    },
    evaluatedBy: {
      type: String,
      enum: ['auto', 'manual', 'ai'],
      default: 'auto'
    },
    evaluatedAt: Date,
    feedback: String
  }],
  
  // Auto-save data
  lastSavedAt: Date,
  
  // Proctoring data (if enabled)
  proctoring: {
    tabSwitches: {
      type: Number,
      default: 0
    },
    suspiciousActivity: [{
      type: String,
      timestamp: Date
    }],
    screenshots: [String]  // URLs if screenshots are captured
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.submissions.createIndex({ examId: 1, studentId: 1 })
db.submissions.createIndex({ studentId: 1 })
db.submissions.createIndex({ status: 1 })
db.submissions.createIndex({ submittedAt: -1 })
```

---

## 5. Results Collection

**Collection Name:** `results`

### Schema

```javascript
{
  _id: ObjectId,
  submissionId: {
    type: ObjectId,
    ref: 'Submission',
    required: true,
    unique: true
  },
  examId: {
    type: ObjectId,
    ref: 'Exam',
    required: true
  },
  studentId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: true
  },
  rank: Number,  // Rank among all students
  
  // Question-wise statistics
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  unattempted: {
    type: Number,
    default: 0
  },
  
  // Time statistics
  timeTaken: {
    type: Number  // Minutes
  },
  averageTimePerQuestion: Number,
  
  // Evaluation breakdown
  evaluation: {
    autoGraded: Number,
    manuallyGraded: Number,
    aiGraded: Number,
    pending: Number
  },
  
  // Subject-wise performance
  subjectPerformance: [{
    subject: String,
    marksObtained: Number,
    totalMarks: Number,
    percentage: Number
  }],
  
  // Feedback
  teacherFeedback: String,
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  
  evaluatedAt: Date,
  publishedAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.results.createIndex({ submissionId: 1 }, { unique: true })
db.results.createIndex({ examId: 1 })
db.results.createIndex({ studentId: 1 })
db.results.createIndex({ percentage: -1 })
db.results.createIndex({ createdAt: -1 })
```

---

## 6. Logs Collection

**Collection Name:** `logs`

### Schema

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    enum: ['user', 'exam', 'question', 'submission', 'result'],
    required: true
  },
  entityId: ObjectId,
  details: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}
```

### Indexes

```javascript
db.logs.createIndex({ userId: 1 })
db.logs.createIndex({ timestamp: -1 })
db.logs.createIndex({ action: 1 })
db.logs.createIndex({ entity: 1, entityId: 1 })
```

---

## Relationships

```
User (1) ----< (M) Exam [createdBy]
User (1) ----< (M) Question [createdBy]
Exam (1) ----< (M) Question [questions array]
User (1) ----< (M) Submission [studentId]
Exam (1) ----< (M) Submission [examId]
Submission (1) ----< (1) Result [submissionId]
```

## Sample Data

### Sample User (Student)
```json
{
  "name": "John Doe",
  "email": "john.student@example.com",
  "password": "$2b$10$hashedpassword",
  "role": "student",
  "isApproved": true,
  "isBlocked": false,
  "profile": {
    "phone": "+1234567890",
    "dateOfBirth": "2005-05-15",
    "gender": "male"
  },
  "rollNumber": "2024001",
  "class": "10th Grade",
  "section": "A"
}
```

### Sample Exam
```json
{
  "title": "Mathematics Mid-term Exam",
  "description": "Mid-term examination covering chapters 1-5",
  "subject": "Mathematics",
  "createdBy": "teacherId",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "startTime": "2024-03-15T10:00:00Z",
  "endTime": "2024-03-15T12:00:00Z",
  "status": "published",
  "settings": {
    "randomizeQuestions": true,
    "negativeMarking": true,
    "negativeMarkingValue": 0.25
  },
  "questions": ["questionId1", "questionId2"]
}
```

### Sample Question (MCQ)
```json
{
  "type": "mcq",
  "question": "What is the value of π (pi)?",
  "options": ["3.14", "2.71", "1.41", "1.73"],
  "correctAnswer": "3.14",
  "marks": 2,
  "negativeMarks": 0.5,
  "subject": "Mathematics",
  "topic": "Geometry",
  "difficulty": "easy",
  "explanation": "Pi is approximately 3.14159...",
  "createdBy": "teacherId"
}
```

## Best Practices

1. **Use Indexes**: Create appropriate indexes for frequently queried fields
2. **Use References**: Use ObjectId references for relationships
3. **Validation**: Use Mongoose validators for data integrity
4. **Timestamps**: Always include createdAt and updatedAt
5. **Soft Delete**: Use flags like isDeleted instead of hard deletes
6. **Audit Trail**: Log important actions in logs collection
7. **Data Types**: Use appropriate data types (Date, Number, Boolean)
8. **Enums**: Use enums for fields with fixed values
9. **Defaults**: Provide sensible defaults
10. **Embedded vs Referenced**: Embed small, non-changing data; reference large or frequently updated data
