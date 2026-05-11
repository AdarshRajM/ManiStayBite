import { Plus, Utensils, BedDouble, Users, Ticket, Megaphone, X, Leaf, Zap, ShieldCheck, TrendingUp, Star, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function HotelOwnerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTasks, setEmployeeTasks] = useState({
    menuManager: false,
    pricingManager: false,
    orderManager: false,
    housekeeping: false,
    receptionist: false,
  });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [showEmployeeSettings, setShowEmployeeSettings] = useState(false);

  // Modals state
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', price: '', image: '' });
  
  const [coupons, setCoupons] = useState([{ code: 'WELCOME50', discount: 50 }]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });

  const [offers, setOffers] = useState([{ title: 'Free Dessert', description: 'Get a free Gulab Jamun on orders above ₹500!' }]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', description: '' });

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Manager' });

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), duration);
  };

  const fetchData = async () => {
    try {
      const [foodRes, roomRes, employeeRes] = await Promise.all([
        api.get('/owner/food'),
        api.get('/owner/rooms'),
        api.get('/owner/employees'),
      ]);

      if (foodRes.data) setFoods(foodRes.data);
      if (roomRes.data) setRooms(roomRes.data);
      if (employeeRes.data) setEmployees(employeeRes.data);
      setFallbackData();
    } catch (err) {
      console.warn('Owner fetch failed, using local fallback data.', err);
      setFallbackData();
    }
  };

  const setFallbackData = () => {
    setEmployees(emp => emp.length ? emp : [{ id: "EMP1", name: "Raju", role: "Chef", permissions: 'MENU_MANAGER,PRICING_MANAGER' }]);
    setOrders([{ id: "STB1025", status: "PREPARING", assignedTo: null }]);
    if (foods.length === 0) {
      setFoods([
        { foodName: "Gulab Jamun", price: 150, foodId: 1 },
        { foodName: "Paneer Tikka", price: 300, foodId: 2 }
      ]);
    }
    if (rooms.length === 0) {
      setRooms([
        { roomType: "Deluxe Suite (101)", status: "AVAILABLE" },
        { roomType: "Single AC (102)", status: "BOOKED" }
      ]);
    }
  };

  const assignOrder = (orderId, empName) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, assignedTo: empName } : o));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (newFood.name && newFood.price) {
      try {
        const response = await api.post('/owner/food', {
          foodName: newFood.name,
          price: Number(newFood.price),
          imageUrl: newFood.image,
        });
        setFoods([...foods, response.data]);
        showToast('Menu item added successfully.');
      } catch (err) {
        console.error('Error adding food item', err);
        setFoods([...foods, { foodName: newFood.name, price: Number(newFood.price), imageUrl: newFood.image }]);
        showToast('Menu item added locally. Backend unavailable.');
      }
      setShowFoodModal(false);
      setNewFood({ name: '', price: '', image: '' });
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (newStaff.name && newStaff.email) {
      try {
        const response = await api.post('/owner/employees', {
          name: newStaff.name,
          email: newStaff.email,
          password: 'welcome123',
        });
        setEmployees([...employees, response.data]);
        showToast(`Created ${newStaff.role} staff account.`);
      } catch (err) {
        console.error('Error creating staff', err);
        setEmployees([...employees, { id: `EMP${Date.now()}`, name: newStaff.name, role: newStaff.role }]);
        showToast('Staff created locally. Backend unavailable.');
      }
      setShowAddStaff(false);
      setNewStaff({ name: '', email: '', role: 'Manager' });
    }
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeSettings(true);
    const permissions = employee.permissions?.split(',') || [];
    setEmployeeTasks({
      menuManager: permissions.includes('MENU_MANAGER'),
      pricingManager: permissions.includes('PRICING_MANAGER'),
      orderManager: permissions.includes('ORDER_MANAGER'),
      housekeeping: permissions.includes('HOUSEKEEPING'),
      receptionist: permissions.includes('RECEPTIONIST'),
    });
  };

  const saveEmployeePermissions = async () => {
    if (!selectedEmployee) {
      showToast('Please select an employee first.');
      return;
    }

    const permissions = [
      employeeTasks.menuManager && 'MENU_MANAGER',
      employeeTasks.pricingManager && 'PRICING_MANAGER',
      employeeTasks.orderManager && 'ORDER_MANAGER',
      employeeTasks.housekeeping && 'HOUSEKEEPING',
      employeeTasks.receptionist && 'RECEPTIONIST',
    ].filter(Boolean).join(',');

    try {
      const response = await api.put(`/owner/employees/${selectedEmployee.id}/permissions`, {
        permissions,
        assignedTasks: permissions,
      });
      setEmployees(employees.map(emp => emp.id === response.data.id ? response.data : emp));
      showToast('Employee task permissions updated.');
    } catch (err) {
      console.error('Error saving employee permissions', err);
      setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? { ...emp, permissions } : emp));
      showToast('Employee permissions updated locally. Backend unavailable.');
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if(newCoupon.code && newCoupon.discount) {
      setCoupons([...coupons, { code: newCoupon.code, discount: newCoupon.discount }]);
      setShowCouponModal(false);
      setNewCoupon({ code: '', discount: '' });
    }
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    if(newOffer.title && newOffer.description) {
      setOffers([...offers, { title: newOffer.title, description: newOffer.description }]);
      setShowOfferModal(false);
      setNewOffer({ title: '', description: '' });
    }
  };

  const data = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  const energyData = [
    { name: 'Mon', electricity: 400, water: 240 },
    { name: 'Tue', electricity: 300, water: 139 },
    { name: 'Wed', electricity: 200, water: 980 },
    { name: 'Thu', electricity: 278, water: 390 },
    { name: 'Fri', electricity: 189, water: 480 },
    { name: 'Sat', electricity: 239, water: 380 },
    { name: 'Sun', electricity: 349, water: 430 },
  ];

  const healthData = [
    { name: 'Cleanliness', value: 92, color: '#10b981' },
    { name: 'Food Quality', value: 88, color: '#3b82f6' },
    { name: 'Service', value: 95, color: '#8b5cf6' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-5 py-4 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          {toastMessage}
        </div>
      )}
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Hotel Management Dashboard</h1>
        <p className="text-slate-500">Manage your menu, rooms, offers, and employees.</p>
      </div>

      {/* AI Smart Pricing Alert */}
      <div className="mb-8 p-4 bg-gradient-to-r from-primary-500/10 to-transparent border-l-4 border-primary-500 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500 text-white rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-lg">AI Pricing Prediction</h3>
            <p className="text-slate-600 dark:text-slate-300">High demand detected for upcoming weekend. Recommended price increase: <span className="font-bold text-primary-500">+20%</span></p>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary-500 text-white font-bold rounded-lg shadow-lg hover:bg-primary-600 transition-colors">Apply New Pricing</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass dark:dark-glass p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="text-yellow-500" /> Energy & Carbon Footprint</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis />
                <Tooltip wrapperClassName="dark:bg-slate-800 dark:text-white rounded-xl" />
                <Line type="monotone" dataKey="electricity" stroke="#eab308" strokeWidth={3} name="Electricity (kWh)" />
                <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} name="Water (L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass dark:dark-glass p-6 rounded-3xl flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="text-green-500" /> AI Health Score</h2>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {healthData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">92%</span>
            </div>
          </div>
          <div className="w-full mt-4 space-y-2">
            {healthData.map(item => (
              <div key={item.name} className="flex justify-between text-sm font-bold">
                <span className="text-slate-500 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div> {item.name}
                </span>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Reputation System */}
        <div className="lg:col-span-3 glass dark:dark-glass p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center justify-center p-4">
            <Star className="w-10 h-10 text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold">4.9 / 5.0</h3>
            <p className="text-slate-500 text-sm">Global Hotel Ranking</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-green-500">Top 5%</h3>
            <p className="text-slate-500 text-sm">in Mumbai Region</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-bold text-primary-500">1,240</h3>
            <p className="text-slate-500 text-sm">Verified Reviews</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Manage Food */}
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Utensils className="text-primary-500" /> Menu Items</h2>
            <button onClick={() => setShowFoodModal(true)} className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {foods.map((f, i) => (
              <div key={i} className="flex justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                <span className="font-medium">{f.foodName}</span>
                <span className="text-primary-500 font-bold">₹{f.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Permissions */}
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-primary-500" /> Employee Access</h2>
            <button onClick={() => setShowEmployeeSettings(!showEmployeeSettings)} className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition-colors">
              {showEmployeeSettings ? 'Hide Settings' : 'Configure Tasks'}
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {employees.map((emp) => (
              <button key={emp.id} onClick={() => selectEmployee(emp)} className={`w-full text-left p-4 rounded-2xl border ${selectedEmployee?.id === emp.id ? 'border-primary-500 bg-primary-500/10' : 'border-slate-200 dark:border-slate-700'} hover:border-primary-500 transition-colors`}>
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="font-bold">{emp.name}</p>
                    <p className="text-sm text-slate-500">{emp.role}</p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700">Select</div>
                </div>
                {emp.permissions && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white">
                    {emp.permissions.split(',').map((perm) => perm && (
                      <span key={perm} className="bg-primary-500 px-2 py-1 rounded-full">{perm.replace('_', ' ')}</span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {showEmployeeSettings && selectedEmployee && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
              <h3 className="font-bold text-lg">Assign tasks for {selectedEmployee.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'menuManager', label: 'Menu & Upload Management' },
                  { key: 'pricingManager', label: 'Price Fixing Authority' },
                  { key: 'orderManager', label: 'Order Coordination' },
                  { key: 'housekeeping', label: 'Housekeeping Support' },
                  { key: 'receptionist', label: 'Reception / Check-in' },
                ].map(option => (
                  <label key={option.key} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl cursor-pointer">
                    <input type="checkbox" checked={employeeTasks[option.key]} onChange={() => setEmployeeTasks(prev => ({ ...prev, [option.key]: !prev[option.key] }))} className="h-4 w-4 accent-primary-500" />
                    <span className="text-slate-700 dark:text-slate-200">{option.label}</span>
                  </label>
                ))}
              </div>
              <button onClick={saveEmployeePermissions} className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">
                Save Employee Permissions
              </button>
            </div>
          )}
        </div>

        {/* Manage Rooms */}
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><BedDouble className="text-primary-500" /> Rooms</h2>
            <button className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {rooms.map((r, i) => (
              <div key={i} className="flex justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                <span className="font-medium">{r.roomType}</span>
                <span className={r.status === "AVAILABLE" ? "text-green-500 font-bold text-sm" : "text-red-500 font-bold text-sm"}>
                  {r.status === "AVAILABLE" ? "Available" : "Booked"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Coupons */}
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Ticket className="text-primary-500" /> Discount Coupons</h2>
            <button onClick={() => setShowCouponModal(true)} className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {coupons.map((c, i) => (
              <div key={i} className="flex justify-between p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <span className="font-bold text-primary-600 dark:text-primary-400">{c.code}</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">₹{c.discount} Off</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Offers */}
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Megaphone className="text-primary-500" /> Active Offers</h2>
            <button onClick={() => setShowOfferModal(true)} className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {offers.map((o, i) => (
              <div key={i} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg">{o.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass dark:dark-glass p-8 rounded-3xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-primary-500" /> Staff & Orders</h2>
          <button onClick={() => setShowAddStaff(!showAddStaff)} className="px-4 py-2 bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center gap-1 hover:bg-primary-600 transition-colors"><Plus className="w-4 h-4" /> Add Staff</button>
        </div>

        {showAddStaff && (
          <form onSubmit={handleAddStaff} className="mb-8 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold mb-4">Create Staff Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Staff Name" required value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900" />
              <input type="email" placeholder="Email Address" required value={newStaff.email} onChange={e=>setNewStaff({...newStaff, email:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900" />
              <select value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900">
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Chef">Chef</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors">Generate Credentials</button>
          </form>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-4 text-slate-500">Active Staff</h3>
            {employees.map(emp => (
              <div key={emp.id} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl mb-2 flex justify-between">
                <span className="font-bold">{emp.name}</span>
                <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">{emp.role}</span>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-slate-500">Assign Orders</h3>
            {orders.map(order => (
              <div key={order.id} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl mb-2 flex justify-between items-center">
                <span className="font-bold text-primary-500">{order.id}</span>
                {order.assignedTo ? (
                  <span className="text-xs font-bold text-green-500">Assigned to: {order.assignedTo}</span>
                ) : (
                  <select 
                    className="text-xs p-1 rounded-lg outline-none bg-slate-100 dark:bg-slate-700"
                    onChange={(e) => assignOrder(order.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Assign Delivery...</option>
                    {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Influencer / Creator Booking */}
      <div className="glass dark:dark-glass p-8 rounded-3xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Camera className="text-pink-500" /> Influencer Collaboration</h2>
          <button className="px-4 py-2 bg-pink-500 text-white font-bold rounded-xl text-sm hover:bg-pink-600 transition-colors">Find Creators</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul Vlogs", followers: "1.2M", platform: "YouTube" },
            { name: "Priya Eats", followers: "850K", platform: "Instagram" }
          ].map((inf, i) => (
            <div key={i} className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">{inf.name.charAt(0)}</div>
              <h3 className="font-bold">{inf.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{inf.followers} on {inf.platform}</p>
              <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold">Invite for Stay</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Add Food Modal */}
        {showFoodModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Menu Item</h3>
                <button onClick={() => setShowFoodModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddFood} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Item Name</label>
                  <input type="text" required value={newFood.name} onChange={e=>setNewFood({...newFood, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Rasgulla" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Price (₹)</label>
                  <input type="number" required value={newFood.price} onChange={e=>setNewFood({...newFood, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 100" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Image URL</label>
                  <input type="url" value={newFood.image} onChange={e=>setNewFood({...newFood, image: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://unsplash.com/..." />
                </div>
                <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25">Add Item</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Coupon</h3>
                <button onClick={() => setShowCouponModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Coupon Code</label>
                  <input type="text" required value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 uppercase" placeholder="e.g. FESTIVAL50" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Discount Amount (₹)</label>
                  <input type="number" required value={newCoupon.discount} onChange={e=>setNewCoupon({...newCoupon, discount: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 50" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25">Create Coupon</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Publish Offer</h3>
                <button onClick={() => setShowOfferModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Offer Title</label>
                  <input type="text" required value={newOffer.title} onChange={e=>setNewOffer({...newOffer, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Weekend Special" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Description</label>
                  <textarea required value={newOffer.description} onChange={e=>setNewOffer({...newOffer, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24" placeholder="e.g. Buy 1 get 1 free on all sweets this weekend." />
                </div>
                <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25">Publish Offer</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
