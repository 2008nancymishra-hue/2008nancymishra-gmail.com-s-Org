import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { Lock, Mail, Phone, Eye, EyeOff, User, MapPin, Building, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { updateUserProfile, currentUser } = useWasteManagement();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Login form state
  const [identifier, setIdentifier] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('demo1234');
  const [otp, setOtp] = useState('');

  // Register form state
  const [regForm, setRegForm] = useState({
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    password: '',
    confirmPassword: '',
    address: 'Flat 402, Green Meadows, Sector 14',
    city: 'New Delhi',
  });

  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier) {
      setError('Please enter your mobile number or email.');
      return;
    }
    if (loginMethod === 'password' && !password) {
      setError('Please enter your password.');
      return;
    }
    if (loginMethod === 'otp' && !otp) {
      setError('Please enter the 4-digit OTP sent to your phone.');
      return;
    }

    // Success
    onSuccess();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regForm.fullName || !regForm.phone || !regForm.email || !regForm.address || !regForm.city) {
      setError('All fields are required.');
      return;
    }
    if (regForm.password && regForm.password !== regForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    updateUserProfile({
      name: regForm.fullName,
      phone: regForm.phone,
      email: regForm.email,
      address: regForm.address,
      city: regForm.city,
    });

    onSuccess();
  };

  const quickDemoLogin = () => {
    setIdentifier('rahul.sharma@example.com');
    setPassword('demo1234');
    onSuccess();
  };

  return (
    <div className="min-h-full flex-1 flex flex-col justify-start p-5 bg-[#F7F9F7]">
      {/* Top Graphic Header */}
      <div className="pt-2 pb-4 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center ring-4 ring-[#E8F5E9]/60 shadow-sm">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
            <path d="M11 19h8.2a1.8 1.8 0 0 0 1.5-2.6l-3.9-6.9" />
            <path d="m14 12 3-6-4.5-1.5" />
            <path d="M15.5 15.5 19 19l-3.5 3.5" />
            <path d="m4.5 14-2.5 2.5 3.5 3.5" />
          </svg>
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back!' : 'Citizen Registration'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {mode === 'login'
            ? 'Sign in to report waste issues and track your neighborhood'
            : 'Join our clean city initiative & keep your surroundings green'}
        </p>
      </div>

      {/* Quick Demo Login Pill for effortless testing */}
      <div className="mb-4">
        <button
          type="button"
          onClick={quickDemoLogin}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>Quick Demo Login (Citizen: Rahul Sharma)</span>
        </button>
      </div>

      {/* Tab toggle between Login & Register */}
      <div className="flex bg-gray-200/80 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'login' ? 'bg-white text-[#2E7D32] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Citizen Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register' ? 'bg-white text-[#2E7D32] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          New Citizen Account
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {mode === 'login' ? (
        /* LOGIN FORM */
        <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Input toggle: Password vs OTP */}
            <div className="flex items-center justify-between text-xs px-1 text-gray-500">
              <span>Sign in via:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`underline font-semibold ${loginMethod === 'password' ? 'text-[#2E7D32]' : 'text-gray-400'}`}
                >
                  Password
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setOtpSent(true);
                  }}
                  className={`underline font-semibold ${loginMethod === 'otp' ? 'text-[#2E7D32]' : 'text-gray-400'}`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {/* Email / Mobile */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+91 98765 43210 or email"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {loginMethod === 'password' ? (
              /* Password field */
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email.')}
                    className="text-[11px] text-[#2E7D32] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Field */
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">One-Time Password (OTP)</label>
                  <span className="text-[11px] text-emerald-700 font-mono">OTP Sent: 4821</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit code (e.g. 4821)"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs rounded-xl shadow-md active:scale-[0.98] transition-all"
            >
              Sign In
            </button>

            {/* Google Login Option */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F7F9F7] px-2 text-gray-400">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27A7.16 7.16 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.26A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="pt-4 text-center">
            <span className="text-xs text-gray-500">Don't have an account? </span>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className="text-xs font-bold text-[#2E7D32] hover:underline"
            >
              Register here
            </button>
          </div>
        </form>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleRegister} className="flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">Password</label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">Confirm Password</label>
                <input
                  type="password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                />
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={regForm.address}
                  onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  placeholder="Flat 402, Green Meadows"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">City</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  placeholder="New Delhi"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs rounded-xl shadow-md active:scale-[0.98] transition-all"
            >
              Create Account
            </button>
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-500">Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-bold text-[#2E7D32] hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
