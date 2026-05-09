import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, TimerReset, UtensilsCrossed, BellRing } from 'lucide-react';

export default function QueueTracker() {
  const [inQueue, setInQueue] = useState(false);
  const [peopleCount, setPeopleCount] = useState(2);
  const [waitTime, setWaitTime] = useState(45); // minutes
  const [token, setToken] = useState(null);

  // Simulate queue moving
  useEffect(() => {
    let interval;
    if (inQueue && waitTime > 0) {
      interval = setInterval(() => {
        setWaitTime(prev => prev - 1);
      }, 60000); // Reduce wait time by 1 min every 60 seconds
    }
    return () => clearInterval(interval);
  }, [inQueue, waitTime]);

  const joinQueue = () => {
    setInQueue(true);
    setToken(`TKN-${Math.floor(Math.random() * 900) + 100}`);
    setWaitTime(45);
  };

  const leaveQueue = () => {
    setInQueue(false);
    setToken(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3"><UtensilsCrossed className="w-10 h-10 text-primary-500" /> Virtual Restaurant Queue</h1>
        <p className="text-slate-500 text-lg">Join the waitlist from your room. We will notify you when your table is ready.</p>
      </div>

      <div className="glass dark:dark-glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Side - Queue Info */}
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold mb-6">Current Restaurant Status</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl text-center border-b-4 border-red-500">
              <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">Waitlist</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">12 Groups</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl text-center border-b-4 border-yellow-500">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">Est. Wait</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">45 Mins</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!inQueue ? (
              <motion.div key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">Number of People in your group</label>
                  <input type="number" min="1" max="15" value={peopleCount} onChange={e=>setPeopleCount(e.target.value)} className="w-full px-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold" />
                </div>
                <button onClick={joinQueue} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/25">
                  Join Virtual Queue
                </button>
              </motion.div>
            ) : (
              <motion.div key="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 rounded-3xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary-500/20 animate-pulse pointer-events-none"></div>
                
                <h3 className="text-slate-400 font-bold mb-2">Your Token Number</h3>
                <div className="text-5xl font-black text-primary-400 tracking-wider mb-6 font-mono bg-black/50 py-4 rounded-2xl border border-primary-500/30">
                  {token}
                </div>

                <div className="flex justify-around items-center mb-8 bg-white/10 p-4 rounded-2xl">
                  <div>
                    <p className="text-slate-400 text-sm">Table For</p>
                    <p className="font-bold text-xl">{peopleCount} Pax</p>
                  </div>
                  <div className="w-px h-12 bg-slate-700"></div>
                  <div>
                    <p className="text-slate-400 text-sm">Wait Time</p>
                    <p className="font-bold text-xl text-yellow-400 flex items-center gap-1"><TimerReset className="w-5 h-5" /> {waitTime} min</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-primary-300 font-bold mb-6">
                  <BellRing className="w-4 h-4 animate-bounce" /> We'll notify your phone when ready.
                </div>

                <button onClick={leaveQueue} className="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl font-bold transition-colors text-sm">
                  Cancel Reservation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:block flex-1 w-full">
          <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" alt="Restaurant Queue" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-ping inline-block"></span> Live Queue Sync
              </div>
              <p className="text-white text-sm">Skip the physical line. Enjoy your room until your table is ready.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
