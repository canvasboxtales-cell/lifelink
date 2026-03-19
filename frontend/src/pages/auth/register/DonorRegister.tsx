import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Mail, Lock, Eye, EyeOff, Shield, User, Phone, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonorRegister() {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

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
          {step === 4 && <Step4 formData={formData} onBack={back} />}
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
      <button onClick={() => onNext({ email, password: pw })} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
    </div>
  );
}

function Step2({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
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
        <button onClick={() => onNext({ name, phone })} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function Step3({ onNext, onBack }: { onNext: (data: Record<string, string>) => void; onBack: () => void }) {
  const [bloodType, setBloodType] = useState('');
  const [weight, setWeight] = useState('50');
  const [lastDonation, setLastDonation] = useState('');
  const [medNotes, setMedNotes] = useState('');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Blood Type *</label>
          <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
            <option value="">Select</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="50" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          <p className="text-xs text-gray-400 mt-1">Minimum 50kg to donate</p>
        </div>
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
        <button onClick={() => onNext({ bloodType, weight })} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Next Step</button>
      </div>
    </div>
  );
}

function Step4({ formData, onBack }: { formData: Record<string, string>; onBack: () => void }) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          {[['Account Type', 'Blood Donor'], ['Email', formData.email || '-'], ['Name', formData.name || '-'], ['Blood Type', formData.bloodType || '-']].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500">{k}:</span>
              <span className="font-medium text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} className="mt-0.5 accent-red-600" />
        <span className="text-sm text-gray-600">I agree to the <span className="text-blue-600">Terms of Service</span> and understand my responsibilities as a blood donor.</span>
      </label>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} className="mt-0.5 accent-red-600" />
        <span className="text-sm text-gray-600">I have read and agree to the <span className="text-blue-600">Privacy Policy</span> and consent to data processing.</span>
      </label>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Data Protection & Privacy</p>
          <p className="text-xs text-green-600">All your information is encrypted and stored securely. We comply with healthcare data protection regulations. Your contact information will only be shared with verified healthcare facilities when you approve a match.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg py-2.5 font-medium">Back</button>
        <button onClick={() => toast.success('Account created successfully!')} disabled={!agreedTerms || !agreedPrivacy} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg py-2.5 font-medium">Create Account</button>
      </div>
    </div>
  );
}
