import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import FindBlood from './pages/FindBlood';
import DonorProfile from './pages/DonorProfile';
import AdminDashboard from './pages/AdminDashboard';
import RequestManagement from './pages/RequestManagement';
import SignIn from './pages/auth/SignIn';
import SignUpChoice from './pages/auth/SignUpChoice';
import DonorRegister from './pages/auth/register/DonorRegister';
import HospitalRegister from './pages/auth/register/HospitalRegister';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function RequireAuth({ children, role }: { children: ReactNode; role?: string }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/signin" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RequireGuest({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'donor') return <Navigate to="/donor-profile" replace />;
    return <Navigate to="/requests" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/signin" element={<RequireGuest><SignIn /></RequireGuest>} />
          <Route path="/register" element={<RequireGuest><SignUpChoice /></RequireGuest>} />
          <Route path="/register/donor" element={<RequireGuest><DonorRegister /></RequireGuest>} />
          <Route path="/register/hospital" element={<RequireGuest><HospitalRegister /></RequireGuest>} />
          <Route path="/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-blood" element={<FindBlood />} />
                <Route path="/donor-profile" element={
                  <RequireAuth role="donor"><DonorProfile /></RequireAuth>
                } />
                <Route path="/admin" element={
                  <RequireAuth role="admin"><AdminDashboard /></RequireAuth>
                } />
                <Route path="/requests" element={
                  <RequireAuth><RequestManagement /></RequireAuth>
                } />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
