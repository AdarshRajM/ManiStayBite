import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Search, Heart, X, Trash2, Star, Clock, Filter, Sparkles, ChefHat } from 'lucide-react';
import QRCodeBill from '../components/QRCodeBill';
import PaymentModal from '../components/PaymentModal';
import api from '../utils/api';

const MENU_ITEMS = [
  // 1. Fast Food 🍔
  { id: 101, name: "Veg Burger", price: 120, category: "Fast Food", type: "Veg", rating: 4.2, tags: "crispy,burger,cheese", offerTag: "Best Seller", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60" },
  { id: 102, name: "Chicken Burger", price: 180, category: "Fast Food", type: "Non-Veg", rating: 4.6, tags: "grilled,juicy", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" },
  { id: 103, name: "Cheese Burger", price: 150, category: "Fast Food", type: "Veg", rating: 4.8, customizable: true, tags: "extra cheese,comfort food", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=500&q=60" },
  { id: 104, name: "French Fries", price: 90, category: "Fast Food", type: "Veg", rating: 4.5, tags: "snack,crispy", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=60" },
  { id: 105, name: "Pizza Margherita", price: 250, category: "Fast Food", type: "Veg", rating: 4.7, customizable: true, tags: "italian,classic", offerTag: "Popular", image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=60" },
  { id: 106, name: "Pasta Alfredo", price: 200, category: "Fast Food", type: "Veg", rating: 4.3, tags: "creamy,italian", image: "https://images.unsplash.com/photo-1621996311239-531f0e5d65bb?auto=format&fit=crop&w=500&q=60" },
  { id: 107, name: "Grilled Sandwich", price: 110, category: "Fast Food", type: "Veg", rating: 4.1, tags: "toasted,snack", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=60" },
  { id: 108, name: "Hot Dog", price: 140, category: "Fast Food", type: "Non-Veg", rating: 4.0, tags: "street food,comfort", image: "https://images.unsplash.com/photo-1541214113241-212e8d2dc60a?auto=format&fit=crop&w=500&q=60" },
  { id: 109, name: "Garlic Bread", price: 120, category: "Fast Food", type: "Veg", rating: 4.6, tags: "starter,italian", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=60" },

  // 2. Beverages 🍹
  { id: 201, name: "Coca Cola", price: 50, category: "Beverages", type: "Veg", rating: 4.8, tags: "cold,refreshing", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=500&q=60" },
  { id: 202, name: "Mango Juice", price: 80, category: "Beverages", type: "Veg", rating: 4.5, tags: "fresh,fruit", image: "https://images.unsplash.com/photo-1600271886742-f049cd451b02?auto=format&fit=crop&w=500&q=60" },
  { id: 203, name: "Chocolate Shake", price: 150, category: "Beverages", type: "Veg", rating: 4.9, tags: "dessert,rich", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=60" },
  { id: 204, name: "Cold Coffee", price: 130, category: "Beverages", type: "Veg", rating: 4.7, tags: "coffee,energizing", image: "https://images.unsplash.com/photo-1461023058943-0708e5223eeb?auto=format&fit=crop&w=500&q=60" },
  { id: 205, name: "Cappuccino", price: 120, category: "Beverages", type: "Veg", rating: 4.6, tags: "hot,comfort", image: "https://images.unsplash.com/photo-1534260164206-2a3a4a72891d?auto=format&fit=crop&w=500&q=60" },

  // 3. Veg Food 🥗
  { id: 301, name: "Paneer Butter Masala", price: 280, category: "Veg Food", type: "Veg", rating: 4.9, tags: "creamy,spicy", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60" },
  { id: 302, name: "Dal Makhani", price: 220, category: "Veg Food", type: "Veg", rating: 4.8, tags: "comfort,protein", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=60" },
  { id: 303, name: "Veg Biryani", price: 250, category: "Veg Food", type: "Veg", rating: 4.5, tags: "aromatic,one-pot", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=60" },
  { id: 304, name: "Butter Naan", price: 50, category: "Veg Food", type: "Veg", rating: 4.7, tags: "bread,side", image: "https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=500&q=60" },
  { id: 305, name: "Shahi Paneer", price: 290, category: "Veg Food", type: "Veg", rating: 4.8, tags: "rich,royal", image: "/food/shahi_paneer.png" },

  // 4. Non-Veg Food 🍗
  { id: 401, name: "Butter Chicken", price: 350, category: "Non-Veg Food", type: "Non-Veg", rating: 4.9, tags: "creamy,classic", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60" },
  { id: 402, name: "Chicken Biryani", price: 320, category: "Non-Veg Food", type: "Non-Veg", rating: 4.8, tags: "spicy,aromatic", image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=500&q=60" },
  { id: 403, name: "Tandoori Chicken", price: 400, category: "Non-Veg Food", type: "Non-Veg", rating: 4.7, tags: "grilled,smoky", image: "/food/tandoori_chicken.png" },
  { id: 404, name: "Mutton Biryani", price: 450, category: "Non-Veg Food", type: "Non-Veg", rating: 4.9, tags: "festive,rich", image: "/food/mutton_biryani.png" },
  { id: 405, name: "Fish Fry", price: 300, category: "Non-Veg Food", type: "Non-Veg", rating: 4.5, tags: "crispy,seafood", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=60" },

  // 5. Chinese 🍜
  { id: 501, name: "Hakka Noodles", price: 180, category: "Chinese", type: "Veg", rating: 4.4, tags: "noodles,street food", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=60" },
  { id: 502, name: "Chilli Chicken", price: 250, category: "Chinese", type: "Non-Veg", rating: 4.7, tags: "szechuan,spicy", offerTag: "Hot Pick", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=60" },
  { id: 503, name: "Spring Rolls", price: 140, category: "Chinese", type: "Veg", rating: 4.3, tags: "starter,crispy", image: "https://images.unsplash.com/photo-1608750216255-392ef611dae3?auto=format&fit=crop&w=500&q=60" },

  // 6. South Indian 🥥
  { id: 601, name: "Masala Dosa", price: 150, category: "South Indian", type: "Veg", rating: 4.8, tags: "crispy,spicy", image: "/food/masala_dosa.png" },
  { id: 602, name: "Idli Sambhar", price: 120, category: "South Indian", type: "Veg", rating: 4.6, tags: "steamed,comfort", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60" },

  // 7. Breakfast 🍳
  { id: 701, name: "Pancakes", price: 160, category: "Breakfast", type: "Veg", rating: 4.5, tags: "sweet,morning", image: "https://images.unsplash.com/photo-1528207776546-38f36c533e4b?auto=format&fit=crop&w=500&q=60" },
  { id: 702, name: "Bread Omelette", price: 90, category: "Breakfast", type: "Non-Veg", rating: 4.3, tags: "quick,budget", image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=500&q=60" },
  { id: 703, name: "Avocado Toast", price: 210, category: "Breakfast", type: "Veg", rating: 4.6, tags: "healthy,continental", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=60" },

  // 8. Desserts 🍰
  { id: 801, name: "Gulab Jamun", price: 100, category: "Desserts", type: "Veg", rating: 4.9, tags: "sweet,classic", image: "https://images.unsplash.com/photo-1596450514735-a50d2402129c?auto=format&fit=crop&w=500&q=60" },
  { id: 802, name: "Chocolate Brownie", price: 180, category: "Desserts", type: "Veg", rating: 4.8, tags: "rich,chocolate", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=60" },
  { id: 803, name: "Rasgulla", price: 110, category: "Desserts", type: "Veg", rating: 4.9, tags: "light,spongy", image: "https://images.unsplash.com/photo-1584270354949-1a430d14ebd2?auto=format&fit=crop&w=500&q=60" },

  // 9. Healthy / Diet Food 🥙
  { id: 901, name: "Grilled Chicken Salad", price: 250, category: "Healthy", type: "Non-Veg", rating: 4.7, tags: "protein,low-calorie", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60" },
  { id: 902, name: "Protein Shake", price: 200, category: "Healthy", type: "Veg", rating: 4.6, tags: "energizing,shake", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=500&q=60" },
  { id: 903, name: "Quinoa Bowl", price: 240, category: "Healthy", type: "Veg", rating: 4.5, tags: "superfood,gluten-free", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60" },

  // 10. Kids Menu 👦
  { id: 1001, name: "Mini Burger & Smile Fries", price: 200, category: "Kids Menu", type: "Veg", rating: 4.9, tags: "fun,combo", image: "https://images.unsplash.com/photo-1632712995328-912b7f3549ce?auto=format&fit=crop&w=500&q=60" },
  { id: 1002, name: "Chocolate Milkshake", price: 120, category: "Kids Menu", type: "Veg", rating: 4.8, tags: "dessert,drink", image: "https://images.unsplash.com/photo-1524348729527-6f33b3f37a0b?auto=format&fit=crop&w=500&q=60" },

  // 11. Combo Meals 🍽️
  { id: 1101, name: "Burger + Fries + Coke", price: 250, category: "Combo Meals", type: "Veg", rating: 4.8, tags: "value meal", offerTag: "Combo Offer", image: "https://images.unsplash.com/photo-1594212884260-0a37de5cc235?auto=format&fit=crop&w=500&q=60" },
  { id: 1102, name: "Chicken Biryani + Coke", price: 350, category: "Combo Meals", type: "Non-Veg", rating: 4.9, tags: "full meal", offerTag: "Family Pack", image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=500&q=60" },
  { id: 1103, name: "Paneer Wrap + Salad", price: 299, category: "Combo Meals", type: "Veg", rating: 4.6, tags: "light lunch", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=60" },

  // 12. Buffet Packages
  { id: 1201, name: "Grand Veg Buffet", price: 799, category: "Buffet Packages", type: "Veg", rating: 4.9, tags: "all-you-can-eat", offerTag: "Weekend Special", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60" },
  { id: 1202, name: "Royal Non-Veg Buffet", price: 999, category: "Buffet Packages", type: "Non-Veg", rating: 4.9, tags: "banquet,celebration", offerTag: "Premium Buffet", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60" },
];

const CATEGORIES = ["All", "Fast Food", "Beverages", "Veg Food", "Non-Veg Food", "Chinese", "South Indian", "Breakfast", "Desserts", "Healthy", "Kids Menu", "Combo Meals", "Buffet Packages"];

const TOP_OFFERS = [
  { id: 1, title: 'Happy Hour', description: '20% off on all beverages between 5pm and 7pm.' },
  { id: 2, title: 'Family Feast', description: 'Order buffet and get free dessert.' },
  { id: 3, title: 'Weekend Combo', description: 'Save ₹50 on burger + fries + drink.' },
];

const SUBSCRIPTIONS = [
  { id: 1, name: 'Meal Plan Plus', price: 999, benefits: 'Daily breakfast + lunch for 7 days' },
  { id: 2, name: 'Room Service Premium', price: 1499, benefits: 'Unlimited snacks and beverages for 5 days' },
];

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Veg, Non-Veg, Premium, Spicy, Recommended
  
  // Customization Modal State
  const [customItem, setCustomItem] = useState(null);
  const [customizations, setCustomizations] = useState({ extraCheese: false, spicy: false, noOnion: false });

  // Live Kitchen Status
  const [kitchenStatus, setKitchenStatus] = useState("Preparing"); // Preparing, Cooking, Packed, Delivered

  useEffect(() => {
    const savedWishlist = localStorage.getItem('staybite_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const searchable = [item.name, item.category, item.tags, item.offerTag].filter(Boolean).join(' ').toLowerCase();
      const matchSearch = searchable.includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchFilter = activeFilter === 'All' || 
                          (activeFilter === 'Veg' && item.type === 'Veg') || 
                          (activeFilter === 'Non-Veg' && item.type === 'Non-Veg') ||
                          (activeFilter === 'Premium' && item.price >= 300) ||
                          (activeFilter === 'Spicy' && item.tags?.includes('spicy')) ||
                          (activeFilter === 'Recommended' && item.offerTag === 'Popular');
      return matchSearch && matchCat && matchFilter;
    });
  }, [searchQuery, activeCategory, activeFilter]);

  const handleAddToCart = (item) => {
    if (item.customizable) {
      setCustomItem(item);
    } else {
      setCart([...cart, { ...item, finalPrice: item.price, addons: [] }]);
    }
  };

  const confirmCustomAddToCart = () => {
    let addonPrice = 0;
    let addons = [];
    if (customizations.extraCheese) { addonPrice += 40; addons.push("Extra Cheese"); }
    if (customizations.spicy) { addons.push("Make it Spicy"); }
    if (customizations.noOnion) { addons.push("No Onion/Garlic"); }
    
    setCart([...cart, { ...customItem, finalPrice: customItem.price + addonPrice, addons }]);
    setCustomItem(null);
    setCustomizations({ extraCheese: false, spicy: false, noOnion: false });
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.find(w => w.id === item.id);
    let newWishlist = exists ? wishlist.filter(w => w.id !== item.id) : [...wishlist, item];
    setWishlist(newWishlist);
    localStorage.setItem('staybite_wishlist', JSON.stringify(newWishlist));
  };

  const processPaymentSuccess = async () => {
    setShowPayment(false);
    try {
      const payload = {
        orderType: "ROOM_SERVICE",
        totalAmount: cart.reduce((s, i) => s + i.finalPrice, 0),
        itemsDetails: JSON.stringify(cart),
        paymentStatus: "SUCCESS"
      };
      await api.post('/orders/create', payload);
      
      const mockToken = "FOOD" + Math.floor(1000 + Math.random() * 9000);
      setTokenInfo({ tokenNumber: mockToken, amount: payload.totalAmount, items: cart.length });
      setCart([]);
      
      // Simulate kitchen progress
      setKitchenStatus("Cooking");
      setTimeout(() => setKitchenStatus("Packed"), 5000);
      setTimeout(() => setKitchenStatus("Delivered"), 10000);
    } catch(err) {
      console.error("Order failed:", err);
    }
  };

  if (tokenInfo) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 gap-8">
        <QRCodeBill tokenNumber={tokenInfo.tokenNumber} amount={tokenInfo.amount} items={tokenInfo.items} />
        
        {/* Live Kitchen Tracker */}
        <div className="glass dark:dark-glass p-8 rounded-3xl w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
            <ChefHat className="text-primary-500" /> Live Kitchen Tracker
          </h2>
          <div className="flex justify-between items-center relative px-8">
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
            
            {["Preparing", "Cooking", "Packed", "Delivered"].map((status, idx) => {
              const stages = ["Preparing", "Cooking", "Packed", "Delivered"];
              const currentIndex = stages.indexOf(kitchenStatus);
              const isPast = idx <= currentIndex;
              const isActive = idx === currentIndex;
              
              return (
                <div key={status} className="flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ scale: 0.8 }} animate={{ scale: isActive ? 1.2 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${isPast ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-500'}`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </motion.div>
                  <span className={`text-sm font-bold ${isActive ? 'text-green-500' : 'text-slate-500'}`}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & AI Recommendations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-orange-500">
            The Ultimate Dining
          </h1>
          <p className="text-slate-500 flex flex-wrap items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> AI suggests: <span className="font-bold text-white">Pizza + Cold Coffee Combo</span> for your next room order.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {TOP_OFFERS.map(offer => (
              <div key={offer.id} className="rounded-3xl border border-primary-500/20 bg-primary-500/5 px-4 py-3 text-sm text-white/90">
                <span className="font-bold">{offer.title}:</span> {offer.description}
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass dark:dark-glass px-6 py-3 rounded-full flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart className="w-5 h-5 text-primary-500" />
          <span className="font-bold">{cart.length} Items (₹{cartTotal})</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search pizza, spicy food, breakfast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {['All', 'Veg', 'Non-Veg', 'Premium', 'Spicy', 'Recommended'].map(filter => (
            <button 
              key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeFilter === filter ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'glass dark:dark-glass hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" /> {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-3 overflow-x-auto pb-6 mb-8 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-slate-800 text-white dark:bg-white dark:text-black' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredMenu.map((item, i) => (
            <motion.div 
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass dark:dark-glass rounded-[2rem] overflow-hidden group flex flex-col border border-white/10 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/20 transition-all"
            >
              <div className="h-48 overflow-hidden relative p-2">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-110" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className={`w-6 h-6 rounded bg-white flex items-center justify-center shadow-md p-1 border-2 ${item.type === 'Veg' ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-3 h-3 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  {item.price >= 300 && <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase">Premium</span>}
                </div>

                <button 
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wishlist.find(w => w.id === item.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-yellow-500" /> {item.rating}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{item.category}</p>
                  {item.tags && (
                    <p className="text-xs text-slate-400 mb-2">{item.tags.split(',').map(tag => tag.trim()).join(' • ')}</p>
                  )}
                  {item.offerTag && (
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white bg-primary-500 px-3 py-1 rounded-full mb-3">
                      {item.offerTag}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-2xl font-black text-primary-500">₹{item.price}</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center font-bold shadow-sm group-hover:scale-110"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMenu.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-2xl font-bold mb-2">No food items found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUBSCRIPTIONS.map(plan => (
          <div key={plan.id} className="glass dark:dark-glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-slate-400 mb-4">{plan.benefits}</p>
            <div className="flex items-end justify-between gap-4">
              <span className="text-3xl font-black text-primary-500">₹{plan.price}</span>
              <button className="px-5 py-3 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-colors">Subscribe</button>
            </div>
          </div>
        ))}
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {customItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass dark:dark-glass p-8 rounded-3xl w-full max-w-md border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Customize Order</h3>
                <button onClick={() => setCustomItem(null)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
              </div>
              <p className="text-lg font-bold text-primary-500 mb-6">{customItem.name} - ₹{customItem.price}</p>
              
              <div className="space-y-4 mb-8">
                <label className="flex items-center justify-between p-4 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/5">
                  <span className="font-bold">Extra Cheese (+₹40)</span>
                  <input type="checkbox" className="w-5 h-5 accent-primary-500" checked={customizations.extraCheese} onChange={() => setCustomizations({...customizations, extraCheese: !customizations.extraCheese})} />
                </label>
                <label className="flex items-center justify-between p-4 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/5">
                  <span className="font-bold">Make it Spicy (Free)</span>
                  <input type="checkbox" className="w-5 h-5 accent-primary-500" checked={customizations.spicy} onChange={() => setCustomizations({...customizations, spicy: !customizations.spicy})} />
                </label>
                <label className="flex items-center justify-between p-4 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/5">
                  <span className="font-bold">No Onion / Garlic (Jain)</span>
                  <input type="checkbox" className="w-5 h-5 accent-primary-500" checked={customizations.noOnion} onChange={() => setCustomizations({...customizations, noOnion: !customizations.noOnion})} />
                </label>
              </div>

              <button onClick={confirmCustomAddToCart} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg">
                Confirm & Add to Cart
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart /> Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <ShoppingCart className="w-24 h-24 mb-6 opacity-20" />
                    <p className="text-xl font-bold">Your cart is empty.</p>
                    <p className="text-sm mt-2">Looks like you haven't added anything yet.</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 glass dark:dark-glass rounded-2xl border border-white/5">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold leading-tight">{item.name}</h4>
                          {item.addons?.length > 0 && (
                            <p className="text-xs text-slate-400 mt-1">{item.addons.join(", ")}</p>
                          )}
                        </div>
                        <p className="text-primary-500 font-bold text-lg">₹{item.finalPrice}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="p-2 h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-500/20 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between items-center mb-6 text-2xl">
                    <span className="font-bold text-slate-400">Total</span>
                    <span className="font-black text-primary-500">₹{cartTotal}</span>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); setShowPayment(true); }} className="w-full py-5 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-[1.02]">
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showPayment && (
        <PaymentModal 
          amount={cartTotal} 
          onClose={() => setShowPayment(false)} 
          onSuccess={processPaymentSuccess} 
        />
      )}
    </div>
  );
}
