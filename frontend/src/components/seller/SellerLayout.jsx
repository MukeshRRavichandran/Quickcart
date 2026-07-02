import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Box, ClipboardList, Users, 
  Star, Tag, BarChart3, Wallet, MessageSquare, Bell, 
  User, Settings, HelpCircle, LogOut, Menu, X, Search, ChevronDown, CheckCircle
} from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function SellerLayout({ children }) {
  const { profile, notifications, messages, orders } = useSeller();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/seller/products', icon: ShoppingBag },
    { label: 'Inventory', path: '/seller/inventory', icon: Box },
    { label: 'Orders', path: '/seller/orders', icon: ClipboardList, badge: orders.filter(o => o.deliveryStatus === 'New' || o.deliveryStatus === 'Processing').length },
    { label: 'Customers', path: '/seller/customers', icon: Users },
    { label: 'Reviews', path: '/seller/reviews', icon: Star },
    { label: 'Offers & Discounts', path: '/seller/offers', icon: Tag },
    { label: 'Analytics & Reports', path: '/seller/analytics', icon: BarChart3 },
    { label: 'Earnings', path: '/seller/earnings', icon: Wallet },
    { label: 'Messages', path: '/seller/messages', icon: MessageSquare, badge: messages.filter(m => m.unreadCount > 0).length },
    { label: 'Notifications', path: '/seller/notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { label: 'Profile & Store', path: '/seller/profile', icon: User },
    { label: 'Settings', path: '/seller/settings', icon: Settings },
    { label: 'Help & Support', path: '/seller/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  // Extract breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    const cleanLabel = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
    return { label: cleanLabel, path };
  });

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-neutral-50 flex text-left font-outfit">
      
      {/* Sidebar - Mobile overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed left Sidebar drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-neutral-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-neutral-50 flex items-center justify-between">
          <Link to="/seller/dashboard" className="flex items-center gap-2">
            <span className="font-outfit font-extrabold text-lg text-primary">
              Quick<span className="text-primary-darker">cart</span>
            </span>
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Seller Portal
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable menu items */}
        <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/seller/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive 
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

        {/* Dynamic promotional green card */}
        <div className="p-4 border-t border-neutral-50">
          <div className="bg-primary-light/40 border border-primary/10 rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-primary/5 rounded-full"></div>
            <h4 className="font-outfit font-extrabold text-xs text-neutral-800">Grow your business</h4>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">Boost sales using custom campaign settings & offers.</p>
            <Link 
              to="/seller/offers"
              className="mt-3 inline-block w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-primary/10 hover:shadow-lg"
            >
              View Growth Tips
            </Link>
          </div>
        </div>

      </aside>

      {/* Main Container */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        
        {/* Sticky Header Topbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-6 lg:px-8">
          
          {/* Hamburger Menu & Search bar */}
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl"
            >
              <Menu size={20} />
            </button>

            {/* Search Input Box */}
            <div className="hidden sm:flex items-center flex-grow relative">
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-transparent rounded-full focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all duration-200"
              />
              <Search size={16} className="absolute left-3.5 text-neutral-400" />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotiDropdownOpen(!notiDropdownOpen)}
                className={`p-2.5 rounded-full transition-all duration-200 relative ${
                  notiDropdownOpen ? 'bg-primary-light/45 text-primary' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              >
                <Bell size={20} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white font-bold text-[9px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Quick notifications modal */}
              {notiDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-80 bg-white border border-neutral-100 rounded-2xl shadow-xl py-3 z-50 fade-in">
                  <div className="px-4 pb-2 border-b border-neutral-50 flex items-center justify-between">
                    <span className="font-outfit font-extrabold text-sm text-neutral-800">Alerts feed</span>
                    <Link to="/seller/notifications" onClick={() => setNotiDropdownOpen(false)} className="text-[10px] text-primary font-bold hover:underline">
                      See all
                    </Link>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {unreadNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-neutral-400">
                        No unread notifications!
                      </div>
                    ) : (
                      unreadNotifications.map(n => (
                        <div key={n.id} className="px-4 py-2.5 hover:bg-neutral-50 flex items-start gap-2.5 border-b border-neutral-50/50 last:border-0">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-neutral-700 leading-normal">{n.text}</p>
                            <span className="text-[9px] text-neutral-400 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
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
                <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold flex items-center justify-center text-sm shadow-sm shadow-primary/20">
                  {profile.storeName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left pr-2">
                  <span className="text-xs font-bold text-neutral-800">{profile.storeName}</span>
                  <span className="text-[9px] text-primary font-semibold flex items-center gap-0.5">
                    <CheckCircle size={8} className="fill-current" /> Verified Seller
                  </span>
                </div>
                <ChevronDown size={14} className="text-neutral-400 hidden md:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-52 bg-white border border-neutral-100 rounded-2xl shadow-xl py-2 z-50 fade-in">
                  <div className="px-4 py-2 text-xs font-semibold text-neutral-400 border-b border-neutral-50 uppercase tracking-wider">
                    Seller Account
                  </div>
                  <Link 
                    to="/seller/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-bold"
                  >
                    <User size={16} className="text-neutral-400" />
                    Store Profile
                  </Link>
                  <Link 
                    to="/seller/settings" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-bold"
                  >
                    <Settings size={16} className="text-neutral-400" />
                    Portal Settings
                  </Link>
                  <Link 
                    to="/seller/help" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-bold border-b border-neutral-50"
                  >
                    <HelpCircle size={16} className="text-neutral-400" />
                    Help & Support
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

        {/* Inner Content Area */}
        <main className="flex-grow p-6 lg:p-8 space-y-6">
          
          {/* Breadcrumb Navigation Row */}
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

          {/* Child Routes Content Injection */}
          <div className="fade-in slide-up">
            {children}
          </div>

        </main>

      </div>
      
    </div>
  );
}
