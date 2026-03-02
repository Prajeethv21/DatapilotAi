import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ label, value, icon, index, trend }) => {
  const colors = [
    { 
      bg: 'from-blue-500/15 to-blue-600/10', 
      border: 'border-blue-500/30', 
      accent: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      glow: 'from-blue-500 to-cyan-500',
      glowOpacity: 'opacity-20'
    },
    { 
      bg: 'from-emerald-500/15 to-emerald-600/10', 
      border: 'border-emerald-500/30', 
      accent: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      glow: 'from-emerald-500 to-green-500',
      glowOpacity: 'opacity-20'
    },
    { 
      bg: 'from-purple-500/15 to-purple-600/10', 
      border: 'border-purple-500/30', 
      accent: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      glow: 'from-purple-500 to-pink-500',
      glowOpacity: 'opacity-20'
    },
    { 
      bg: 'from-amber-500/15 to-amber-600/10', 
      border: 'border-amber-500/30', 
      accent: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      glow: 'from-amber-500 to-orange-500',
      glowOpacity: 'opacity-20'
    },
  ];
  
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative group"
    >
      {/* Animated glow effect on hover */}
      <motion.div 
        className={`absolute -inset-0.5 bg-gradient-to-br ${color.glow} rounded-2xl blur-lg ${color.glowOpacity} group-hover:opacity-40 transition-opacity duration-500`}
      />
      
      {/* Card */}
      <div className={`relative bg-gradient-to-br ${color.bg} backdrop-blur-xl border ${color.border} rounded-2xl p-6 overflow-hidden h-full`}>
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
        
        {/* Content */}
        <div className="relative">
          {/* Label with icon */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              {label}
            </p>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-8 h-8 rounded-lg ${color.iconBg} border ${color.border} flex items-center justify-center`}
            >
              {trend === 'up' ? (
                <ArrowUpRight size={14} className={color.accent} />
              ) : trend === 'down' ? (
                <ArrowDownRight size={14} className={color.accent} />
              ) : (
                <Minus size={14} className={color.accent} />
              )}
            </motion.div>
          </div>

          {/* Value */}
          <motion.h3 
            className={`text-3xl lg:text-4xl font-numbers font-black ${color.accent} mb-3`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.h3>

          {/* Trend indicator */}
          <motion.div 
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {trend === 'up' ? (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  <TrendingUp size={11} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-bold">+12.5%</span>
                </div>
                <span className="text-[9px] text-gray-600">vs last period</span>
              </>
            ) : trend === 'down' ? (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                  <TrendingDown size={11} className="text-red-400" />
                  <span className="text-[10px] text-red-400 font-bold">-5.2%</span>
                </div>
                <span className="text-[9px] text-gray-600">vs last period</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/10 border border-gray-500/20 rounded-md">
                  <Minus size={11} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-bold">0.0%</span>
                </div>
                <span className="text-[9px] text-gray-600">no change</span>
              </>
            )}
          </motion.div>
        </div>

        {/* Decorative corner element */}
        <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${color.glow} opacity-10 rounded-tl-full`} />
      </div>
    </motion.div>
  );
};

export default KPICard;
