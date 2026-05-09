import { CreditCard, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentModal({ amount, onClose, onSuccess }) {
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess(method);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 dark:hover:text-white"><X className="w-5 h-5"/></button>
        
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><CreditCard className="text-primary-500"/> Secure Checkout</h2>
        <p className="text-slate-500 mb-6 flex justify-between items-center">
          <span>Amount Payable</span>
          <span className="font-bold text-lg text-slate-900 dark:text-white">INR {amount}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setMethod('UPI')}
            className={`p-4 rounded-xl border-2 font-bold transition-colors ${method === 'UPI' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
          >
            UPI / QR Code
          </button>
          <button 
            onClick={() => setMethod('CARD')}
            className={`p-4 rounded-xl border-2 font-bold transition-colors ${method === 'CARD' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
          >
            Credit / Debit Card
          </button>
        </div>

        {method === 'UPI' && (
          <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
            <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-sm mb-4 border border-slate-200">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR" className="w-full h-full" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Scan to Pay via Any UPI App</p>
            <p className="text-xs text-slate-500">GPay • PhonePe • Paytm</p>
          </div>
        )}

        {method === 'CARD' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Card Number</label>
              <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary-500" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">Expiry</label>
                <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">CVV</label>
                <input type="password" placeholder="•••" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Name on Card</label>
              <input type="text" placeholder="Adarsh Raj Mani" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary-500" />
            </div>
          </div>
        )}

        <button 
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          {processing ? <span className="animate-pulse">Processing...</span> : <span>Pay INR {amount}</span>}
        </button>
      </motion.div>
    </div>
  );
}
