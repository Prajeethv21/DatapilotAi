import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Chatbot Component
 * Conversational interface for user interactions
 */
const Chatbot = ({ onAnalysisRequest, isLoading }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI analytics assistant. Ask me to analyze any topic - try "show global COVID trends" or "analyze sales data".'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    onAnalysisRequest(input);
    setInput('');

    // Add thinking message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: 'Analyzing your request...',
        isLoading: true
      }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addBotResponse = (content) => {
    setMessages(prev => prev.filter(m => !m.isLoading));
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: content
    }]);
  };

  // Expose method to parent
  useEffect(() => {
    window.addChatbotResponse = addBotResponse;
  }, []);

  const suggestionPrompts = [
    "Show global COVID statistics",
    "Analyze world population trends",
    "Display stock market data",
    "Climate change temperature data"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="glass-panel p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-nebula flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Analytics Assistant</h3>
            <p className="text-xs text-gray-400">Powered by OpenAI</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-nebula text-white'
                    : 'glass-panel'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-nebula-pink rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-nebula-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-nebula-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Try these examples:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="glass-panel p-2 text-xs text-left hover:bg-white/10 transition-colors rounded-lg"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="glass-panel p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for any analytics dashboard..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="cosmic-button px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
