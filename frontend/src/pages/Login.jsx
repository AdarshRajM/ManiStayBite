import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Camera } from 'lucide-react';
import FaceLogin from '../components/FaceLogin';
import { useState } from 'react';
import api from '../utils/api';

export default function Login({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showFaceLogin, setShowFaceLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Try hitting the real Spring Boot backend
      const res = await api.post('/auth/login', { email, password });
      sessionStorage.setItem('staybite_token', res.data.token);
      localStorage.setItem('realName', res.data.name || email.split('@')[0]);
      setUserRole(res.data.role);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.warn("Backend not running, falling back to mock login.");
      sessionStorage.setItem('staybite_token', "mock_token");
      
      // Super Admin Bypass
      if (email === 'adarshrajmanii@gmail.com' && password === 'Mani8228') {
        localStorage.setItem('realName', 'Adarsh Raj Mani');
        setUserRole('SUPER_ADMIN');
        setIsAuthenticated(true);
        navigate('/dashboard');
        return;
      }

      // Mock Login Logic based on email prefix
      let mockRole = "CUSTOMER";
      let mockName = "Guest User";
      if (email.startsWith("admin")) { mockRole = "SUPER_ADMIN"; mockName = "System Admin"; }
      else if (email.startsWith("owner")) { mockRole = "HOTEL_OWNER"; mockName = "Hotel Owner"; }
      else if (email.startsWith("emp")) { mockRole = "EMPLOYEE"; mockName = "Staff Member"; }
      else { mockName = email.split('@')[0]; }
      
      localStorage.setItem('realName', mockName);
      setUserRole(mockRole);
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass dark:dark-glass rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <LogIn className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to manage your bookings.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
            Login to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={() => setShowFaceLogin(true)}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" /> Face Verification Login
          </button>
        </div>

        {showFaceLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative max-w-md w-full">
              <button 
                onClick={() => setShowFaceLogin(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
              >
                ×
              </button>
              <FaceLogin onSuccess={() => {
                setShowFaceLogin(false);
                setIsAuthenticated(true);
                setUserRole('CUSTOMER');
                localStorage.setItem('realName', 'Verified Face User');
                navigate('/dashboard');
              }} />
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account? <Link to="/signup" className="text-primary-500 font-bold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
