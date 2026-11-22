import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import {
  Activity,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  Clock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    villageCommunity: '',
    district: '',
    age: '',
    gender: 'Male',
    role: 'ROLE_USER',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [demoOtp, setDemoOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes (300s)
  const [resendCooldown, setResendCooldown] = useState(30); // 30s resend cooldown
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // 5-minute expiry countdown
  useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  // 30-second resend cooldown countdown
  useEffect(() => {
    let interval;
    if (showOtpModal && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Real-time password criteria
  const pwd = formData.password || '';
  const passwordCriteria = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd),
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Allow only numbers and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phoneNumber: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step 1: Validate form inputs and request Email OTP
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setError('');

    // Phone Number validation: exactly 10 digits
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // Password criteria validations
    if (!passwordCriteria.length) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!passwordCriteria.uppercase) {
      setError('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!passwordCriteria.lowercase) {
      setError('Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!passwordCriteria.number) {
      setError('Password must contain at least one number (0-9).');
      return;
    }
    if (!passwordCriteria.special) {
      setError('Password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      // Request 6-digit OTP from backend
      const res = await authApi.sendOtp({
        email: formData.email,
        fullName: formData.fullName,
      });

      if (res.data?.demoOtp) {
        setDemoOtp(res.data.demoOtp);
      }

      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setTimer(300);
      setResendCooldown(30);
      setShowOtpModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to send verification code. Please check your email address.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setOtpError('');
    setIsSendingOtp(true);
    try {
      const res = await authApi.sendOtp({
        email: formData.email,
        fullName: formData.fullName,
      });
      if (res.data?.demoOtp) {
        setDemoOtp(res.data.demoOtp);
      }
      setTimer(300);
      setResendCooldown(30);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend code. Please try again.';
      setOtpError(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP Digit handling
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const newOtp = [...otp];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        setOtp(newOtp);
        const nextIdx = Math.min(digits.length, 5);
        document.getElementById(`otp-digit-${nextIdx}`)?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      document.getElementById(`otp-digit-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-digit-${index - 1}`)?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newOtp = [...otp];
    pasteData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const focusIdx = Math.min(pasteData.length, 5);
    document.getElementById(`otp-digit-${focusIdx}`)?.focus();
  };

  const handleAutoFillDemoOtp = () => {
    if (!demoOtp) return;
    const digits = demoOtp.split('');
    setOtp(digits);
    setOtpError('');
  };

  // Step 2: Verify OTP and finalize account registration
  const handleVerifyAndRegister = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const user = await register({
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null,
        otp: fullOtp,
      });

      setShowOtpModal(false);

      if (user.role === 'ROLE_NURSE') {
        navigate('/nurse/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired verification code. Please try again.';
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-slate-50 to-emerald-50/40 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-700 to-emerald-800 rounded-3xl text-white shadow-md shadow-teal-900/15 mb-2.5 border border-teal-600/30">
          <KidneyIcon className="w-8 h-8" filled />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create ArogyaTrack Account</h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-teal-800">
          Track Health. Connect Care. Stay Well.
        </p>
        <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-teal-200/80 rounded-full text-xs font-semibold text-teal-900">
          <RuralVillageEmblem className="w-3.5 h-3.5" />
          <span>Rural Kidney Health Risk Monitoring System</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleInitiateRegistration} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Phone Number - strictly 10 digits */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-bold ${
                    formData.phoneNumber.length === 10
                      ? 'text-emerald-700'
                      : formData.phoneNumber.length > 0
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}>
                    {formData.phoneNumber.length}/10 digits
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                      formData.phoneNumber.length === 10
                        ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-600'
                        : formData.phoneNumber.length > 0
                        ? 'border-amber-300 focus:ring-amber-500/20 focus:border-amber-500'
                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-600'
                    }`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Must be exactly 10 numeric digits (e.g. 9848012345)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="ROLE_USER">Community Member</option>
                  <option value="ROLE_NURSE">Health Worker / ANM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Village / Community <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="villageCommunity"
                    value={formData.villageCommunity}
                    onChange={handleChange}
                    placeholder="e.g. Pasumarru Village"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Guntur"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 48"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Password with Complexity requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`w-full pl-9 pr-10 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                      isPasswordValid
                        ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-600'
                        : formData.password.length > 0
                        ? 'border-amber-300 focus:ring-amber-500/20 focus:border-amber-500'
                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-10 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                      formData.confirmPassword && formData.confirmPassword === formData.password
                        ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-600'
                        : formData.confirmPassword
                        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Criteria Live Checklist */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Password Requirements:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className={`flex items-center space-x-1.5 font-medium ${
                  passwordCriteria.length ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {passwordCriteria.length ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>8+ characters</span>
                </div>

                <div className={`flex items-center space-x-1.5 font-medium ${
                  passwordCriteria.uppercase ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {passwordCriteria.uppercase ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>1 Uppercase (A-Z)</span>
                </div>

                <div className={`flex items-center space-x-1.5 font-medium ${
                  passwordCriteria.lowercase ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {passwordCriteria.lowercase ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>1 Lowercase (a-z)</span>
                </div>

                <div className={`flex items-center space-x-1.5 font-medium ${
                  passwordCriteria.number ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {passwordCriteria.number ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>1 Number (0-9)</span>
                </div>

                <div className={`flex items-center space-x-1.5 font-medium ${
                  passwordCriteria.special ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {passwordCriteria.special ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>1 Special character</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Sending Verification Code...</span>
              ) : (
                <>
                  <span>Verify Email & Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Email OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Verify Your Email</h2>
              <p className="mt-1 text-xs text-slate-500">
                To complete registration, enter the 6-digit verification code sent to:
              </p>
              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate max-w-[220px]">{formData.email}</span>
              </div>
            </div>

            {/* Evaluation / Demo Helper */}
            {demoOtp && (
              <div className="mt-4 bg-amber-50 border border-amber-200/90 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Evaluation OTP:</span>{' '}
                    <span className="font-mono font-black text-sm tracking-widest text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded">
                      {demoOtp}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] transition-all shadow-xs"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {/* OTP Error Banner */}
            {otpError && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{otpError}</span>
              </div>
            )}

            {/* 6 Digit Inputs */}
            <form onSubmit={handleVerifyAndRegister} className="mt-5 space-y-4">
              <div className="flex justify-center items-center space-x-2 sm:space-x-3" onPaste={handlePasteOtp}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-digit-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center font-mono font-bold text-xl sm:text-2xl rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 text-slate-900 transition-all outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Expiry Timer & Resend Button */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Expires in <strong className="font-mono text-slate-700">{formatTime(timer)}</strong>
                  </span>
                </span>

                {resendCooldown > 0 ? (
                  <span className="text-slate-400 font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={otpLoading || otp.join('').length !== 6}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {otpLoading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify & Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-all"
                >
                  Edit Registration Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
