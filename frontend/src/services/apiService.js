import api from './api';

// Authentication APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updateprofile', userData),
  updatePassword: (passwords) => api.put('/auth/updatepassword', passwords),
};

// User APIs
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  approveUser: (id) => api.put(`/users/${id}/approve`),
  blockUser: (id) => api.put(`/users/${id}/block`),
};

// Exam APIs
export const examAPI = {
  getExams: (params) => api.get('/exams', { params }),
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: (examData) => api.post('/exams', examData),
  updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
  publishExam: (id) => api.put(`/exams/${id}/publish`),
  startExam: (id) => api.get(`/exams/${id}/start`),
};

// Question APIs
export const questionAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (questionData) => api.post('/questions', questionData),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

// Submission APIs
export const submissionAPI = {
  submitExam: (submissionData) => api.post('/submissions', submissionData),
  autoSaveAnswers: (data) => api.post('/submissions/auto-save', data),
  getSubmission: (id) => api.get(`/submissions/${id}`),
  getExamSubmissions: (examId) => api.get(`/submissions/exam/${examId}`),
  getStudentSubmissions: (studentId) => api.get(`/submissions/student/${studentId}`),
  manualEvaluate: (id, data) => api.put(`/submissions/${id}/evaluate`, data),
};

// Result APIs
export const resultAPI = {
  getResult: (submissionId) => api.get(`/results/${submissionId}`),
  getExamResults: (examId) => api.get(`/results/exam/${examId}`),
  getStudentResults: (studentId) => api.get(`/results/student/${studentId}`),
  getExamStatistics: (examId) => api.get(`/results/exam/${examId}/statistics`),
};

// Dashboard APIs
export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getTeacherDashboard: () => api.get('/dashboard/teacher'),
  getStudentDashboard: () => api.get('/dashboard/student'),
};
