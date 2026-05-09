import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Sparkles } from 'lucide-react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    let timeout;
    if (isListening) {
      setTranscript("Listening...");
      setResponse("");
      
      timeout = setTimeout(() => {
        setTranscript("Book a deluxe room for tomorrow");
        
        setTimeout(() => {
          setIsListening(false);
          setResponse("I have navigated you to the Rooms page. You can complete your Deluxe Room booking there.");
        }, 1500);
        
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isListening]);

  return (
    <>
      {/* Global FAB */}
      <button 
        onClick={() => setIsListening(true)}
        className="fixed bottom-24 right-6 z-[90] w-14 h-14 bg-gradient-to-tr from-primary-500 to-teal-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <Mic className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isListening && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center text-center shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <button onClick={() => setIsListening(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold mb-8 flex items-center gap-2"><Sparkles className="text-primary-500 w-5 h-5" /> AI Voice Booking</h2>

              {/* Pulsing Mic UI */}
              <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-4 bg-primary-500/40 rounded-full animate-pulse"></div>
                <div className="relative z-10 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50">
                  <Mic className="w-8 h-8" />
                </div>
              </div>

              <div className="h-20 flex flex-col justify-center">
                <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
                  {transcript}
                </p>
                {response && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-primary-500 mt-2">
                    {response}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
