import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Platform Categories
  const [categories, setCategories] = useState([
    { id: 'CAT-001', name: 'Fruits & Vegetables', count: 48, status: 'Active', image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-002', name: 'Dairy & Eggs', count: 32, status: 'Active', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-003', name: 'Rice, Atta & Grains', count: 24, status: 'Active', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-004', name: 'Spices, Oils & Cooking Essentials', count: 40, status: 'Active', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-005', name: 'Bakery', count: 18, status: 'Active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-006', name: 'Snacks & Biscuits', count: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-007', name: 'Beverages', count: 35, status: 'Active', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-009', name: 'Meat, Fish & Seafood', count: 22, status: 'Active', image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=150&auto=format&fit=crop&q=80' },
    { id: 'CAT-010', name: 'Sweets, Chocolates & Desserts', count: 30, status: 'Active', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=150&auto=format&fit=crop&q=80' }
  ]);

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restockRequests, setRestockRequests] = useState([]);

  // Payout Settlements & Transaction Ledger
  const [payouts, setPayouts] = useState([
    { id: 'PAY-8001', seller: 'VeggieMart', amount: 480.00, requestDate: '29 Jun 2026', status: 'Pending' },
    { id: 'PAY-8002', seller: 'BakeryBoutique', amount: 320.00, requestDate: '27 Jun 2026', status: 'Approved' },
    { id: 'PAY-8003', seller: 'VeggieMart', amount: 620.00, requestDate: '21 Jun 2026', status: 'Settled' }
  ]);

  // Delivery partners fleet
  const [deliveryPartners, setDeliveryPartners] = useState([
    { id: 'DEL-01', name: 'Courier John', phone: '+1 (555) 123-4567', vehicle: 'E-Bike', status: 'Active', activeDeliveries: 1 },
    { id: 'DEL-02', name: 'Courier Alice', phone: '+1 (555) 987-6543', vehicle: 'Motorcycle', status: 'Active', activeDeliveries: 1 },
    { id: 'DEL-03', name: 'Courier Bob', phone: '+1 (555) 456-7890', vehicle: 'Electric Scooter', status: 'Inactive', activeDeliveries: 0 }
  ]);

  // Platform level coupons
  const [coupons, setCoupons] = useState([
    { id: 'CPN-01', code: 'QUICK50', name: 'New User Discount', type: 'Flat', value: 50, status: 'Active' },
    { id: 'CPN-02', code: 'ORGANIC20', name: 'Farming Special Campaign', type: 'Percentage', value: 20, status: 'Active' }
  ]);

  // Help tickets queue
  const [tickets, setTickets] = useState([
    { id: 'TCK-101', subject: 'Payout delays', user: 'VeggieMart (Seller)', date: '30 Jun 2026', status: 'Open', message: 'payout of ₹480.00 is still pending settlement.' },
    { id: 'TCK-102', subject: 'Refund query', user: 'Jane Smith (Customer)', date: '28 Jun 2026', status: 'Resolved', message: 'I have not received the credit refund for order #ORD-1202.' }
  ]);

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const apiCall = async (endpoint, options = {}) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4555';
    const url = `${baseURL}/api${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const user = await apiCall('/auth/me');
          if (user.role === 'admin' || user.role === 'sub-admin') {
            setIsAuthenticated(true);
            setAdminUser(user);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem('adminToken');
        }
      }
    };
    checkToken();
  }, []);

  const loadAdminData = async () => {
    if (isAuthenticated) {
      try {
        const allUsers = await apiCall('/admin/users');
        setSellers(allUsers.filter(u => u.role === 'seller').map(s => ({
          id: s._id,
          name: s.storeName || s.name,
          email: s.email,
          phone: s.phone || '+1 (555) 321-7654',
          registrationDate: new Date(s.createdAt).toLocaleDateString('en-US'),
          verificationStatus: s.isApproved ? 'Approved' : (s.isBlocked ? 'Rejected' : 'Pending'),
          status: s.isBlocked ? 'Suspended' : 'Active',
          productsCount: 0,
          earnings: 0.00,
          gstin: s.gstin || 'Not Provided',
          bankName: s.bankName || 'Not Provided',
          bankAccount: s.bankAccount || 'Not Provided',
          routingNumber: s.routingNumber || 'Not Provided',
          address: s.address || { address: 'Not Provided', city: '', state: '', zipCode: '' },
          aadhaarFile: s.aadhaarFile || '',
          panFile: s.panFile || '',
          licenseFile: s.licenseFile || ''
        })));

        setCustomers(allUsers.filter(u => u.role === 'customer').map(c => ({
          id: c._id,
          name: c.name,
          email: c.email,
          phone: c.phone || '+1 (555) 222-3333',
          ordersCount: 0,
          totalSpend: 0,
          status: c.isBlocked ? 'Blocked' : 'Active'
        })));

        const allProds = await apiCall('/admin/products');
        setProducts(allProds.map(p => ({
          id: p._id,
          name: p.name,
          seller: p.seller ? (p.seller.storeName || p.seller.name) : 'Platform',
          category: p.category,
          price: p.price,
          stock: p.stock,
          rating: p.rating || 0.0,
          approvalStatus: p.approvalStatus || 'Pending',
          status: p.isActive ? 'Active' : 'Draft',
          image: p.image
        })));

        const allOrders = await apiCall('/admin/orders');
        setOrders(allOrders.map(o => ({
          id: o._id,
          customer: o.user ? o.user.name : 'Guest',
          seller: o.items.length > 0 && o.items[0].seller ? 'Multiple' : 'Quickcart',
          products: o.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
          amount: o.total,
          paymentStatus: 'Paid',
          deliveryStatus: o.status === 'Pending' ? 'New' : o.status,
          orderDate: new Date(o.createdAt).toLocaleDateString('en-US'),
          deliveryPartner: o.courierPartner || ''
        })));

        const allRestockReqs = await apiCall('/admin/restock-requests');
        setRestockRequests(allRestockReqs);

      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (isAuthenticated) {
      loadAdminData();
      intervalId = setInterval(() => {
        loadAdminData();
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.role === 'admin' || data.role === 'sub-admin') {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setAdminUser(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // CRUD Implementations
  const addCategory = (name, img) => {
    setCategories(prev => [
      ...prev,
      {
        id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name,
        count: 0,
        status: 'Active',
        image: img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
      }
    ]);
  };

  const editCategory = (id, fields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const approveProduct = async (id) => {
    try {
      await apiCall(`/admin/products/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, approvalStatus: 'Approved', status: 'Active' } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await apiCall(`/admin/products/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ approvalStatus: 'rejected' }),
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, approvalStatus: 'Rejected', status: 'Suspended' } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiCall(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const approveSeller = async (id) => {
    try {
      await apiCall(`/admin/users/${id}/approve`, { method: 'PUT' });
      setSellers(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'Approved', status: 'Active' } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const suspendSeller = async (id) => {
    try {
      await apiCall(`/admin/users/${id}/reject`, { method: 'PUT' });
      setSellers(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'Rejected', status: 'Suspended' } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const blockCustomer = async (id) => {
    try {
      await apiCall(`/admin/users/${id}/block`, { method: 'PUT' });
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked' } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const unblockCustomer = async (id) => {
    try {
      await apiCall(`/admin/users/${id}/block`, { method: 'PUT' });
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'Active' } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const assignDeliveryPartner = async (orderId, partnerName) => {
    try {
      await apiCall(`/admin/orders/${orderId}/courier`, {
        method: 'PUT',
        body: JSON.stringify({ courierPartner: partnerName, status: 'Processing' }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPartner: partnerName, deliveryStatus: 'Processing' } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await apiCall(`/admin/orders/${orderId}/courier`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const settlePayout = (id) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Settled' } : p));
  };

  const addCoupon = (code, type, value, name) => {
    setCoupons(prev => [
      ...prev,
      {
        id: `CPN-${Math.floor(10 + Math.random() * 90)}`,
        code: code.toUpperCase(),
        type,
        value,
        name,
        status: 'Active'
      }
    ]);
  };

  const resolveTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
        categories,
        products,
        sellers,
        customers,
        orders,
        restockRequests,
        payouts,
        deliveryPartners,
        coupons,
        tickets,
        addCategory,
        editCategory,
        deleteCategory,
        approveProduct,
        rejectProduct,
        deleteProduct,
        approveSeller,
        suspendSeller,
        blockCustomer,
        unblockCustomer,
        assignDeliveryPartner,
        updateOrderStatus,
        settlePayout,
        addCoupon,
        resolveTicket,
        loadAdminData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
export default AdminContext;
