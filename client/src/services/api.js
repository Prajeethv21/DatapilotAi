import axios from 'axios';

// Use Vercel serverless functions in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const apiService = {
  async analyzePrompt(prompt) {
    const res = await axios.post(`${API_BASE_URL}/chat/analyze`, { prompt });
    return res.data;
  },

  async sendMessage(message, conversationId, dashboardContext) {
    const res = await axios.post(`${API_BASE_URL}/chat/message`, { 
      message, conversationId, dashboardContext 
    });
    return res.data;
  },

  async checkHealth() {
    try {
      const res = await axios.get(`${API_BASE_URL}/health`);
      return res.data;
    } catch {
      return { status: 'offline' };
    }
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_BASE_URL}/upload/file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async connectDatabase(config) {
    const res = await axios.post(`${API_BASE_URL}/upload/database`, config);
    return res.data;
  }
};

export default apiService;
