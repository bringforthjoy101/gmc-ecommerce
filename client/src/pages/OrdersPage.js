import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchMyOrders, fetchOrder } from '../api';

const STATUS_COLORS = { pending:'#f0ad4e', processing:'#17a2b8', shipped:'#6f42c1', delivered:'#28a745', cancelled:'#dc3545' };

// Single order detail view
export function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const success = searchParams.get('success');

  useEffect(() => { fetchOrder(id).then((r) => setOrder(r.data.data)); }, [id]);

  if (!order) return <div style={{ textAlign:'center', padding:'4rem' }}>Loading…</div>;

  return (
    <div style={s.page}>
      {success && <div style={s.successBanner}>🎉 Order placed successfully! Your order is confirmed.</div>}
      <div style={s.header}>
        <h1 style={s.title}>Order Details</h1>
        <span style={{ ...s.statusBadge, background: STATUS_COLORS[order.status] || '#888' }}>{order.status}</span>
      </div>
      <p style={s.orderId}>Order ID: <code>{order._id}</code></p>
      <p style={s.orderId}>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>

      <h3 style={s.sectionHead}>Items</h3>
      <div style={s.itemsList}>
        {order.items.map((item, i) => (
          <div key={i} style={s.item}>
            <img src={item.imageUrl} alt={item.name} style={s.img} />
            <span style={s.itemName}>{item.name}</span>
            <span>× {item.quantity}</span>
            <span style={s.lineTotal}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <h3 style={s.sectionHead}>Shipping Address</h3>
      <p style={s.addr}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zip}</p>

      <div style={s.totals}>
        <div style={s.totalRow}><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
        <div style={s.totalRow}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice}`}</span></div>
        <div style={{ ...s.totalRow, fontWeight:700, fontSize:'1.1rem', borderTop:'2px solid #eee', paddingTop:8 }}>
          <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <Link to="/orders" style={s.backLink}>← Back to My Orders</Link>
    </div>
  );
}

// Orders list
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then((r) => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign:'center', padding:'4rem' }}>Loading…</div>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={s.empty}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/" style={s.shopBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div style={s.table}>
          <div style={{ ...s.tableRow, ...s.tableHead }}>
            <span>Order ID</span><span>Date</span><span>Total</span><span>Status</span><span></span>
          </div>
          {orders.map((o) => (
            <div key={o._id} style={s.tableRow}>
              <span style={s.orderId}>{o._id.slice(-8).toUpperCase()}</span>
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
              <span>${o.totalPrice.toFixed(2)}</span>
              <span style={{ ...s.statusBadge, background: STATUS_COLORS[o.status] || '#888' }}>{o.status}</span>
              <Link to={`/orders/${o._id}`} style={s.viewBtn}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:         { maxWidth:900, margin:'0 auto', padding:'2rem' },
  title:        { color:'#1a1a2e', marginBottom:'1.5rem' },
  header:       { display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' },
  sectionHead:  { color:'#1a1a2e', borderBottom:'2px solid #e94560', paddingBottom:6, marginTop:'1.5rem' },
  successBanner:{ background:'#d4edda', color:'#155724', padding:'1rem', borderRadius:6, marginBottom:'1.5rem', fontWeight:600 },
  statusBadge:  { padding:'0.3rem 0.8rem', borderRadius:20, color:'#fff', fontSize:'0.8rem', fontWeight:600 },
  orderId:      { color:'#666', fontSize:'0.9rem' },
  itemsList:    { display:'flex', flexDirection:'column', gap:8 },
  item:         { display:'flex', alignItems:'center', gap:'1rem', background:'#f9f9f9', borderRadius:6, padding:'0.8rem' },
  img:          { width:50, height:50, objectFit:'cover', borderRadius:4 },
  itemName:     { flex:1, fontWeight:500 },
  lineTotal:    { fontWeight:700 },
  addr:         { color:'#555', background:'#f5f5f5', padding:'0.8rem 1rem', borderRadius:6 },
  totals:       { background:'#fff', border:'1px solid #eee', borderRadius:8, padding:'1.2rem', maxWidth:320, marginLeft:'auto', marginTop:'1.5rem', display:'flex', flexDirection:'column', gap:8 },
  totalRow:     { display:'flex', justifyContent:'space-between', fontSize:'0.95rem' },
  backLink:     { display:'inline-block', marginTop:'1.5rem', color:'#1a1a2e', textDecoration:'none', fontWeight:600 },
  table:        { background:'#fff', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' },
  tableHead:    { background:'#1a1a2e', color:'#fff', fontWeight:700 },
  tableRow:     { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:'1rem', padding:'0.9rem 1.2rem', borderBottom:'1px solid #f0f0f0', alignItems:'center' },
  viewBtn:      { color:'#e94560', textDecoration:'none', fontWeight:600, fontSize:'0.85rem' },
  empty:        { textAlign:'center', padding:'4rem' },
  shopBtn:      { display:'inline-block', marginTop:'1rem', padding:'0.7rem 2rem', background:'#1a1a2e', color:'#fff', borderRadius:6, textDecoration:'none', fontWeight:600 },
};
