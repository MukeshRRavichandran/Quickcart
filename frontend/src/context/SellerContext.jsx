import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest, sellerAPI, reviewsAPI, notificationsAPI } from '../services/api';

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  // Store Profile
  const [profile, setProfile] = useState({
    storeName: 'VeggieMart',
    sellerName: 'VeggieMart',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh organic greens and vegetables directly sourced from local fields to your kitchen.',
    email: 'contact@veggiemart.com',
    phone: '+1 (555) 321-7654',
    address: '42 Greenway Ave, Fresh Meadows, CA 94016',
    gstin: '22AAAAA0000A1Z5',
    bankName: 'Organic Valley Bank',
    bankAccount: '•••• •••• 8743',
    routingNumber: '121000248',
    hours: '08:00 AM - 08:00 PM',
  });

  // Wallet and Earnings
  const [earnings, setEarnings] = useState({
    balance: 1420.50,
    pendingSettlement: 980.00,
    withdrawnTotal: 2500.00,
    history: [
      { id: 'TXN-9021', date: '28 Jun 2026', amount: 480.00, status: 'Settled', type: 'Payout' },
      { id: 'TXN-8742', date: '21 Jun 2026', amount: 620.00, status: 'Settled', type: 'Payout' },
      { id: 'TXN-7412', date: '14 Jun 2026', amount: 800.00, status: 'Settled', type: 'Payout' },
      { id: 'TXN-6589', date: '07 Jun 2026', amount: 600.00, status: 'Settled', type: 'Payout' },
    ],
  });

  // Mock Products list - pre-loaded with mock data matching the screenshot!
  const [products, setProducts] = useState([]);

  // Mock Orders
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1256',
      customer: { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 234-5678', address: '123 Oak St, San Francisco, CA' },
      items: [
        { product: 'Fresh Strawberries (1 lb)', quantity: 2, price: 180.00 },
        { product: 'Organic Avocados (Pack of 2)', quantity: 1, price: 220.00 }
      ],
      amount: 75.40,
      paymentStatus: 'Paid',
      deliveryStatus: 'New',
      orderDate: '01 Jul 2026',
      timeAgo: '10 mins ago'
    },
    {
      id: 'ORD-1255',
      customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 345-6789', address: '456 Maple Ave, Los Angeles, CA' },
      items: [
        { product: 'Tri-Color Bell Peppers (3 Pack)', quantity: 1, price: 150.00 },
        { product: 'Pasture-Raised Eggs (Dozen)', quantity: 2, price: 110.00 }
      ],
      amount: 48.20,
      paymentStatus: 'Paid',
      deliveryStatus: 'Processing',
      orderDate: '01 Jul 2026',
      timeAgo: '35 mins ago'
    },
    {
      id: 'ORD-1254',
      customer: { name: 'Michael Brown', email: 'michael@example.com', phone: '+1 (555) 456-7890', address: '789 Pine Rd, San Jose, CA' },
      items: [
        { product: 'Organic Avocados (Pack of 2)', quantity: 3, price: 220.00 }
      ],
      amount: 62.10,
      paymentStatus: 'Paid',
      deliveryStatus: 'Packed',
      orderDate: '01 Jul 2026',
      timeAgo: '1 hr ago'
    },
    {
      id: 'ORD-1253',
      customer: { name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 567-8901', address: '101 Cedar Ln, Oakland, CA' },
      items: [
        { product: 'Fresh Blueberries (125g)', quantity: 4, price: 120.00 }
      ],
      amount: 35.90,
      paymentStatus: 'Paid',
      deliveryStatus: 'Shipped',
      orderDate: '01 Jul 2026',
      timeAgo: '2 hrs ago'
    },
    {
      id: 'ORD-1252',
      customer: { name: 'William Wilson', email: 'william@example.com', phone: '+1 (555) 678-9012', address: '202 Birch Blvd, Sacramento, CA' },
      items: [
        { product: 'Fresh Strawberries (1 lb)', quantity: 1, price: 180.00 },
        { product: 'Baby Carrots (500g)', quantity: 2, price: 80.00 }
      ],
      amount: 80.00,
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      orderDate: '30 Jun 2026',
      timeAgo: '3 hrs ago'
    }
  ]);

  // Mock Customers List
  const [customers, setCustomers] = useState([
    { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 234-5678', ordersCount: 12, totalSpend: 540.20, status: 'Active' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 345-6789', ordersCount: 8, totalSpend: 382.40, status: 'Active' },
    { id: 'CUST-003', name: 'Michael Brown', email: 'michael@example.com', phone: '+1 (555) 456-7890', ordersCount: 15, totalSpend: 812.50, status: 'Active' },
    { id: 'CUST-004', name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 567-8901', ordersCount: 5, totalSpend: 198.00, status: 'Inactive' },
    { id: 'CUST-005', name: 'William Wilson', email: 'william@example.com', phone: '+1 (555) 678-9012', ordersCount: 22, totalSpend: 1240.00, status: 'Active' },
  ]);

  // Mock Reviews
  const [reviews, setReviews] = useState([
    { id: 'REV-001', product: 'Fresh Strawberries (1 lb)', customer: 'John Doe', rating: 5, comment: 'Incredibly sweet and fresh! My kids loved them. Will definitely buy again next week.', date: '30 Jun 2026', reply: '' },
    { id: 'REV-002', product: 'Organic Avocados (Pack of 2)', customer: 'Jane Smith', rating: 4, comment: 'Very creamy. One was perfectly ripe, the other took two more days to ripen.', date: '29 Jun 2026', reply: 'Thanks for your feedback Jane! We pack them at varying ripeness so you can enjoy them over several days.' },
    { id: 'REV-003', product: 'Pasture-Raised Eggs (Dozen)', customer: 'Michael Brown', rating: 5, comment: 'Top quality eggs. Big orange yolks. Best scrambled eggs ever!', date: '28 Jun 2026', reply: '' },
    { id: 'REV-004', product: 'Fresh Blueberries (125g)', customer: 'Emily Davis', rating: 3, comment: 'Tasty but a couple of berries were squished at the bottom of the container.', date: '27 Jun 2026', reply: '' }
  ]);

  // Mock Offers & Discounts
  const [offers, setOffers] = useState([
    { id: 'OFF-001', code: 'FRESH20', name: 'Grand Reopening Special', type: 'Percentage', value: 20, status: 'Active', startDate: '2026-06-01', endDate: '2026-07-31' },
    { id: 'OFF-002', code: 'FRESH10', name: 'Weekly Newsletter Offer', type: 'Percentage', value: 10, status: 'Active', startDate: '2026-06-15', endDate: '2026-07-15' },
    { id: 'OFF-003', code: 'FREESHIP50', name: 'Free Shipping Over ₹50', type: 'Free Shipping', value: 0, status: 'Active', startDate: '2026-05-01', endDate: '2026-08-01' }
  ]);

  // Mock Chats/Messages threads
  const [messages, setMessages] = useState([
    {
      id: 'MSG-001',
      customerName: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Got the eggs, they were great!',
      time: 'Yesterday',
      unreadCount: 0,
      thread: [
        { sender: 'Customer', text: 'Hello, when will my order ship?', time: 'Yesterday 1:30 PM' },
        { sender: 'Seller', text: 'Hi Jane, it has been shipped! You should receive it soon.', time: 'Yesterday 1:45 PM' },
        { sender: 'Customer', text: 'Got the eggs, they were great!', time: 'Yesterday 3:00 PM' }
      ]
    }
  ]);

  const [restockRequests, setRestockRequests] = useState([]);

  const { sellerUser: user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let intervalId;
    const fetchSellerData = async (showLoading = true) => {
      if (user && user.role === 'seller') {
        if (showLoading) setLoading(true);
        try {
          const prods = await sellerAPI.getProducts();
          setProducts(prods.map(p => ({
            ...p,
            id: p._id,
            soldCount: p.soldCount || 0,
            rating: p.rating || 4.5,
            status: p.isActive ? 'Active' : 'Inactive'
          })));

          const earns = await sellerAPI.getEarnings();
          setEarnings(earns);

          const ords = await sellerAPI.getOrders();
          setOrders(ords.map(o => ({
            id: o._id,
            customer: { 
              name: o.user?.name || 'Guest', 
              email: o.user?.email || '', 
              phone: o.shippingAddress?.phone || 'N/A', 
              address: o.shippingAddress?.address || 'N/A' 
            },
            items: o.items.map(i => ({ product: i.name || 'Unknown Item', quantity: i.quantity, price: i.price })),
            amount: o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            paymentStatus: o.paymentStatus || 'Paid',
            deliveryStatus: (o.status === 'Pending' ? 'New' : o.status) || 'New',
            orderDate: new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeAgo: ''
          })));

          const revs = await reviewsAPI.getSellerReviews();
          setReviews(revs);

          const requests = await sellerAPI.getRestockRequests();
          setRestockRequests(requests);

          const notifs = await notificationsAPI.getAll();
          setNotifications(notifs.map(n => ({
            id: n._id,
            type: n.type,
            text: n.text,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: n.read
          })));

          setProfile({
            storeName: user.storeName || 'VeggieMart',
            sellerName: user.name || 'VeggieMart Seller',
            isVerified: user.isApproved,
            logo: user.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
            banner: user.banner || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
            description: user.description || 'Fresh organic greens and vegetables directly sourced from local fields to your kitchen.',
            email: user.email || 'contact@veggiemart.com',
            phone: user.phone || '+1 (555) 321-7654',
            address: user.address?.address ? `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}` : '42 Greenway Ave, Fresh Meadows, CA 94016',
            gstin: user.gstin || '22AAAAA0000A1Z5',
            bankName: user.bankName || 'Organic Valley Bank',
            bankAccount: user.bankAccount || '•••• •••• 8743',
            routingNumber: user.routingNumber || '121000248',
            hours: user.hours || '08:00 AM - 08:00 PM',
          });

        } catch (err) {
          console.error('Failed to load seller data', err);
        } finally {
          if (showLoading) setLoading(false);
        }
      }
    };

    fetchSellerData(true);

    if (user && user.role === 'seller') {
      intervalId = setInterval(() => {
        fetchSellerData(false);
      }, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  // CRUD Operations
  const addProduct = async (newProduct) => {
    try {
      const data = await sellerAPI.createProduct(newProduct);
      setProducts((prev) => [{ ...data, id: data._id, status: 'Active' }, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const editProduct = async (id, updatedFields) => {
    try {
      const data = await sellerAPI.updateProduct(id, updatedFields);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...data, id: data._id } : p))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await sellerAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const data = await sellerAPI.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, deliveryStatus: data.status === 'Pending' ? 'New' : data.status } : o))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const replyToReview = async (reviewId, replyText) => {
    try {
      await reviewsAPI.reply(reviewId, replyText);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const saveProfileBackend = async (newProfile) => {
    try {
      let addressObj = {};
      if (newProfile.address) {
        const parts = newProfile.address.split(',').map(p => p.trim());
        addressObj = {
          address: parts[0] || '',
          city: parts[1] || '',
          state: parts[2] ? parts[2].split(' ')[0] : '',
          zipCode: parts[2] ? parts[2].split(' ')[1] : ''
        };
      }
      
      const payload = {
        name: newProfile.sellerName,
        email: newProfile.email,
        storeName: newProfile.storeName,
        phone: newProfile.phone,
        hours: newProfile.hours,
        description: newProfile.description,
        logo: newProfile.logo,
        banner: newProfile.banner,
        gstin: newProfile.gstin,
        bankName: newProfile.bankName,
        bankAccount: newProfile.bankAccount,
        routingNumber: newProfile.routingNumber,
        address: addressObj
      };

      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setProfile(newProfile);
    } catch (err) {
      console.error('Failed to update seller profile on backend', err);
      throw err;
    }
  };

  const addOffer = (newOffer) => {
    setOffers((prev) => [{ ...newOffer, id: `OFF-00${prev.length + 1}`, status: 'Active' }, ...prev]);
  };

  const addMessage = (customerId, text) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === customerId) {
          return {
            ...m,
            lastMessage: text,
            time: 'Just Now',
            thread: [...m.thread, { sender: 'Seller', text, time: 'Just Now' }],
          };
        }
        return m;
      })
    );
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SellerContext.Provider
      value={{
        profile,
        setProfile: saveProfileBackend,
        earnings,
        setEarnings,
        products,
        orders,
        customers,
        reviews,
        offers,
        messages,
        notifications,
        restockRequests,
        addProduct,
        editProduct,
        deleteProduct,
        updateOrderStatus,
        replyToReview,
        addOffer,
        addMessage,
        markAllNotificationsRead,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => useContext(SellerContext);
export default SellerContext;
