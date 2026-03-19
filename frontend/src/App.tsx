import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
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

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUpChoice />} />
          <Route path="/register/donor" element={<DonorRegister />} />
          <Route path="/register/hospital" element={<HospitalRegister />} />
          <Route path="/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-blood" element={<FindBlood />} />
                <Route path="/donor-profile" element={<DonorProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/requests" element={<RequestManagement />} />
              </Routes>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
