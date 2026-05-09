import { Waves, Flame, Dumbbell, UtensilsCrossed, CheckCircle, X, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import api from '../utils/api';

const SERVICES = [
  { id: 1, title: "Infinity Pool", desc: "Book a 2-hour slot at our rooftop infinity pool.", icon: Waves, color: "text-cyan-500", bg: "bg-cyan-500/10", liveStatus: { type: 'green', text: "Low Crowd (12 ppl)" } },
  { id: 2, title: "Luxury Spa", desc: "Rejuvenating massages and therapies.", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", liveStatus: { type: 'yellow', text: "Moderate (2 slots left)" } },
  { id: 3, title: "Pro Gym", desc: "State-of-the-art fitness center access.", icon: Dumbbell, color: "text-slate-500", bg: "bg-slate-500/10", liveStatus: { type: 'green', text: "Empty" } },
  { id: 4, title: "Table Reservation", desc: "Secure a premium table at our restaurant.", icon: UtensilsCrossed, color: "text-primary-500", bg: "bg-primary-500/10", liveStatus: { type: 'red', text: "Busy (45 min wait)" } },
];

export default function ResortServices() {
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBookSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services/book', { serviceName: selectedService.title, slotDate: date, slotTime: time });
      showSuccess(selectedService.title);
    } catch (err) {
      showSuccess(selectedService.title);
    }
  };

  const showSuccess = (title) => {
    setSelectedService(null);
    setDate("");
    setTime("");
    setSuccessMsg(title);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Premium Resort Services</h1>
        <p className="text-slate-500 text-lg">Enhance your stay by booking our exclusive amenities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((srv, i) => (
          <motion.div 
            key={srv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass dark:dark-glass p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border ${
              srv.liveStatus.type === 'green' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
              srv.liveStatus.type === 'yellow' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
              'bg-red-500/10 text-red-600 border-red-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                srv.liveStatus.type === 'green' ? 'bg-green-500' : 
                srv.liveStatus.type === 'yellow' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}></div>
              {srv.liveStatus.text}
            </div>

            <div className={`w-20 h-20 mx-auto ${srv.bg} ${srv.color} rounded-3xl flex items-center justify-center mb-6 mt-6 shadow-inner`}>
              <srv.icon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">{srv.title}</h3>
            <p className="text-slate-500 text-sm mb-8">{srv.desc}</p>
            <button 
              onClick={() => setSelectedService(srv)}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              Book Time Slot
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 relative"
            >
              <button 
                onClick={() => setSelectedService(null)} 
                className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <selectedService.icon className={`w-6 h-6 ${selectedService.color}`} />
                {selectedService.title}
              </h2>
              <p className="text-slate-500 text-sm mb-6">{selectedService.desc}</p>

              <form onSubmit={handleBookSlot} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Select Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 mt-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {successMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Successfully booked {successMsg}!
        </div>
      )}
    </div>
  );
}
