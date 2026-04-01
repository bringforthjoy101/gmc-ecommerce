import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div style={s.card}>
      <Link to={`/products/${product._id}`}>
        <img src={product.imageUrl || 'https://via.placeholder.com/300x200'} alt={product.name} style={s.img} />
      </Link>
      <div style={s.body}>
        <span style={s.category}>{product.category}</span>
        <Link to={`/products/${product._id}`} style={s.name}>{product.name}</Link>
        <div style={s.rating}><span style={s.stars}>{stars}</span> ({product.numReviews})</div>
        <div style={s.footer}>
          <span style={s.price}>${product.price.toFixed(2)}</span>
          {product.stock > 0
            ? <button style={s.btn} onClick={() => addItem(product._id, 1)}>Add to Cart</button>
            : <span style={s.oos}>Out of Stock</span>
          }
        </div>
      </div>
    </div>
  );
}

const s = {
  card:     { background:'#fff', borderRadius:8, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', transition:'transform 0.2s' },
  img:      { width:'100%', height:200, objectFit:'cover' },
  body:     { padding:'0.9rem', display:'flex', flexDirection:'column', gap:4, flex:1 },
  category: { fontSize:'0.72rem', color:'#888', textTransform:'uppercase', letterSpacing:1 },
  name:     { fontWeight:600, color:'#1a1a2e', textDecoration:'none', fontSize:'0.95rem', lineHeight:1.3 },
  rating:   { fontSize:'0.8rem', color:'#666' },
  stars:    { color:'#f4a90a' },
  footer:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:8 },
  price:    { fontWeight:700, fontSize:'1.1rem', color:'#e94560' },
  btn:      { padding:'0.35rem 0.8rem', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:'0.8rem' },
  oos:      { fontSize:'0.8rem', color:'#dc3545', fontWeight:600 },
};
