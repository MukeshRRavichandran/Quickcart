const API_URL = '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const isSellerPath = window.location.pathname.startsWith('/seller/') || window.location.pathname === '/seller';
  const tokenKey = isSellerPath ? 'sellerToken' : 'customerToken';
  const token = localStorage.getItem(tokenKey);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

export const authAPI = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password, role = 'customer', storeName = '') => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, storeName }),
  }),
  getMe: () => apiRequest('/auth/me'),
};

export const productsAPI = {
  getAll: (category = '', search = '') => {
    let query = '';
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString();
    if (queryString) {
      query = `?${queryString}`;
    }
    return apiRequest(`/products${query}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
};

export const cartAPI = {
  get: () => apiRequest('/cart'),
  add: (productId, quantity = 1) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),
  update: (productId, quantity) => apiRequest(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  remove: (productId) => apiRequest(`/cart/${productId}`, {
    method: 'DELETE',
  }),
};

export const wishlistAPI = {
  get: () => apiRequest('/wishlist'),
  add: (productId) => apiRequest('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  remove: (productId) => apiRequest(`/wishlist/${productId}`, {
    method: 'DELETE',
  }),
};

export const couponsAPI = {
  validate: (code, subtotal) => apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal }),
  }),
  getActive: () => apiRequest('/coupons'),
};

export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  cancel: (id) => apiRequest(`/orders/${id}/cancel`, {
    method: 'PUT',
  }),
};

export const sellerAPI = {
  getProducts: () => apiRequest('/products/seller'),
  createProduct: (data) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id, data) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  getOrders: () => apiRequest('/orders/seller'),
  updateOrderStatus: (id, status) => apiRequest(`/orders/seller/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getEarnings: () => apiRequest('/orders/seller/earnings'),
};

export const adminAPI = {
  getUsers: () => apiRequest('/admin/users'),
  toggleUserBlock: (id) => apiRequest(`/admin/users/${id}/block`, {
    method: 'PUT',
  }),
  getProducts: () => apiRequest('/admin/products'),
  approveProduct: (id, status) => apiRequest(`/admin/products/${id}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ approvalStatus: status }),
  }),
  getOrders: () => apiRequest('/admin/orders'),
  assignCourier: (id, courierData) => apiRequest(`/admin/orders/${id}/courier`, {
    method: 'PUT',
    body: JSON.stringify(courierData),
  }),
  getStats: () => apiRequest('/admin/stats'),
};

export const reviewsAPI = {
  getProductReviews: (productId) => apiRequest(`/reviews/product/${productId}`),
  create: (data) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getSellerReviews: () => apiRequest('/reviews/seller'),
  reply: (id, reply) => apiRequest(`/reviews/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply }),
  }),
};

export const notificationsAPI = {
  getAll: () => apiRequest('/notifications'),
  markRead: (id) => apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
  markAllRead: () => apiRequest('/notifications/read-all', {
    method: 'PUT',
  }),
};
