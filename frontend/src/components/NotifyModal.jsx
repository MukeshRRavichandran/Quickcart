import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';

export default function NotifyModal({ product, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user?.email) {
        setEmail(user.email);
      } else {
        setEmail('');
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await productsAPI.notifyRestock(product._id, email);
      setSuccess(true);
      if (onSuccess) onSuccess();
      // Optional: Auto close after a few seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error requesting notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform scale-in">
        <div className="flex justify-between items-center p-4 border-b border-neutral-100">
          <h2 className="font-outfit font-bold text-lg text-neutral-800 flex items-center gap-2">
            <Bell size={20} className="text-amber-500" />
            Restock Alert
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <h3 className="font-outfit font-bold text-neutral-800 text-lg mb-2">Request Submitted!</h3>
              <p className="text-sm text-neutral-500">
                Your restock notification request has been submitted successfully. We'll notify you when <strong>{product.name}</strong> is back in stock.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3 mb-2">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-neutral-50" />
                <div>
                  <h4 className="font-outfit font-semibold text-neutral-800 text-sm line-clamp-2">{product.name}</h4>
                  <span className="text-xs text-red-500 font-medium">Currently Out of Stock</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-accent font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors mt-2"
              >
                {loading ? 'Submitting...' : 'Notify Me When Available'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
