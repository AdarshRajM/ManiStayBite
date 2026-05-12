import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backendBaseUrl } from '../utils/api';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let client = null;
    
    try {
      const wsEndpoint = backendBaseUrl ? `${backendBaseUrl}/ws` : '/ws';
      const socket = new SockJS(wsEndpoint);
      client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log('Connected to WebSocket');
          client.subscribe('/topic/notifications', (message) => {
            const newNotif = message.body;
            setNotifications(prev => [newNotif, ...prev]);
            
            // Auto close notification toast after 5s if we were making individual toasts
          });
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
        }
      });
      
      client.activate();
    } catch (err) {
      console.warn("WebSocket connection failed. Running without real-time notifications.");
    }

    return () => {
      if (client) client.deactivate();
    };
  }, []);

  return (
    <div className="fixed top-20 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl hover:bg-slate-50 transition-colors border border-slate-200 dark:border-slate-700"
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 right-0 w-80 glass dark:dark-glass rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-primary-500 text-white font-bold flex justify-between items-center">
              <span>Notifications</span>
              <span className="bg-white/20 px-2 py-1 rounded-lg text-xs">{notifications.length} new</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No new notifications</div>
              ) : (
                notifications.map((msg, i) => (
                  <div key={i} className="p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                    {msg}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
