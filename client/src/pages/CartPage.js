import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, total, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div style={s.empty}>
      <div style={s.emptyIcon}>🛒</div>
      <h2>Your cart is empty</h2>
      <Link to="/" style={s.shopBtn}>Continue Shopping</Link>
    </div>
  );

  const shipping = total >= 100 ? 0 : 10;

  return (
    <div style={s.page}>
      <h1 style={s.title}>Shopping Cart</h1>
      <div style={s.layout}>
        {/* Items */}
        <div style={s.items}>
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={item._id} style={s.item}>
                <img src={p.imageUrl} alt={p.name} style={s.img} />
                <div style={s.detail}>
                  <Link to={`/products/${p._id}`} style={s.itemName}>{p.name}</Link>
                  <div style={s.itemPrice}>${p.price.toFixed(2)}</div>
                </div>
                <div style={s.qtyRow}>
                  <button style={s.qtyBtn} onClick={() => updateItem(item._id, item.quantity - 1)}>−</button>
                  <span style={s.qtyVal}>{item.quantity}</span>
                  <button style={s.qtyBtn} onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                </div>
                <div style={s.lineTotal}>${(p.price * item.quantity).toFixed(2)}</div>
                <button style={s.removeBtn} onClick={() => removeItem(item._id)}>✕</button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>
          <div style={s.summaryRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div style={s.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color:'#28a745' }}>Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && <p style={s.freeShip}>Add ${(100 - total).toFixed(2)} more for free shipping</p>}
          <div style={{ ...s.summaryRow, fontWeight:700, fontSize:'1.1rem', borderTop:'2px solid #eee', paddingTop:12, marginTop:8 }}>
            <span>Total</span><span>${(total + shipping).toFixed(2)}</span>
          </div>
          <button style={s.checkoutBtn}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/" style={s.continueLink}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:        { maxWidth:1100, margin:'0 auto', padding:'2rem' },
  title:       { marginBottom:'1.5rem', color:'#1a1a2e' },
  layout:      { display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' },
  items:       { display:'flex', flexDirection:'column', gap:'1rem' },
  item:        { display:'flex', alignItems:'center', gap:'1rem', background:'#fff', borderRadius:8, padding:'1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' },
  img:         { width:80, height:80, objectFit:'cover', borderRadius:6 },
  detail:      { flex:1 },
  itemName:    { fontWeight:600, color:'#1a1a2e', textDecoration:'none', display:'block', marginBottom:4 },
  itemPrice:   { color:'#888', fontSize:'0.9rem' },
  qtyRow:      { display:'flex', alignItems:'center', gap:8 },
  qtyBtn:      { width:28, height:28, border:'1px solid #ddd', borderRadius:4, background:'#f5f5f5', cursor:'pointer' },
  qtyVal:      { minWidth:24, textAlign:'center', fontWeight:600 },
  lineTotal:   { fontWeight:700, minWidth:64, textAlign:'right' },
  removeBtn:   { background:'none', border:'none', color:'#dc3545', cursor:'pointer', fontSize:'1rem', padding:'0 4px' },
  summary:     { background:'#fff', borderRadius:8, padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:12 },
  summaryTitle:{ margin:0, color:'#1a1a2e' },
  summaryRow:  { display:'flex', justifyContent:'space-between', fontSize:'0.95rem' },
  freeShip:    { fontSize:'0.8rem', color:'#888', margin:0 },
  checkoutBtn: { padding:'0.8rem', background:'#e94560', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:'1rem' },
  continueLink:{ textAlign:'center', color:'#666', fontSize:'0.85rem', textDecoration:'none' },
  empty:       { textAlign:'center', padding:'6rem 2rem' },
  emptyIcon:   { fontSize:'4rem', marginBottom:'1rem' },
  shopBtn:     { display:'inline-block', marginTop:'1rem', padding:'0.7rem 2rem', background:'#1a1a2e', color:'#fff', borderRadius:6, textDecoration:'none', fontWeight:600 },
};
