import { useRef, useEffect, useState } from 'react';
import { Camera, ScanLine, X, Cpu } from 'lucide-react';

export default function LiveScanner({ onScanComplete, onClose }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  // Initialize Webcam
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied or unavailable.");
        onClose();
      }
    }
    setupCamera();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle fake scan progress
  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          handleScanSuccess();
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [scanning]);

  const handleScanSuccess = () => {
    // Generate a random simulated Indian license plate
    const states = ['MH', 'DL', 'KA', 'GJ', 'TN', 'UP'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const num1 = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const num2 = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    
    const fakePlate = `${randomState}${num1}${letters}${num2}`;
    
    // Slight delay before closing to show 100% completion
    setTimeout(() => {
      onScanComplete(fakePlate);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 absolute top-0 w-full z-20">
          <div className="flex items-center gap-3 text-blue-400 font-mono text-sm tracking-widest">
            <Camera className="animate-pulse" size={18} />
            <span>LIVE_OPTICAL_RECOGNITION</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Camera Feed Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover opacity-80"
          ></video>

          {/* Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-1/4 right-1/4 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
          </div>

          {/* Scanning Laser Animation */}
          {scanning && (
            <>
              <div className="absolute w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-scan pointer-events-none"></div>
              <div className="absolute bg-blue-500/10 w-full h-full animate-scan origin-top pointer-events-none"></div>
            </>
          )}

          {/* Success Overlay */}
          {!scanning && (
            <div className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center backdrop-blur-sm z-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.8)] mb-4 animate-bounce">
                <ScanLine size={32} />
              </div>
              <h2 className="text-2xl font-black text-emerald-400 font-mono tracking-widest bg-emerald-950/80 px-6 py-2 rounded-lg border border-emerald-500/50">
                PLATE DETECTED
              </h2>
            </div>
          )}
        </div>

        {/* Footer & Progress */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex justify-between items-center mb-2 font-mono text-xs">
            <span className="text-slate-400 flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> AI Processing Core
            </span>
            <span className={scanning ? 'text-blue-400' : 'text-emerald-400 font-bold'}>
              {scanning ? `ANALYZING... ${scanProgress}%` : 'MATCH FOUND 100%'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${scanning ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
