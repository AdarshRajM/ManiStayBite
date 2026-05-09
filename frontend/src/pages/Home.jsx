import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Utensils, MapPin, Navigation, Building, Fuel } from 'lucide-react';
import Hero3D from '../components/Hero3D';

const REVIEWS = [
  { id: 1, name: "Rahul Verma", text: "Room bahut clean tha aur food awesome tha.", rating: 5 },
  { id: 2, name: "Priya Sharma", text: "Best luxury experience! The swimming pool and spa are top notch.", rating: 5 },
  { id: 3, name: "Amit Kumar", text: "Food ordering is super fast. QR code billing is very convenient.", rating: 4 },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Hero3D />
      
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 drop-shadow-2xl"
        >
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500 dark:from-primary-400 dark:to-teal-200">ManiStayBite</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-xl text-slate-800 dark:text-slate-200 mb-10 font-medium"
        >
          Smart Hotel, Food & Event Management System. Experience premium hospitality with AI-powered services.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <Link to="/order" className="px-8 py-4 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/50 flex items-center gap-2">
            <Utensils className="w-5 h-5" /> Order Food
          </Link>
          <Link to="/rooms" className="px-8 py-4 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md text-slate-900 dark:text-white font-bold border border-slate-900/10 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-all flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Book Room
          </Link>
        </motion.div>
      </div>

      <div className="bg-slate-50 dark:bg-dark-bg py-24 relative z-10 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* New Premium Amenities Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Amenities</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Discover world-class services designed for your ultimate relaxation and convenience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div whileHover={{ scale: 1.02 }} className="glass dark:dark-glass rounded-3xl overflow-hidden group cursor-pointer relative">
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" alt="Spa" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Luxury Spa</h3>
                <p className="text-slate-200">Rejuvenate your senses with our signature wellness therapies.</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="glass dark:dark-glass rounded-3xl overflow-hidden group cursor-pointer relative">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Dining" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Fine Dining</h3>
                <p className="text-slate-200">Reserve a table and experience exquisite culinary artistry.</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Real reviews from our verified guests who enjoyed their stay and dining experience at ManiStayBite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass dark:dark-glass p-8 rounded-3xl"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Verified Booking
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Smart Nearby Services Simulator */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"><Navigation className="w-8 h-8 text-primary-500" /> Smart Nearby Services</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Explore essential services around the hotel. Tap a location for quick navigation.</p>
            </div>
            
            <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-200 dark:bg-slate-900">
              {/* Simulated Map Background */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80" alt="Map View" className="w-full h-full object-cover opacity-50 grayscale" />
              
              {/* Map Filter Badge */}
              <div className="absolute top-6 left-6 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Competitor Hotels Hidden</span>
              </div>
              
              {/* Interactive Map Pins */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative group cursor-pointer">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-bold text-sm">ManiStayBite (You)</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/4 left-1/4 z-10">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <span className="font-bold">H</span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <p className="font-bold text-sm text-red-500">City Hospital</p>
                    <p className="text-xs text-slate-500">2.5 km away • Open 24/7</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 z-10">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <span className="font-bold">₹</span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <p className="font-bold text-sm text-green-500">HDFC Bank ATM</p>
                    <p className="text-xs text-slate-500">0.5 km away</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 right-1/3 z-10">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <p className="font-bold text-sm text-orange-500">Indian Oil Petrol Pump</p>
                    <p className="text-xs text-slate-500">1.2 km away</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
