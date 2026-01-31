
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Target, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';

const MOCK_STATS = [
  { name: 'Roads', resolved: 45, pending: 15 },
  { name: 'Water', resolved: 78, pending: 5 },
  { name: 'Electricity', resolved: 92, pending: 8 },
  { name: 'Waste', resolved: 33, pending: 22 },
  { name: 'Health', resolved: 65, pending: 12 },
];

const TREND_DATA = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 82 },
];

const CivicScoreDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle2 size={24} /></div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <h4 className="text-slate-500 text-sm font-medium">Issues Resolved</h4>
          <p className="text-3xl font-bold text-slate-800">1,284</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Target size={24} /></div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Last 30d</span>
          </div>
          <h4 className="text-slate-500 text-sm font-medium">Avg Response Time</h4>
          <p className="text-3xl font-bold text-slate-800">2.4 <span className="text-sm font-normal text-slate-400">days</span></p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={24} /></div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Excellent</span>
          </div>
          <h4 className="text-slate-500 text-sm font-medium">Civic Trust Score</h4>
          <p className="text-3xl font-bold text-slate-800">82/100</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck size={24} /></div>
            <span className="text-xs font-bold text-purple-400 bg-purple-50 px-2 py-1 rounded">Live</span>
          </div>
          <h4 className="text-slate-500 text-sm font-medium">Active Volunteers</h4>
          <p className="text-3xl font-bold text-slate-800">452</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Resolution Ratio by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="resolved" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Constituency Trust Index</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} hide />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicScoreDashboard;
