import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Sparkles, Layers } from 'lucide-react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    'Initializing AI Engine',
    'Loading Neural Networks',
    'Calibrating Data Processors',
    'Ready to Launch'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete?.(), 400);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  useEffect(() => {
    setStage(Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1));
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030308] overflow-hidden"
    >
      {/* Subtle bg glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-500/[0.05] rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* 3D Box Loader Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="loader">
            <div className="box box0"><div></div></div>
            <div className="box box1"><div></div></div>
            <div className="box box2"><div></div></div>
            <div className="box box3"><div></div></div>
            <div className="box box4"><div></div></div>
            <div className="box box5"><div></div></div>
            <div className="box box6"><div></div></div>
            <div className="box box7"><div></div></div>
            <div className="ground"><div></div></div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DataPilot AI
            </span>
          </h1>
          <p className="text-xs text-gray-600 font-medium tracking-wider uppercase">Intelligent Analytics Platform</p>
        </motion.div>

        {/* Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-10 mb-6 flex items-center justify-center gap-2 text-gray-400"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              {stage < 2 ? <Brain size={14} /> : stage < 3 ? <Zap size={14} /> : <Sparkles size={14} />}
            </motion.div>
            <span className="text-xs font-medium">{stages[stage]}</span>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="relative w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg font-bold text-blue-400"
        >
          {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
