import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Phone, Droplets, Heart, Award, Bell, Calendar, Shield, ChevronRight, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthStore } from '../store/authStore';
import { getDonorProfileApi, updateAvailabilityApi, updateDonorProfileApi } from '../api/donors';
import type { BloodType } from '../types';

const urgencyColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-gray-100 text-gray-600',
};

export default function DonorProfile() {
  const user = useAuthStore(s => s.user);
  const profileId = user?.profileId;
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<{ name: string; city: string; phone: string }>({ name: '', city: '', phone: '' });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['donor-profile', profileId],
    queryFn: () => getDonorProfileApi(profileId!),
    enabled: !!profileId,
  });

  const availMutation = useMutation({
    mutationFn: (available: boolean) => updateAvailabilityApi(profileId!, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-profile', profileId] });
      toast.success('Availability updated');
    },
    onError: () => toast.error('Failed to update availability'),
  });

  const editMutation = useMutation({
    mutationFn: (data: object) => updateDonorProfileApi(profileId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-profile', profileId] });
      toast.success('Profile updated');
      setEditMode(false);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleEditOpen = () => {
    setEditData({ name: profile?.name || '', city: profile?.city || '', phone: profile?.phone || '' });
    setEditMode(true);
  };

  const handleEditSave = () => {
    editMutation.mutate(editData);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );

  if (error || !profile) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-500 font-medium">Could not load profile</p>
        <p className="text-gray-400 text-sm mt-1">Please try again later</p>
      </div>
    </div>
  );

  const isAvailable = profile.availability === 'available';
  const initials = profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {editMode ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Edit Profile</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                    <input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
                      <select value={editData.city} onChange={e => setEditData(d => ({ ...d, city: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
                        <option value="">Select city</option>
                        {['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Kurunegala', 'Ratnapura', 'Anuradhapura', 'Batticaloa'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                      <input value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditMode(false)} className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg py-2 text-sm flex items-center justify-center gap-1">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                    <button onClick={handleEditSave} disabled={editMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1">
                      <Save className="w-3 h-3" /> {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">{initials}</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <BloodTypeBadge type={profile.blood_type as BloodType} size="md" />
                        <span className={`flex items-center gap-1 text-sm ${isAvailable ? 'text-green-600' : 'text-orange-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-orange-400'}`} />
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.city}, Sri Lanka</span>}
                        {profile.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {profile.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Available for Donation</span>
                      <button
                        onClick={() => availMutation.mutate(!isAvailable)}
                        disabled={availMutation.isPending}
                        className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                    <button onClick={handleEditOpen} className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-4 py-1.5 text-sm flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Droplets className="w-5 h-5 text-red-500" />, bg: 'bg-red-50', value: profile.total_donations, label: 'Donations' },
                { icon: <Heart className="w-5 h-5 text-red-400" />, bg: 'bg-pink-50', value: profile.lives_impacted || profile.total_donations * 3, label: 'Lives Impacted' },
                { icon: <Award className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50', value: `${profile.response_rate}%`, label: 'Response Rate' },
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Donation</span>
                  <span className="text-gray-900">{profile.last_donation || 'Never donated'}</span>
                </div>
                {profile.next_eligible_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next Eligible Date</span>
                    <span className="text-blue-600 font-medium">{profile.next_eligible_date}</span>
                  </div>
                )}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 font-medium text-sm">You're eligible to donate!</p>
                {profile.next_eligible_date && <p className="text-green-600 text-xs mt-0.5">Next eligible from {profile.next_eligible_date}</p>}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-red-600" /> Donation History</h3>
              {profile.donation_history?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No donation history yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.donation_history?.map((h: { id: string; hospital_name: string; patient_type: string; donated_at: string }) => (
                    <div key={h.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{h.hospital_name}</p>
                        <p className="text-xs text-gray-500">{h.patient_type}</p>
                      </div>
                      <span className="text-xs text-gray-400">{h.donated_at}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><Bell className="w-4 h-4 text-red-600" /> Find Requests</h3>
              <p className="text-xs text-gray-500 mb-3">Browse blood requests near you</p>
              <button
                onClick={() => window.location.href = '/requests'}
                className="w-full text-red-600 text-sm font-medium flex items-center justify-center gap-1 hover:underline"
              >
                View All Requests <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
