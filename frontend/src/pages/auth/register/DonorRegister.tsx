import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Mail, Lock, Eye, EyeOff, Shield, User, Phone, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerDonorApi } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';

const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const CITY_COORDS: Record<string, [number, number]> = {
  'Ampara': [7.2840, 81.6724],
  'Anuradhapura': [8.3114, 80.4037],
  'Badulla': [6.9895, 80.8524],
  'Batticaloa': [7.7102, 81.6924],
  'Colombo': [6.9271, 79.8612],
  'Galle': [6.0535, 80.2210],
  'Gampaha': [7.0873, 79.9984],
  'Hambantota': [6.1246, 81.1185],
  'Jaffna': [9.6615, 80.0255],
  'Kalutara': [6.5854, 79.9607],
  'Kandy': [7.2906, 80.6337],
  'Kegalle': [7.2513, 80.3464],
  'Kilinochchi': [9.3803, 80.3770],
  'Kurunegala': [7.4818, 80.3609],
  'Mannar': [8.9810, 79.9044],
  'Matale': [7.4675, 80.6234],
  'Matara': [5.9549, 80.5550],
  'Monaragala': [6.8728, 81.3471],
  'Mullaitivu': [9.2671, 80.8142],
  'Nuwara Eliya': [6.9497, 80.7828],
  'Polonnaruwa': [7.9403, 81.0188],
  'Puttalam': [8.0362, 79.8283],
  'Ratnapura': [6.6828, 80.3992],
  'Trincomalee': [8.5874, 81.2152],
  'Vavuniya': [8.7514, 80.4971]
};

export default function DonorRegister() {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
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

  const stepTitles = ['Account Information', 'Personal Details', 'Blood & Medical Information', 'Terms & Confirmation'];
  const stepDescs = ['Create your account credentials', 'Tell us about yourself', 'Medical and donation details', 'Review and accept our policies'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-8" style={{ background: 'linear-gradient(180deg, #FECDD3 0%, #BFDBFE 100%)' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-4 gap-4">
          <Link to="/register" className="text-gray-600 text-sm flex items-center gap-1 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /> Back</Link>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center"><Droplets className="w-6 h-6 text-white" /></div>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Donor Registration</h1>
          <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-red-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-7">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{stepTitles[step - 1]}</h2>
          <p className="text-gray-400 text-sm mb-5">{stepDescs[step - 1]}</p>

          {step === 1 && (
            <Step1 showPw={showPw} setShowPw={setShowPw} showCPw={showCPw} setShowCPw={setShowCPw} onNext={next} />
          )}
          {step === 2 && <Step2 onNext={next} onBack={back} />}
          {step === 3 && <Step3 onNext={next} onBack={back} />}
          {step === 4 && (
            <Step4
              formData={formData}
              onBack={back}
              onSubmit={async (agreedTerms, agreedPrivacy) => {
                const coords = CITY_COORDS[formData.city] || null;
                const payload = {
                  email: formData.email,
                  password: formData.password,
                  name: formData.name,
                  phone: formData.phone || undefined,
                  national_id: formData.nid || undefined,
                  date_of_birth: formData.dob || undefined,
                  blood_type: formData.bloodType,
                  weight_kg: formData.weight ? Number(formData.weight) : undefined,
                  last_donation_date: formData.lastDonation || undefined,
                  medical_notes: formData.medNotes || undefined,
                  city: formData.city || undefined,
                  latitude: coords ? coords[0] : undefined,
                  longitude: coords ? coords[1] : undefined,
                  agreed_terms: agreedTerms,
                  agreed_privacy: agreedPrivacy,
                };
                const res = await registerDonorApi(payload);
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
                toast.success('Account created! Welcome to LifeLink.');
                navigate('/donor-profile');
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

function Step1({ showPw, setShowPw, showCPw, setShowCPw, onNext }: {
  showPw: boolean;
  setShowPw: (v: boolean | ((prev: boolean) => boolean)) => void;
  showCPw: boolean;
  setShowCPw: (v: boolean | ((prev: boolean) => boolean)) => void;
  onNext: (data: Record<string, string>) => void;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');

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
          <input value={cpw} onChange={e => setCpw(e.target.value)} type={showCPw ? 'text' : 'password'} placeholder="Re-enter your password" className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-3 text-gray-400">{showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Secure & Private</p>
          <p className="text-xs text-blue-600">Your data is encrypted and protected. We never share your information without permission.</p>
        </div>
      </div>
      <button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
    </div>
  );
}

function Step2({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');

  const handleNext = () => {
    if (!name) { toast.error('Full name is required'); return; }
    onNext({ name, dob, phone, nid });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Date of Birth *</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">National ID Number (Optional)</label>
        <input value={nid} onChange={e => setNid(e.target.value)} placeholder="XXXXXXXXXV" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        <p className="text-xs text-gray-400 mt-1">For verification purposes only</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function Step3({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [bloodType, setBloodType] = useState('');
  const [weight, setWeight] = useState('50');
  const [lastDonation, setLastDonation] = useState('');
  const [medNotes, setMedNotes] = useState('');
  const [city, setCity] = useState('');

  const handleNext = () => {
    if (!bloodType) { toast.error('Blood type is required'); return; }
    onNext({ bloodType, weight, lastDonation, medNotes, city });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Blood Type *</label>
          <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="50" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          <p className="text-xs text-gray-400 mt-1">Minimum 50kg to donate</p>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">City / District</label>
        <select value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Select your city</option>
          {DISTRICTS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Last Donation Date (Optional)</label>
        <input type="date" value={lastDonation} onChange={e => setLastDonation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        <p className="text-xs text-gray-400 mt-1">Leave blank if you've never donated before</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Medical Conditions / Allergies (Optional)</label>
        <textarea value={medNotes} onChange={e => setMedNotes(e.target.value)} placeholder="List any medical conditions, medications, or allergies that might affect blood donation" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none" />
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <p className="text-sm font-medium text-orange-800">Eligibility Note</p>
        <p className="text-xs text-orange-600">You must be 18-65 years old, weigh at least 50kg, and be in good health to donate blood.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function Step4({
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
            ['Account Type', 'Blood Donor'],
            ['Email', formData.email || '-'],
            ['Name', formData.name || '-'],
            ['Blood Type', formData.bloodType || '-'],
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
        <span className="text-sm text-gray-600">I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms of Service</Link> and understand my responsibilities as a blood donor.</span>
      </label>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} className="mt-0.5 accent-red-600" />
        <span className="text-sm text-gray-600">I have read and agree to the <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</Link> and consent to data processing.</span>
      </label>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Data Protection & Privacy</p>
          <p className="text-xs text-green-600">All your information is encrypted and stored securely. We comply with healthcare data protection regulations.</p>
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
