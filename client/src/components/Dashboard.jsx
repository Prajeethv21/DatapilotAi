import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Download, ExternalLink, FileSpreadsheet, Layers, TrendingUp, TrendingDown, Activity, Zap, BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Sparkles, Target, Award, Clock, FileImage, FileText } from 'lucide-react';
import KPICard from './KPICard';
import { LineChartComponent, BarChartComponent, PieChartComponent, AreaChartComponent } from './charts/Charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CyberRadio from './CyberRadio';

/**
 * Dashboard - Ultra-Professional Premium Analytics Layout
 * Modern SaaS-grade dashboard with glassmorphism and advanced animations
 * ⭐ NEW: Export, Auto Recommendations, NL Filtering
 */
const Dashboard = ({ data, insights, datasetInfo }) => {
  const [expandedInsights, setExpandedInsights] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [chartRecommendations, setChartRecommendations] = useState(null);
  const [exportFormat, setExportFormat] = useState('png');
  const dashboardRef = useRef(null);
  
  // ⭐ NEW: Export Dashboard to PNG or PDF
  const exportDashboard = async (format = 'png') => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: '#050510',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `dashboard-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`dashboard-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // ⭐ NEW: Calculate chart recommendations based on dataset structure
  React.useEffect(() => {
    if (data?.data?.statistics) {
      const stats = data.data.statistics;
      const recommendations = [];
      
      // Check for date columns → Line chart
      const hasDateColumn = Object.keys(stats).some(key => 
        key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase().includes('year')
      );
      if (hasDateColumn) {
        recommendations.push({
          type: 'line',
          reason: 'Time-series data detected',
          icon: LineChart,
          color: 'blue'
        });
      }
      
      // Check for categorical data → Bar/Pie chart
      const categoricalColumns = Object.entries(stats).filter(([_, s]) => s.type === 'categorical');
      if (categoricalColumns.length > 0) {
        recommendations.push({
          type: 'bar',
          reason: `${categoricalColumns.length} categorical column(s) found`,
          icon: BarChart3,
          color: 'purple'
        });
        recommendations.push({
          type: 'pie',
          reason: 'Distribution analysis available',
          icon: PieChart,
          color: 'emerald'
        });
      }
      
      // Check for numeric columns → KPIs
      const numericColumns = Object.entries(stats).filter(([_, s]) => s.type === 'numeric');
      if (numericColumns.length > 0) {
        recommendations.push({
          type: 'kpi',
          reason: `${numericColumns.length} numeric metric(s) for KPIs`,
          icon: Target,
          color: 'cyan'
        });
      }
      
      setChartRecommendations(recommendations);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg px-8 relative z-10"
        >
          {/* Floating icon with glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-28 h-28 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30" />
            <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <Layers className="w-14 h-14 text-blue-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent"
          >
            Ready to Create Magic
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-gray-400 leading-relaxed mb-6"
          >
            Ask the AI to create a stunning dashboard on any topic, or upload your own data to unlock insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 text-xs text-gray-600"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-400" />
              <span>AI-Powered</span>
            </div>
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-cyan-400" />
              <span>Real-time Analysis</span>
            </div>
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Target size={14} className="text-purple-400" />
              <span>Interactive</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/3 via-purple-600/3 to-cyan-600/3 pointer-events-none" />
      
      <div ref={dashboardRef} className="relative z-10 p-8 space-y-8">
        {/* Premium Header with Stats + Export Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-2"
            >
              DataPilot AI
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-gray-400">Live Data</span>
              </div>
              <div className="w-1 h-1 bg-gray-700 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-gray-400">AI-Generated</span>
              </div>
              <div className="w-1 h-1 bg-gray-700 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-purple-400" />
                <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2 block">Export Format</label>
              <CyberRadio
                options={[
                  { label: 'PNG', value: 'png' },
                  { label: 'PDF', value: 'pdf' }
                ]}
                name="export-format"
                selectedValue={exportFormat}
                onChange={setExportFormat}
              />
            </div>
            
            <motion.button
              onClick={() => exportDashboard(exportFormat)}
              disabled={isExporting}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl text-sm font-medium text-blue-400 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              <Download size={16} />
              <span>{isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}</span>
            </motion.button>
            
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-0.5">Data Quality</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-emerald-400">98%</div>
                <Award size={14} className="text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ⭐ NEW: Chart Recommendations Based on Dataset Structure */}
        {chartRecommendations && chartRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-[#0f0f28]/90 to-[#0a0a1f]/90 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recommended Visualizations</h3>
                  <p className="text-xs text-gray-500">Auto-detected based on dataset structure</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {chartRecommendations.map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + (i * 0.05) }}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-${rec.color}-500/10 border border-${rec.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                        <Icon size={14} className={`text-${rec.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white capitalize">{rec.type}</div>
                        <div className="text-[10px] text-gray-500 truncate">{rec.reason}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Dataset Info Card with Glassmorphism */}
        {(data.dataset || datasetInfo) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="group relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-[#0f0f28]/90 to-[#0a0a1f]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl">
              <div className="flex items-start gap-5">
                {/* Icon with glow */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-40" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Database size={24} className="text-blue-400" strokeWidth={1.5} />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-heading font-bold text-white mb-1">
                    {datasetInfo?.name || data.dataset?.name || 'Dataset'}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                    {datasetInfo?.description || data.dataset?.description || 'Analyzing your data with AI intelligence'}
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <FileSpreadsheet size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Records</div>
                        <div className="text-sm font-numbers font-bold text-white">
                          {(datasetInfo?.rowCount || data.dataset?.rowCount || data.data?.metadata?.totalRows || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Layers size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Columns</div>
                        <div className="text-sm font-numbers font-bold text-white">
                          {data.data?.metadata?.columns || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <BarChart3 size={14} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Format</div>
                        <div className="text-sm font-bold text-white">CSV</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                {(datasetInfo?.downloadUrl || datasetInfo?.source) && (
                  <motion.a
                    href={datasetInfo.downloadUrl || datasetInfo.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl text-sm font-medium text-blue-400 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all flex-shrink-0 backdrop-blur-sm group"
                  >
                    <Download size={16} className="group-hover:animate-bounce" />
                    <span>Source</span>
                    <ExternalLink size={12} className="opacity-50" />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium AI Insights Card */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="group relative"
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-[#0f0f28]/95 to-[#0a0a1f]/95 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-2xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center"
                    >
                      <Sparkles size={18} className="text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-heading font-bold text-white">AI-Generated Insights</h3>
                      <p className="text-xs text-gray-500">Powered by AI Intelligence</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setExpandedInsights(!expandedInsights)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    {expandedInsights ? 'Collapse' : 'Expand'}
                  </motion.button>
                </div>

                <AnimatePresence>
                  <motion.div
                    initial={{ height: 80, opacity: 0.7 }}
                    animate={{ 
                      height: expandedInsights ? 'auto' : 80,
                      opacity: 1
                    }}
                    className="overflow-hidden"
                  >
                    <div className={`text-sm text-gray-300 leading-relaxed ${!expandedInsights ? 'line-clamp-3' : ''}`}>
                      {insights}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium KPI Cards Grid */}
        {data.data?.kpis?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-blue-400" />
              <h2 className="text-lg font-heading font-bold text-white">Key Performance Indicators</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {data.data.kpis.map((kpi, i) => (
                <KPICard key={i} {...kpi} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Charts Grid with Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-purple-400" />
              <h2 className="text-lg font-heading font-bold text-white">Data Visualization</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Primary</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>Secondary</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {data.data?.chartData?.lineChart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group"
              >
                <LineChartComponent data={data.data.chartData.lineChart} title="Time Series Trend" />
              </motion.div>
            )}
            
            {data.data?.chartData?.barChart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group"
              >
                <BarChartComponent data={data.data.chartData.barChart} title="Category Breakdown" />
              </motion.div>
            )}
            
            {data.data?.chartData?.pieChart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group"
              >
                <PieChartComponent data={data.data.chartData.pieChart} title="Distribution Analysis" />
              </motion.div>
            )}
            
            {data.data?.chartData?.lineChart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group"
              >
                <AreaChartComponent data={data.data.chartData.lineChart} title="Cumulative View" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Premium Statistics Table */}
        {data.data?.statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-[#0f0f28]/90 to-[#0a0a1f]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Activity size={18} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-white">Statistical Summary</h3>
                  <p className="text-xs text-gray-500">Numerical data analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.data.statistics)
                  .filter(([_, s]) => s.type === 'numeric')
                  .slice(0, 6)
                  .map(([field, stat], idx) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + (idx * 0.05) }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="relative group/stat overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.15] transition-colors">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                          <TrendingUp size={12} className="text-blue-400" />
                          {field}
                        </p>
                        <div className="space-y-2">
                          {[
                            { label: 'Average', value: Math.round(stat.average), icon: '📊', color: 'text-blue-400' },
                            { label: 'Min', value: Math.round(stat.min), icon: '📉', color: 'text-emerald-400' },
                            { label: 'Max', value: Math.round(stat.max), icon: '📈', color: 'text-purple-400' }
                          ].map(({ label, value, icon, color }) => (
                            <div key={label} className="flex justify-between items-center text-xs group/item">
                              <span className="text-gray-500 flex items-center gap-1.5">
                                <span className="text-sm opacity-60">{icon}</span>
                                {label}
                              </span>
                              <span className={`font-bold ${color} group-hover/item:scale-110 transition-transform`}>
                                {value.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3));
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(6, 182, 212, 0.5));
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
