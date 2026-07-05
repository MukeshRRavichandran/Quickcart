import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Sellers from './pages/Sellers';
import SellerDetails from './pages/SellerDetails';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Reviews from './pages/Reviews';
import Coupons from './pages/Coupons';
import Analytics from './pages/Analytics';
import Payments from './pages/Payments';
import Delivery from './pages/Delivery';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import Content from './pages/Content';
import SettingsPage from './pages/Settings';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/add" element={<Products />} />
          <Route path="/admin/products/edit/:id" element={<Products />} />
          <Route path="/admin/sellers" element={<Sellers />} />
          <Route path="/admin/sellers/:id" element={<SellerDetails />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<Orders />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/coupons" element={<Coupons />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/delivery" element={<Delivery />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/content" element={<Content />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/help" element={<Help />} />
          <Route path="/admin/*" element={<NotFound />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminProvider>
  );
}
