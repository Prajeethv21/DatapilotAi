import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import Chatbot from './Chatbot';
import Dashboard from './Dashboard';
import DataUpload from './DataUpload';
import apiService from '../services/api';

/**
 * Dashboard Page Component
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const health = await apiService.checkHealth();
      setApiStatus(health.status === 'OK' ? 'connected' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleAnalysisRequest = async (prompt) => {
    setIsLoading(true);
    try {
      const result = await apiService.analyzePrompt(prompt);
      setDashboardData(result.processedData);
      setInsights(result.insights);
      return result;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataUploaded = (result) => {
    setDashboardData(result.processedData);
    setInsights(result.insights);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-md bg-gray-900/50 border-b border-white/10 sticky top-0"
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">AI-BI Dashboard</h1>
                  <p className="text-xs text-gray-400">Intelligent Analytics Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm">{apiStatus === 'connected' ? 'API Connected' : 'API Offline'}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Refresh
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Chat & Upload */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 overflow-hidden flex flex-col"
          >
            {/* Data Upload Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                Data Sources
              </h2>
              <DataUpload onDataUploaded={handleDataUploaded} />
            </div>

            {/* Chatbot Section */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full" />
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-400 mt-1">Ask me anything about your data</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <Chatbot
                  onAnalysisRequest={handleAnalysisRequest}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {dashboardData ? (
                <Dashboard
                  key="dashboard"
                  data={dashboardData}
                  insights={insights}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center p-12"
                >
                  <div className="text-center max-w-md">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center"
                    >
                      <Brain className="w-12 h-12 text-purple-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">Ready to Analyze</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Upload your data or ask a question to get started with AI-powered insights
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
