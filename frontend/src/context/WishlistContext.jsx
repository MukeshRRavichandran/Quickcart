import React, { createContext, useState, useEffect, useContext } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const data = await wishlistAPI.get();
          setWishlistItems(data.products || []);
        } catch (err) {
          console.error('Failed to load wishlist', err);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistItems([]);
      }
    };
    loadWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to modify your wishlist');
    }
    
    const isItemWishlisted = wishlistItems.some(item => item._id === productId);
    
    try {
      let data;
      if (isItemWishlisted) {
        data = await wishlistAPI.remove(productId);
      } else {
        data = await wishlistAPI.add(productId);
      }
      setWishlistItems(data.products || []);
      return !isItemWishlisted;
    } catch (err) {
      console.error('Wishlist error', err);
      throw err;
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
