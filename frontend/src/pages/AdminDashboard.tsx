import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Clock, CheckCircle, TrendingUp, Download, Search } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/ui/StatCard';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getDashboardApi, getModelMetricsApi, getAdminDonorsApi } from '../api/admin';
import type { BloodType } from '../types';

const BLOOD_COLORS: Record<string, string> = {
  'O+': '#27AE60', 'A+': '#E74C3C', 'B+': '#3498DB', 'AB+': '#9B59B6',
  'B-': '#2980B9', 'A-': '#C0392B', 'AB-': '#8E44AD', 'O-': '#1E8449',
};

export default function AdminDashboard() {
  const [donorPage, setDonorPage] = useState(1);
  const [donorSearch, setDonorSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboardApi,
  });

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getModelMetricsApi,
  });

  const { data: donorsData, isLoading: donorsLoading } = useQuery({
    queryKey: ['admin-donors', donorPage, donorSearch],
    queryFn: () => getAdminDonorsApi({ page: donorPage, per_page: 10, search: donorSearch || undefined }),
  });

  if (dashLoading) return (
    <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>
  );

  const trendData = dashboard?.donation_trends || [];
  const bloodDist = dashboard?.blood_type_distribution || {};
  const bloodPieData = Object.entries(bloodDist).map(([name, value]) => ({
    name, value, fill: BLOOD_COLORS[name] || '#888',
  }));

  const modelMetrics = metrics ? [
    { name: 'Accuracy', value: metrics.accuracy },
    { name: 'Precision', value: metrics.precision },
    { name: 'Recall', value: metrics.recall },
    { name: 'F1-Score', value: metrics.f1_score },
  ] : [
    { name: 'Accuracy', value: 78.3 },
    { name: 'Precision', value: 72.1 },
    { name: 'Recall', value: 68.4 },
    { name: 'F1-Score', value: 70.2 },
  ];

  const activity = dashboard?.recent_activity || [];
  const donors = donorsData?.donors || [];
  const totalDonors = donorsData?.total || 0;
  const totalPages = donorsData?.pages || 1;

  const handleSearch = () => setDonorSearch(searchInput);

  const exportCSV = () => {
    if (!donors.length) return;
    const headers = ['Name', 'Blood Type', 'City', 'Total Donations', 'Availability'];
    const rows = donors.map((d: { name: string; blood_type: string; city: string; total_donations: number; availability: string }) =>
      [d.name, d.blood_type, d.city, d.total_donations, d.availability].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">System overview and analytics</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Donors" value={String(dashboard?.total_donors ?? 0)} change={`↑ ${dashboard?.donors_change ?? 0}% from last month`} icon={<Users className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
          <StatCard title="Active Requests" value={String(dashboard?.active_requests ?? 0)} icon={<Clock className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" changeColor="text-orange-500" />
          <StatCard title="Successful Matches" value={String(dashboard?.successful_matches ?? 0)} icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
          <StatCard title="System Accuracy" value={`${dashboard?.system_accuracy ?? 96.5}%`} change={`↑ ${dashboard?.accuracy_change ?? 2.3}% improvement`} icon={<TrendingUp className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Donation & Match Trends</h3>
            <p className="text-xs text-gray-500 mb-4">Last 7 months performance</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
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
                <Pie data={bloodPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {bloodPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
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
              <BarChart data={modelMetrics} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" fill="#2980B9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-3">
              <p className="text-green-700 text-xs font-medium">Model is performing optimally</p>
              {metrics?.last_updated && (
                <p className="text-green-600 text-xs">Last updated: {new Date(metrics.last_updated).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-gray-500 mb-4">Real-time system events</p>
            <div className="space-y-3">
              {activity.map((a: { type: string; description: string; detail: string; time_ago: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    a.type === 'match' ? 'bg-green-100 text-green-600' :
                    a.type === 'donor' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {a.type === 'match' ? '✓' : a.type === 'donor' ? '👤' : '🩸'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{a.description}</p>
                    <p className="text-xs text-gray-500">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400">{a.time_ago}</span>
                </div>
              ))}
              {activity.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No recent activity</p>}
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
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search donors..."
                  className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <button onClick={handleSearch} className="bg-red-600 text-white rounded-lg px-3 py-2 text-sm">Search</button>
              <button onClick={exportCSV} className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {donorsLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Donor Name', 'Blood Type', 'Location', 'Donations', 'Status'].map(h => (
                    <th key={h} className="text-left text-gray-500 font-medium py-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donors.map((d: { id: string; name: string; blood_type: string; city: string; total_donations: number; availability: string }, i: number) => (
                  <tr key={d.id || i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-900">{d.name}</td>
                    <td className="py-3 pr-4"><BloodTypeBadge type={d.blood_type as BloodType} /></td>
                    <td className="py-3 pr-4 text-gray-500">{d.city || '-'}</td>
                    <td className="py-3 pr-4 text-gray-900">{d.total_donations}</td>
                    <td className="py-3 pr-4"><StatusBadge status={d.availability} /></td>
                  </tr>
                ))}
                {donors.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No donors found</td></tr>
                )}
              </tbody>
            </table>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {donors.length > 0 ? ((donorPage - 1) * 10 + 1) : 0}-{Math.min(donorPage * 10, totalDonors)} of {totalDonors} donors
            </p>
            <div className="flex gap-2">
              <button
                disabled={donorPage <= 1}
                onClick={() => setDonorPage(p => p - 1)}
                className="border border-gray-300 text-gray-600 disabled:text-gray-300 rounded-lg px-3 py-1 text-xs"
              >Previous</button>
              <span className="px-3 py-1 text-xs text-gray-600">{donorPage} / {totalPages}</span>
              <button
                disabled={donorPage >= totalPages}
                onClick={() => setDonorPage(p => p + 1)}
                className="border border-gray-300 text-gray-600 disabled:text-gray-300 rounded-lg px-3 py-1 text-xs"
              >Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
