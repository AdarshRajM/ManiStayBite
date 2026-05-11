import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Sparkles, Car, Coffee, Clock, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const SERVICES = [
  { id: 'POOL', name: 'Pool Reservation', icon: Waves, color: 'from-blue-400 to-blue-600', desc: 'Reserve your luxury pool slot.' },
  { id: 'SPA', name: 'Spa & Wellness', icon: Sparkles, color: 'from-purple-400 to-pink-600', desc: 'Book relaxing massages & therapy.' },
  { id: 'CAB', name: 'Cab & Travel', icon: Car, color: 'from-yellow-400 to-orange-500', desc: 'Airport drops & local tours.' },
  { id: 'ROOM_SERVICE', name: 'Digital Room Service', icon: Coffee, color: 'from-green-400 to-emerald-600', desc: 'Order water, towels, and food.' }
];

export default function ServicesHub() {
  const [activeService, setActiveService] = useState(null);
  const [details, setDetails] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        serviceType: activeService.id,
        details,
        scheduledTime
      };
      await api.post('/customer/services/book', payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveService(null);
        setDetails('');
        setScheduledTime('');
      }, 3000);
    } catch (err) {
      alert('Failed to book service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Luxury Services Hub</h1>
          <p className="text-xl text-slate-400">Everything you need, at your fingertips.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setActiveService(service); setSuccess(false); }}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 glass dark:dark-glass border ${activeService?.id === service.id ? 'border-white ring-2 ring-white/50 scale-105' : 'border-white/10 hover:border-white/30'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${service.color}`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-sm text-slate-400">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeService && (
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass dark:dark-glass rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto overflow-hidden"
            >
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Request Confirmed!</h3>
                  <p className="text-slate-400">Our staff will attend to your {activeService.name} request shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${activeService.color}`}>
                      <activeService.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Book {activeService.name}</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300">Request Details</label>
                    <textarea 
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={
                        activeService.id === 'CAB' ? "E.g., Airport drop tomorrow at 5 AM" :
                        activeService.id === 'ROOM_SERVICE' ? "E.g., Extra towels and 2 bottles of water" :
                        "Any specific preferences or requests?"
                      }
                      className="w-full h-32 p-4 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-white/50 text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Preferred Time (Optional)
                    </label>
                    <input 
                      type="datetime-local" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-white/50 text-white"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all ${isSubmitting ? 'opacity-50' : 'hover:opacity-90 hover:scale-[1.02]'} bg-gradient-to-r ${activeService.color}`}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Request'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
