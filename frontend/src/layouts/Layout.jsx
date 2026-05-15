import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, CreditCard, MapPin, LogOut, Cpu, Bell, Shield } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Telemetry', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Scanner', path: '/vehicles', icon: <Car size={20} /> },
    { name: 'FastTag Network', path: '/fasttags', icon: <CreditCard size={20} /> },
    { name: 'Toll Stations', path: '/booths', icon: <MapPin size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30 z-0"></div>

      {/* Sidebar */}
      <div className="w-72 glass-panel border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3 text-blue-400 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <Cpu size={24} />
            </div>
            <span className="text-2xl font-black tracking-widest font-mono uppercase">TollFlow</span>
          </div>
        </div>
        
        <div className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 font-mono">Control Modules</div>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div 
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                  ? 'text-white bg-blue-600/10 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                )}
                <div className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                  {item.icon}
                </div>
                <span className="font-mono text-sm tracking-wide">{item.name}</span>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-800/50">
          <div 
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full bg-red-500/10 border border-red-500/20 py-3 rounded-xl font-mono text-sm tracking-widest text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer transition-colors shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          >
            <LogOut size={18} />
            DISCONNECT
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-20 glass-panel border-b border-slate-800/50 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-emerald-400" />
            <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
              Secure Channel Active
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-slate-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 shadow-[0_0_5px_rgba(239,68,68,1)] animate-pulse"></span>
            </div>
            
            <div className="w-px h-8 bg-slate-800"></div>
            
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-200 font-mono">{user?.name || 'SYS_ADMIN'}</p>
                <p className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mt-0.5">Clearance: Level 5</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)] group-hover:bg-blue-600/30 transition-colors">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
