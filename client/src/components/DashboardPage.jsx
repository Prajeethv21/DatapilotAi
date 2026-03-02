import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Upload, X, Wifi, WifiOff, PanelLeftClose, PanelLeft, Database, Play, AlertCircle, LogOut } from 'lucide-react';
import Chatbot from './Chatbot';
import Dashboard from './Dashboard';
import CyberRadio from './CyberRadio';
import apiService from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbForm, setDbForm] = useState({ type: 'mysql', host: 'localhost', port: '', user: '', password: '', database: '', query: 'SELECT * FROM your_table LIMIT 1000' });
  const [dbError, setDbError] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => { checkHealth(); }, []);

  const checkHealth = async () => {
    try {
      const data = await apiService.checkHealth();
      setApiStatus(data.status === 'OK' || data.status === 'healthy' ? 'connected' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  const handleDashboardData = (processedData, newInsights, dataset) => {
    setDashboardData(processedData);
    setInsights(newInsights);
    setDatasetInfo(dataset || null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setUploadError('');
    try {
      const data = await apiService.uploadFile(file);
      if (data.success) {
        const processed = data.data || data.processedData;
        const fname = data.filename || data.fileName;
        setDashboardData({
          data: processed,
          dataset: { name: fname, description: 'Uploaded file', rowCount: processed?.metadata?.totalRows }
        });
        setInsights(data.insights);
        setDatasetInfo({ name: fname, description: 'Uploaded CSV file', rowCount: processed?.metadata?.totalRows });
        setShowUpload(false);
        setUploadError('');
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDbConnect = async () => {
    setDbError('');
    if (!dbForm.host || !dbForm.database || !dbForm.query) {
      setDbError('Host, database, and query are required');
      return;
    }
    setIsProcessing(true);
    try {
      const data = await apiService.connectDatabase({
        type: dbForm.type,
        host: dbForm.host,
        port: dbForm.port ? parseInt(dbForm.port) : undefined,
        user: dbForm.user,
        password: dbForm.password,
        database: dbForm.database,
        query: dbForm.query
      });
      if (data.success) {
        setDashboardData({
          data: data.processedData,
          dataset: { name: data.database, description: `${dbForm.type} database query`, rowCount: data.rowCount }
        });
        setInsights(data.insights);
        setDatasetInfo({ name: data.database, description: `Connected via ${dbForm.type}`, rowCount: data.rowCount });
        setShowDbModal(false);
      } else {
        setDbError(data.error || data.message || 'Connection failed');
      }
    } catch (err) {
      setDbError(err.message || 'Could not connect to server');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#060612] text-white overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="relative z-20 h-14 px-4 flex items-center justify-between border-b border-white/[0.04] bg-[#080818]/80 backdrop-blur-xl flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </motion.button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose size={18} className="text-gray-400" /> : <PanelLeft size={18} className="text-gray-400" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold">DataPilot AI</h1>
              <p className="text-[10px] text-gray-600">Intelligent Analytics</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => { setShowUpload(!showUpload); setShowDbModal(false); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Upload size={13} />
            Upload
          </motion.button>

          <motion.button
            onClick={() => { setShowDbModal(!showDbModal); setShowUpload(false); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Database size={13} />
            Database
          </motion.button>

          <motion.button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userName');
              navigate('/login');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={13} />
            Logout
          </motion.button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02]">
            {apiStatus === 'connected' ? (
              <>
                <Wifi size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
              </>
            ) : apiStatus === 'checking' ? (
              <>
                <Wifi size={12} className="text-yellow-400 animate-pulse" />
                <span className="text-[10px] text-yellow-400 font-medium">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-400" />
                <span className="text-[10px] text-red-400 font-medium">Offline</span>
                <button onClick={checkHealth} className="text-[10px] text-blue-400 ml-1 hover:underline">Retry</button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-4 z-30 w-80 bg-[#0f0f24] border border-white/10 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Upload Data</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
              <Upload size={24} className="text-gray-500 mb-2" />
              <span className="text-xs text-gray-500">Drop CSV or Excel file here</span>
              <span className="text-[10px] text-gray-700 mt-1">Max 50MB</span>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={isProcessing} />
            </label>
            {isProcessing && <p className="text-xs text-blue-400 mt-3 text-center animate-pulse">Processing file...</p>}
            {uploadError && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2 mt-3">
                <AlertCircle size={12} /> {uploadError}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Modal */}
      <AnimatePresence>
        {showDbModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-4 z-30 w-96 bg-[#0f0f24] border border-white/10 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Database size={14} className="text-blue-400" /> Connect Database</h3>
              <button onClick={() => setShowDbModal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2 block">Database Type</label>
                <CyberRadio
                  options={[
                    { label: 'MySQL', value: 'mysql' },
                    { label: 'PostgreSQL', value: 'postgresql' }
                  ]}
                  name="db-type"
                  selectedValue={dbForm.type}
                  onChange={(value) => setDbForm({...dbForm, type: value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Host</label>
                  <input
                    value={dbForm.host}
                    onChange={(e) => setDbForm({...dbForm, host: e.target.value})}
                    placeholder="localhost"
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Port</label>
                  <input
                    value={dbForm.port}
                    onChange={(e) => setDbForm({...dbForm, port: e.target.value})}
                    placeholder={dbForm.type === 'mysql' ? '3306' : '5432'}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Username</label>
                  <input
                    value={dbForm.user}
                    onChange={(e) => setDbForm({...dbForm, user: e.target.value})}
                    placeholder="root"
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Password</label>
                  <input
                    type="password"
                    value={dbForm.password}
                    onChange={(e) => setDbForm({...dbForm, password: e.target.value})}
                    placeholder="••••••"
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Database Name</label>
                <input
                  value={dbForm.database}
                  onChange={(e) => setDbForm({...dbForm, database: e.target.value})}
                  placeholder="my_database"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">SQL Query</label>
                <textarea
                  value={dbForm.query}
                  onChange={(e) => setDbForm({...dbForm, query: e.target.value})}
                  placeholder="SELECT * FROM table_name LIMIT 1000"
                  rows={3}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30 font-mono resize-none"
                />
              </div>

              {dbError && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                  <AlertCircle size={12} /> {dbError}
                </div>
              )}

              <button
                onClick={handleDbConnect}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-medium transition-colors"
              >
                <Play size={12} />
                {isProcessing ? 'Connecting...' : 'Connect & Query'}
              </button>

              <p className="text-[10px] text-gray-600 text-center">
                You can also tell the chatbot: <em>"query my mysql database"</em>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex-shrink-0 border-r border-white/[0.04] overflow-hidden"
            >
              <div className="w-[380px] h-full p-3">
                <Chatbot
                  onDashboardData={handleDashboardData}
                  isProcessing={isProcessing}
                  dashboardContext={dashboardData ? {
                    kpis: dashboardData.data?.kpis,
                    statistics: dashboardData.data?.statistics,
                    metadata: dashboardData.data?.metadata,
                    datasetName: dashboardData.dataset?.name
                  } : null}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-hidden">
          <Dashboard
            data={dashboardData}
            insights={insights}
            datasetInfo={datasetInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
