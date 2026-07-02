import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // 'customer' or 'seller'
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        // On success, redirect
        const token = localStorage.getItem('token');
        if (token) {
          const userPayload = JSON.parse(atob(token.split('.')[1]));
          if (userPayload.role === 'seller') {
            navigate('/seller/dashboard', { replace: true });
          } else {
            navigate(redirectPath, { replace: true });
          }
        } else {
          navigate(redirectPath, { replace: true });
        }
      } else {
        if (!formData.name) {
          setError('Name is required for registration.');
          setLoading(false);
          return;
        }
        if (role === 'seller' && !formData.storeName) {
          setError('Store Brand Name is required for seller registration.');
          setLoading(false);
          return;
        }
        
        const data = await register(
          formData.name,
          formData.email,
          formData.password,
          role,
          role === 'seller' ? formData.storeName : ''
        );

        if (role === 'seller' || data.pendingApproval) {
          setRegistrationSuccess(true);
          setLoading(false);
          return;
        }

        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8 fade-in text-left font-outfit">
        <div className="text-center space-y-2">
          <span className="font-outfit font-extrabold text-3xl tracking-tight text-primary">
            Quick<span className="text-primary-darker">cart</span>
          </span>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl inline-block mt-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-2">
            Application Received!
          </h2>
          <p className="text-xs text-neutral-400">
            Your store registration is undergoing administrator audit.
          </p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <p className="text-sm text-neutral-650 leading-relaxed font-semibold">
            Thank you for registering as a seller! To protect our customer community, all new stores must be reviewed and approved by our admin team.
          </p>
          <div className="bg-neutral-50 rounded-2xl p-4 text-xs text-neutral-550 font-semibold text-left space-y-1 border border-neutral-100">
            <span className="text-[10px] text-neutral-450 uppercase tracking-wider block font-bold">Application Status</span>
            <span className="font-bold text-amber-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Pending Verification Audit
            </span>
          </div>
          <button
            onClick={() => {
              setRegistrationSuccess(false);
              setIsLogin(true);
              setFormData({ name: '', email: '', password: '', storeName: '' });
            }}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 fade-in">
      
      {/* Brand logo details */}
      <div className="text-center space-y-2">
        <span className="font-outfit font-extrabold text-3xl tracking-tight text-primary">
          Quick<span className="text-primary-darker">cart</span>
        </span>
        <h2 className="font-outfit font-bold text-xl text-neutral-800">
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isLogin ? 'Sign in to access your fresh food basket' : 'Sign up for weekly recipes and fresh deals'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
        
        {/* Account Type Switcher */}
        <div className="flex border-b border-neutral-100 pb-1">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setError('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 ${
              role === 'customer'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('seller');
              setError('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 ${
              role === 'seller'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Seller Merchant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-neutral-600">
          
          {/* Name (Registration Only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label>Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          {/* Store Brand Name (Registration Only & Seller Only) */}
          {!isLogin && role === 'seller' && (
            <div className="space-y-1">
              <label>Store Brand Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required={!isLogin && role === 'seller'}
                  placeholder="e.g. VeggieMart"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold"
                />
                <Store size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label>Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@example.com"
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label>Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
            </div>
          </div>

          {error && <span className="text-[11px] text-accent font-bold block">{error}</span>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-neutral-300 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Switch mode button */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>

      </div>

      {/* Trust badge footer */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold">
        <ShieldCheck size={14} className="text-primary" />
        <span>Your credentials are encrypted & secure</span>
      </div>

    </div>
  );
}
