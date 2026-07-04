import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBasket, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems, cartCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);

  useEffect(() => {
    if (cartCount > prevCount) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    setPrevCount(cartCount);
  }, [cartCount, prevCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout('customer');
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Search Bar & Seller Portal */}
          <div className="flex items-center gap-6 flex-grow max-w-2xl">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 gap-2">
              <span className="font-outfit font-extrabold text-2xl tracking-tight text-primary flex items-center">
                Quick<span className="text-primary-darker">cart</span>
              </span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh food..."
                className="w-full pl-4 pr-10 py-2.5 bg-neutral-100 focus:bg-white text-sm text-neutral-800 rounded-full border border-transparent focus:border-primary/30 outline-none transition-all duration-200"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-neutral-400 hover:text-primary transition-colors">
                <Search size={18} />
              </button>
            </form>

            {/* Seller Portal Link */}
            <Link 
              to="/seller/dashboard"
              className="hidden md:inline-flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-full transition-colors whitespace-nowrap"
            >
              Seller Portal
            </Link>

            {/* Customer Portal Link */}
            <Link 
              to="/login"
              className="hidden md:inline-flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-full transition-colors whitespace-nowrap"
            >
              Customer Portal
            </Link>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-neutral-500 hover:text-primary hover:bg-primary-light/35 rounded-full transition-all duration-200"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white font-semibold text-[10px] w-5 h-5 flex items-center justify-center rounded-full scale-90 border-2 border-white animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <div className="relative">
              <Link 
                to="/cart" 
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <ShoppingBasket size={18} />
                <span>Basket ({cartCount})</span>
              </Link>

              {/* Popover Mini-Basket */}
              {showPopup && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300 font-outfit">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="text-xs font-extrabold text-neutral-800">Added to Basket! 🎉</span>
                    <button onClick={() => setShowPopup(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  
                  {/* Scrollable Items list */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-neutral-50 my-2 pr-1 scrollbar-thin">
                    {cartItems.map((item) => (
                      <div key={item.product?._id} className="flex items-center gap-3 py-2.5 first:pt-1.5 last:pb-1.5">
                        <img src={item.product?.image} alt={item.product?.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-50" />
                        <div className="flex-grow text-left space-y-0.5 min-w-0">
                          <h4 className="text-[11px] font-bold text-neutral-800 truncate">{item.product?.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-semibold block">
                            {item.quantity} x ₹{item.product?.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Subtotal</span>
                      <span className="text-xs font-extrabold text-neutral-800">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/cart"
                      onClick={() => setShowPopup(false)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold rounded-full shadow-md shadow-primary/10 transition-all"
                    >
                      View Basket
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              {user ? (
                <>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 border border-neutral-200 rounded-full hover:border-primary/40 focus:outline-none transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl py-2 z-50 fade-in">
                      <div className="px-4 py-2 text-xs font-semibold text-neutral-400 border-b border-neutral-50 uppercase tracking-wider">
                        My Account
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <User size={16} />
                        Profile & Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="p-2 text-neutral-500 hover:text-primary hover:bg-primary-light/35 rounded-full flex items-center transition-all duration-200"
                >
                  <User size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2 text-neutral-500">
              <ShoppingBasket size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white font-semibold text-[10px] w-5 h-5 flex items-center justify-center rounded-full scale-90 border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-neutral-600 hover:text-primary focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 shadow-inner fade-in">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fresh food..."
              className="w-full pl-4 pr-10 py-2.5 bg-neutral-100 text-sm text-neutral-800 rounded-full border border-transparent outline-none"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-neutral-400">
              <Search size={18} />
            </button>
          </form>


          <Link 
            to="/wishlist" 
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-neutral-700 hover:text-primary flex justify-between items-center"
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && <span className="bg-primary-light text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">{wishlistCount}</span>}
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/profile" 
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-neutral-700 hover:text-primary"
              >
                My Profile & Orders
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-semibold text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-primary hover:underline"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
