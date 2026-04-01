// ─────────────────────────────────────────────────────────────────────────────
// context/CartContext.js
// Wraps all cart API calls. Exposes items, total, count, and mutators.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchCart, addToCart as apiAdd, updateCartItem as apiUpdate, removeCartItem as apiRemove } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const r = await fetchCart();
      setItems(r.data.data?.items || []);
    } catch { setItems([]); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = async (productId, quantity = 1) => {
    await apiAdd({ productId, quantity });
    await refresh();
  };

  const updateItem = async (itemId, quantity) => {
    await apiUpdate(itemId, { quantity });
    await refresh();
  };

  const removeItem = async (itemId) => {
    await apiRemove(itemId);
    await refresh();
  };

  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
