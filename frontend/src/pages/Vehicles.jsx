import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layouts/Layout';
import LiveScanner from '../components/LiveScanner';
import { Search, Plus, Car, Filter, Check, Camera, Zap } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    tollBooth: '',
    fastTagEnabled: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, bRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/booths`)
      ]);
      setVehicles(vRes.data);
      setBooths(bRes.data);
      if (bRes.data.length > 0) {
        setFormData(prev => ({ ...prev, tollBooth: bRes.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`, formData);
      setVehicles([res.data, ...vehicles]);
      setShowModal(false);
      setFormData({ ...formData, vehicleNumber: '', fastTagEnabled: false });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding entry');
    }
  };

  const markPaid = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${id}/pay`);
      setVehicles(vehicles.map(v => v._id === id ? res.data : v));
    } catch (err) {
      console.error(err);
    }
  };

  const handleScanComplete = (plateNumber) => {
    setShowScanner(false);
    setFormData(prev => ({ ...prev, vehicleNumber: plateNumber, fastTagEnabled: true }));
    setShowModal(true);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-mono uppercase tracking-widest">Surveillance Log</h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">Monitor all incoming and outgoing telemetry across toll nodes.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowScanner(true)}
            className="relative bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 outline-none shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <Camera size={20} className="relative z-10" /> 
            <span className="relative z-10 font-bold tracking-widest font-mono">LIVE SCANNER</span>
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary font-mono tracking-widest"
          >
            <Plus size={20} /> MANUAL ENTRY
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search plate registry..." 
              className="input-field pl-12 font-mono text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary font-mono tracking-widest text-xs">
            <Filter size={16} /> FILTER
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 font-mono">
            <thead className="text-xs tracking-widest bg-slate-800/50 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Node Origin</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Toll Amount</th>
                <th className="px-6 py-4">Network Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-10 text-blue-500 animate-pulse">[LOADING_TELEMETRY]</td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-slate-500">[NO_RECORDS_FOUND]</td></tr>
              ) : (
                filteredVehicles.map(v => (
                  <tr key={v._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                        <Car size={16} />
                      </div>
                      {v.vehicleNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{v.vehicleType}</td>
                    <td className="px-6 py-4 text-slate-400">{v.tollBooth?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(v.entryTime).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-blue-400">₹{v.amount}</td>
                    <td className="px-6 py-4">
                      {v.paymentStatus === 'Completed' ? (
                        <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs tracking-widest">
                          {v.fastTagEnabled ? 'FAST_TAG' : 'CLEARED'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs tracking-widest animate-pulse">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {v.paymentStatus === 'Pending' ? (
                        <button onClick={() => markPaid(v._id)} className="text-emerald-400 hover:text-white font-bold text-xs bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/30 flex items-center gap-2 ml-auto transition-colors hover:bg-emerald-600">
                          <Check size={16} /> AUTHORIZE
                        </button>
                      ) : (
                        <span className="text-slate-600 font-medium">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden border border-slate-700">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-bold text-white font-mono tracking-widest flex items-center gap-2">
                <Zap size={18} className="text-blue-500" /> SYSTEM OVERRIDE
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white font-bold text-xl transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleAddEntry} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Registry Plate</label>
                <input 
                  type="text" 
                  className="input-field uppercase font-bold tracking-widest text-lg" 
                  placeholder="E.G. MH01AB1234"
                  value={formData.vehicleNumber}
                  onChange={e => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Chassis Class</label>
                  <select 
                    className="input-field"
                    value={formData.vehicleType}
                    onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                  >
                    <option value="Car">Class A (Car)</option>
                    <option value="Bike">Class B (Bike)</option>
                    <option value="Bus">Class C (Bus)</option>
                    <option value="Truck">Class D (Truck)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Active Node</label>
                  <select 
                    className="input-field"
                    value={formData.tollBooth}
                    onChange={e => setFormData({...formData, tollBooth: e.target.value})}
                  >
                    {booths.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <input 
                  type="checkbox" 
                  id="fasttag"
                  className="w-5 h-5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500/50 focus:ring-offset-slate-900"
                  checked={formData.fastTagEnabled}
                  onChange={e => setFormData({...formData, fastTagEnabled: e.target.checked})}
                />
                <label htmlFor="fasttag" className="text-sm font-bold text-blue-400 cursor-pointer font-mono">
                  Override with FastTag Digital Check
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 font-mono tracking-widest text-sm">CANCEL</button>
                <button type="submit" className="btn-primary flex-1 font-mono tracking-widest text-sm text-white">INJECT DATA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Scanner Overlay */}
      {showScanner && (
        <LiveScanner 
          onScanComplete={handleScanComplete} 
          onClose={() => setShowScanner(false)} 
        />
      )}

    </Layout>
  );
}
