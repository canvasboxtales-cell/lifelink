import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Clock, CheckCircle, AlertCircle, TrendingUp, MapPin, User, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthStore } from '../store/authStore';
import { listRequestsApi, createRequestApi, updateRequestStatusApi } from '../api/requests';
import type { BloodType } from '../types';

interface RequestItem {
  id: string;
  hospital_name: string;
  blood_type: string;
  status: string;
  urgency: string;
  hospital_location: string;
  doctor_name: string;
  units_needed: number;
  matches_found: number;
  contacted: number;
  confirmed: number;
  created_at: string;
  deadline: string;
  patient_condition: string;
  completed_at?: string;
}

const urgencyColors: Record<string, string> = {
  HIGH: 'bg-red-600 text-white',
  MEDIUM: 'bg-orange-400 text-white',
  LOW: 'bg-gray-300 text-gray-700',
};

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  pending: 'text-orange-500',
  completed: 'text-blue-500',
  cancelled: 'text-gray-400',
};

const statusDot: Record<string, string> = {
  active: 'bg-green-500',
  pending: 'bg-orange-400',
  completed: 'bg-blue-500',
  cancelled: 'bg-gray-400',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return dateStr;
  }
}

export default function RequestManagement() {
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: listRequestsApi,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateRequestStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const active = requests.filter((r: RequestItem) => r.status === 'active').length;
  const pending = requests.filter((r: RequestItem) => r.status === 'pending').length;
  const completed = requests.filter((r: RequestItem) => r.status === 'completed').length;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
            <p className="text-gray-500 text-sm">Manage and track blood donation requests</p>
          </div>
          {(user?.role === 'hospital' || user?.role === 'admin') && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Request
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Requests" value={String(active)} icon={<AlertCircle className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" />
          <StatCard title="Pending" value={String(pending)} icon={<Clock className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" />
          <StatCard title="Completed" value={String(completed)} icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
          <StatCard title="Total" value={String(requests.length)} icon={<TrendingUp className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        )}

        {!isLoading && requests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No requests found</p>
            <p className="text-gray-400 text-sm mt-1">
              {user?.role === 'hospital' ? 'Create a new blood request to get started' : 'No active blood requests at this time'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((req: RequestItem) => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{req.hospital_name || 'Unknown Hospital'}</h3>
                  <BloodTypeBadge type={req.blood_type as BloodType} />
                  <span className={`flex items-center gap-1 text-sm ${statusColors[req.status] || 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${statusDot[req.status] || 'bg-gray-400'}`} />
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold ${urgencyColors[req.urgency] || 'bg-gray-200 text-gray-700'}`}>
                  {req.urgency === 'LOW' ? 'LOW PRIORITY' : req.urgency}
                </span>
              </div>
              <div className="flex gap-3 text-sm text-gray-500 mb-4">
                {req.hospital_location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.hospital_location}</span>}
                {req.doctor_name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {req.doctor_name}</span>}
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  ['Units Needed', req.units_needed, 'text-gray-900'],
                  ['Matches Found', req.matches_found, 'text-blue-600'],
                  ['Contacted', req.contacted, 'text-orange-500'],
                  ['Confirmed', req.confirmed, 'text-green-600'],
                ].map(([label, value, cls]) => (
                  <div key={label as string} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`text-xl font-bold ${cls}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created: {formatDate(req.created_at)}</span>
                {req.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline: {formatDate(req.deadline)}</span>}
              </div>
              {req.patient_condition && (
                <p className="text-sm text-gray-600"><span className="font-medium">Patient Condition:</span> {req.patient_condition}</p>
              )}
              {req.status === 'completed' && req.completed_at && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">Completed on {formatDate(req.completed_at)}</p>
                </div>
              )}
              {req.status !== 'completed' && req.status !== 'cancelled' && (user?.role === 'admin' || user?.role === 'hospital') && (
                <div className="mt-3 flex gap-2">
                  {req.status === 'active' && (
                    <button
                      onClick={() => statusMutation.mutate({ id: req.id, status: 'completed' })}
                      disabled={statusMutation.isPending}
                      className="text-xs border border-green-600 text-green-600 hover:bg-green-50 rounded-lg px-3 py-1.5"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => statusMutation.mutate({ id: req.id, status: 'cancelled' })}
                    disabled={statusMutation.isPending}
                    className="text-xs border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-lg px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CreateRequestModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    blood_type: '',
    units_needed: 1,
    urgency: 'MEDIUM',
    patient_condition: '',
    doctor_name: '',
    deadline: '',
  });

  const createMutation = useMutation({
    mutationFn: () => createRequestApi({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Blood request created successfully');
      onClose();
    },
    onError: () => toast.error('Failed to create request'),
  });

  const handleSubmit = () => {
    if (!form.blood_type) { toast.error('Blood type is required'); return; }
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Create Blood Request</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Blood Type *</label>
              <select value={form.blood_type} onChange={e => setForm(f => ({ ...f, blood_type: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Units Needed</label>
              <input type="number" min="1" value={form.units_needed} onChange={e => setForm(f => ({ ...f, units_needed: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Urgency</label>
            <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Doctor Name</label>
            <input value={form.doctor_name} onChange={e => setForm(f => ({ ...f, doctor_name: e.target.value }))} placeholder="Dr. Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Patient Condition</label>
            <textarea value={form.patient_condition} onChange={e => setForm(f => ({ ...f, patient_condition: e.target.value }))} placeholder="Brief description of patient condition" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none h-20 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Deadline (Optional)</label>
            <input type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg py-2.5 text-sm font-medium">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg py-2.5 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
