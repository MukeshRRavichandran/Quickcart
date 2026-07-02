import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI, couponsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product ? item.product.price : 0;
      return total + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    let intervalId;
    const loadCart = async (showLoading = true) => {
      if (user) {
        if (showLoading) setLoading(true);
        try {
          const data = await cartAPI.get();
          setCartItems(data.items || []);
        } catch (err) {
          console.error('Failed to load cart', err);
        } finally {
          if (showLoading) setLoading(false);
        }
      } else {
        setCartItems([]);
        setPromoCode('');
        setDiscountAmount(0);
      }
    };
    loadCart(true);

    if (user) {
      intervalId = setInterval(() => {
        loadCart(false);
      }, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  // Recalculate coupon if items or subtotal changes
  useEffect(() => {
    const revalidateCoupon = async () => {
      if (promoCode) {
        try {
          const data = await couponsAPI.validate(promoCode, getSubtotal());
          setDiscountAmount(data.discountAmount);
        } catch (err) {
          setPromoCode('');
          setDiscountAmount(0);
        }
      }
    };
    revalidateCoupon();
  }, [cartItems, promoCode]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    try {
      const data = await cartAPI.add(productId, quantity);
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      const data = await cartAPI.update(productId, quantity);
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const data = await cartAPI.remove(productId);
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
  };

  const applyPromoCode = async (code) => {
    try {
      const data = await couponsAPI.validate(code, getSubtotal());
      if (data.valid) {
        setPromoCode(data.code);
        setDiscountAmount(data.discountAmount);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountAmount(0);
  };

  const getDiscountPercent = () => {
    const subtotal = getSubtotal();
    return subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
  };

  const getTax = () => {
    const taxable = getSubtotal() - discountAmount;
    return taxable > 0 ? taxable * 0.085 : 0;
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0 || subtotal >= 50) return 0;
    return 5.99;
  };

  const getTotal = () => {
    return getSubtotal() - discountAmount + getTax() + getShipping();
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        promoCode,
        discountPercent: getDiscountPercent(),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        subtotal: getSubtotal(),
        discount: discountAmount,
        tax: getTax(),
        shipping: getShipping(),
        total: getTotal(),
        cartCount: getCartCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
