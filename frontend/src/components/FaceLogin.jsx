import { Camera, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FaceLogin({ onSuccess }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('WAITING'); // WAITING, SCANNING, SUCCESS, FAILED

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setStatus('FAILED');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateFaceScan = () => {
    setStatus('SCANNING');
    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        stopCamera();
        if (onSuccess) onSuccess();
      }, 1500);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 glass dark:dark-glass rounded-3xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-2">Face Verification</h2>
      <p className="text-slate-500 mb-6 text-center">Please look directly at the camera to match with your Aadhaar identity.</p>

      <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary-500 mb-6 bg-slate-800">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        
        {/* Scanning Animation Overlay */}
        {status === 'SCANNING' && (
          <motion.div 
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_#4ade80]"
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        {status === 'WAITING' && (
          <button 
            onClick={simulateFaceScan}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors"
          >
            <Camera className="w-5 h-5" /> Start Scan
          </button>
        )}
        
        {status === 'SCANNING' && (
          <div className="flex items-center gap-2 text-primary-500 font-bold">
            <RefreshCw className="w-5 h-5 animate-spin" /> Verifying...
          </div>
        )}

        {status === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="flex items-center gap-2 text-green-500 font-bold"
          >
            <CheckCircle className="w-6 h-6" /> Identity Verified!
          </motion.div>
        )}

        {status === 'FAILED' && (
          <div className="flex items-center gap-2 text-red-500 font-bold">
            <XCircle className="w-6 h-6" /> Camera Access Denied
          </div>
        )}
      </div>
    </div>
  );
}
