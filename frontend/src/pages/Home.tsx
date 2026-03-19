import { Link } from 'react-router-dom';
import { Flame, MapPin, Users, Heart, TrendingUp, Droplets, Bell } from 'lucide-react';
import StatCard from '../components/ui/StatCard';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-full px-3 py-1 text-sm font-medium mb-6">
            <Flame className="w-4 h-4" /> AI-Powered Blood Matching
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Save Lives with<br /><span className="text-red-600">Smart Blood Donation</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Connecting donors and recipients across Sri Lanka using intelligent matching algorithms. Every donation counts, every match matters.
          </p>
          <div className="flex gap-4 mb-8">
            <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4" /> Become a Donor
            </Link>
            <Link to="/find-blood" className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-6 py-3 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Find Blood Now
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#C0392B','#E74C3C','#922B21','#CB4335'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: c }}>
                  <Droplets className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">2,500+ Active Donors</p>
              <p className="text-gray-500 text-xs">Ready to help 24/7</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Perfect Match Found!</p>
                <p className="text-sm text-gray-500">O+ Blood • 2.3km away</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Compatibility</span>
                <span className="text-green-600 font-semibold">98% Match</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs font-semibold text-gray-800">3 Urgent Requests</p>
                <p className="text-xs text-gray-500">In your area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Donors" value="2,547" change="↑ 12% this month" icon={<Users className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
        <StatCard title="Lives Saved" value="1,823" change="↑ 143 this week" icon={<Heart className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" />
        <StatCard title="Success Rate" value="96.5%" change="↑ 2.3% increase" icon={<TrendingUp className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
        <StatCard title="Active Requests" value="47" icon={<Droplets className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" />
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">How It Works</h2>
          <p className="text-center text-gray-500 mb-10">Three simple steps to make a difference</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: 1, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', title: 'Register as Donor', desc: 'Create your profile with blood type, location, and medical history in minutes' },
              { n: 2, icon: <TrendingUp className="w-6 h-6 text-orange-500" />, bg: 'bg-orange-50', title: 'AI Matches You', desc: 'Our intelligent system finds compatible recipients based on multiple factors' },
              { n: 3, icon: <Heart className="w-6 h-6 text-red-500" />, bg: 'bg-red-50', title: 'Save a Life', desc: "Get notified when you're a match and coordinate donation at nearby facilities" },
            ].map(({ n, icon, bg, title, desc }) => (
              <div key={n} className="relative bg-gray-50 rounded-xl p-6 border border-gray-100">
                <span className="absolute top-4 right-4 text-5xl font-bold text-gray-100">{n}</span>
                <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Need */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-red-800 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-red-300" />
              <span className="text-red-300 text-xs font-semibold tracking-widest uppercase">Urgent Need</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Blood Needed Now</h2>
            <p className="text-red-200 mb-4">5 critical patients waiting for O-, AB+, and B+ blood types in Colombo area</p>
            <div className="flex gap-2">
              {['O-', 'AB+', 'B+'].map(t => (
                <span key={t} className="bg-red-700 text-white px-3 py-1 rounded-full text-sm font-bold">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-48">
            <Link to="/register" className="bg-white text-red-700 font-semibold px-6 py-2 rounded-lg text-center hover:bg-red-50">
              I Can Donate
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Make a Difference?</h2>
          <p className="text-gray-500 mb-8">Join thousands of donors across Sri Lanka using AI-powered matching to save lives efficiently</p>
          <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-8 py-3 font-medium inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
