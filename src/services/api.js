import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4006',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServerInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Contact/Message APIs (to be implemented)
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/api/contact', messageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Schedule meeting APIs (to be implemented)
export const checkAvailability = async (date) => {
  try {
    const response = await api.get('/api/schedule/availability', { params: { date } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scheduleMeeting = async (meetingData) => {
  try {
    const response = await api.post('/api/schedule', meetingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// CEO AI Chat
export const sendCeoChatMessage = async (message) => {
  try {
    const response = await api.post('/api/ceo-chat', { message }, { timeout: 30000 });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      return { success: false, reply: 'You have reached the message limit. Please try again later.' };
    }
    throw error;
  }
};

export default api;
