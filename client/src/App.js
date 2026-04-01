import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage      from './pages/HomePage';
import ProductPage   from './pages/ProductPage';
import CartPage      from './pages/CartPage';
import CheckoutPage  from './pages/CheckoutPage';
import OrdersPage, { OrderDetailPage } from './pages/OrdersPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import AdminProducts from './pages/admin/AdminProducts';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
            <Navbar />
            <main style={{ flex:1 }}>
              <Routes>
                <Route path="/"                  element={<HomePage />} />
                <Route path="/products/:id"      element={<ProductPage />} />
                <Route path="/cart"              element={<CartPage />} />
                <Route path="/login"             element={<LoginPage />} />
                <Route path="/register"          element={<RegisterPage />} />

                {/* Protected routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><OrdersPage /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
