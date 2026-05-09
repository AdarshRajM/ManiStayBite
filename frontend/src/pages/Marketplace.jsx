import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Flower2, Pill, Camera, Music, CheckCircle, Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'gifts', name: 'Gifts & Flowers', icon: Flower2, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'pharmacy', name: 'Pharmacy (10 Min)', icon: Pill, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'photo', name: 'Freelance Photographer', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'dj', name: 'Freelance DJ', icon: Music, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const ITEMS = [
  { id: 1, category: 'gifts', name: 'Premium Red Roses Bouquet', price: 1500, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80', vendor: 'Local Florist' },
  { id: 2, category: 'gifts', name: 'Chocolate Truffle Cake (1kg)', price: 1200, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', vendor: 'Sweet Bakery' },
  { id: 3, category: 'pharmacy', name: 'First Aid Kit & Basics', price: 450, image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80', vendor: 'Apollo Pharmacy' },
  { id: 4, category: 'photo', name: 'Couple Photoshoot (2 Hours)', price: 5000, image: 'https://images.unsplash.com/photo-1554048667-73d4af9abf18?w=500&q=80', vendor: 'Rahul Portraits' },
  { id: 5, category: 'dj', name: 'Party DJ Setup (4 Hours)', price: 8000, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80', vendor: 'DJ Snake Clone' },
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('gifts');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredItems = ITEMS.filter(item => item.category === activeTab);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => {
      setCart([]);
      setShowCheckout(false);
      alert("Order placed! Vendor/Freelancer has been notified.");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3"><ShoppingBag className="w-10 h-10 text-primary-500" /> Hyperlocal Marketplace</h1>
          <p className="text-slate-500 text-lg">Order gifts, medicines, or book freelance creators directly to your room.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search for anything..." className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap font-bold transition-all ${activeTab === cat.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <div className={`p-2 rounded-xl ${cat.bg} ${cat.color}`}><cat.icon className="w-5 h-5" /></div>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass dark:dark-glass rounded-3xl overflow-hidden flex flex-col">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-primary-500 font-bold mb-2">By {item.vendor}</p>
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-xl">₹{item.price}</span>
                    <button onClick={() => addToCart(item)} className="px-4 py-2 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-colors">
                      {item.category === 'photo' || item.category === 'dj' ? 'Book' : 'Add'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="glass dark:dark-glass rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="text-primary-500" /> Cart ({cart.length})</h2>
          {cart.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="truncate pr-4 text-sm font-medium">{item.name}</div>
                    <div className="font-bold shrink-0">₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary-500">₹{cart.reduce((a, b) => a + b.price, 0)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={showCheckout} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/25 flex justify-center items-center gap-2">
                {showCheckout ? <span className="animate-pulse">Processing...</span> : <>Checkout <CheckCircle className="w-5 h-5" /></>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
