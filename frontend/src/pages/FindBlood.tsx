import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Bot, Phone, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import MatchScoreCircle from '../components/ui/MatchScoreCircle';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { searchDonorsApi } from '../api/donors';
import type { BloodType } from '../types';

interface DonorResult {
  id: string;
  name: string;
  blood_type: string;
  location: string;
  distance_km: number;
  match_score: number;
  total_donations: number;
  response_rate: number;
  last_donation: string;
  availability: string;
  ai_recommendation: string;
}

interface SearchParams {
  blood_type: string;
  radius_km: number;
  availability: string;
  min_donations: number;
  lat: number;
  lng: number;
}

const DEFAULT_LOCATION = { lat: 6.9271, lng: 79.8612 }; // Colombo

export default function FindBlood() {
  const [bloodType, setBloodType] = useState('');
  const [radius, setRadius] = useState(10);
  const [availability, setAvailability] = useState('available');
  const [minDonations, setMinDonations] = useState(0);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState('Colombo (default)');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    blood_type: '', radius_km: 10, availability: 'available', min_donations: 0, ...DEFAULT_LOCATION,
  });

  const { data: donors = [], isLoading, isFetching } = useQuery({
    queryKey: ['donors-search', searchParams],
    queryFn: () => searchDonorsApi({
      blood_type: searchParams.blood_type || undefined,
      radius_km: searchParams.radius_km,
      lat: searchParams.lat,
      lng: searchParams.lng,
      min_donations: searchParams.min_donations,
      availability: searchParams.availability || undefined,
    }),
  });

  const applyFilters = () => {
    setSearchParams({ blood_type: bloodType, radius_km: radius, availability, min_donations: minDonations, lat: location.lat, lng: location.lng });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setLocationLabel('Your location');
        toast.dismiss();
        toast.success('Location updated');
      },
      () => { toast.dismiss(); toast.error('Could not get location'); }
    );
  };

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
                  <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none">
                    <option value="">All Types</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t}>{t}</option>)}
                  </select>
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
                  <MapPin className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 mb-2">{locationLabel}</p>
                  <button onClick={useMyLocation} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Use my location
                  </button>
                </div>
                <button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Donor List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{donors.length} donors</span> found · within {searchParams.radius_km} km
                {searchParams.blood_type && ` · ${searchParams.blood_type}`}
              </p>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                <option>Sort by Match Score</option>
              </select>
            </div>

            {(isLoading || isFetching) && (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            )}

            {!isLoading && !isFetching && donors.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No donors found</p>
                <p className="text-gray-400 text-sm mt-1">Try increasing the search radius or changing the blood type filter</p>
              </div>
            )}

            {!isLoading && !isFetching && (
              <div className="space-y-4">
                {donors.map((donor: DonorResult) => (
                  <div key={donor.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex gap-4">
                      <MatchScoreCircle score={donor.match_score} size={90} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <BloodTypeBadge type={donor.blood_type as BloodType} />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" /> {donor.location} · {donor.distance_km}km away
                          <span className={`ml-2 w-2 h-2 rounded-full inline-block ${donor.availability === 'available' ? 'bg-green-500' : 'bg-orange-400'}`} />
                          <span className={donor.availability === 'available' ? 'text-green-600' : 'text-orange-500'}>
                            {donor.availability === 'available' ? 'Available' : 'Pending'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                          {[
                            ['Total Donations', donor.total_donations, 'text-gray-900'],
                            ['Response Rate', `${donor.response_rate}%`, 'text-green-600'],
                            ['Last Donation', donor.last_donation, 'text-gray-900'],
                            ['Distance', `${donor.distance_km} km`, 'text-blue-600'],
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
                            <p className="text-xs text-gray-600">{donor.ai_recommendation}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Contact Donor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
