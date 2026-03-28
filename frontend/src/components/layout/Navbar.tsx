import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Droplets, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navLinks = () => {
    const base: string[][] = [['/', 'Home'], ['/find-blood', 'Find Blood']];
    if (!user) return [...base, ['/requests', 'Requests']];
    if (user.role === 'admin') return [...base, ['/admin', 'Admin'], ['/requests', 'Requests']];
    if (user.role === 'hospital') return [...base, ['/requests', 'Requests']];
    return [...base, ['/donor-profile', 'My Profile'], ['/requests', 'Requests']];
  };

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
          {navLinks().map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'}
              className={({ isActive }) => `text-sm font-medium pb-0.5 ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-red-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-300 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register/donor" className="border border-red-600 text-red-600 hover:bg-red-50 rounded-lg px-4 py-1.5 text-sm font-medium">
                Register as Donor
              </Link>
              <Link to="/signin" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
