import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(id)
      .then((r) => setProduct(r.data.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = async () => {
    await addItem(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={s.center}>Loading…</div>;
  if (!product) return null;

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div style={s.page}>
      <button onClick={() => navigate(-1)} style={s.back}>← Back</button>
      <div style={s.container}>
        <img src={product.imageUrl || 'https://via.placeholder.com/500x400'} alt={product.name} style={s.img} />
        <div style={s.info}>
          <span style={s.cat}>{product.category}</span>
          <h1 style={s.name}>{product.name}</h1>
          <div style={s.rating}><span style={s.stars}>{stars}</span> {product.rating} ({product.numReviews} reviews)</div>
          <p style={s.desc}>{product.description}</p>
          <div style={s.price}>${product.price.toFixed(2)}</div>
          <div style={s.stock}>
            {product.stock > 0
              ? <span style={{ color:'#28a745' }}>✓ In Stock ({product.stock} available)</span>
              : <span style={{ color:'#dc3545' }}>✗ Out of Stock</span>}
          </div>
          {product.stock > 0 && (
            <div style={s.actions}>
              <div style={s.qtyRow}>
                <button style={s.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={s.qtyVal}>{qty}</span>
                <button style={s.qtyBtn} onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <button style={{ ...s.addBtn, ...(added ? s.addedBtn : {}) }} onClick={handleAdd}>
                {added ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:      { maxWidth:1000, margin:'0 auto', padding:'2rem' },
  back:      { background:'none', border:'none', color:'#1a1a2e', cursor:'pointer', fontSize:'0.9rem', marginBottom:'1.5rem', fontWeight:600 },
  container: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', background:'#fff', borderRadius:12, padding:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  img:       { width:'100%', borderRadius:8, objectFit:'cover', maxHeight:400 },
  info:      { display:'flex', flexDirection:'column', gap:12 },
  cat:       { fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:1, color:'#888' },
  name:      { margin:0, fontSize:'1.6rem', color:'#1a1a2e', lineHeight:1.3 },
  rating:    { fontSize:'0.9rem', color:'#666' },
  stars:     { color:'#f4a90a' },
  desc:      { color:'#555', lineHeight:1.7, margin:0 },
  price:     { fontSize:'2rem', fontWeight:800, color:'#e94560' },
  stock:     { fontSize:'0.9rem' },
  actions:   { display:'flex', alignItems:'center', gap:'1rem', marginTop:8 },
  qtyRow:    { display:'flex', alignItems:'center', gap:8 },
  qtyBtn:    { width:32, height:32, border:'1px solid #ddd', borderRadius:4, background:'#f5f5f5', cursor:'pointer', fontSize:'1.1rem' },
  qtyVal:    { minWidth:24, textAlign:'center', fontWeight:600 },
  addBtn:    { flex:1, padding:'0.8rem', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:'1rem', transition:'background 0.2s' },
  addedBtn:  { background:'#28a745' },
  center:    { textAlign:'center', padding:'4rem' },
};
