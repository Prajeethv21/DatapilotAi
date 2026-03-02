import React from 'react';
import { motion } from 'framer-motion';
import KPICard from './KPICard';
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent
} from './charts/Charts';

/**
 * Dashboard Component
 * Dynamically renders analytics visualizations
 */
const Dashboard = ({ data, insights }) => {
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🌌
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Ready to Analyze</h2>
          <p className="text-gray-400">Ask the AI assistant to create a dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">AI-Generated Insights & Visualizations</p>
      </motion.div>

      {/* Dataset Info */}
      {data.dataset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">📊</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{data.dataset.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{data.dataset.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>📝 {data.dataset.rowCount.toLocaleString()} records</span>
                <span>📁 {data.data.metadata.columns} columns</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      {insights && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 mb-6 border-l-4 border-nebula-pink"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-semibold mb-2">AI-Generated Insights</h3>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">{insights}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      {data.data.kpis && data.data.kpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {data.data.kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} index={index} />
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.data.chartData.lineChart && (
          <LineChartComponent
            data={data.data.chartData.lineChart}
            title="Time Series Trend"
          />
        )}

        {data.data.chartData.barChart && (
          <BarChartComponent
            data={data.data.chartData.barChart}
            title="Category Analysis"
          />
        )}

        {data.data.chartData.pieChart && (
          <PieChartComponent
            data={data.data.chartData.pieChart}
            title="Distribution"
          />
        )}

        {data.data.chartData.lineChart && (
          <AreaChartComponent
            data={data.data.chartData.lineChart}
            title="Cumulative View"
          />
        )}
      </div>

      {/* Statistics Summary */}
      {data.data.statistics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 mt-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>📈</span> Statistical Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.data.statistics)
              .filter(([_, stat]) => stat.type === 'numeric')
              .slice(0, 6)
              .map(([field, stat]) => (
                <div key={field} className="bg-white/5 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">{field}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average:</span>
                      <span className="font-semibold">{Math.round(stat.average).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min:</span>
                      <span>{Math.round(stat.min).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max:</span>
                      <span>{Math.round(stat.max).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
