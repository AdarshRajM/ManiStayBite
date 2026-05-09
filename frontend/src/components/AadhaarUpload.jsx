import { useState } from 'react';
import { UploadCloud, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AadhaarUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('UNVERIFIED'); // UNVERIFIED, PENDING, VERIFIED

  const handleUpload = (e) => {
    e.preventDefault();
    setStatus('PENDING');
    // Simulate API call to backend for verification
    setTimeout(() => {
      setStatus('VERIFIED');
    }, 3000);
  };

  return (
    <div className="glass dark:dark-glass p-8 rounded-3xl max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        {status === 'VERIFIED' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <ShieldAlert className="w-8 h-8 text-yellow-500" />}
        <div>
          <h2 className="text-2xl font-bold">Identity Verification</h2>
          <p className="text-sm text-slate-500">
            {status === 'VERIFIED' ? 'Your account is fully verified.' : 'Upload Aadhaar for security.'}
          </p>
        </div>
      </div>

      {status !== 'VERIFIED' && (
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Aadhaar Number</label>
            <input 
              type="text" 
              placeholder="XXXX XXXX XXXX" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="image/*,.pdf"
              required
            />
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium">{file ? file.name : 'Click or drag Aadhaar scan here'}</p>
          </div>

          <button 
            type="submit" 
            disabled={status === 'PENDING'}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {status === 'PENDING' ? 'Verifying AI Match...' : 'Submit Document'}
          </button>
        </form>
      )}

      {status === 'VERIFIED' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-500/10 text-green-600 rounded-xl border border-green-500/20 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Aadhaar successfully matched via advanced OCR!
        </motion.div>
      )}
    </div>
  );
}
