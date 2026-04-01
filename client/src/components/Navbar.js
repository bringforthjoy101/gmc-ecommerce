import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate  = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>🛍️ GMC Shop</Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Shop</Link>
        {isAdmin && <Link to="/admin/products" style={s.link}>⚙️ Admin</Link>}
        {user ? (
          <>
            <Link to="/orders" style={s.link}>My Orders</Link>
            <Link to="/cart" style={{ ...s.link, ...s.cartBtn }}>
              🛒 {count > 0 && <span style={s.badge}>{count}</span>}
            </Link>
            <button onClick={handleLogout} style={s.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/cart" style={{ ...s.link, ...s.cartBtn }}>
              🛒 {count > 0 && <span style={s.badge}>{count}</span>}
            </Link>
            <Link to="/login"    style={s.btn}>Login</Link>
            <Link to="/register" style={{ ...s.btn, background: '#28a745' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 2rem', background:'#1a1a2e', color:'#fff', position:'sticky', top:0, zIndex:100 },
  brand:   { color:'#e94560', fontWeight:700, fontSize:'1.3rem', textDecoration:'none' },
  links:   { display:'flex', alignItems:'center', gap:'1rem' },
  link:    { color:'#eee', textDecoration:'none', fontSize:'0.9rem' },
  cartBtn: { position:'relative', display:'inline-block' },
  badge:   { position:'absolute', top:'-8px', right:'-12px', background:'#e94560', color:'#fff', borderRadius:'50%', padding:'2px 6px', fontSize:'0.7rem', fontWeight:700 },
  btn:     { padding:'0.4rem 1rem', background:'#e94560', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', textDecoration:'none', fontSize:'0.85rem' },
};
