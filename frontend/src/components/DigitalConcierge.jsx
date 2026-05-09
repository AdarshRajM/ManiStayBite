import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Ambulance, ShieldAlert, Droplets, Coffee, X, CarFront } from 'lucide-react';

export default function DigitalConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  const handleRequest = (service) => {
    setActiveRequest(service);
    setTimeout(() => {
      setActiveRequest(null);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-72 overflow-hidden"
          >
            <div className="p-4 bg-primary-500 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><BellRing className="w-5 h-5" /> Digital Concierge</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-primary-600 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            
            {activeRequest ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-primary-500">Dispatching {activeRequest}...</p>
                <p className="text-sm text-slate-500 mt-2">Staff will arrive at your room shortly.</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                <button onClick={() => handleRequest('Fresh Towels')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Droplets className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Request Towels</p>
                    <p className="text-xs text-slate-500">Housekeeping</p>
                  </div>
                </button>

                <button onClick={() => handleRequest('Room Cleaning')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
                  <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><SparklesIcon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Room Cleaning</p>
                    <p className="text-xs text-slate-500">Housekeeping</p>
                  </div>
                </button>

                <button onClick={() => handleRequest('Morning Tea')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Coffee className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Morning Tea</p>
                    <p className="text-xs text-slate-500">Room Service</p>
                  </div>
                </button>
                
                <button onClick={() => handleRequest('Taxi')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
                  <div className="p-2 bg-slate-500/10 text-slate-500 rounded-lg"><CarFront className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Book a Taxi</p>
                    <p className="text-xs text-slate-500">Front Desk</p>
                  </div>
                </button>

                <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>

                {/* Emergency Services */}
                <button onClick={() => handleRequest('Emergency SOS')} className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors text-left group">
                  <div className="p-2 bg-red-500 text-white rounded-lg group-hover:animate-pulse"><ShieldAlert className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm text-red-600 dark:text-red-400">Emergency SOS</p>
                    <p className="text-xs text-red-500/80">Doctor & Security</p>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl text-white transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-slate-800 scale-90' : 'bg-primary-500 hover:bg-primary-600 hover:scale-110 hover:-translate-y-1'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <BellRing className="w-6 h-6" />}
      </button>
    </div>
  );
}

// Inline Sparkles icon since it wasn't imported at top
function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
