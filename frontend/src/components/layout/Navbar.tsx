import { Link, NavLink } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          LifeLink
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {[['/', 'Home'], ['/find-blood', 'Find Blood'], ['/donor-profile', 'Donor Profile'], ['/admin', 'Admin'], ['/requests', 'Requests']].map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'}
              className={({ isActive }) => `text-sm font-medium pb-0.5 ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/register" className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-4 py-1.5 text-sm font-medium">
            Register as Donor
          </Link>
          <Link to="/find-blood" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium">
            Find Blood
          </Link>
        </div>
      </div>
    </nav>
  );
}
