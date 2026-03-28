import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Bot, Phone, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import MatchScoreCircle from '../components/ui/MatchScoreCircle';
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



const BLOOD_BANKS = [
  { name: 'All Blood Banks (Island-wide)', lat: 7.8731, lng: 80.7718 },
  { name: 'National Blood Center', lat: 6.89138, lng: 79.8778 },
  { name: 'Blood Bank - Anuradhapura Teaching Hospital', lat: 8.3258, lng: 80.4135 },
  { name: 'Blood Bank - Colombo North Teaching Hospital (Ragama)', lat: 7.02849, lng: 79.921 },
  { name: 'Blood Bank - Colombo South Teaching Hospital (Kalubowila)', lat: 6.86808, lng: 79.8748 },
  { name: 'Blood Bank - Galle National Hospital (Karapitiya)', lat: 6.047, lng: 80.22 },
  { name: 'Blood Bank - Jaffna Teaching Hospital', lat: 9.6692, lng: 80.2215 },
  { name: 'Blood Bank - Kandy National Hospital (Teaching)', lat: 7.2926, lng: 80.6337 },
  { name: 'Blood Bank - Peradeniya Teaching Hospital', lat: 7.2906, lng: 80.5907 },
  { name: 'Blood Bank - Ratnapura Teaching Hospital', lat: 6.6631, lng: 80.3968 },
  { name: 'Blood Bank - Teaching Hospital Badulla', lat: 6.9869, lng: 81.057 },
  { name: 'Blood Bank - Teaching Hospital Batticaloa', lat: 7.7111, lng: 81.6986 },
  { name: 'Blood Bank - Apeksha Hospital (National Cancer Institute)', lat: 6.8375, lng: 79.9202 },
  { name: 'Blood Bank - Teaching Hospital Mahamodara', lat: 6.03882, lng: 80.2057 },
  { name: 'Blood Bank - DGH Nuwara Eliya', lat: 6.97419, lng: 80.7802 },
  { name: 'Blood Bank - DGH Nawalapitiya', lat: 7.05312, lng: 80.5352 },
  { name: 'Blood Bank - DGH Kegalle', lat: 7.24748, lng: 80.3455 },
  { name: 'Blood Bank - DGH Embilipitiya', lat: 6.32594, lng: 80.8418 },
  { name: 'Blood Bank - DGH Kalutara', lat: 6.56324, lng: 79.9853 },
  { name: 'Blood Bank - DGH Gampaha', lat: 7.09134, lng: 80.0007 },
  { name: 'Blood Bank - DGH Negombo', lat: 7.21249, lng: 79.8484 },
  { name: 'Blood Bank - DGH Matale', lat: 7.46111, lng: 80.6247 },
  { name: 'Blood Bank - DGH Hambantota', lat: 6.12682, lng: 81.1226 },
  { name: 'Blood Bank - DGH Monaragala', lat: 6.89137, lng: 81.3426 },
  { name: 'Blood Bank - DGH Mannar', lat: 8.98238, lng: 79.9038 },
  { name: 'Blood Bank - DGH Vavuniya', lat: 8.7602, lng: 80.4999 },
  { name: 'Blood Bank - DGH Trincomalee', lat: 8.56491, lng: 81.2395 },
  { name: 'Blood Bank - DGH Chilaw', lat: 7.57235, lng: 79.7973 },
  { name: 'Blood Bank - DGH Polonnaruwa', lat: 7.94323, lng: 81.0096 },
  { name: 'Blood Bank - DGH Matara', lat: 5.948, lng: 80.5497 },
  { name: 'Blood Bank - DGH Kilinochchi', lat: 9.37274, lng: 80.4118 },
  { name: 'Blood Bank - DGH Ampara', lat: 7.29903, lng: 81.6894 },
  { name: 'Blood Bank - DGH Mullaitivu', lat: 9.22692, lng: 80.8005 },
  { name: 'Blood Bank - DGH Avissawella', lat: 6.95715, lng: 80.2074 },
  { name: 'Blood Bank - Base Hospital Homagama', lat: 6.84805, lng: 79.9917 },
  { name: 'Blood Bank - Base Hospital Dikoya', lat: 6.85515, lng: 80.6003 },
  { name: 'Blood Bank - Base Hospital Gampola', lat: 7.15649, lng: 80.565 },
  { name: 'Blood Bank - Base Hospital Panadura', lat: 6.72164, lng: 79.9068 },
  { name: 'Blood Bank - Kethumathi Maternity Hospital', lat: 6.71535, lng: 79.9086 },
  { name: 'Blood Bank - Base Hospital Wathupitiwala', lat: 7.12356, lng: 80.1097 },
  { name: 'Blood Bank - Base Hospital Dambulla', lat: 7.87265, lng: 80.6506 },
  { name: 'Blood Bank - Base Hospital Tangalle', lat: 6.02278, lng: 80.7975 },
  { name: 'Blood Bank - Base Hospital Balapitiya', lat: 6.26069, lng: 80.0382 },
  { name: 'Blood Bank - Base Hospital Elpitiya', lat: 6.29387, lng: 80.1643 },
  { name: 'Blood Bank - Base Hospital Kuliyapitiya', lat: 7.47207, lng: 80.0446 },
  { name: 'Blood Bank - Base Hospital Diyatalawa', lat: 6.80559, lng: 80.9563 },
  { name: 'Blood Bank - Base Hospital Mahiyanganaya', lat: 7.32552, lng: 80.991 },
  { name: 'Blood Bank - Base Hospital Valachchenai', lat: 7.91135, lng: 81.533 },
  { name: 'Blood Bank - Base Hospital Kaluvanchikudy', lat: 7.51737, lng: 81.7852 },
  { name: 'Blood Bank - Base Hospital Kantale', lat: 8.36674, lng: 81.0048 },
  { name: 'Blood Bank - Base Hospital Puttalam', lat: 8.02794, lng: 79.8387 },
  { name: 'Blood Bank - Base Hospital Medirigiriya', lat: 8.14324, lng: 80.9671 },
  { name: 'Blood Bank - Base Hospital Akkaraipattu', lat: 7.22774, lng: 81.8511 },
  { name: 'Blood Bank - Base Hospital Kalmunai South AMH', lat: 7.40321, lng: 81.8311 },
  { name: 'Blood Bank - Base Hospital Kalmunai North', lat: 7.42009, lng: 81.8223 },
  { name: 'Blood Bank - Base Hospital Point Pedro', lat: 9.80567, lng: 80.2248 },
  { name: 'Blood Bank - Base Hospital Tellipalai', lat: 9.78434, lng: 80.0387 },
  { name: 'Blood Bank - Base Hospital Thambuththegama', lat: 8.15374, lng: 80.2937 },
  { name: 'Blood Bank - National Institute of Infectious Diseases (IDH)', lat: 6.92239, lng: 79.917 },
  { name: 'Blood Bank - Base Hospital Mulleriyawa', lat: 6.92493, lng: 79.9429 },
  { name: 'Blood Bank - Base Hospital Rikillagaskada', lat: 7.14537, lng: 80.7826 },
  { name: 'Blood Bank - Base Hospital Teldeniya', lat: 7.30717, lng: 80.7643 },
  { name: 'Blood Bank - Base Hospital Karawanella', lat: 7.02456, lng: 80.2618 },
  { name: 'Blood Bank - Base Hospital Warakapola', lat: 7.22531, lng: 80.1961 },
  { name: 'Blood Bank - Base Hospital Mawanella', lat: 7.25358, lng: 80.4462 },
  { name: 'Blood Bank - Base Hospital Kahawatta', lat: 6.57887, lng: 80.5745 },
  { name: 'Blood Bank - Base Hospital Balangoda', lat: 6.65833, lng: 80.7125 },
  { name: 'Blood Bank - Base Hospital Meerigama', lat: 7.25833, lng: 80.1351 },
  { name: 'Blood Bank - Base Hospital Minuwangoda', lat: 7.17226, lng: 79.9562 },
  { name: 'Blood Bank - Base Hospital Tissamaharama', lat: 6.28531, lng: 81.2686 },
  { name: 'Blood Bank - Base Hospital Walasmulla', lat: 6.14694, lng: 80.6983 },
  { name: 'Blood Bank - Base Hospital Udugama', lat: 6.18814, lng: 80.3407 },
  { name: 'Blood Bank - Base Hospital Bibile', lat: 7.16402, lng: 81.2252 },
  { name: 'Blood Bank - Base Hospital Wellawaya', lat: 6.73062, lng: 81.0985 },
  { name: 'Blood Bank - Base Hospital Nikaweratiya', lat: 7.74751, lng: 80.1144 },
  { name: 'Blood Bank - Base Hospital Dambadeniya', lat: 7.34865, lng: 80.1373 },
  { name: 'Blood Bank - Base Hospital Galgamuwa', lat: 8.00127, lng: 80.2772 },
  { name: 'Blood Bank - Base Hospital Welimada', lat: 6.90894, lng: 80.9092 },
  { name: 'Blood Bank - Base Hospital Chettikulam', lat: 8.65894, lng: 80.3125 },
  { name: 'Blood Bank - Base Hospital Kattankudy', lat: 7.68527, lng: 81.7393 },
  { name: 'Blood Bank - Base Hospital Kinniya', lat: 8.5021, lng: 81.1878 },
  { name: 'Blood Bank - Base Hospital Muttur', lat: 8.45457, lng: 81.263 },
  { name: 'Blood Bank - Base Hospital Marawila', lat: 7.39347, lng: 79.8321 },
  { name: 'Blood Bank - Base Hospital Deniyaya', lat: 6.35768, lng: 80.568 },
  { name: 'Blood Bank - Base Hospital Kamburupitiya', lat: 6.09602, lng: 80.5646 },
  { name: 'Blood Bank - Base Hospital Potuvil', lat: 6.87621, lng: 81.8303 },
  { name: 'Blood Bank - Base Hospital Sammanturai', lat: 7.36839, lng: 81.813 },
  { name: 'Blood Bank - Base Hospital Chavakachcheri', lat: 9.66165, lng: 80.1668 },
  { name: 'Blood Bank - Base Hospital Kayts', lat: 9.69841, lng: 79.8659 },
  { name: 'Blood Bank - Base Hospital Padaviya', lat: 8.83238, lng: 80.769 },
  { name: 'Blood Bank - Base Hospital Mahaoya', lat: 7.53087, lng: 81.3556 },
  { name: 'Blood Bank - Base Hospital Dehiattakandiya', lat: 7.67299, lng: 81.0434 },
  { name: 'Blood Bank - Teaching Hospital Kurunegala', lat: 7.47913, lng: 80.3591 },
  { name: 'Blood Bank - National Hospital for Respiratory Diseases (Welisara)', lat: 7.02493, lng: 79.9035 },
  { name: 'Blood Bank - Lady Ridgeway Hospital for Children (LRH)', lat: 6.91771, lng: 79.8763 },
  { name: 'Blood Bank - Castle Street Hospital for Women (CSHW)', lat: 6.91021, lng: 79.8843 },
  { name: 'Blood Bank - Sri Jayawardhanepura General Hospital', lat: 6.86877, lng: 79.9256 },
  { name: 'Blood Bank - National Institute for Nephrology, Dialises & Transplantation (Maligawatta)', lat: 6.93241, lng: 79.8716 },
  { name: 'Blood Bank - De Soysa Hospital for Women (DMH)', lat: 6.92002, lng: 79.8706 },
  { name: 'South Regional Blood Centre - Kamburugamuwa', lat: 5.94182, lng: 80.4974 },
  { name: 'Blood Bank - Base Hospital Medawachchiya', lat: 8.541, lng: 80.4733 },
  { name: 'Blood Bank - University Hospital KDU', lat: 6.82483, lng: 79.9071 },
  { name: 'Blood Bank - Army Hospital', lat: 6.89989, lng: 79.8757 },
  { name: 'Blood Bank - DGH Horana', lat: 6.71069, lng: 80.0657 },
  { name: 'Blood Bank - Base Hospital Eheliyagoda', lat: 6.84823, lng: 80.2642 },
];

export default function FindBlood() {
  const [bloodType, setBloodType] = useState('');
  const [radius, setRadius] = useState(10);
  const [availability, setAvailability] = useState('available');
  const [minDonations, setMinDonations] = useState(0);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isRadiusActive, setIsRadiusActive] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data: donors = [], isLoading, isFetching } = useQuery({
    queryKey: ['donors-search', searchParams],
    queryFn: () => {
      if (!searchParams) return [];
      return searchDonorsApi({
        blood_type: searchParams.blood_type === 'ALL' ? undefined : (searchParams.blood_type || undefined),
        radius_km: searchParams.radius_km,
        lat: searchParams.lat,
        lng: searchParams.lng,
        min_donations: searchParams.min_donations,
        availability: searchParams.availability || undefined,
      });
    },
    enabled: !!searchParams,
    staleTime: Infinity,
    gcTime: 0, // Clears cache when filter changes
  });

  const applyFilters = () => {
    if (!bloodType) {
      toast.error('Please select a Blood Type');
      return;
    }
    if (!location) {
      toast.error('Please select a Search Location or use GPS');
      return;
    }
    const searchRadius = isRadiusActive ? radius : 10000;

    setCurrentPage(1);
    setSearchParams({ 
      blood_type: bloodType, 
      radius_km: searchRadius, 
      availability, 
      min_donations: minDonations, 
      lat: location.lat, 
      lng: location.lng 
    });
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-5">
                <Filter className="w-4 h-4" /> Filters
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">Blood Type Needed</label>
                  <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none">
                    <option value="" disabled>Select a blood type...</option>
                    <option value="ALL">All Types</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600 font-medium">Search Radius {isRadiusActive ? `: ${radius} km` : '(Disabled)'}</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={isRadiusActive} onChange={e => setIsRadiusActive(e.target.checked)} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <input type="range" min="1" max="50" value={radius} onChange={e => setRadius(Number(e.target.value))} disabled={!isRadiusActive} className={`w-full accent-red-600 ${!isRadiusActive ? 'opacity-50 cursor-not-allowed' : ''}`} />
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
                  <input type="number" value={minDonations} onChange={e => setMinDonations(Number(e.target.value))} min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <label className="text-sm text-gray-600 font-medium block mb-2">Search Location</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none mb-3"
                    onChange={(e) => {
                      if (e.target.value) {
                         const bank = BLOOD_BANKS.find(b => b.name === e.target.value);
                         if (bank) {
                            setLocation({ lat: bank.lat, lng: bank.lng });
                            setLocationLabel(bank.name);
                         }
                      }
                    }}
                  >
                    <option value="">Select a blood bank...</option>
                    {BLOOD_BANKS.map(b => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>

                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center text-center border border-gray-100">
                    <MapPin className="w-5 h-5 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 font-medium mb-2 leading-tight">{locationLabel || 'No location selected'}</p>
                    <button onClick={useMyLocation} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> Or use GPS location
                    </button>
                  </div>
                </div>
                <button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Donor List */}
          <div className="flex-1">
            {searchParams && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{donors.length} donors</span> found · {searchParams.radius_km > 1000 ? 'Island-wide Search' : `within ${searchParams.radius_km} km`}
                  {searchParams.blood_type && ` · ${searchParams.blood_type === 'ALL' ? 'All Blood Types' : searchParams.blood_type}`}
                </p>
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option>Sort by Match Score</option>
                </select>
              </div>
            )}

            {!searchParams && (
              <div className="bg-white rounded-xl border-dashed border-2 border-gray-200 shadow-sm p-16 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Apply Filters to Search</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">Please select a blood type and location from the sidebar filters to find the best compatible donors nearby.</p>
              </div>
            )}

            {(isLoading || isFetching) && searchParams && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-[90px] h-[90px] rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-3 pt-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="grid grid-cols-4 gap-3 pt-3">
                          <div className="h-8 bg-gray-200 rounded" />
                          <div className="h-8 bg-gray-200 rounded" />
                          <div className="h-8 bg-gray-200 rounded" />
                          <div className="h-8 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !isFetching && searchParams && donors.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No donors found</p>
                <p className="text-gray-400 text-sm mt-1">Try increasing the search radius or changing the blood type filter</p>
              </div>
            )}

            {!isLoading && !isFetching && searchParams && donors.length > 0 && (
              <>
                <div className="space-y-4">
                  {donors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((donor: DonorResult) => (
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
                              ['Response Rate', `${Number(donor.response_rate).toFixed(2)}%`, 'text-green-600'],
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
                
                {donors.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, donors.length)} of {donors.length} donors
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(donors.length / ITEMS_PER_PAGE), p + 1))}
                        disabled={currentPage >= Math.ceil(donors.length / ITEMS_PER_PAGE)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
