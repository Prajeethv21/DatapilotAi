import React, { useState } from 'react';
import { Upload, Database, X } from 'lucide-react';
import apiService from '../services/api';

const DataUpload = ({ onDataUploaded }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dbConfig, setDbConfig] = useState({
    type: 'mysql',
    host: 'localhost',
    port: '',
    user: '',
    password: '',
    database: '',
    query: 'SELECT * FROM your_table LIMIT 1000'
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiService.uploadFile(file);
      onDataUploaded(result);
      setShowUpload(false);
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDatabaseConnect = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const result = await apiService.connectDatabase(dbConfig);
      onDataUploaded(result);
      setShowDatabase(false);
      alert('Database connected successfully!');
    } catch (error) {
      alert('Database connection failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Upload Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Upload size={18} />
          Upload CSV/Excel
        </button>
        
        <button
          onClick={() => setShowDatabase(!showDatabase)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Database size={18} />
          Connect Database
        </button>
      </div>

      {/* File Upload Panel */}
      {showUpload && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Upload Data File</h3>
            <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          {uploading && <p className="text-sm text-gray-400 mt-2">Uploading and processing...</p>}
        </div>
      )}

      {/* Database Connection Panel */}
      {showDatabase && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Connect to Database</h3>
            <button onClick={() => setShowDatabase(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleDatabaseConnect} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Database Type</label>
                <select
                  value={dbConfig.type}
                  onChange={(e) => setDbConfig({...dbConfig, type: e.target.value})}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                >
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Host</label>
                <input
                  type="text"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Port (optional)</label>
                <input
                  type="number"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                  placeholder={dbConfig.type === 'mysql' ? '3306' : '5432'}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Database Name</label>
                <input
                  type="text"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={dbConfig.user}
                  onChange={(e) => setDbConfig({...dbConfig, user: e.target.value})}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={dbConfig.password}
                  onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">SQL Query</label>
              <textarea
                value={dbConfig.query}
                onChange={(e) => setDbConfig({...dbConfig, query: e.target.value})}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm"
                rows="3"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? 'Connecting...' : 'Connect & Load Data'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DataUpload;
