import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I am the ManiStayBite AI Assistant. You can ask me about our menu, room availability, or even upload a photo of a sweet/food to check if we have it!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text, image = null) => {
    if (!text && !image) return;

    const newMsg = { id: Date.now(), text, isBot: false, image };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Processing (LLM Vision mock)
    setTimeout(() => {
      let botReply = "I can help you with that! How else can I assist you today?";
      
      if (image) {
        botReply = "I analyzed your image! It looks like a 'Gulab Jamun'. We do have it available! It costs ₹150 per plate. Preparation time is approx 10 minutes. Would you like me to add it to your order?";
      } else if (text.toLowerCase().includes("sweet") || text.toLowerCase().includes("dessert")) {
        botReply = "We have amazing sweets! Rasmalai (₹200), Gulab Jamun (₹150), and Jalebi (₹100). They are all currently available. You can order them from the Food Menu page.";
      } else if (text.toLowerCase().includes("room")) {
        botReply = "We have Deluxe and Single AC rooms available right now starting at ₹2500/night. Please visit the Rooms page to book.";
      } else if (text.toLowerCase().includes("order")) {
        botReply = "You can order directly by going to the 'Order Food' page from the top menu. Let me know if you want recommendations!";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, isBot: true }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleSend("What is this sweet?", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary-500 text-white shadow-2xl hover:bg-primary-600 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] glass dark:dark-glass rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-primary-500 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="font-bold">ManiStayBite AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-slate-200 dark:bg-slate-700 rounded-tl-none text-slate-800 dark:text-slate-100' : 'bg-primary-500 text-white rounded-tr-none'}`}>
                    {msg.image && (
                      <img src={msg.image} alt="upload" className="w-full rounded-lg mb-2 object-cover" />
                    )}
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-primary-500 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask about sweets, food..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                />
                <button 
                  onClick={() => handleSend(input)}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
