import { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default function EmployeeDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/employee/orders');
      if (res.data && res.data.length > 0) setOrders(res.data);
      else setFallbackOrders();
    } catch (err) {
      setFallbackOrders();
    }
  };

  const setFallbackOrders = () => {
    setOrders([
      { id: "STB1025", item: "2x Gulab Jamun", status: "PREPARING", room: "101" },
      { id: "STB1026", item: "1x Rasmalai", status: "OUT_FOR_DELIVERY", room: "105" },
    ]);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/employee/orders/${id}/status?status=${newStatus}`);
      
      // Broadcast WebSocket
      try {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
          stompClient.send('/app/order.status', {}, JSON.stringify({ orderId: id, status: newStatus }));
          stompClient.disconnect();
        });
      } catch(wsErr) { console.error("WS error", wsErr); }

      fetchOrders(); // Refresh
    } catch (err) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Staff Delivery Portal</h1>
        <p className="text-slate-500">View and update your assigned orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order, i) => (
          <div key={i} className="glass dark:dark-glass p-6 rounded-3xl border-l-4 border-l-primary-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary-500 mb-1">{order.id}</h3>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{order.item}</p>
                <p className="text-sm text-slate-500 mt-2">Deliver to Room: <span className="font-bold text-slate-900 dark:text-white">{order.room}</span></p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                {order.status === 'PREPARING' ? <Clock className="w-3 h-3 text-orange-500" /> : <Package className="w-3 h-3 text-blue-500" />}
                {order.status}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              {order.status === 'PREPARING' && (
                <button 
                  onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  Pick Up Order
                </button>
              )}
              {order.status === 'OUT_FOR_DELIVERY' && (
                <button 
                  onClick={() => updateStatus(order.id, 'DELIVERED')}
                  className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Delivered
                </button>
              )}
              {order.status === 'DELIVERED' && (
                <div className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl text-sm font-bold text-center">
                  Completed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
