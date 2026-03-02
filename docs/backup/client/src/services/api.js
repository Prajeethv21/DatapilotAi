import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * API Service for communicating with backend
 */
export const apiService = {
  /**
   * Send analysis request to AI agent
   * @param {string} prompt - User's natural language request
   * @returns {Promise} - Analysis results with dashboard data
   */
  async analyzePrompt(prompt) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/analyze`, {
        prompt
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Analysis failed');
    }
  },

  /**
   * Send simple chat message
   */
  async sendMessage(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message
      });
      return response.data;
    } catch (error) {
      console.error('Chat Error:', error);
      throw new Error('Failed to send message');
    }
  },

  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      return { status: 'offline' };
    }
  },

  /**
   * Upload CSV or Excel file
   */
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw new Error(error.response?.data?.error || 'Upload failed');
    }
  },

  /**
   * Connect to database and fetch data
   */
  async connectDatabase(config) {
    try {
      const response = await axios.post(`${API_BASE_URL}/upload/database`, config);
      return response.data;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error(error.response?.data?.error || 'Database connection failed');
    }
  }
};

export default apiService;
