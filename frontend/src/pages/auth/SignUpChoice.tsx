import { Link } from 'react-router-dom';
import { Droplets, Building2 } from 'lucide-react';

export default function SignUpChoice() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #FECDD3 0%, #BFDBFE 100%)' }}>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Join LifeLink</h1>
        <p className="text-gray-500 text-sm">Choose how you'd like to contribute to saving lives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Donor Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Register as Donor</h2>
          <p className="text-gray-500 text-sm mb-5">Become a life-saving hero by donating blood to those in need. Get matched with recipients using AI-powered technology.</p>
          <ul className="text-left space-y-2 mb-6">
            {['AI-powered matching with recipients', 'Track your donation history', 'Get notified of nearby requests', 'Earn recognition badges', 'Help save lives in your community'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs flex-shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link to="/register/donor" className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium">Continue as Donor</Link>
        </div>

        {/* Hospital Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hospital Staff Access</h2>
          <p className="text-gray-500 text-sm mb-5">Healthcare facility registration for blood banks, hospitals, and medical centers to request blood donations.</p>
          <ul className="text-left space-y-2 mb-6">
            {['Submit urgent blood requests', 'AI-powered donor matching', 'Real-time donor availability', 'Request tracking dashboard', 'Direct donor communication'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link to="/register/hospital" className="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium">Continue as Hospital Staff</Link>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-6">Already have an account? <Link to="/signin" className="text-red-600 font-bold hover:underline">Sign In</Link></p>
    </div>
  );
}
