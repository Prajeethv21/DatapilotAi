import React from 'react';
import { motion } from 'framer-motion';

/**
 * KPI Card Component
 * Displays key performance indicators
 */
const KPICard = ({ label, value, icon, index }) => {
  const iconEmojis = {
    'database': '💾',
    'trending-up': '📈',
    'bar-chart': '📊',
    'activity': '⚡'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-6 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold bg-gradient-nebula bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
        <div className="text-4xl group-hover:scale-110 transition-transform">
          {iconEmojis[icon] || '📊'}
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
