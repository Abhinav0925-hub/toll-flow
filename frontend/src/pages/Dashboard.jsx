import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layouts/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Car, CreditCard, MapPin, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']; // Blue, Emerald, Amber, Purple

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics/dashboard`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-64 text-blue-500 font-mono gap-4">
        <Activity size={32} className="animate-pulse" />
        <span>[FETCHING_TELEMETRY_DATA]...</span>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white font-mono uppercase tracking-widest flex items-center gap-3">
          <Activity className="text-blue-500" /> System Telemetry
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-sm">Live data stream from connected TollFlow nodes.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="card group hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Total Revenue</p>
              <h3 className="text-4xl font-black text-white font-mono">₹{data.revenueToday.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="text-xs font-mono text-blue-400 flex items-center gap-1 bg-blue-500/10 w-max px-2 py-1 rounded">
            ↑ 12% vs yesterday
          </div>
        </div>

        <div className="card group hover:border-emerald-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Traffic Volume</p>
              <h3 className="text-4xl font-black text-white font-mono">{data.vehiclesToday.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-shadow">
              <Car size={24} />
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 w-max px-2 py-1 rounded">
            ↑ 5% vs yesterday
          </div>
        </div>

        <div className="card group hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">FastTag Network</p>
              <h3 className="text-4xl font-black text-white font-mono">
                {data.vehiclesToday > 0 ? Math.round((data.fastTagCount / data.vehiclesToday) * 100) : 0}%
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-shadow">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="text-xs font-mono text-purple-400 flex items-center gap-1 bg-purple-500/10 w-max px-2 py-1 rounded">
            {data.fastTagCount} digital scans
          </div>
        </div>

        <div className="card group hover:border-amber-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Active Nodes</p>
              <h3 className="text-4xl font-black text-white font-mono">{data.activeBooths}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-shadow">
              <MapPin size={24} />
            </div>
          </div>
          <div className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 w-max px-2 py-1 rounded">
            All systems nominal
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-widest font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            7-Day Revenue Matrix
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'monospace'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'monospace'}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#3b82f6' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-widest font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Vehicle Class Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.typeDistribution}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.typeDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <div className="w-3 h-3 rounded shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}></div>
                {entry.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
