import { useState } from 'react';
import { MapPin, Phone, Droplets, Heart, Award, Bell, Calendar, Shield, ChevronRight, Edit } from 'lucide-react';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import type { BloodType } from '../types';

const MOCK_NEARBY = [
  { id: '1', bloodType: 'O+' as BloodType, hospital: 'Colombo General', distance: 2.3, urgency: 'high', match: 98 },
  { id: '2', bloodType: 'O+' as BloodType, hospital: 'Asiri Surgical', distance: 4.1, urgency: 'medium', match: 92 },
  { id: '3', bloodType: 'O-' as BloodType, hospital: 'Durdans Hospital', distance: 5.8, urgency: 'low', match: 78 },
];

const HISTORY = [
  { id: '1', hospital: 'Colombo National Hospital', patient: 'Emergency Patient', date: '10/11/2025' },
  { id: '2', hospital: 'Asiri Hospital', patient: 'Surgery Patient', date: '22/08/2025' },
  { id: '3', hospital: 'Lanka Hospital', patient: 'Accident Victim', date: '18/05/2025' },
  { id: '4', hospital: 'Nawaloka Hospital', patient: 'Cancer Patient', date: '14/02/2025' },
];

const urgencyColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-gray-100 text-gray-600',
};

export default function DonorProfile() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">KP</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Kasun Perera</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <BloodTypeBadge type="O+" size="md" />
                      <span className="flex items-center gap-1 text-green-600 text-sm"><span className="w-2 h-2 bg-green-500 rounded-full" /> Available</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Colombo 07, Sri Lanka</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +94 77 123 4567</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Available for Donation</span>
                    <button onClick={() => setAvailable(a => !a)} className={`relative w-11 h-6 rounded-full transition-colors ${available ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${available ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  <button className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-4 py-1.5 text-sm flex items-center gap-1">
                    <Edit className="w-3 h-3" /> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Droplets className="w-5 h-5 text-red-500" />, bg: 'bg-red-50', value: '12', label: 'Donations' },
                { icon: <Heart className="w-5 h-5 text-red-400" />, bg: 'bg-pink-50', value: '36', label: 'Lives Impacted' },
                { icon: <Award className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50', value: '94%', label: 'Response Rate' },
              ].map(({ icon, bg, value, label }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                  <div className={`${bg} p-2 rounded-lg`}>{icon}</div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-red-600" /> Donation Eligibility</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Last Donation</span><span className="text-gray-900">10/11/2025</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Next Eligible Date</span><span className="text-blue-600 font-medium">10/02/2026</span></div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 font-medium text-sm">✓ You're eligible to donate!</p>
                <p className="text-green-600 text-xs mt-0.5">You can donate again from February 10, 2026</p>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-red-600" /> Donation History</h3>
              <div className="space-y-3">
                {HISTORY.map(h => (
                  <div key={h.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{h.hospital}</p>
                      <p className="text-xs text-gray-500">{h.patient}</p>
                    </div>
                    <span className="text-xs text-gray-400">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><Bell className="w-4 h-4 text-red-600" /> Nearby Requests</h3>
              <p className="text-xs text-gray-500 mb-4">Matching your blood type</p>
              <div className="space-y-3">
                {MOCK_NEARBY.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <BloodTypeBadge type={r.bloodType} />
                      <span className="text-xs text-green-600 font-medium">{r.match}% Match</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{r.hospital}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.distance} km</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColors[r.urgency]}`}>{r.urgency}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-red-600 text-sm font-medium flex items-center justify-center gap-1 hover:underline">
                View All Requests <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: <Bell className="w-4 h-4" />, label: 'Notification Settings' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Privacy Settings' },
                  { icon: <Award className="w-4 h-4" />, label: 'View Achievements' },
                ].map(({ icon, label }) => (
                  <button key={label} className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
