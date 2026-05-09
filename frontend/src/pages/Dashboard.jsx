import { Calendar as CalendarIcon, CreditCard, ShoppingBag, User, Download, QrCode, ThermometerSun, Lightbulb, Tv, Power, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AadhaarUpload from '../components/AadhaarUpload';
import SkeletonLoader from '../components/SkeletonLoader';
import PaymentModal from '../components/PaymentModal';
import BookingCalendar from '../components/BookingCalendar';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';

const STATS = [
  { label: "Active Bookings", value: "2", icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Food Orders", value: "12", icon: ShoppingBag, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Total Spent", value: "₹15,400", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  
  // IoT Smart Room State
  const [acTemp, setAcTemp] = useState(22);
  const [lightsOn, setLightsOn] = useState(true);
  const [tvOn, setTvOn] = useState(false);

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.text("ManiStayBite SaaS - GST Invoice", 20, 20);
    doc.text("Customer: Adarsh Raj Mani", 20, 30);
    doc.text("Order: Deluxe Room & Rasmalai", 20, 40);
    doc.text("Total Paid: INR 15,400", 20, 50);
    doc.save("manistaybite_receipt.pdf");
  };

  const realName = localStorage.getItem('realName') || 'Adarsh';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
          {realName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {realName.split(' ')[0]}!</h1>
          <p className="text-slate-500">Here is your activity overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {STATS.map((stat, i) => (
          loading ? (
            <div key={`loader-${i}`} className="h-32"><SkeletonLoader /></div>
          ) : (
            <motion.div 
              key={`stat-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass dark:dark-glass p-6 rounded-3xl flex items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </motion.div>
          )
        ))}
      </div>

      <div className="glass dark:dark-glass rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Ordered Rasmalai</h4>
                <p className="text-sm text-slate-500">Today at 2:30 PM</p>
              </div>
            </div>
            <span className="font-bold">₹200</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Booked Deluxe Room</h4>
                <p className="text-sm text-slate-500">May 10 - May 12</p>
              </div>
            </div>
            <span className="font-bold text-green-500">Confirmed</span>
          </div>

          <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Pending Payment</h4>
                <p className="text-sm text-slate-500">Suite Room Upgrade</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600"
            >
              Pay INR 5000
            </button>
          </div>
        </div>

        {showPayment && (
          <PaymentModal 
            amount={5000} 
            onClose={() => setShowPayment(false)} 
            onSuccess={(method) => {
              alert(`Payment of 5000 via ${method} successful!`);
              setShowPayment(false);
            }} 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* AI Personalized Recommendations */}
        <div className="lg:col-span-3 mb-4">
          <div className="glass dark:dark-glass p-8 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary-500/10 to-teal-500/10 border border-primary-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="flex-1 relative z-10">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Sparkles className="text-primary-500" /> AI Personalized Recommendations</h2>
              <p className="text-slate-500 mb-6">Based on your previous 4 stays, we have curated these quick options for you.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-primary-500/50">
                  <div className="w-16 h-16 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0"><ShoppingBag className="w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold">Your Favorite Order</h4>
                    <p className="text-sm text-slate-500">Chicken Biryani & Coke</p>
                    <span className="text-xs font-bold text-primary-500 mt-1 block">1-Click Order</span>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-primary-500/50">
                  <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0"><CalendarIcon className="w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold">Usual Room</h4>
                    <p className="text-sm text-slate-500">Deluxe Sea View Suite</p>
                    <span className="text-xs font-bold text-primary-500 mt-1 block">Re-book</span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/ai-planner" className="px-6 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg flex items-center gap-2 shrink-0">
              Plan Next Trip <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* IoT Smart Room Dashboard */}
        <div className="glass dark:dark-glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Power className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Power className="text-primary-500" /> IoT Smart Room Controls</h2>
          <p className="text-sm text-slate-500 mb-8">Control your physical room appliances directly from the app.</p>
          
          <div className="space-y-6 relative z-10">
            {/* AC Control */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><ThermometerSun className="w-5 h-5" /></div>
                  <span className="font-bold">Air Conditioning</span>
                </div>
                <span className="text-xl font-bold text-blue-500">{acTemp}°C</span>
              </div>
              <input type="range" min="16" max="30" value={acTemp} onChange={(e) => setAcTemp(e.target.value)} className="w-full accent-blue-500" />
            </div>

            {/* Smart Lights */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${lightsOn ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-500/20 text-slate-500'}`}><Lightbulb className="w-5 h-5" /></div>
                <span className="font-bold">Smart Ambient Lights</span>
              </div>
              <button onClick={() => setLightsOn(!lightsOn)} className={`w-14 h-7 rounded-full p-1 transition-colors ${lightsOn ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${lightsOn ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Smart TV */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${tvOn ? 'bg-purple-500/20 text-purple-500' : 'bg-slate-500/20 text-slate-500'}`}><Tv className="w-5 h-5" /></div>
                <span className="font-bold">Smart TV Power</span>
              </div>
              <button onClick={() => setTvOn(!tvOn)} className={`w-14 h-7 rounded-full p-1 transition-colors ${tvOn ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${tvOn ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass dark:dark-glass rounded-3xl p-8 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><QrCode className="text-primary-500" /> Smart Room Entry</h2>
            <div className="bg-white p-4 rounded-xl shadow-xl flex items-center justify-center w-[150px] h-[150px] border-4 border-dashed border-slate-300">
              <span className="text-slate-400 font-bold">QR Code</span>
            </div>
            <p className="mt-4 text-sm font-bold text-primary-500">Scan at the door to unlock</p>
          </div>

          <div className="glass dark:dark-glass rounded-3xl p-8 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Download className="text-primary-500" /> Invoices & GST</h2>
            <button 
              onClick={downloadReceipt}
              className="w-full py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-primary-500/25"
            >
              <Download className="w-5 h-5" /> Download Latest Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <BookingCalendar />
        <AadhaarUpload />
      </div>
    </div>
  );
}
