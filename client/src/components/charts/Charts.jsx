import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, MessageCircle, Sparkles, X } from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
const GRADIENT_COLORS = [
  { from: '#3b82f6', to: '#06b6d4' },
  { from: '#8b5cf6', to: '#ec4899' },
  { from: '#10b981', to: '#06b6d4' },
  { from: '#f59e0b', to: '#ef4444' }
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f0f28]/98 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-xl shadow-2xl">
      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-300">{entry.name}</span>
          </div>
          <span className="text-sm font-bold" style={{ color: entry.color }}>
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ⭐ NEW: Generate chart explanation using simple logic (no real AI needed)
const generateChartExplanation = (type, data, title) => {
  if (!data || !data.length) return "No data available for analysis.";
  
  const dataLength = data.length;
  const firstKey = Object.keys(data[0] || {}).find(k => k !== 'date' && k !== 'category' && k !== 'name');
  const values = data.map(d => d[firstKey] || d.value || 0).filter(v => typeof v === 'number');
  
  if (!values.length) return "Unable to analyze this dataset.";
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const maxItem = data.find(d => (d[firstKey] || d.value) === max);
  const minItem = data.find(d => (d[firstKey] || d.value) === min);
  
  let explanation = '';
  
  switch (type) {
    case 'line':
      const trend = values[values.length - 1] > values[0] ? 'upward' : 'downward';
      explanation = `📈 This line chart shows ${title.toLowerCase()} with ${dataLength} data points. ` +
        `The overall trend is ${trend}. ` +
        `Peak value of ${max.toLocaleString()} was recorded at ${maxItem?.date || 'a specific point'}, ` +
        `while the lowest value of ${min.toLocaleString()} occurred at ${minItem?.date || 'another point'}. ` +
        `Average value: ${avg.toFixed(2).toLocaleString()}.`;
      break;
      
    case 'bar':
      explanation = `📊 This bar chart breaks down ${title.toLowerCase()} across ${dataLength} categories. ` +
        `The highest performing category is "${maxItem?.category || maxItem?.name}" with a value of ${max.toLocaleString()}, ` +
        `while "${minItem?.category || minItem?.name}" has the lowest at ${min.toLocaleString()}. ` +
        `Average per category: ${avg.toFixed(2).toLocaleString()}.`;
      break;
      
    case 'pie':
      const total = values.reduce((a, b) => a + b, 0);
      const maxPercent = ((max / total) * 100).toFixed(1);
      explanation = `🥧 This pie chart visualizes the distribution of ${title.toLowerCase()} across ${dataLength} segments. ` +
        `The largest segment is "${maxItem?.name || maxItem?.category}" representing ${maxPercent}% of the total (${max.toLocaleString()}). ` +
        `Total value: ${total.toLocaleString()}.`;
      break;
      
    case 'area':
      const growth = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1);
      explanation = `📉 This area chart displays cumulative ${title.toLowerCase()} over ${dataLength} periods. ` +
        `Starting from ${values[0].toLocaleString()}, the data shows a ${growth > 0 ? 'growth' : 'decline'} of ${Math.abs(growth)}% ` +
        `reaching ${values[values.length - 1].toLocaleString()} by the end. ` +
        `Peak value: ${max.toLocaleString()}.`;
      break;
      
    default:
      explanation = `This visualization shows ${dataLength} data points with values ranging from ${min.toLocaleString()} to ${max.toLocaleString()}.`;
  }
  
  return explanation;
};

const ChartCard = ({ title, icon: Icon, children, delay = 0, gradientFrom, gradientTo, chartType, chartData, onExplainClick }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  
  const handleExplain = () => {
    const exp = generateChartExplanation(chartType, chartData, title);
    setExplanation(exp);
    setShowExplanation(true);
    
    // Also send to chatbot if callback provided
    if (onExplainClick) {
      onExplainClick(exp);
    }
  };
  
  return (
    <div className="group relative">
      {/* Animated glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-gradient-to-br from-[#0f0f28]/95 to-[#0a0a1f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 overflow-hidden group-hover:border-white/20 transition-all duration-300"
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFrom}/20 ${gradientTo}/20 border border-white/10 flex items-center justify-center`}>
              <Icon size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-500">Real-time data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* ⭐ NEW: Explain This Chart Button */}
            <motion.button
              onClick={handleExplain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300 hover:from-purple-500/20 hover:to-pink-500/20 transition-all"
            >
              <Sparkles size={12} />
              <span>Explain Chart</span>
            </motion.button>
            
            {/* Mini indicator */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
            </div>
          </div>
        </div>

        {/* Chart content */}
        <div className="relative">
          {children}
        </div>
        
        {/* ⭐ NEW: Explanation Popup */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl relative"
          >
            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <MessageCircle size={16} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-300 mb-1">AI Analysis</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const LineChartComponent = ({ data, title, onExplainClick }) => {
  if (!data?.length) return null;
  return (
    <ChartCard 
      title={title || 'Time Series Trend'} 
      icon={TrendingUp}
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-500"
      delay={0.1}
      chartType="line"
      chartData={data}
      onExplainClick={onExplainClick}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0a0a1f' }} 
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 3, fill: '#0f0f28' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const BarChartComponent = ({ data, title, onExplainClick }) => {
  if (!data?.length) return null;
  return (
    <ChartCard 
      title={title || 'Category Breakdown'} 
      icon={BarChart3}
      gradientFrom="from-purple-500"
      gradientTo="to-pink-500"
      delay={0.15}
      chartType="bar"
      chartData={data}
      onExplainClick={onExplainClick}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="category" 
            stroke="#6b7280" 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
            angle={-15} 
            textAnchor="end" 
            height={60}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const PieChartComponent = ({ data, title, onExplainClick }) => {
  if (!data?.length) return null;
  return (
    <ChartCard 
      title={title || 'Distribution Analysis'} 
      icon={PieChartIcon}
      gradientFrom="from-emerald-500"
      gradientTo="to-cyan-500"
      delay={0.2}
      chartType="pie"
      chartData={data}
      onExplainClick={onExplainClick}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
          >
            {data.map((_, i) => (
              <Cell 
                key={i} 
                fill={COLORS[i % COLORS.length]}
                stroke="#0a0a1f"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const AreaChartComponent = ({ data, title, onExplainClick }) => {
  if (!data?.length) return null;
  return (
    <ChartCard 
      title={title || 'Cumulative View'} 
      icon={Activity}
      gradientFrom="from-amber-500"
      gradientTo="to-orange-500"
      delay={0.25}
      chartType="area"
      chartData={data}
      onExplainClick={onExplainClick}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="url(#areaStroke)" 
            strokeWidth={3}
            fill="url(#areaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
