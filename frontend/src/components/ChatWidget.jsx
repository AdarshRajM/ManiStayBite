import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help with your stay today?' }]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    
    // Simulate WebSocket response delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'An agent will connect with you shortly.' }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-primary-500 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Live Support</h3>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5"/></button>
            </div>
            
            <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50 dark:bg-slate-800">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-primary-500 text-white self-end rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 dark:text-white self-start rounded-bl-none'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl outline-none text-sm"
              />
              <button type="submit" className="p-2 bg-primary-500 text-white rounded-xl"><Send className="w-4 h-4"/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
