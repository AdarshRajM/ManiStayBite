import { Moon, Sun, Globe, Mic, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function GlobalNavbar() {
  const { i18n, t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        alert(`You searched for: "${transcript}". Searching AI Engine...`);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass dark:dark-glass px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
          ManiStayBite SaaS
        </span>
      </div>

      <div className="hidden md:flex items-center bg-white/50 dark:bg-slate-800/50 rounded-full px-4 py-2 w-1/3 border border-slate-200 dark:border-slate-700">
        <Search className="w-5 h-5 text-slate-400 mr-2" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Try 'Book a room for tomorrow'..." 
          className="bg-transparent outline-none w-full text-sm dark:text-white"
        />
        <button 
          onClick={startVoiceSearch}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'}`}
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl">
          <Globe className="w-5 h-5 text-primary-500" />
          <select 
            onChange={changeLanguage} 
            className="bg-transparent outline-none font-bold text-sm dark:text-white"
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-white/80 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>
    </nav>
  );
}
