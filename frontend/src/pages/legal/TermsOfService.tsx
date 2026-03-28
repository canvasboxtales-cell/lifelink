import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose max-w-none text-gray-600 space-y-6">
        <p>Last updated: October 2026</p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
        <p>Welcome to LifeLink. By accessing or using our platform, you agree to be bound by these Terms of Service. LifeLink is a platform designed to connect blood donors with hospitals and patients in need across Sri Lanka.</p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. User Responsibilities</h2>
        <p>As a registered donor or hospital representative:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must provide accurate medical and contact information.</li>
          <li>You acknowledge that you are at least 18 years old or possess legal parental consent.</li>
          <li>You agree not to use the service for any malicious, fraudulent, or commercial purposes.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Medical Disclaimer</h2>
        <p>LifeLink serves strictly as a logistical match-making platform. We do not provide medical advice, diagnosis, or treatment. All blood collections and medical decisions are the exclusive responsibility of the verifiable healthcare institutions.</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Liability</h2>
        <p>LifeLink and its developers shall not be held liable for any health complications arising from blood donations, delays in emergency processing, or discrepancies in donor eligibility. Donations are made voluntarily at your own risk.</p>
      </div>
    </div>
  );
}
