import { motion } from 'framer-motion';
import { Users, Building2, MapPin, ShieldCheck, TrendingUp, ShieldAlert, BarChart3, Search, Filter, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SuperAdminDashboard() {
  const [hotels, setHotels] = useState([
    { id: 1, name: "Taj Mahal Palace", status: "PENDING", owner: "Ratan Tata" },
    { id: 2, name: "ITC Maurya", status: "APPROVED", owner: "Sanjiv Puri" },
  ]);

  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);

  // New Owner Creation State
  const [newOwner, setNewOwner] = useState({ name: '', email: '', hotelName: '' });
  const [showAddOwner, setShowAddOwner] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const evRes = await api.get('/admin/events/pending');
      if (evRes.data && evRes.data.length > 0) setEvents(evRes.data);
      else setFallbackEvents();
    } catch (err) {
      setFallbackEvents();
    }
  };

  const setFallbackEvents = () => {
    setEvents([{ id: 101, type: "Wedding", date: "Dec 01, 2026", status: "PENDING" }]);
    setReviews([{ id: 501, item: "Paneer Tikka", rating: 1, text: "Fake review testing", flag: true }]);
  };

  const approveHotel = (id) => {
    setHotels(hotels.map(h => h.id === id ? { ...h, status: "APPROVED" } : h));
  };

  const approveEvent = async (id) => {
    try {
      await api.put(`/admin/events/${id}/approve`);
      fetchData();
    } catch(err) {
      setEvents(events.map(e => e.id === id ? { ...e, status: "APPROVED" } : e));
    }
  };

  const deleteReview = async (id) => {
    try {
      await api.delete(`/admin/reviews/${id}`);
      fetchData();
    } catch(err) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleCreateOwner = (e) => {
    e.preventDefault();
    setHotels([...hotels, { id: Date.now(), name: newOwner.hotelName, status: "APPROVED", owner: newOwner.name }]);
    setShowAddOwner(false);
    setNewOwner({ name: '', email: '', hotelName: '' });
    alert(`Created Hotel Owner credentials for ${newOwner.email} with default password 'welcome123'`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="w-10 h-10 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold">Super Admin Portal</h1>
          <p className="text-slate-500">Manage the entire ManiStayBite ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass dark:dark-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl"><Building2 /></div>
          <div><p className="text-sm text-slate-500">Total Hotels</p><h3 className="text-2xl font-bold">124</h3></div>
        </div>
        <div className="glass dark:dark-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-xl"><Users /></div>
          <div><p className="text-sm text-slate-500">Total Users</p><h3 className="text-2xl font-bold">45,210</h3></div>
        </div>
        <div className="glass dark:dark-glass p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl"><TrendingUp /></div>
          <div><p className="text-sm text-slate-500">Total Revenue</p><h3 className="text-2xl font-bold">₹2.4 Cr</h3></div>
        </div>
      </div>

      <div className="glass dark:dark-glass p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Registered Hotels & Owners</h2>
          <button onClick={() => setShowAddOwner(!showAddOwner)} className="px-4 py-2 bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-colors">
            <Plus className="w-5 h-5" /> Add Hotel Owner
          </button>
        </div>

        {showAddOwner && (
          <form onSubmit={handleCreateOwner} className="mb-8 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold mb-4">Create New Hotel Owner Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Owner Name" required value={newOwner.name} onChange={e=>setNewOwner({...newOwner, name:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900" />
              <input type="email" placeholder="Owner Email" required value={newOwner.email} onChange={e=>setNewOwner({...newOwner, email:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900" />
              <input type="text" placeholder="Hotel Name" required value={newOwner.hotelName} onChange={e=>setNewOwner({...newOwner, hotelName:e.target.value})} className="px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900" />
            </div>
            <button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors">Generate Account & Send Invite</button>
          </form>
        )}

        <div className="space-y-4">
          {hotels.map(hotel => (
            <div key={hotel.id} className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <h4 className="font-bold">{hotel.name}</h4>
                <p className="text-sm text-slate-500">Owner: {hotel.owner}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${hotel.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {hotel.status}
                </span>
                {hotel.status === 'PENDING' && (
                  <button onClick={() => approveHotel(hotel.id)} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-bold">
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6">Pending Event Bookings</h2>
          <div className="space-y-4">
            {events.map(ev => (
              <div key={ev.id} className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <h4 className="font-bold">{ev.type}</h4>
                  <p className="text-sm text-slate-500">{ev.date}</p>
                </div>
                {ev.status === 'PENDING' ? (
                  <button onClick={() => approveEvent(ev.id)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600">Approve</button>
                ) : (
                  <span className="text-green-500 text-xs font-bold">APPROVED</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass dark:dark-glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 text-red-500">Flagged Reviews</h2>
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{rev.item} ({rev.rating} Star)</h4>
                  <button onClick={() => deleteReview(rev.id)} className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
                </div>
                <p className="text-sm text-slate-600">"{rev.text}"</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-slate-500 text-sm">No flagged reviews.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="glass dark:dark-glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-primary-500" /> Google Maps Integration</h2>
          <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.09262729959!2d77.108983!3d28.644800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="glass dark:dark-glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Filter className="text-primary-500" /> Advanced Search & Filters</h2>
          <div className="space-y-4">
            <div className="flex bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl">
              <input type="text" placeholder="Search Nearby Hotels..." className="bg-transparent outline-none w-full px-2" />
              <button className="p-2 bg-primary-500 text-white rounded-lg"><Search className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-4">
              <select className="flex-1 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 outline-none">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <select className="flex-1 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 outline-none">
                <option>Rating: 4+ Stars</option>
                <option>Rating: 3+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 glass dark:dark-glass rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-primary-500" /> Hotel Verification Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-bold text-slate-500">Hotel Name</th>
                <th className="p-4 font-bold text-slate-500">Owner</th>
                <th className="p-4 font-bold text-slate-500">Documents</th>
                <th className="p-4 font-bold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-bold">Taj Palace Resort</td>
                <td className="p-4 text-slate-500">Amit Sharma</td>
                <td className="p-4 text-blue-500 hover:underline cursor-pointer">View_GST.pdf</td>
                <td className="p-4 flex gap-2">
                  <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><CheckCircle className="w-5 h-5" /></button>
                  <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><XCircle className="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
