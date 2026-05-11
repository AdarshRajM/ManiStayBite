import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Search, Heart, X, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

import QRCodeBill from '../components/QRCodeBill';
import PaymentModal from '../components/PaymentModal';
import api from '../utils/api';

const MENU_ITEMS = [
  { id: 1, name: "Gulab Jamun", price: 150, image: "https://images.unsplash.com/photo-1596450514735-a50d2402129c?auto=format&fit=crop&w=500&q=60", category: "Sweet" },
  { id: 2, name: "Rasmalai", price: 200, image: "https://images.unsplash.com/photo-1550993414-cb9287a55cfa?auto=format&fit=crop&w=500&q=60", category: "Sweet" },
  { id: 3, name: "Paneer Tikka", price: 300, image: "https://images.unsplash.com/photo-1567158442220-4a81ba082163?auto=format&fit=crop&w=500&q=60", category: "Starter" },
  { id: 4, name: "Veg Biryani", price: 250, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=60", category: "Main Course" },
  { id: 5, name: "Kaju Katli", price: 400, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=60", category: "Sweet" },
  { id: 6, name: "Crispy Samosa", price: 50, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=60", category: "Snack" },
  { id: 7, name: "Mango Lassi", price: 90, image: "https://images.unsplash.com/photo-1574542459039-4d642b36e897?auto=format&fit=crop&w=500&q=60", category: "Drink" },
  { id: 8, name: "Butter Chicken", price: 350, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60", category: "Main Course" },
  { id: 9, name: "Dal Makhani", price: 220, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=60", category: "Main Course" },
  { id: 10, name: "Garlic Naan", price: 60, image: "https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=500&q=60", category: "Bread" },
  { id: 11, name: "Hot Jalebi", price: 120, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60", category: "Sweet" },
  { id: 12, name: "Cold Coffee", price: 150, image: "https://images.unsplash.com/photo-1461023058943-0708e5223eeb?auto=format&fit=crop&w=500&q=60", category: "Drink" },
  { id: 13, name: "Tandoori Chicken Platter", price: 450, image: "/food/tandoori_chicken.png", category: "Starter" },
  { id: 14, name: "Shahi Paneer", price: 280, image: "/food/shahi_paneer.png", category: "Main Course" },
  { id: 15, name: "Hyderabadi Mutton Biryani", price: 400, image: "/food/mutton_biryani.png", category: "Main Course" },
  { id: 16, name: "Crispy Masala Dosa", price: 180, image: "/food/masala_dosa.png", category: "Main Course" },
];

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [splitCount, setSplitCount] = useState(1);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('staybite_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.find(w => w.id === item.id);
    let newWishlist;
    if (exists) {
      newWishlist = wishlist.filter(w => w.id !== item.id);
    } else {
      newWishlist = [...wishlist, item];
    }
    setWishlist(newWishlist);
    localStorage.setItem('staybite_wishlist', JSON.stringify(newWishlist));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckingOut(true);
    setShowPayment(true);
  };

  const processPaymentSuccess = async () => {
    setShowPayment(false);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = useLoyaltyPoints ? total - 50 : total;
    try {
      const mockToken = "STB" + Math.floor(1000 + Math.random() * 9000);
      setTokenInfo({ tokenNumber: mockToken, amount: finalTotal, items: cart.length });
      setCart([]);
    } catch(err) {
      console.error(err);
    }
  };

  if (tokenInfo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <QRCodeBill tokenNumber={tokenInfo.tokenNumber} amount={tokenInfo.amount} items={tokenInfo.items} />
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Our Premium Menu</h1>
          <p className="text-slate-500">Discover our exquisite culinary offerings.</p>
        </div>
        <div className="glass dark:dark-glass px-6 py-3 rounded-full flex items-center gap-3 relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold">{cart.length} Items</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              {cart.length}
            </span>
          )}
        </div>
      </div>
      
      {/* Search and Mood AI Filter */}
      <div className="mb-12 space-y-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search foods, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">AI Mood Recommendation</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['All', 'Romantic', 'Party', 'Gym'].map(mood => (
              <button 
                key={mood}
                onClick={() => setSearchQuery(mood === 'All' ? '' : mood)}
                className="px-6 py-2 rounded-full border-2 border-primary-500 font-bold transition-all hover:bg-primary-500 hover:text-white dark:text-white"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {Object.entries(
        filteredMenu.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {})
      ).map(([category, items]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">{category}s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="glass dark:dark-glass rounded-3xl overflow-hidden group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    {item.category}
                  </div>
                  <button 
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.find(w => w.id === item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <span className="text-xl font-bold text-primary-500">₹{item.price}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full mt-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
                  >
                    <Plus className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark-bg z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart /> Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center p-3 glass dark:dark-glass rounded-xl">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-primary-500 font-bold">₹{item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="mb-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-primary-600 dark:text-primary-400">Loyalty Points</h3>
                      <p className="text-xs text-slate-500">Available: 500 (₹50)</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500" checked={useLoyaltyPoints} onChange={() => setUseLoyaltyPoints(!useLoyaltyPoints)} />
                      <span className="font-bold text-sm">Apply</span>
                    </label>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-xl">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary-500">₹{useLoyaltyPoints ? cartTotal - 50 : cartTotal}</span>
                  </div>

                  <div className="mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <label className="text-sm font-bold block mb-2">Split Bill (Group Checkout)</label>
                    <div className="flex gap-4 items-center">
                      <input type="number" min="1" max="10" value={splitCount} onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)} className="w-20 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center outline-none" />
                      <span className="text-sm font-bold text-slate-500">
                        ₹{splitCount > 0 ? ((useLoyaltyPoints ? cartTotal - 50 : cartTotal) / splitCount).toFixed(2) : 0} / person
                      </span>
                    </div>
                  </div>

                  <button onClick={handleCheckout} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showPayment && (
        <PaymentModal 
          amount={useLoyaltyPoints ? cartTotal - 50 : cartTotal} 
          onClose={() => {setShowPayment(false); setIsCheckingOut(false);}} 
          onSuccess={processPaymentSuccess} 
        />
      )}
    </div>
  );
}
