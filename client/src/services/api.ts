import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string, role: string = 'user') =>
    api.post('/auth/register', { username, email, password, role }),
};

export const articlesAPI = {
  getAll: () => api.get('/articles'),
  create: (title: string, content: string, author_id: number) =>
    api.post('/articles', { title, content, author_id }),
  update: (id: number, title: string, content: string, author_id: number) =>
    api.put(`/articles/${id}`, { title, content, author_id }),
  delete: (id: number) => api.delete(`/articles/${id}`),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;