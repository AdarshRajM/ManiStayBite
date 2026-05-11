import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle, Hotel, Phone, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { setupRecaptcha, requestPhoneOtp } from '../firebase';

export default function Signup({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [toastMessage, setToastMessage] = useState('');
  
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Focus ref for first OTP input
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Auto OTP Detection (Web OTP API)
  useEffect(() => {
    if (step === 2 && 'OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then(otp => {
        if (otp && otp.code) {
          const codeArr = otp.code.split('').slice(0, 4);
          setOtp(codeArr);
        }
      }).catch(err => console.log('Web OTP API error:', err));
      return () => ac.abort();
    }
  }, [step]);

  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), duration);
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (attempts >= 3) {
      showToast("❌ Maximum attempts reached. Try again later.");
      return;
    }

    setAttempts(a => a + 1);

    try {
      if (authMethod === 'phone') {
        setupRecaptcha('recaptcha-container');
        const formattedPhone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
        const result = await requestPhoneOtp(formattedPhone);
        setConfirmationResult(result);
        showToast("📱 OTP sent to your phone via Firebase");
      } else {
        await api.post('/auth/send-otp', { identifier, channel: 'EMAIL' });
        showToast("📧 OTP sent to your email");
      }
      
      setTimer(300); // 5 minutes
      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      showToast("❌ Failed to send OTP: " + (err.response?.data || err.message));
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length < 4) {
      showToast("⚠️ Please enter complete OTP");
      return;
    }

    try {
      if (authMethod === 'phone' && confirmationResult) {
        // Firebase verification
        const result = await confirmationResult.confirm(enteredOtp);
        const token = await result.user.getIdToken();
        const res = await api.post('/auth/firebase-login', { token, name, identifier });
        finalizeAuth(res.data);
      } else {
        // Custom backend verification
        const res = await api.post('/auth/verify-otp', { identifier, otp: enteredOtp, name });
        finalizeAuth(res.data);
      }
    } catch (err) {
      showToast("❌ Invalid OTP! Please try again.");
      console.error(err);
    }
  };

  const finalizeAuth = (data) => {
    sessionStorage.setItem('staybite_token', data.token);
    localStorage.setItem('realName', name);
    setUserRole(data.role || 'CUSTOMER');
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
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
          <p className="text-slate-500 mb-6">Create an account to unlock premium experiences.</p>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                <button type="button" onClick={() => {setAuthMethod('email'); setIdentifier('');}} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMethod === 'email' ? 'bg-white dark:bg-slate-700 shadow text-primary-500' : 'text-slate-500'}`}>
                  Email / WhatsApp
                </button>
                <button type="button" onClick={() => {setAuthMethod('phone'); setIdentifier('');}} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMethod === 'phone' ? 'bg-white dark:bg-slate-700 shadow text-primary-500' : 'text-slate-500'}`}>
                  Phone Auth
                </button>
              </div>

              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e=>setName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  {authMethod === 'email' ? (
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  ) : (
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  )}
                  <input 
                    type={authMethod === 'email' ? 'text' : 'tel'} 
                    placeholder={authMethod === 'email' ? 'Email or WhatsApp Number' : 'Phone Number (+91...)'} 
                    required 
                    value={identifier} 
                    onChange={e=>setIdentifier(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>

              <div id="recaptcha-container"></div>

              <button type="submit" className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25 mt-4">
                Send OTP
              </button>
            </form>
          ) : (
            <motion.form initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <p className="font-bold text-slate-700 dark:text-slate-300">Enter OTP sent to</p>
                <p className="text-primary-500 font-bold">{identifier}</p>
                {timer > 0 ? (
                  <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button type="button" onClick={handleSendOTP} className="text-sm text-primary-500 font-bold mt-2 hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="flex justify-center gap-4">
                {otp.map((digit, i) => (
                  <input 
                    key={i} 
                    ref={el => otpRefs.current[i] = el}
                    type="text" 
                    maxLength="1" 
                    required
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                    value={digit}
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
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
