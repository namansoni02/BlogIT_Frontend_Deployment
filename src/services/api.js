import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/user/userdata'),
};

// Post APIs
export const postAPI = {
  createPost: (postData) => api.post('/post', postData),
  getAllPosts: (page = 1, limit = 5) => api.get(`/post?page=${page}&limit=${limit}`),
  deletePost: (postId) => api.delete(`/post/delete/${postId}`),
};

// User APIs
export const userAPI = {
  getUserProfile: (username) => api.get(`/user/${username}`),
  followUser: (userId) => api.post(`/user/follow/${userId}`),
  unfollowUser: (userId) => api.post(`/user/unfollow/${userId}`),
  getFollowers: () => api.get('/user/followers'),
  getFollowing: () => api.get('/user/following'),
  getFollowNotifications: () => api.get('/user/follownotifications'),
  getAllUsers: () => api.get('/user/allusers'),
};

export default api;
