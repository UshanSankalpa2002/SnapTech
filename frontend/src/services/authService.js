import api from './api';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await api.get(`${API_URL}/profile`, config);
  return response.data;
};

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const formData = new FormData();
  
  // Append text data
  Object.keys(userData).forEach(key => {
    if (key !== 'avatar' && userData[key] !== undefined) {
      if (typeof userData[key] === 'object') {
        formData.append(key, JSON.stringify(userData[key]));
      } else {
        formData.append(key, userData[key]);
      }
    }
  });
  
  // Append file if exists
  if (userData.avatar && userData.avatar instanceof File) {
    formData.append('avatar', userData.avatar);
  }
  
  const response = await api.put(`${API_URL}/profile`, formData, config);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Change password
const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await api.put(`${API_URL}/change-password`, passwordData, config);
  return response.data;
};

// Verify token
const verifyToken = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await api.get(`${API_URL}/verify`, config);
  return response.data;
};

// Create admin user
const createAdmin = async (adminData) => {
  const response = await api.post(`${API_URL}/create-admin`, adminData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  createAdmin,
};

export default authService;