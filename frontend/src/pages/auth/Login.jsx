import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, HeartHandshake } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role === 'ROLE_NURSE') {
        navigate('/nurse/dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-slate-50 to-emerald-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* ArogyaTrack Header with Kidney & Rural Visuals */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-700 to-emerald-800 rounded-3xl text-white shadow-lg shadow-teal-900/15 mb-3 border border-teal-600/30">
          <KidneyIcon className="w-9 h-9" filled />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">ArogyaTrack</h1>
        <p className="mt-1 text-sm font-bold text-teal-800">Track Health. Connect Care. Stay Well.</p>
        <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-teal-200/80 rounded-full text-xs font-semibold text-teal-900">
          <RuralVillageEmblem className="w-3.5 h-3.5" />
          <span>Rural Kidney Health Risk Monitoring System</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@arogyatrack.org"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact your community health worker or administrator to reset your password.')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-2">
              Quick Demonstration Accounts
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('ramesh@arogyatrack.org', 'user123')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-slate-700 font-medium transition-colors text-center"
              >
                <div className="font-bold text-emerald-800">User</div>
                <div className="text-[10px] text-slate-500">Community Member</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('nurse@arogyatrack.org', 'nurse123')}
                className="p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl text-slate-700 font-medium transition-colors text-center"
              >
                <div className="font-bold text-teal-800">Nurse</div>
                <div className="text-[10px] text-slate-500">Health Worker</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@arogyatrack.org', 'admin123')}
                className="p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-slate-700 font-medium transition-colors text-center"
              >
                <div className="font-bold text-indigo-800">Admin</div>
                <div className="text-[10px] text-slate-500">District Admin</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create Account
            </Link>
          </div>
        </div>

        {/* Community Illustration / Trust Note */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>Connected with rural primary health centres and community workers</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
