import React, { useState } from 'react';
import { Upload, Database, X } from 'lucide-react';

const DataUpload = ({ onDataUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/api/upload/file', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        onDataUploaded?.(data);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
        <Upload size={20} className="text-gray-500 mb-1" />
        <span className="text-xs text-gray-500">Drop CSV/Excel here</span>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={uploading} />
      </label>
      {uploading && <p className="text-xs text-blue-400 mt-2 text-center animate-pulse">Processing...</p>}
    </div>
  );
};

export default DataUpload;
