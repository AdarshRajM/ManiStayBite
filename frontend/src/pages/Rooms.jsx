import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BedDouble, CheckCircle, View, Smartphone, Scan, X } from 'lucide-react';

const ROOMS = [
  { id: 1, type: "Deluxe Suite", price: 5000, features: ["AC", "King Bed", "City View"], available: true, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80" },
  { id: 2, type: "Single Premium", price: 2500, features: ["AC", "Queen Bed", "Pool View"], available: true, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80" },
  { id: 3, type: "Standard Non-AC", price: 1500, features: ["Non-AC", "Twin Bed", "Free WiFi"], available: false, image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80" },
];

export default function Rooms() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [arRoom, setArRoom] = useState(null);

  const handleBook = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const submitBooking = (e) => {
    e.preventDefault();
    setShowBookingForm(false);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Book Your Stay</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Experience luxury and comfort with our premium room selections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ROOMS.map((room, i) => (
          <motion.div 
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass dark:dark-glass rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={room.image} alt={room.type} className="w-full h-full object-cover" />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${room.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {room.available ? 'Available' : 'Booked'}
              </div>
              <button onClick={() => setArRoom(room)} className="absolute top-4 left-4 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-primary-500 hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-2 group/ar">
                <View className="w-5 h-5" /> <span className="text-xs font-bold w-0 overflow-hidden group-hover/ar:w-24 transition-all whitespace-nowrap">360° AR View</span>
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">{room.type}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {room.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs rounded-lg flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" /> {feature}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">₹{room.price}</span>
                  <span className="text-sm text-slate-500"> / night</span>
                </div>
                <button 
                  onClick={() => handleBook(room)}
                  disabled={!room.available}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${room.available ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-primary-500/25' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                >
                  <BedDouble className="w-5 h-5" />
                  {room.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showBookingForm && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass dark:dark-glass p-8 rounded-3xl max-w-md w-full relative">
            <h2 className="text-2xl font-bold mb-4">Book {selectedRoom.type}</h2>
            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input type="date" required className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input type="date" required className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBookingForm(false)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">Confirm</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {bookingSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Booking Confirmed!
        </div>
      )}

      {/* AR Preview Modal Simulator */}
      <AnimatePresence>
        {arRoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img src={arRoom.image} className="w-full h-full object-cover scale-150 blur-sm" alt="AR Background" />
            </div>
            
            <div className="absolute top-8 left-8 text-white z-10 flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 backdrop-blur-md rounded-full animate-pulse border border-primary-500">
                <Smartphone className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{arRoom.type} - AR Preview</h3>
                <p className="text-sm text-slate-300">Move your device around to explore</p>
              </div>
            </div>

            <button onClick={() => setArRoom(null)} className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur hover:bg-white/20 rounded-full text-white z-10 transition-colors">
              <X className="w-6 h-6" />
            </button>

            {/* AR Viewfinder UI */}
            <div className="relative z-10 w-[80vw] h-[80vh] border-2 border-white/20 rounded-[3rem] overflow-hidden flex items-center justify-center">
              <img src={arRoom.image} className="absolute inset-0 w-full h-full object-cover origin-center animate-pan" alt="Room AR" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Scan className="w-32 h-32 text-primary-500/50 animate-ping" strokeWidth={1} />
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="px-6 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> King Bed Detected
                </div>
                <div className="px-6 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Window View Detected
                </div>
              </div>
            </div>

            {/* CSS Animation for panning */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes pan {
                0% { transform: scale(1.2) translate(0, 0); }
                33% { transform: scale(1.2) translate(5%, 2%); }
                66% { transform: scale(1.2) translate(-5%, -2%); }
                100% { transform: scale(1.2) translate(0, 0); }
              }
              .animate-pan { animation: pan 20s infinite ease-in-out; }
            `}} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
