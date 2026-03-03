import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Brain, TrendingUp, Zap, Database, Upload, BarChart3, Sparkles, Globe, Lock, Cpu, ChevronDown, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';

// Scroll-triggered section wrapper
const RevealSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const features = [
    { icon: Brain, title: 'Conversational AI', desc: 'Chat naturally like with ChatGPT. Ask anything, create dashboards with words.', color: 'blue' },
    { icon: Globe, title: 'Auto Dataset Search', desc: 'AI searches the web for relevant datasets on any topic you request.', color: 'cyan' },
    { icon: TrendingUp, title: 'Live Dashboards', desc: 'Interactive charts, KPIs, and visualizations that update in real-time.', color: 'emerald' },
    { icon: Zap, title: 'Instant Insights', desc: 'Get AI-generated analysis and actionable recommendations in seconds.', color: 'amber' },
    { icon: Upload, title: 'Upload Anything', desc: 'Drop your CSV/Excel files for instant analysis and visualization.', color: 'violet' },
    { icon: Lock, title: 'Enterprise Security', desc: 'OWASP-compliant with rate limiting, validation, and XSS protection.', color: 'rose' }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', hover: 'group-hover:border-blue-500/40' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', hover: 'group-hover:border-cyan-500/40' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', hover: 'group-hover:border-emerald-500/40' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', hover: 'group-hover:border-amber-500/40' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: 'text-violet-400', hover: 'group-hover:border-violet-500/40' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-400', hover: 'group-hover:border-rose-500/40' },
  };

  const stats = [
    { value: 'Any Topic', label: 'Dashboard Generation' },
    { value: 'Real-time', label: 'Data Processing' },
    { value: 'GPT-Powered', label: 'AI Intelligence' },
    { value: '24/7', label: 'Always Available' }
  ];

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      {/* FloatingLines Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FloatingLines
          linesGradient={['#0044cc', '#0066ff', '#00aaff', '#0088dd']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={false}
          parallax={false}
          animationSpeed={0.6}
        />
      </div>

      {/* Subtle gradient overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-0 w-full z-50 bg-[#030308]/60 backdrop-blur-xl border-b border-white/[0.04]"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
            <img src="/datapilot-logo.svg" alt="DataPilot Logo" className="w-9 h-9" />
            <div>
              <h1 className="text-sm font-bold tracking-tight">DataPilot AI</h1>
              <p className="text-[9px] text-gray-600 font-medium tracking-wider uppercase">Intelligent Analytics</p>
            </div>
          </motion.div>
          
          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
            >
              Launch Dashboard
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition-colors"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 pt-32 pb-24 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
            >
              <Sparkles size={13} className="text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">Powered by Advanced AI</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black mb-6 leading-[1.1] tracking-tight">
              <span className="text-white">Your gateway to</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                intelligent analytics.
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Chat with AI to create dashboards on any topic. Upload your data or let AI find datasets for you. Get instant insights with beautiful visualizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-colors"
              >
                Launch Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <MessageSquare size={16} className="text-blue-400" />
                Sign In / Sign Up
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.03 }}
                className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm"
              >
                <div className="text-xl font-bold text-blue-400 mb-1">{stat.value}</div>
                <div className="text-[11px] text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-700"
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
              Everything you need.
              <span className="text-blue-400"> Nothing you don't.</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              From conversational AI to real-time dashboards, every feature is designed for maximum insight.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <RevealSection key={i} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    className={`group relative p-6 bg-white/[0.015] border border-white/[0.05] ${c.hover} rounded-2xl transition-all duration-300 hover:bg-white/[0.03]`}
                  >
                    <div className={`w-11 h-11 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center mb-4`}>
                      <f.icon size={20} className={c.icon} />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-white">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
              Three steps. <span className="text-cyan-400">Infinite insights.</span>
            </h2>
          </RevealSection>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Ask or Upload', desc: 'Type a topic or upload your CSV/Excel data. AI handles the rest.', icon: MessageSquare },
              { step: '02', title: 'AI Finds & Processes', desc: 'AI searches the web for datasets, processes the data, and generates analytics.', icon: Brain },
              { step: '03', title: 'Explore & Ask Questions', desc: 'Interact with your live dashboard. Ask follow-up questions. Download datasets.', icon: BarChart3 }
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-5 p-6 bg-white/[0.015] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all"
                >
                  <span className="text-4xl font-black text-white/[0.06] leading-none select-none">{item.step}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                        <item.icon size={16} className="text-blue-400" />
                      </div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-28 px-6">
        <RevealSection className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 bg-gradient-to-br from-blue-500/[0.06] to-cyan-500/[0.04] border border-blue-500/10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
            <div className="relative">
              <Globe size={40} className="mx-auto mb-5 text-blue-400" />
              <h2 className="text-3xl font-black mb-4">Ready to unlock your data?</h2>
              <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto">
                Start creating AI-powered dashboards in seconds. No setup required.
              </p>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm shadow-2xl shadow-blue-500/20 flex items-center gap-2 mx-auto transition-colors"
              >
                Start Now <Sparkles size={16} />
              </motion.button>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-gray-700">© 2026 DataPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
