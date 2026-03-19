import { Users, Clock, CheckCircle, TrendingUp, Download, Search } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/ui/StatCard';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import StatusBadge from '../components/ui/StatusBadge';
import type { BloodType } from '../types';

const TREND_DATA = [
  { month: 'Jul', donations: 145, matches: 130 },
  { month: 'Aug', donations: 168, matches: 155 },
  { month: 'Sep', donations: 172, matches: 160 },
  { month: 'Oct', donations: 185, matches: 170 },
  { month: 'Nov', donations: 195, matches: 185 },
  { month: 'Dec', donations: 210, matches: 200 },
  { month: 'Jan', donations: 225, matches: 215 },
];

const BLOOD_DATA = [
  { name: 'O+', value: 31, fill: '#27AE60' },
  { name: 'A+', value: 22, fill: '#E74C3C' },
  { name: 'B+', value: 18, fill: '#3498DB' },
  { name: 'AB+', value: 6, fill: '#9B59B6' },
  { name: 'B-', value: 5, fill: '#2980B9' },
  { name: 'A-', value: 7, fill: '#C0392B' },
  { name: 'AB-', value: 2, fill: '#8E44AD' },
  { name: 'O-', value: 9, fill: '#1E8449' },
];

const MODEL_METRICS = [
  { name: 'Accuracy', value: 78.3 },
  { name: 'Precision', value: 72.1 },
  { name: 'Recall', value: 68.4 },
  { name: 'F1-Score', value: 70.2 },
];

const DONORS = [
  { name: 'Kasun Perera', bloodType: 'O+', location: 'Colombo', donations: 12, status: 'available' },
  { name: 'Anjali Silva', bloodType: 'A+', location: 'Kandy', donations: 8, status: 'available' },
  { name: 'Rajith Fernando', bloodType: 'B+', location: 'Galle', donations: 15, status: 'unavailable' },
  { name: 'Nimali Jayawardena', bloodType: 'AB+', location: 'Jaffna', donations: 6, status: 'available' },
  { name: 'Chaminda W.', bloodType: 'O-', location: 'Colombo', donations: 20, status: 'available' },
];

const ACTIVITY = [
  { type: 'match', color: 'bg-green-100 text-green-600', desc: 'Match: Kasun Perera', detail: 'Matched with Emergency Patient', time: '5 min ago' },
  { type: 'donor', color: 'bg-blue-100 text-blue-600', desc: 'New Donor: Anjali Silva', detail: 'Registration completed', time: '12 min ago' },
  { type: 'request', color: 'bg-orange-100 text-orange-600', desc: 'Blood Request: O-', detail: 'From Colombo General Hospital', time: '18 min ago' },
  { type: 'match', color: 'bg-green-100 text-green-600', desc: 'Match: Rajith Fernando', detail: 'Matched with Surgery Patient', time: '25 min ago' },
];

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">System overview and analytics</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Donors" value="2,547" change="↑ 12% from last month" icon={<Users className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
          <StatCard title="Active Requests" value="47" change="↓ 5 urgent" changeColor="text-orange-500" icon={<Clock className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" />
          <StatCard title="Successful Matches" value="1,823" change="↑ 143 this week" icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
          <StatCard title="System Accuracy" value="96.5%" change="↑ 2.3% improvement" icon={<TrendingUp className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Donation & Match Trends</h3>
            <p className="text-xs text-gray-500 mb-4">Last 7 months performance</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#C0392B" dot={{ fill: '#C0392B', r: 4 }} name="Donations" />
                <Line type="monotone" dataKey="matches" stroke="#27AE60" dot={{ fill: '#27AE60', r: 4 }} name="Successful Matches" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Blood Type Pie */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Blood Type Distribution</h3>
            <p className="text-xs text-gray-500 mb-2">Active donor breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={BLOOD_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {BLOOD_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* AI Metrics */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" /> AI Model Performance
            </h3>
            <p className="text-xs text-gray-500 mb-4">Current model metrics</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={MODEL_METRICS} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" fill="#2980B9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-3">
              <p className="text-green-700 text-xs font-medium">✓ Model is performing optimally</p>
              <p className="text-green-600 text-xs">Last updated: 2 hours ago</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-gray-500 mb-4">Real-time system events</p>
            <div className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${a.color}`}>
                    {a.type === 'match' ? '✓' : a.type === 'donor' ? '👤' : '🩸'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{a.desc}</p>
                    <p className="text-xs text-gray-500">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donor Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Donor Management</h3>
              <p className="text-xs text-gray-500">Manage and monitor registered donors</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input placeholder="Search donors..." className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm" />
              </div>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Donor Name', 'Blood Type', 'Location', 'Donations', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-gray-500 font-medium py-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DONORS.map((d, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-gray-900">{d.name}</td>
                  <td className="py-3 pr-4"><BloodTypeBadge type={d.bloodType as BloodType} /></td>
                  <td className="py-3 pr-4 text-gray-500">{d.location}</td>
                  <td className="py-3 pr-4 text-gray-900">{d.donations}</td>
                  <td className="py-3 pr-4"><StatusBadge status={d.status} /></td>
                  <td className="py-3">
                    <button className="text-red-600 hover:underline text-xs mr-3">View</button>
                    <button className="text-gray-500 hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing 1-5 of 2,547 donors</p>
            <div className="flex gap-2">
              <button className="border border-gray-300 text-gray-600 rounded-lg px-3 py-1 text-xs">Previous</button>
              <button className="border border-gray-300 text-gray-600 rounded-lg px-3 py-1 text-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
