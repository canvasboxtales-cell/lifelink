import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Droplets, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (_data: FormData) => {
    toast.success('Signed in successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #FECDD3 0%, #BFDBFE 100%)' }}>
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Sign in to LifeLink Blood Donation System</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your credentials to access your account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input {...register('email')} type="email" placeholder="your@email.com" className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Enter your password" className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-3 text-gray-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-red-600" /> Remember me
            </label>
            <button type="button" className="text-red-600 text-sm hover:underline">Forgot password?</button>
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium">Sign In</button>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-sm text-gray-400">Or</span><div className="flex-1 h-px bg-gray-200" /></div>
          <button type="button" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium">
            <span className="text-red-600 font-bold">G</span> Continue with Google
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Sign Up</Link></p>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Quick access for:</p>
          <div className="flex justify-center gap-6">
            <Link to="/register/donor" className="text-blue-600 text-xs hover:underline">Register as Donor</Link>
            <Link to="/register/hospital" className="text-blue-600 text-xs hover:underline">Hospital Staff Access</Link>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-6">By signing in, you agree to our <span className="text-blue-600">Terms of Service</span> • <span className="text-blue-600">Privacy Policy</span></p>
    </div>
  );
}
