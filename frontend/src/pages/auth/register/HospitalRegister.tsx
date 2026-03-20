import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, Shield, MapPin, Phone, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerHospitalApi } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';

const CITY_COORDS: Record<string, [number, number]> = {
  'Colombo': [6.9271, 79.8612],
  'Kandy': [7.2906, 80.6337],
  'Galle': [6.0535, 80.2210],
  'Jaffna': [9.6615, 80.0255],
  'Negombo': [7.2081, 79.8358],
  'Matara': [5.9549, 80.5550],
  'Kurunegala': [7.4818, 80.3609],
  'Ratnapura': [6.6828, 80.3992],
  'Anuradhapura': [8.3114, 80.4037],
  'Batticaloa': [7.7102, 81.6924],
};

export default function HospitalRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const next = (data?: Record<string, string>) => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const stepTitles = ['Account Information', 'Hospital Information', 'Location & Contact', 'Terms & Confirmation'];
  const stepDescs = ['Create your account credentials', 'Tell us about your facility', 'Facility location details', 'Review and accept our policies'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-8" style={{ background: 'linear-gradient(180deg, #FECDD3 0%, #BFDBFE 100%)' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-4 gap-4">
          <Link to="/register" className="text-gray-600 text-sm flex items-center gap-1 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /> Back</Link>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center"><Building2 className="w-6 h-6 text-white" /></div>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Hospital Registration</h1>
          <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-red-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-7">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{stepTitles[step - 1]}</h2>
          <p className="text-gray-400 text-sm mb-5">{stepDescs[step - 1]}</p>
          {step === 1 && <HospStep1 onNext={next} />}
          {step === 2 && <HospStep2 onNext={next} onBack={back} />}
          {step === 3 && <HospStep3 onNext={next} onBack={back} />}
          {step === 4 && (
            <HospStep4
              formData={formData}
              onBack={back}
              onSubmit={async (agreedTerms, agreedPrivacy) => {
                const coords = CITY_COORDS[formData.city] || null;
                const payload = {
                  email: formData.email,
                  password: formData.password,
                  hospital_name: formData.hospitalName,
                  facility_type: formData.facilityType || undefined,
                  license_number: formData.license || undefined,
                  contact_phone: formData.phone || undefined,
                  address: formData.address || undefined,
                  city: formData.city || undefined,
                  latitude: coords ? coords[0] : undefined,
                  longitude: coords ? coords[1] : undefined,
                  agreed_terms: agreedTerms,
                  agreed_privacy: agreedPrivacy,
                };
                const res = await registerHospitalApi(payload);
                setAuth(
                  {
                    id: res.user.id,
                    email: res.user.email,
                    role: res.user.role,
                    name: res.user.name,
                    profileId: res.user.profile_id,
                  },
                  res.access_token
                );
                toast.success('Hospital account created! Welcome to LifeLink.');
                navigate('/requests');
              }}
            />
          )}
        </div>
        {step === 1 && (
          <p className="text-center text-sm text-gray-600 mt-4">Already have an account? <Link to="/signin" className="text-red-600 font-bold">Sign In</Link></p>
        )}
      </div>
    </div>
  );
}

function HospStep1({ onNext }: { onNext: (data: Record<string, string>) => void }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleNext = () => {
    if (!email || !pw) { toast.error('Email and password are required'); return; }
    if (pw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (pw !== cpw) { toast.error('Passwords do not match'); return; }
    onNext({ email, password: pw });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Email Address *</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={pw} onChange={e => setPw(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters" className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-3 text-gray-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={cpw} onChange={e => setCpw(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Re-enter your password" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Secure & Private</p>
          <p className="text-xs text-blue-600">Your data is encrypted and protected.</p>
        </div>
      </div>
      <button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
    </div>
  );
}

function HospStep2({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [hospitalName, setHospitalName] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [license, setLicense] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!hospitalName) { toast.error('Hospital name is required'); return; }
    onNext({ hospitalName, facilityType, license, phone });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Hospital/Facility Name *</label>
        <div className="relative">
          <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={hospitalName} onChange={e => setHospitalName(e.target.value)} placeholder="Enter hospital name" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Facility Type *</label>
          <select value={facilityType} onChange={e => setFacilityType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
            <option value="">Select</option>
            {['General Hospital', 'Surgical Hospital', 'Blood Bank', 'Medical Center', 'Clinic'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">License Number *</label>
          <input value={license} onChange={e => setLicense(e.target.value)} placeholder="Facility license number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Contact Phone *</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function HospStep3({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Address *</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none h-20 resize-none" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">City/District *</label>
        <select value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Select city</option>
          {['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Kurunegala', 'Ratnapura', 'Anuradhapura', 'Batticaloa'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button onClick={() => onNext({ address, city })} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function HospStep4({
  formData,
  onBack,
  onSubmit,
}: {
  formData: Record<string, string>;
  onBack: () => void;
  onSubmit: (agreedTerms: boolean, agreedPrivacy: boolean) => Promise<void>;
}) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onSubmit(agreedTerms, agreedPrivacy);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          {[
            ['Account Type', 'Hospital Staff'],
            ['Email', formData.email || '-'],
            ['Hospital', formData.hospitalName || '-'],
            ['City', formData.city || '-'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500">{k}:</span>
              <span className="font-medium text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} className="mt-0.5 accent-red-600" />
        <span className="text-sm text-gray-600">I agree to the <span className="text-blue-600">Terms of Service</span> and understand my responsibilities as a healthcare provider.</span>
      </label>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} className="mt-0.5 accent-red-600" />
        <span className="text-sm text-gray-600">I have read and agree to the <span className="text-blue-600">Privacy Policy</span> and consent to data processing.</span>
      </label>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Data Protection & Privacy</p>
          <p className="text-xs text-green-600">All your information is encrypted and stored securely. Your facility information will be verified before activation.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button
          onClick={handleCreate}
          disabled={!agreedTerms || !agreedPrivacy || loading}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg py-2.5 font-medium"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
