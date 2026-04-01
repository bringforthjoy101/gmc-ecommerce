import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, refresh } = useCart();
  const [form,    setForm]    = useState({ address:'', city:'', country:'', zip:'' });
  const [payment, setPayment] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const shipping = total >= 100 ? 0 : 10;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await placeOrder({ shippingAddress: form, paymentMethod: payment });
      await refresh();
      navigate(`/orders/${r.data.data._id}?success=1`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Checkout</h1>
      <div style={s.layout}>
        {/* Shipping form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <h3 style={s.sectionHead}>Shipping Address</h3>
          {error && <div style={s.error}>{error}</div>}
          {[
            { name:'address', label:'Street Address', placeholder:'123 Main St' },
            { name:'city',    label:'City',           placeholder:'New York' },
            { name:'country', label:'Country',        placeholder:'USA' },
            { name:'zip',     label:'ZIP / Postal Code', placeholder:'10001' },
          ].map((f) => (
            <div key={f.name} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <input style={s.input} name={f.name} required value={form[f.name]}
                onChange={handleChange} placeholder={f.placeholder} />
            </div>
          ))}

          <h3 style={s.sectionHead}>Payment Method</h3>
          {['Credit Card', 'PayPal', 'Bank Transfer'].map((m) => (
            <label key={m} style={s.radioLabel}>
              <input type="radio" name="payment" value={m} checked={payment === m}
                onChange={() => setPayment(m)} /> {m}
            </label>
          ))}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Placing Order…' : `Place Order — $${(total + shipping).toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div style={s.summary}>
          <h3 style={s.sectionHead}>Order Summary</h3>
          {items.map((item) => item.product && (
            <div key={item._id} style={s.summaryItem}>
              <img src={item.product.imageUrl} alt={item.product.name} style={s.summaryImg} />
              <span style={s.summaryName}>{item.product.name} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={s.divider} />
          <div style={s.summaryRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div style={s.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
          <div style={{ ...s.summaryRow, fontWeight:700, fontSize:'1.05rem' }}>
            <span>Total</span><span>${(total + shipping).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:        { maxWidth:1000, margin:'0 auto', padding:'2rem' },
  title:       { color:'#1a1a2e', marginBottom:'1.5rem' },
  layout:      { display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' },
  form:        { background:'#fff', borderRadius:8, padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:12 },
  sectionHead: { margin:'0 0 4px', color:'#1a1a2e', borderBottom:'2px solid #e94560', paddingBottom:6 },
  field:       { display:'flex', flexDirection:'column', gap:4 },
  label:       { fontSize:'0.85rem', fontWeight:600, color:'#444' },
  input:       { padding:'0.55rem 0.8rem', border:'1px solid #ddd', borderRadius:4, fontSize:'0.95rem' },
  radioLabel:  { display:'flex', alignItems:'center', gap:8, fontSize:'0.9rem', cursor:'pointer' },
  submitBtn:   { padding:'0.9rem', background:'#e94560', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:'1rem', marginTop:8 },
  error:       { background:'#f8d7da', color:'#721c24', padding:'0.6rem 1rem', borderRadius:4, fontSize:'0.9rem' },
  summary:     { background:'#fff', borderRadius:8, padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:10 },
  summaryItem: { display:'flex', alignItems:'center', gap:10, fontSize:'0.88rem' },
  summaryImg:  { width:40, height:40, objectFit:'cover', borderRadius:4 },
  summaryName: { flex:1, color:'#444' },
  divider:     { borderTop:'1px solid #eee', margin:'4px 0' },
  summaryRow:  { display:'flex', justifyContent:'space-between', fontSize:'0.92rem' },
};
