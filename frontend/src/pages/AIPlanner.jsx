import { useState } from 'react';
import { Bot, MapPin, Users, Wallet, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIPlanner() {
  const [budget, setBudget] = useState(5000);
  const [guests, setGuests] = useState(2);
  const [mood, setMood] = useState('Relaxing');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setIsPlanning(true);
    setPlan(null);
    
    setTimeout(() => {
      setIsPlanning(false);
      setPlan({
        title: `Perfect ${mood} Getaway for ${guests}`,
        totalCost: budget - (budget * 0.1),
        days: [
          {
            day: "Day 1: Arrival & Relaxation",
            activities: [
              "Check-in to Premium Sea-View Suite",
              "Welcome drinks & Light Snacks",
              "Evening Luxury Spa Session (60 mins)",
              "Candlelight Dinner by the Pool"
            ]
          },
          {
            day: "Day 2: Adventure & Memories",
            activities: [
              "Breakfast in bed",
              "Local City Tour via Private Cab",
              "Lunch at renowned authentic restaurant",
              "Departure with Digital Souvenir Album"
            ]
          }
        ]
      });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 text-primary-500 rounded-full mb-4">
          <Bot className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Vacation Planner</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Let our advanced AI curate the perfect itinerary based on your budget, guests, and mood.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="glass dark:dark-glass p-8 rounded-3xl sticky top-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Sparkles className="text-primary-500" /> Plan Your Trip</h2>
          <form onSubmit={handleGeneratePlan} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2"><Wallet className="w-4 h-4 text-slate-400" /> Budget (₹)</label>
              <input type="range" min="2000" max="50000" step="500" value={budget} onChange={e=>setBudget(e.target.value)} className="w-full accent-primary-500" />
              <div className="text-right font-bold text-primary-500 mt-1">₹{budget}</div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Number of Guests</label>
              <input type="number" min="1" max="10" value={guests} onChange={e=>setGuests(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Trip Mood</label>
              <div className="grid grid-cols-2 gap-3">
                {['Relaxing', 'Adventure', 'Romantic', 'Party'].map(m => (
                  <button 
                    key={m} type="button"
                    onClick={() => setMood(m)}
                    className={`p-3 rounded-xl border-2 font-bold transition-all ${mood === m ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isPlanning} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              {isPlanning ? <span className="animate-pulse">AI is thinking...</span> : <>Generate Itinerary <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isPlanning && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold">Analyzing preferences and finding best prices...</p>
              </motion.div>
            )}

            {plan && !isPlanning && (
              <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="glass dark:dark-glass p-8 rounded-3xl bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{plan.title}</h2>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Estimated Cost</p>
                      <p className="text-2xl font-bold text-primary-500">₹{plan.totalCost}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">
                    1-Click Book Package
                  </button>
                </div>

                <div className="space-y-4">
                  {plan.days.map((day, i) => (
                    <div key={i} className="glass dark:dark-glass p-6 rounded-3xl">
                      <h3 className="font-bold text-lg mb-4 text-primary-500">{day.day}</h3>
                      <ul className="space-y-3">
                        {day.activities.map((act, j) => (
                          <li key={j} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!isPlanning && !plan && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-500 p-12 text-center glass dark:dark-glass rounded-3xl border-dashed">
                <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Your AI-generated travel itinerary will appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
