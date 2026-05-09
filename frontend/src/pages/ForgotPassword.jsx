import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass dark:dark-glass p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-bl-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-tr-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-slate-500 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25"
              >
                Send Reset Link <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 font-medium text-sm">
              If an account exists for {email}, a password reset link has been sent. Please check your inbox.
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-slate-500 font-medium hover:text-primary-500 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
