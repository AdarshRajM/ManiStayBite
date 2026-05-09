import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [loadingText, setLoadingText] = useState('Initializing Systems...');

  useEffect(() => {
    const texts = [
      'Loading Smart Contracts...',
      'Connecting to AI Concierge...',
      'Securing User Data...',
      'Welcome to ManiStayBite'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) {
        setLoadingText(texts[i]);
      } else {
        clearInterval(interval);
      }
    }, 600); // changes text every 600ms

    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds total splash duration

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F19] text-white overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-40 h-40 mb-8 rounded-3xl overflow-hidden glass p-4 shadow-2xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/30 to-teal-400/30 animate-spin" style={{ animationDuration: '3s' }}></div>
          <img src="/logo.png" alt="ManiStayBite Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 text-transparent bg-clip-text">
          ManiStayBite
        </h1>
        <p className="text-primary-400 font-bold tracking-widest uppercase text-sm mb-12">
          Premium SaaS Ecosystem
        </p>

        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                className="w-3 h-3 bg-primary-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-sm font-mono text-slate-500">{loadingText}</p>
        </div>
      </motion.div>
    </div>
  );
}
