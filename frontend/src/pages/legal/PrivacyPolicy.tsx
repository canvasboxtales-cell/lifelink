import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose max-w-none text-gray-600 space-y-6">
        <p>Last updated: October 2026</p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Data Collection</h2>
        <p>When you register on LifeLink, we collect personal information necessary to facilitate blood matching. This includes name, contact details, precise location (GPS coordinates), blood type, and standard medical screening notes.</p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Location Data</h2>
        <p>Your geographic coordinates are utilized purely for the platform's AI matching algorithms to calculate proximity between you and emergency requests. We do not track your real-time movement and data is bound strictly to your registered location.</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security & Encryption</h2>
        <p>All sensitive medical data and location coordinates are protected under industry-standard encryption. LifeLink complies with healthcare data protection guidelines to ensure your medical history remains strictly confidential between you and registered hospitals.</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Sharing</h2>
        <p>We do not sell or share your data with advertisers. Your contact information and blood profile is exclusively shared with verified hospital administrators when your profile algorithmically matches an emergency blood request.</p>
      </div>
    </div>
  );
}
