import { useState } from 'react';
import { Search, Filter, Bot, Phone, User, Mail, MapPin } from 'lucide-react';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import MatchScoreCircle from '../components/ui/MatchScoreCircle';
import type { Donor, BloodType } from '../types';

const MOCK_DONORS: Donor[] = [
  { id: '1', name: 'Kasun Perera', bloodType: 'O+', location: 'Colombo 07', distanceKm: 2.3, matchScore: 98, totalDonations: 12, responseRate: 94, lastDonationDate: 'Nov 10', availability: 'available', aiRecommendation: 'High compatibility based on blood type, proximity (2.3km), and excellent response history (94% response rate)', donationHistory: [] },
  { id: '2', name: 'Anjali Silva', bloodType: 'O+', location: 'Wellawatte', distanceKm: 3.8, matchScore: 95, totalDonations: 8, responseRate: 89, lastDonationDate: 'Oct 15', availability: 'available', aiRecommendation: 'High compatibility based on blood type, proximity (3.8km), and excellent response history (89% response rate)', donationHistory: [] },
  { id: '3', name: 'Rajith Fernando', bloodType: 'O+', location: 'Dehiwala', distanceKm: 5.2, matchScore: 92, totalDonations: 15, responseRate: 97, lastDonationDate: 'Sep 28', availability: 'available', aiRecommendation: 'High compatibility based on blood type, proximity (5.2km), and excellent response history (97% response rate)', donationHistory: [] },
  { id: '4', name: 'Nimali Jayawardena', bloodType: 'O+', location: 'Mount Lavinia', distanceKm: 7.1, matchScore: 88, totalDonations: 6, responseRate: 85, lastDonationDate: 'Dec 5', availability: 'pending', aiRecommendation: 'High compatibility based on blood type, proximity (7.1km), and excellent response history (85% response rate)', donationHistory: [] },
  { id: '5', name: 'Chaminda Wickramasinghe', bloodType: 'O-', location: 'Nugegoda', distanceKm: 6.5, matchScore: 85, totalDonations: 20, responseRate: 92, lastDonationDate: 'Aug 20', availability: 'available', aiRecommendation: 'High compatibility based on blood type, proximity (6.5km), and excellent response history (92% response rate)', donationHistory: [] },
];

export default function FindBlood() {
  const [bloodType, setBloodType] = useState('');
  const [radius, setRadius] = useState(10);
  const [availability, setAvailability] = useState('available');
  const [minDonations, setMinDonations] = useState(0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Blood Donors</h1>
        <p className="text-gray-500 mb-8">AI-powered matching to find the best compatible donors</p>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-5">
                <Filter className="w-4 h-4" /> Filters
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">Blood Type Needed</label>
                  <input value={bloodType} onChange={e => setBloodType(e.target.value)} placeholder="e.g., O+" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">Search Radius: {radius} km</label>
                  <input type="range" min="1" max="50" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full accent-red-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 km</span><span>50 km</span></div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-2">Availability Status</label>
                  {[['available', 'Available Now'], ['pending', 'Pending Response'], ['', 'Show All']].map(([val, label]) => (
                    <label key={label} className="flex items-center gap-2 text-sm text-gray-600 mb-1 cursor-pointer">
                      <input type="radio" name="avail" checked={availability === val} onChange={() => setAvailability(val)} className="accent-red-600" /> {label}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">Minimum Donations</label>
                  <input type="number" value={minDonations} onChange={e => setMinDonations(Number(e.target.value))} min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center border border-gray-100">
                  <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Interactive map with donor clustering</p>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Donor List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600"><span className="font-semibold">{MOCK_DONORS.length} donors</span> found · showing results within {radius} km for {bloodType || 'O+'}</p>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                <option>Sort by Match Score</option>
                <option>Sort by Distance</option>
                <option>Sort by Donations</option>
              </select>
            </div>
            <div className="space-y-4">
              {MOCK_DONORS.map(donor => (
                <div key={donor.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex gap-4">
                    <MatchScoreCircle score={donor.matchScore} size={90} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                        <BloodTypeBadge type={donor.bloodType as BloodType} />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" /> {donor.location} • {donor.distanceKm}km away
                        <span className={`ml-2 w-2 h-2 rounded-full inline-block ${donor.availability === 'available' ? 'bg-green-500' : 'bg-orange-400'}`} />
                        <span className={donor.availability === 'available' ? 'text-green-600' : 'text-orange-500'}>
                          {donor.availability === 'available' ? 'Available' : 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                        {[
                          ['Total Donations', donor.totalDonations, 'text-gray-900'],
                          ['Response Rate', `${donor.responseRate}%`, 'text-green-600'],
                          ['Last Donation', donor.lastDonationDate, 'text-gray-900'],
                          ['Distance', `${donor.distanceKm} km`, 'text-blue-600'],
                        ].map(([label, value, cls]) => (
                          <div key={label as string}>
                            <p className="text-gray-400 text-xs">{label}</p>
                            <p className={`font-semibold ${cls}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 flex gap-2">
                        <Bot className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-blue-700 mb-0.5">AI Recommendation</p>
                          <p className="text-xs text-gray-600">{donor.aiRecommendation}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Contact Donor
                        </button>
                        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-1.5 text-sm flex items-center gap-1">
                          <User className="w-3 h-3" /> View Profile
                        </button>
                        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-1.5 text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Send Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-6 py-2 text-sm font-medium">
                Load More Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
