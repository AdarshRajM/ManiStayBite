import { User, Mail, Phone, MapPin, Receipt, Calendar, Crown, Baby } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [familyMode, setFamilyMode] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const realName = localStorage.getItem('realName') || 'John Doe';
  const init = realName.charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-3"><User className="text-primary-500 w-8 h-8" /> My Profile</h1>
        <p className="text-slate-500">Manage your personal information and view history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Personal Info */}
        <div className="glass dark:dark-glass p-8 rounded-3xl md:col-span-1 h-fit">
          <div className="w-24 h-24 bg-primary-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
            {init}
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">{realName}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Mail className="w-5 h-5 text-primary-500" /> john.doe@example.com
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Phone className="w-5 h-5 text-primary-500" /> +91 9876543210
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <MapPin className="w-5 h-5 text-primary-500" /> Mumbai, India
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold flex items-center gap-2"><Baby className="text-pink-500" /> Smart Family Mode</h3>
              <button onClick={() => setFamilyMode(!familyMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${familyMode ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${familyMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <p className="text-xs text-slate-500">Filters menus and activities for kids.</p>
          </div>
        </div>

        {/* History */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="glass dark:dark-glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-500" /> Booking History</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center border-l-4 border-l-blue-500">
                <div>
                  <h4 className="font-bold">Deluxe Room (101)</h4>
                  <p className="text-sm text-slate-500">Jan 12 - Jan 15, 2026</p>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">Completed</span>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center border-l-4 border-l-blue-500">
                <div>
                  <h4 className="font-bold">Wedding Hall</h4>
                  <p className="text-sm text-slate-500">Dec 01, 2026</p>
                </div>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold">Pending</span>
              </div>
            </div>
          </div>

          <div className="glass dark:dark-glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Receipt className="text-green-500" /> Payment History</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold">Food Order #STB1024</h4>
                  <p className="text-xs text-slate-500">Card ending in 4242</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">₹850</p>
                  <p className="text-xs text-slate-400">May 05, 2026</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass dark:dark-glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent pointer-events-none group-hover:scale-105 transition-transform duration-500"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Crown className="text-yellow-500" /> Premium Membership</h2>
            <p className="text-sm text-slate-500 mb-6">Unlock exclusive VIP perks, free pool access, and complimentary breakfast.</p>
            
            {isSubscribed ? (
              <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-bold border border-yellow-500/20 rounded-xl flex items-center justify-between">
                <span>Active Member</span>
                <span>Renews: 01 Jan 2027</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-lg">VIP Pass</h4>
                  <p className="text-sm text-slate-500">₹4,999 / year</p>
                </div>
                <button onClick={() => setIsSubscribed(true)} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Subscribe</button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
