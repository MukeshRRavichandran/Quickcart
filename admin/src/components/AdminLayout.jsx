import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShoppingBag, Store, Users,
  ClipboardList, Box, Star, Tag, BarChart3, Wallet, Truck,
  Bell, UserCheck, LayoutTemplate, Settings, User, HelpCircle,
  LogOut, Menu, X, Search, ChevronDown, CheckCircle, ShoppingCart, RefreshCcw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminLayout({ children }) {
  const { adminUser, logout, tickets } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Sellers', path: '/admin/sellers', icon: Store },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Inventory', path: '/admin/inventory', icon: Box },
    { label: 'Restock Requests', path: '/admin/restock-requests', icon: RefreshCcw },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: Tag },
    { label: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Payments', path: '/admin/payments', icon: Wallet },
    { label: 'Delivery Partners', path: '/admin/delivery', icon: Truck },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'User Management', path: '/admin/users', icon: UserCheck },
    { label: 'Content Management', path: '/admin/content', icon: LayoutTemplate },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Help & Support', path: '/admin/help', icon: HelpCircle, badge: tickets.filter(t => t.status === 'Open').length },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isSellerVerificationPage = location.pathname.startsWith('/admin/sellers/') && location.pathname !== '/admin/sellers';

  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    const cleanLabel = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
    return { label: cleanLabel, path };
  });

  return (
    <div className="min-h-screen bg-neutral-50 flex text-left font-outfit">

      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Fixed */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-neutral-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>

        {/* Header brand */}
        <div className="h-20 px-6 border-b border-neutral-50 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-primary" />
            <div className="flex flex-col items-end">
              <span className="font-outfit font-extrabold text-lg text-primary leading-none">
                Quantum
              </span>
              <span className="font-outfit font-bold text-[10px] text-primary-darker leading-none">
                Quick Cart
              </span>
            </div>
            <span className="text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable menu routes */}
        <nav className="flex-grow py-5 px-4 space-y-0.5 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${isActive
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-neutral-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 mt-4 text-left"
          >
            <LogOut size={18} className="text-red-400" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* Footer info brand */}
        <div className="p-4 border-t border-neutral-50 text-[10px] text-neutral-400 font-semibold text-center">
          Quantum Quick Cart Admin v1.0.0
        </div>

      </aside>

      {/* Main Column */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">

        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-6 lg:px-8">

          {/* Hamburger & Search */}
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl"
            >
              <Menu size={20} />
            </button>

            {!isSellerVerificationPage && (
              <div className="hidden sm:flex items-center flex-grow relative">
                <input
                  type="text"
                  placeholder="Search resources, products, orders..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-transparent rounded-full focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all duration-200"
                />
                <Search size={16} className="absolute left-3.5 text-neutral-400" />
              </div>
            )}
          </div>

          {/* Action elements */}
          <div className="flex items-center gap-4">

            {/* Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotiDropdownOpen(!notiDropdownOpen)}
                className={`p-2.5 rounded-full transition-all duration-200 relative ${notiDropdownOpen ? 'bg-primary-light/45 text-primary' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                  }`}
              >
                <Bell size={20} />
              </button>

              {notiDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-64 bg-white border border-neutral-100 rounded-2xl shadow-xl py-3 z-50 fade-in text-center">
                  <div className="px-4 pb-2 border-b border-neutral-50 font-bold text-xs text-neutral-800">
                    Notifications center
                  </div>
                  <div className="py-4 text-xs text-neutral-400">
                    No active system announcements!
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 border border-neutral-200 rounded-full hover:border-primary/45 focus:outline-none transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-extrabold flex items-center justify-center text-sm">
                  A
                </div>
                <div className="hidden md:flex flex-col text-left pr-2">
                  <span className="text-xs font-bold text-neutral-800">{adminUser?.name || 'Admin Root'}</span>
                  <span className="text-[9px] text-neutral-400 font-semibold flex items-center gap-0.5">
                    <CheckCircle size={8} className="fill-current text-primary" /> {adminUser?.role || 'Super Admin'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-neutral-400 hidden md:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl py-2 z-50 fade-in">
                  <div className="px-4 py-2 text-xs font-semibold text-neutral-400 border-b border-neutral-50 uppercase tracking-wider">
                    Settings
                  </div>
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-bold"
                  >
                    <User size={16} className="text-neutral-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-bold border-b border-neutral-50"
                  >
                    <Settings size={16} className="text-neutral-400" />
                    Portal Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 text-left transition-colors font-bold"
                  >
                    <LogOut size={16} className="text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 lg:p-8 space-y-6">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            {breadcrumbs.map((bc, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={bc.path}>
                  <span className="text-neutral-300">/</span>
                  {isLast ? (
                    <span className="text-neutral-600">{bc.label}</span>
                  ) : (
                    <Link to={bc.path} className="hover:text-primary transition-colors">{bc.label}</Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Mount nested pages */}
          <div className="fade-in slide-up">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}
