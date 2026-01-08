# Frontend Components Documentation

## Overview
The frontend is built with React using functional components and hooks. It follows a component-based architecture with clear separation of concerns.

## Component Hierarchy

```
App
├── AuthProvider (Context)
└── Router
    ├── Login
    ├── Register
    ├── AdminDashboard
    ├── TeacherDashboard
    ├── StudentDashboard
    ├── ExamList
    ├── ExamCreation
    ├── ExamTaking
    └── Results
```

## Core Components

### 1. App.js
Main application component that sets up routing and authentication.

**Features:**
- React Router setup
- Protected route wrapper
- Role-based redirects
- 404 handling

### 2. AuthContext (Context Provider)
Manages authentication state across the application.

**State:**
- `user`: Current logged-in user
- `loading`: Loading state
- `error`: Error messages

**Methods:**
- `login(credentials)`: User login
- `register(userData)`: User registration
- `logout()`: User logout
- `checkAuth()`: Verify authentication

### 3. ProtectedRoute Component
Higher-order component for route protection.

**Props:**
- `children`: Component to render
- `allowedRoles`: Array of allowed roles

**Behavior:**
- Redirects to login if not authenticated
- Redirects to unauthorized if role not allowed
- Shows loading state while checking auth

## Page Components

### Login Page
**File:** `src/pages/Login.js`

**Features:**
- Email/password form
- Form validation
- Error handling
- Link to registration

**State:**
- `formData`: Email and password
- `error`: Error message
- `loading`: Loading state

### Register Page
**File:** `src/pages/Register.js`

**Features:**
- User registration form
- Role selection (Student/Teacher)
- Password confirmation
- Validation

**Fields:**
- Name
- Email
- Password
- Confirm Password
- Role

### Admin Dashboard
**File:** `src/pages/AdminDashboard.js`

**Features:**
- System statistics display
- User management table
- Approve/block users
- Recent activity

**Data Displayed:**
- Total users, students, teachers
- Total exams, active exams
- Total submissions
- Pending approvals

**Actions:**
- Approve teachers
- Block/unblock users
- View user details

### Teacher Dashboard
**File:** `src/pages/TeacherDashboard.js`

**Features:**
- Teacher statistics
- Recent exams list
- Create exam button
- Exam management

**Data Displayed:**
- My exams count
- Published/draft exams
- Total submissions
- Pending evaluations

**Actions:**
- Create new exam
- View exam details
- Edit exam
- View submissions

### Student Dashboard
**File:** `src/pages/StudentDashboard.js`

**Features:**
- Student performance stats
- Available exams list
- Recent results
- Start exam functionality

**Data Displayed:**
- Available exams count
- Completed exams
- Average score
- Recent results with grades

**Actions:**
- Start available exam
- View result details

### Exam Creation Page
**File:** `src/pages/ExamCreation.js`

**Features:**
- Exam details form
- Validation
- Create/cancel actions

**Form Fields:**
- Title
- Description
- Subject
- Duration (minutes)
- Total marks
- Passing marks
- Start time
- End time
- Instructions

### Exam Taking Page
**File:** `src/pages/ExamTaking.js`

**Features:**
- Real-time countdown timer
- Question display
- Answer input (MCQ, True/False, Text)
- Navigation between questions
- Auto-submit on timeout
- Submit confirmation

**State:**
- `exam`: Exam data with questions
- `answers`: Student's answers
- `currentQuestion`: Current question index
- `timeRemaining`: Remaining time in seconds

**Components:**
- Timer display (fixed position)
- Question card
- Answer options/textarea
- Previous/Next navigation
- Submit button

### Results Page
**File:** `src/pages/Results.js`

**Features:**
- Score details display
- Performance analysis
- Feedback and recommendations
- Strengths and weaknesses

**Data Displayed:**
- Marks obtained / Total marks
- Percentage and grade
- Pass/fail status
- Correct/wrong/unattempted count
- Time taken
- Teacher's feedback
- Strengths and weaknesses

### Exam List Page
**File:** `src/pages/ExamList.js`

**Features:**
- Placeholder for exam listing
- Filter and search (to be implemented)
- View exam details

## Services

### API Service
**File:** `src/services/api.js`

**Purpose:** Axios instance with interceptors

**Features:**
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Automatic token refresh redirect

### API Service Layer
**File:** `src/services/apiService.js`

**Purpose:** Centralized API calls

**Exports:**
- `authAPI`: Authentication endpoints
- `userAPI`: User management endpoints
- `examAPI`: Exam CRUD endpoints
- `questionAPI`: Question management endpoints
- `submissionAPI`: Exam submission endpoints
- `resultAPI`: Result retrieval endpoints
- `dashboardAPI`: Dashboard data endpoints

## Styling

### App.css
**File:** `src/App.css`

**Styles Included:**
- Global reset and base styles
- Layout containers and cards
- Header and navigation
- Buttons (primary, secondary, success, danger)
- Forms and inputs
- Tables
- Dashboard stats grid
- Exam taking interface
- Responsive design (mobile-friendly)

**Color Scheme:**
- Primary: `#1976d2` (Blue)
- Success: `#28a745` (Green)
- Danger: `#dc3545` (Red)
- Secondary: `#6c757d` (Gray)

## State Management

### Global State (Context)
- Authentication state managed by `AuthContext`
- User information shared across components

### Local State (useState)
- Component-specific state
- Form data
- Loading states
- Error messages

### Effect Hooks (useEffect)
- Data fetching on mount
- Timer management
- Auto-save functionality

## Routing

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/` - Redirects based on role
- `/admin/dashboard` - Admin dashboard (Admin only)
- `/teacher/dashboard` - Teacher dashboard (Teacher only)
- `/teacher/exams` - Exam list (Teacher/Admin)
- `/teacher/exams/create` - Create exam (Teacher/Admin)
- `/student/dashboard` - Student dashboard (Student only)
- `/student/exam/:id` - Take exam (Student only)
- `/results/:submissionId` - View results (All authenticated users)

## Best Practices Implemented

1. **Component Reusability**: Common styles and patterns
2. **Separation of Concerns**: Services separate from components
3. **Error Handling**: Try-catch blocks and error states
4. **Loading States**: User feedback during async operations
5. **Form Validation**: Client-side validation before submission
6. **Responsive Design**: Mobile-first approach
7. **Code Organization**: Logical folder structure
8. **Security**: Token-based auth, protected routes
9. **User Experience**: Confirmations, feedback messages
10. **Accessibility**: Semantic HTML, proper labels

## Future Component Enhancements

### To Be Implemented:
1. **QuestionBank Component**: Manage question library
2. **UserProfile Component**: Edit user profile
3. **ExamResults Component**: Detailed answer review
4. **Analytics Component**: Charts and graphs
5. **Notifications Component**: Real-time notifications
6. **Settings Component**: User preferences
7. **FileUpload Component**: Image upload for questions
8. **RichTextEditor Component**: Better text editing
9. **Timer Component**: Reusable timer
10. **Modal Component**: Reusable modal dialogs

## Component Testing

### Test Cases (To Implement):
- Unit tests for individual components
- Integration tests for user flows
- Snapshot tests for UI consistency
- Mock API calls in tests

### Example Test Structure:
```javascript
// Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## Performance Optimization

### Current Optimizations:
- Component lazy loading (to be implemented)
- Memoization with useMemo (to be implemented)
- Debouncing for search (to be implemented)
- Virtual scrolling for large lists (to be implemented)

### Recommended:
```javascript
// Lazy loading
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Memoization
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## Deployment Checklist

- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Set up CDN for assets
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Configure PWA (optional)
