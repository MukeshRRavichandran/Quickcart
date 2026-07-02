import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Seller Context & Layout
import { SellerProvider } from './context/SellerContext';
import SellerLayout from './components/seller/SellerLayout';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

// Seller Pages
import Dashboard from './pages/seller/Dashboard';
import Products from './pages/seller/Products';
import AddEditProduct from './pages/seller/AddEditProduct';
import Inventory from './pages/seller/Inventory';
import Orders from './pages/seller/Orders';
import OrderDetail from './pages/seller/OrderDetail';
import Customers from './pages/seller/Customers';
import Reviews from './pages/seller/Reviews';
import Offers from './pages/seller/Offers';
import Analytics from './pages/seller/Analytics';
import Earnings from './pages/seller/Earnings';
import Messages from './pages/seller/Messages';
import Notifications from './pages/seller/Notifications';
import ProfileStore from './pages/seller/ProfileStore';
import SettingsPage from './pages/seller/Settings';
import Help from './pages/seller/Help';
import NotFound from './pages/seller/NotFound';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-outfit font-bold text-neutral-500 text-sm">Harvesting freshness...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Seller Protected Route Wrapper
function SellerProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-outfit font-bold text-neutral-500 text-sm">Validating credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');

  if (isSellerRoute) {
    return (
      <SellerProtectedRoute>
        <SellerProvider>
          <SellerLayout>
          <Routes>
            <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
            <Route path="/seller/dashboard" element={<Dashboard />} />
            <Route path="/seller/products" element={<Products />} />
            <Route path="/seller/products/add" element={<AddEditProduct />} />
            <Route path="/seller/products/edit/:id" element={<AddEditProduct />} />
            <Route path="/seller/inventory" element={<Inventory />} />
            <Route path="/seller/orders" element={<Orders />} />
            <Route path="/seller/orders/:id" element={<OrderDetail />} />
            <Route path="/seller/customers" element={<Customers />} />
            <Route path="/seller/reviews" element={<Reviews />} />
            <Route path="/seller/offers" element={<Offers />} />
            <Route path="/seller/analytics" element={<Analytics />} />
            <Route path="/seller/earnings" element={<Earnings />} />
            <Route path="/seller/messages" element={<Messages />} />
            <Route path="/seller/notifications" element={<Notifications />} />
            <Route path="/seller/profile" element={<ProfileStore />} />
            <Route path="/seller/settings" element={<SettingsPage />} />
            <Route path="/seller/help" element={<Help />} />
            <Route path="/seller/*" element={<NotFound />} />
          </Routes>
        </SellerLayout>
      </SellerProvider>
      </SellerProtectedRoute>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Sticky Header */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* Protected Routes */}
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation/:id" 
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
