import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth({ defaultRole = 'seller', isRegister = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(!isRegister);
  const [role, setRole] = useState(defaultRole);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  React.useEffect(() => {
    setIsLogin(!isRegister);
    setRole(defaultRole);
    setError('');
    setRegistrationSuccess(false);
  }, [defaultRole, isRegister]);

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
        await login(formData.email, formData.password, role);
        // On success, redirect
        const tokenKey = role === 'seller' ? 'sellerToken' : 'customerToken';
        const token = localStorage.getItem(tokenKey);
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
        
        {/* Title Header Badge */}
        <div className="text-center border-b border-neutral-50 pb-3 flex items-center justify-center gap-1.5 font-outfit">
          {role === 'seller' ? (
            <>
              <Store size={15} className="text-primary" />
              <span className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                Seller Portal
              </span>
            </>
          ) : (
            <>
              <User size={15} className="text-primary" />
              <span className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                Customer Portal
              </span>
            </>
          )}
        </div>

        {role === 'seller' && !isLogin ? (
          <div className="text-center space-y-5 py-4 fade-in font-outfit">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Store size={26} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-outfit font-extrabold text-neutral-800 text-sm">Seller Partner Center</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed px-4">
                To start selling on QuickCart, please register using our high-fidelity, multi-step merchant onboarding application.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/seller-register')}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              Start Onboarding Form <ArrowRight size={14} />
            </button>
          </div>
        ) : (
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
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
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
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
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
        )}

        {/* Switch mode & Forgot Password block */}
        <div className="flex justify-between items-center pt-2 font-outfit text-xs font-bold">
          {isLogin ? (
            <button
              type="button"
              onClick={() => alert('Password reset link has been sent to your email address!')}
              className="text-neutral-450 hover:text-primary transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-neutral-800 hover:text-black hover:underline"
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
