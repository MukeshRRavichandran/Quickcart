import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Login() {
  const { login } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@quickcart.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const success = await login(email, password);
      setLoading(false);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Invalid email credentials or master password.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Invalid email credentials or master password.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 relative font-outfit">
      
      {/* Background visual circles */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/10 -z-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-emerald-500/5 -z-10 blur-3xl" />

      <div className="max-w-md w-full bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl text-center space-y-6">
        
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="p-3 bg-primary-light text-primary rounded-2xl inline-block">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-neutral-800 tracking-tight">Quickcart</h1>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Control Deck Authorization</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Admin Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@quickcart.com"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
              required
            />
            <Mail size={16} className="absolute left-3.5 top-8.5 text-neutral-400" />
          </div>

          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Master Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-mono"
              required
            />
            <Lock size={16} className="absolute left-3.5 top-8.5 text-neutral-400" />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-bold mt-1 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Unlock Console</span>
            )}
          </button>

        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-neutral-50 text-[10px] text-neutral-400 font-semibold leading-relaxed">
          Authorized personnel only. Access logging is active for this session.
        </div>

      </div>

    </div>
  );
}
