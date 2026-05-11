import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, useGLTF } from '@react-three/drei';
import { Calendar, Users, MapPin, Music, CheckCircle, IndianRupee } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// A simple 3D Ring/Decoration component since we don't have a glTF file
const Event3DElement = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2, 0.5, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh scale={0.5} position={[0, 0, 0]}>
        <octahedronGeometry />
        <meshStandardMaterial color="#FF1493" metalness={0.5} roughness={0.2} wireframe />
      </mesh>
    </Float>
  );
};

export default function EventBookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: 'Wedding',
    guestCount: 50,
    area: 'Banquet Hall',
    bookingDate: '',
    cateringPackage: 'Veg',
    decorationPackage: 'Basic',
    additionalServices: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PRICING = {
    area: { 'Entire Hotel': 500000, 'Banquet Hall': 50000, 'Pool Area': 30000, 'Rooftop': 20000 },
    catering: { 'Veg': 500, 'Non-Veg': 800, 'Premium Buffet': 1200, 'Live Counter': 1500 }, // per person
    decoration: { 'Basic': 10000, 'Premium': 50000, 'Royal Theme': 150000, 'Floral': 80000 },
    services: { 'DJ': 15000, 'Photography': 20000, 'Videography': 30000, 'Security': 5000, 'Valet Parking': 8000, 'Fireworks': 25000 }
  };

  const calculateCost = useMemo(() => {
    let total = 0;
    total += PRICING.area[formData.area] || 0;
    total += (PRICING.catering[formData.cateringPackage] || 0) * formData.guestCount;
    total += PRICING.decoration[formData.decorationPackage] || 0;
    formData.additionalServices.forEach(srv => {
      total += PRICING.services[srv] || 0;
    });
    const tax = total * 0.18; // 18% GST
    return { subtotal: total, tax, total: total + tax };
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleService = (service) => {
    setFormData(prev => {
      const exists = prev.additionalServices.includes(service);
      if (exists) return { ...prev, additionalServices: prev.additionalServices.filter(s => s !== service) };
      return { ...prev, additionalServices: [...prev.additionalServices, service] };
    });
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        additionalServices: formData.additionalServices.join(','),
        estimatedCost: calculateCost.total,
        advancePaid: calculateCost.total * 0.2 // 20% advance
      };
      await api.post('/customer/events/book', payload);
      setStep(4); // Success step
    } catch (err) {
      alert("Failed to submit booking: " + (err.response?.data || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Event3DElement />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-2/3 glass dark:dark-glass p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Plan Your Grand Event
          </h1>
          <p className="text-slate-300 mb-8">Customize every detail of your perfect day.</p>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Event Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Wedding', 'Birthday Party', 'Corporate Event', 'Ring Ceremony', 'Reception', 'DJ Night', 'Pool Party', 'Family Function'].map(type => (
                    <button key={type} onClick={() => handleChange('eventType', type)} className={`p-3 rounded-xl border transition-all ${formData.eventType === type ? 'bg-yellow-500 text-black border-yellow-500 font-bold shadow-lg shadow-yellow-500/50' : 'border-white/20 hover:bg-white/10'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">Number of Guests</label>
                  <div className="flex items-center gap-4 bg-black/30 p-3 rounded-xl border border-white/10">
                    <Users className="text-yellow-500" />
                    <input type="number" min="10" value={formData.guestCount} onChange={(e) => handleChange('guestCount', parseInt(e.target.value) || 0)} className="bg-transparent w-full outline-none font-bold text-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">Event Date & Time</label>
                  <div className="flex items-center gap-4 bg-black/30 p-3 rounded-xl border border-white/10">
                    <Calendar className="text-yellow-500" />
                    <input type="datetime-local" value={formData.bookingDate} onChange={(e) => handleChange('bookingDate', e.target.value)} className="bg-transparent w-full outline-none text-slate-200" style={{colorScheme: 'dark'}} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Select Venue Area</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(PRICING.area).map(area => (
                    <button key={area} onClick={() => handleChange('area', area)} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.area === area ? 'bg-blue-500 text-white border-blue-500 font-bold shadow-lg shadow-blue-500/50' : 'border-white/20 hover:bg-white/10'}`}>
                      <MapPin className={formData.area === area ? 'text-white' : 'text-blue-400'} /> {area}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl mt-6 hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                Next: Catering & Decor
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Catering Package (Per Person)</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(PRICING.catering).map(cat => (
                    <button key={cat} onClick={() => handleChange('cateringPackage', cat)} className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.cateringPackage === cat ? 'bg-green-500 text-white border-green-500 font-bold shadow-lg shadow-green-500/50' : 'border-white/20 hover:bg-white/10'}`}>
                      <span>{cat}</span>
                      <span className="text-xs opacity-80">₹{PRICING.catering[cat]} / pax</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Theme & Decoration</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(PRICING.decoration).map(dec => (
                    <button key={dec} onClick={() => handleChange('decorationPackage', dec)} className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.decorationPackage === dec ? 'bg-pink-500 text-white border-pink-500 font-bold shadow-lg shadow-pink-500/50' : 'border-white/20 hover:bg-white/10'}`}>
                      <span>{dec}</span>
                      <span className="text-xs opacity-80">₹{PRICING.decoration[dec]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="w-1/3 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]">Next: Extra Services</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-4 text-slate-300">Additional Services</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(PRICING.services).map(srv => (
                    <label key={srv} className="flex items-center gap-3 p-4 rounded-xl border border-white/20 cursor-pointer hover:bg-white/5 transition-colors">
                      <input type="checkbox" className="w-5 h-5 accent-yellow-500" checked={formData.additionalServices.includes(srv)} onChange={() => handleToggleService(srv)} />
                      <div className="flex flex-col">
                        <span className="font-bold">{srv}</span>
                        <span className="text-xs text-yellow-400">₹{PRICING.services[srv]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                <h3 className="font-bold text-yellow-500 mb-2">Advance Payment</h3>
                <p className="text-sm text-slate-300">To confirm your booking, a 20% token advance is required. The rest can be paid 7 days prior to the event.</p>
                <div className="mt-4 text-2xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-6 h-6" /> {(calculateCost.total * 0.2).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(2)} className="w-1/3 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Back</button>
                <button onClick={submitBooking} disabled={isSubmitting || !formData.bookingDate} className={`w-2/3 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)] flex justify-center items-center gap-2 ${(!formData.bookingDate || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                  {isSubmitting ? 'Processing...' : 'Pay Advance & Book'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              <h2 className="text-3xl font-bold mb-4">Booking Request Sent!</h2>
              <p className="text-slate-300 mb-8">Our Event Manager will review your request and contact you shortly.</p>
              <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                Go to Dashboard
              </button>
            </motion.div>
          )}

        </div>

        {/* Right Side: Live Cost Estimator */}
        <div className="w-full md:w-1/3 sticky top-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass dark:dark-glass p-6 rounded-3xl border border-white/10 backdrop-blur-xl bg-black/40">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <IndianRupee className="text-green-400" /> Live Cost Estimator
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Venue ({formData.area})</span>
                <span className="font-bold">₹{PRICING.area[formData.area]?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Catering ({formData.guestCount} pax)</span>
                <span className="font-bold">₹{((PRICING.catering[formData.cateringPackage] || 0) * formData.guestCount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Decor ({formData.decorationPackage})</span>
                <span className="font-bold">₹{PRICING.decoration[formData.decorationPackage]?.toLocaleString('en-IN') || 0}</span>
              </div>
              
              {formData.additionalServices.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2 block">Extras</span>
                  {formData.additionalServices.map(srv => (
                    <div key={srv} className="flex justify-between items-center text-xs text-slate-300 mb-1">
                      <span>{srv}</span>
                      <span>₹{PRICING.services[srv].toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-bold">₹{calculateCost.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400">Taxes & Fees (18%)</span>
                <span className="font-bold text-red-400">+ ₹{calculateCost.tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/20 text-xl font-bold text-yellow-500">
                <span>Total Est.</span>
                <span>₹{calculateCost.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
