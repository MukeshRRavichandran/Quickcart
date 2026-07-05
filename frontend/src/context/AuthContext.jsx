import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const fetchWithToken = async (endpoint, token) => {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Token verification failed');
  return response.json();
};

export const AuthProvider = ({ children }) => {
  const [customerUser, setCustomerUser] = useState(null);
  const [sellerUser, setSellerUser] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      // Fetch Customer details if customerToken exists
      const customerToken = localStorage.getItem('customerToken');
      if (customerToken) {
        try {
          const data = await fetchWithToken('/auth/me', customerToken);
          setCustomerUser(data);
        } catch (err) {
          console.error('Failed to authenticate customer token', err);
          localStorage.removeItem('customerToken');
          setCustomerUser(null);
        }
      }
      setCustomerLoading(false);

      // Fetch Seller details if sellerToken exists
      const sellerToken = localStorage.getItem('sellerToken');
      if (sellerToken) {
        try {
          const data = await fetchWithToken('/auth/me', sellerToken);
          setSellerUser(data);
        } catch (err) {
          console.error('Failed to authenticate seller token', err);
          localStorage.removeItem('sellerToken');
          setSellerUser(null);
        }
      }
      setSellerLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, preferredRole = null) => {
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      const resolvedRole = preferredRole || data.role;
      
      if (resolvedRole === 'seller') {
        localStorage.setItem('sellerToken', data.token);
        setSellerUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          storeName: data.storeName,
        });
      } else {
        localStorage.setItem('customerToken', data.token);
        setCustomerUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, role = 'customer', storeName = '', extraData = {}) => {
    setError(null);
    try {
      const data = await authAPI.register(name, email, password, role, storeName, extraData);
      if (role === 'seller') {
        return { ...data, pendingApproval: true };
      }
      localStorage.setItem('customerToken', data.token);
      setCustomerUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = (roleToLogout = null) => {
    const isSeller = roleToLogout === 'seller' || window.location.pathname.startsWith('/seller/') || window.location.pathname === '/seller';
    if (isSeller) {
      localStorage.removeItem('sellerToken');
      setSellerUser(null);
    } else {
      localStorage.removeItem('customerToken');
      setCustomerUser(null);
    }
  };

  // Determine active states based on path for backward compatibility
  const isSellerPath = window.location.pathname.startsWith('/seller/') || window.location.pathname === '/seller';
  const user = isSellerPath ? sellerUser : customerUser;
  const isAuthenticated = isSellerPath ? !!sellerUser : !!customerUser;
  const loading = isSellerPath ? sellerLoading : customerLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        // Explicitly exposed states for dual-auth
        customerUser,
        sellerUser,
        customerIsAuthenticated: !!customerUser,
        sellerIsAuthenticated: !!sellerUser,
        customerLoading,
        sellerLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
