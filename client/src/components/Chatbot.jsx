import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Download, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * ChatGPT-like Chatbot Component
 */
const Chatbot = ({ onDashboardData, isProcessing, dashboardContext }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hey there! 👋 I'm your AI assistant. Ask me anything!\n\n- 💬 **Chat** - Ask any question on any topic\n- 📊 **Dashboards** - *\"Create a dashboard about world GDP\"*\n- 💻 **Code** - *\"Write a Python function to...\"*\n- 🧮 **Math** - *\"What is the square root of 144?\"*\n- 📁 **Data analysis** - Upload files or ask about your dashboard\n\nI'm a general-purpose AI - try anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isProcessing) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const requestBody = {
        message: currentInput,
        conversationId
      };
      
      // Only include dashboardContext if it exists
      if (dashboardContext) {
        requestBody.dashboardContext = dashboardContext;
      }

      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        // Add bot message
        const botMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply || data.message || 'Done!',
          timestamp: new Date(),
          type: data.type,
          dataset: data.dataset || null
        };
        setMessages(prev => [...prev, botMsg]);

        // If dashboard data was returned, send it to parent
        if (data.type === 'dashboard' && data.processedData) {
          onDashboardData?.(data.processedData, data.insights, data.dataset);
        }
      } else {
        throw new Error(data.error || 'Request failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${error.message === 'Failed to fetch' ? 'Cannot connect to server. Make sure the backend is running on port 5000.' : error.message}`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = dashboardContext
    ? [
        "What are the KPIs?",
        "Summarize this data",
        "What is quantum computing?",
        "Write a Python sort function",
      ]
    : [
        "What is machine learning?",
        "Create a dashboard about world GDP",
        "Explain blockchain simply",
        "What is 256 * 48?",
      ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a]/50 rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-white">AI Assistant</h3>
            <p className="text-[11px] text-gray-500">Ask me anything &middot; Always online</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-blue-400" />
                </div>
              )}
              
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : msg.isError
                    ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md'
                    : 'bg-white/[0.04] border border-white/[0.06] text-gray-200 rounded-bl-md'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-0.5 [&_strong]:text-blue-300 [&_a]:text-blue-400 [&_a]:underline">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {/* Dataset download button */}
                {msg.dataset && msg.dataset.downloadUrl && (
                  <motion.a
                    href={msg.dataset.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Download size={12} />
                    Download Dataset
                  </motion.a>
                )}

                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-right text-blue-300/40' : 'text-gray-600'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={14} className="text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-blue-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-blue-400" />
                <span className="text-xs text-gray-400">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (only when few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-gray-600 mb-2 font-medium uppercase tracking-wider">Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-gray-400 hover:bg-white/[0.07] hover:text-gray-200 transition-all hover:border-blue-500/20"
              >
                <BarChart3 size={10} className="inline mr-1.5 opacity-50" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5 bg-white/[0.01]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dashboardContext ? "Ask about the data or anything else..." : "Ask me anything..."}
            rows={1}
            disabled={isLoading || isProcessing}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/30 resize-none min-h-[42px] max-h-[120px] transition-colors disabled:opacity-50"
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <motion.button
            onClick={sendMessage}
            disabled={isLoading || isProcessing || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Send size={16} className="text-white" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
