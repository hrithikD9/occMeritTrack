// API configuration and service methods for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  // Login with role and passkey
  login: async (role, passkey = '') => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, passkey }),
    });
    
    // Store token if teacher login (token is in response.data.token)
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token stored successfully for', role);
    } else if (role === 'teacher') {
      console.warn('Teacher login but no token received:', response);
    }
    
    return response;
  },

  // Verify current token
  verifyToken: async () => {
    try {
      const response = await apiRequest('/auth/verify');
      return response;
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Student/Candidate APIs
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    const response = await apiRequest('/students');
    return response.data; // Returns array of students
  },

  // Get single student by ID
  getStudentById: async (id) => {
    const response = await apiRequest(`/students/${id}`);
    return response.data;
  },

  // Add new student or add test to existing student (Teacher only)
  addStudent: async (studentData) => {
    const response = await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    return response.data;
  },

  // Update student test marks (Teacher only)
  updateStudent: async (id, updateData) => {
    const response = await apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data;
  },

  // Update specific test mark for a student (Teacher only)
  updateStudentMark: async (studentId, testIndex, obtainedMarks, totalMarks) => {
    const response = await apiRequest(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        testIndex,
        obtainedMarks,
        totalMarks
      }),
    });
    return response.data;
  },

  // Delete student (Teacher only)
  deleteStudent: async (id) => {
    const response = await apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // Manually recalculate all student ranks (Teacher only)
  recalculateRanks: async () => {
    const response = await apiRequest('/students/recalculate-ranks', {
      method: 'POST',
    });
    return response.data;
  },
};

export default {
  auth: authAPI,
  students: studentAPI,
};
