import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Car, Lock, ShieldAlert, Cpu, TerminalSquare } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.msg);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans text-slate-200">
      
      {/* High-Tech Animated Background Elements */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      <div className="w-full max-w-5xl glass-panel rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex relative z-10 border border-slate-700/50">
        
        {/* Left Side: Graphic Banner */}
        <div className="hidden lg:flex w-1/2 bg-slate-900/50 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-700/50">
          
          <div className="relative z-10 animate-float">
            <div className="flex items-center gap-3 text-blue-400 mb-12">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Cpu size={32} />
              </div>
              <span className="text-3xl font-black tracking-widest uppercase font-mono">TollFlow_OS</span>
            </div>
            
            <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              A.I. Traffic <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Surveillance
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md font-mono text-sm leading-relaxed">
              [SYSTEM_READY] — Initiating secure handshake protocol. Monitoring real-time telemetry from active toll plazas.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-3 text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 w-max px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            Encrypted Connection Secured
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-slate-950/80">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <TerminalSquare size={28} className="text-blue-500" />
                Access Terminal
              </h2>
              <p className="text-slate-500 font-mono text-sm">Please authenticate to continue.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30 font-medium text-sm flex items-start gap-3 animate-glitch">
                <ShieldAlert className="shrink-0 mt-0.5" size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Admin Clearance ID</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="admin@tollflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Security Key</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    className="input-field tracking-widest" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary h-14 mt-6 text-lg tracking-widest uppercase font-bold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AUTHENTICATING...
                  </div>
                ) : (
                  <>
                    <Lock size={20} />
                    INITIALIZE LOGIN
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
              <span>Demo Credentials:</span>
              <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">admin@tollflow.com / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
