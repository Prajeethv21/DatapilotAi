import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import apiService from './services/api';

/**
 * Main App Component
 * DataPilot AI - Intelligent Analytics Platform
 */
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on mount
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

  /**
   * Handle analysis request from chatbot
   */
  const handleAnalysisRequest = async (prompt) => {
    setIsLoading(true);
    setDashboardData(null);
    setInsights(null);

    try {
      console.log('🔄 Sending analysis request:', prompt);
      const response = await apiService.analyzePrompt(prompt);

      if (response.success) {
        console.log('✅ Analysis complete:', response.response);
        
        // Update dashboard with received data
        setDashboardData(response.response);
        setInsights(response.response.insights);

        // Add bot response to chat
        if (window.addChatbotResponse) {
          window.addChatbotResponse(
            `✅ Analysis complete!\n\n${response.response.message}\n\nView the dashboard for detailed visualizations.`
          );
        }
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      
      if (window.addChatbotResponse) {
        window.addChatbotResponse(
          `❌ Error: ${error.message}\n\nPlease try a different request or check your API connection.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-nebula-pink/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-cosmic-teal/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="glass-panel m-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🌌
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-nebula bg-clip-text text-transparent">
                  DataPilot AI
                </h1>
                <p className="text-xs text-gray-400">Intelligent Analytics Platform</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}></span>
                <span className="text-gray-400">
                  {apiStatus === 'connected' ? 'API Connected' : 'API Offline'}
                </span>
              </div>
              <button
                onClick={checkAPIHealth}
                className="px-3 py-1 text-xs glass-panel hover:bg-white/10 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 mx-4 mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Chatbot Sidebar */}
          <div className="lg:col-span-1 flex flex-col min-h-0">
            <Chatbot
              onAnalysisRequest={handleAnalysisRequest}
              isLoading={isLoading}
            />
          </div>

          {/* Dashboard Main Area */}
          <div className="lg:col-span-2 glass-panel p-6 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                    className="text-6xl mb-4"
                  >
                    🔮
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Searching datasets • Analyzing data • Generating insights
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-nebula-pink rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-nebula-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-cosmic-teal rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <Dashboard data={dashboardData} insights={insights} />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="glass-panel m-4 p-3 text-center text-xs text-gray-500">
          <p>DataPilot AI • Powered by AI & React</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
