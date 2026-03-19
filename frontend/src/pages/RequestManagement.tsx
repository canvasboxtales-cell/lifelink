import { Plus, Clock, CheckCircle, AlertCircle, TrendingUp, MapPin, User, Calendar } from 'lucide-react';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import StatCard from '../components/ui/StatCard';
import type { BloodType } from '../types';

const REQUESTS = [
  {
    id: '1', hospitalName: 'Colombo General Hospital', bloodType: 'O-' as BloodType, status: 'active', urgency: 'HIGH',
    location: 'Colombo 07', doctorName: 'Dr. Sunil Perera', unitsNeeded: 3, matchesFound: 12, contacted: 8, confirmed: 2,
    createdAt: '10/01/2026, 08:30:00', deadline: '10/01/2026, 14:00:00', patientCondition: 'Emergency surgery - accident victim',
  },
  {
    id: '2', hospitalName: 'Asiri Surgical Hospital', bloodType: 'AB+' as BloodType, status: 'pending', urgency: 'MEDIUM',
    location: 'Colombo 05', doctorName: 'Dr. Anjali Fernando', unitsNeeded: 2, matchesFound: 8, contacted: 5, confirmed: 1,
    createdAt: '09/01/2026, 15:20:00', deadline: '11/01/2026, 10:00:00', patientCondition: 'Scheduled surgery - cancer treatment',
  },
  {
    id: '3', hospitalName: 'Lanka Hospital', bloodType: 'B+' as BloodType, status: 'completed', urgency: 'LOW',
    location: 'Colombo 06', doctorName: 'Dr. Rajith Silva', unitsNeeded: 1, matchesFound: 15, contacted: 10, confirmed: 3,
    createdAt: '08/01/2026, 10:15:00', deadline: '09/01/2026, 16:00:00', patientCondition: 'Routine transfusion',
    completedAt: '09/01/2026, 14:30:00', completedBy: 'Kasun Perera',
  },
];

const urgencyColors: Record<string, string> = {
  HIGH: 'bg-red-600 text-white',
  MEDIUM: 'bg-orange-400 text-white',
  LOW: 'bg-gray-300 text-gray-700',
};

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  pending: 'text-orange-500',
  completed: 'text-blue-500',
};

export default function RequestManagement() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
            <p className="text-gray-500 text-sm">Manage and track blood donation requests</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Request
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Requests" value="1" icon={<AlertCircle className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" />
          <StatCard title="Pending" value="1" icon={<Clock className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" />
          <StatCard title="Completed Today" value="1" icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
          <StatCard title="Success Rate" value="96%" icon={<TrendingUp className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
        </div>

        <div className="space-y-4">
          {REQUESTS.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{req.hospitalName}</h3>
                  <BloodTypeBadge type={req.bloodType} />
                  <span className={`flex items-center gap-1 text-sm ${statusColors[req.status]}`}>
                    <span className={`w-2 h-2 rounded-full ${req.status === 'active' ? 'bg-green-500' : req.status === 'pending' ? 'bg-orange-400' : 'bg-blue-500'}`} />
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold ${urgencyColors[req.urgency]}`}>
                  {req.urgency === 'LOW' ? 'LOW PRIORITY' : req.urgency}
                </span>
              </div>
              <div className="flex gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {req.doctorName}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  ['Units Needed', req.unitsNeeded, 'text-gray-900'],
                  ['Matches Found', req.matchesFound, 'text-blue-600'],
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
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created: {req.createdAt}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline: {req.deadline}</span>
              </div>
              <p className="text-sm text-gray-600"><span className="font-medium">Patient Condition:</span> {req.patientCondition}</p>
              {req.status === 'completed' && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">✓ Completed: Donation received from {req.completedBy}</p>
                  <p className="text-green-600 text-xs">Completed on {req.completedAt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
