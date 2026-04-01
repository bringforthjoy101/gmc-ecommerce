// ─────────────────────────────────────────────────────────────────────────────
// src/api.js — Axios instance + per-resource helpers
// Token is read from localStorage on every request (no stale closures).
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => api.post('/auth/register', data);
export const loginUser     = (data) => api.post('/auth/login', data);
export const fetchMe       = ()     => api.get('/auth/me');

// Products
export const fetchProducts = (params) => api.get('/products', { params });
export const fetchProduct  = (id)     => api.get(`/products/${id}`);
export const createProduct = (data)   => api.post('/products', data);
export const updateProduct = (id, d)  => api.put(`/products/${id}`, d);
export const deleteProduct = (id)     => api.delete(`/products/${id}`);

// Cart
export const fetchCart       = ()          => api.get('/cart');
export const addToCart       = (data)      => api.post('/cart', data);
export const updateCartItem  = (id, data)  => api.put(`/cart/${id}`, data);
export const removeCartItem  = (id)        => api.delete(`/cart/${id}`);
export const clearCart       = ()          => api.delete('/cart/clear');

// Orders
export const placeOrder      = (data) => api.post('/orders', data);
export const fetchMyOrders   = ()     => api.get('/orders/mine');
export const fetchAllOrders  = ()     => api.get('/orders');
export const fetchOrder      = (id)   => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

export default api;
