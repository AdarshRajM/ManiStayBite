import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle, Hotel } from 'lucide-react';
import { useState } from 'react';
import api from '../utils/api';

export default function Signup({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSendOTP = (e) => {
    e.preventDefault();
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedOtp(generated);
    setToastMessage(`📧 SIMULATED EMAIL: Your OTP is ${generated}`);
    setTimeout(() => setToastMessage(''), 8000);
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.join('') !== expectedOtp) {
      setToastMessage("❌ Invalid OTP! Please try again.");
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    try {
      // Simulate Backend Signup
      const res = await api.post('/auth/signup', { name, email, password, role: 'CUSTOMER' });
      sessionStorage.setItem('staybite_token', res.data.token || "mock_token");
      localStorage.setItem('realName', name);
      setUserRole('CUSTOMER');
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.warn("Backend not running, simulating mock signup.");
      sessionStorage.setItem('staybite_token', "mock_token");
      localStorage.setItem('realName', name);
      setUserRole('CUSTOMER');
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="absolute top-10 z-50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 font-bold"
        >
          {toastMessage}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass dark:dark-glass rounded-3xl p-8 my-12"
      >
        <div className="text-center mb-8">
          <Hotel className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Join ManiStayBite</h2>
          <p className="text-slate-500 mb-8">Create an account to unlock premium experiences.</p>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e=>setName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="email" placeholder="Email Address" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="password" placeholder="Password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25 mt-4">
                Continue to Verification
              </button>
            </form>
          ) : (
            <motion.form initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <p className="font-bold text-slate-700 dark:text-slate-300">Enter OTP sent to</p>
                <p className="text-primary-500 font-bold">{email}</p>
              </div>
              <div className="flex justify-center gap-4">
                {otp.map((digit, i) => (
                  <input 
                    key={i} type="text" maxLength="1" required
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                      if(e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
                    }}
                  />
                ))}
              </div>
              <button type="submit" className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-green-500/25">
                <CheckCircle className="w-5 h-5" /> Verify & Create Account
              </button>
            </motion.form>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}<Link to="/login" className="text-primary-500 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
