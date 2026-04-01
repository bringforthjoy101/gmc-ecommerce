import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Kitchen', 'Sports', 'Other'];

export default function HomePage() {
  const [products,  setProducts]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('All');
  const [page,      setPage]      = useState(1);
  const [pages,     setPages]     = useState(1);
  const [query,     setQuery]     = useState('');   // committed search term

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (query)              params.search   = query;
      if (category !== 'All') params.category = category;
      const r = await fetchProducts(params);
      setProducts(r.data.data);
      setTotal(r.data.total);
      setPages(r.data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, query, category]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => { e.preventDefault(); setQuery(search); setPage(1); };
  const handleCat    = (cat) => { setCategory(cat); setPage(1); setQuery(''); setSearch(''); };

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Welcome to GMC Shop</h1>
        <p style={s.heroSub}>Discover quality products across every category</p>
        <form onSubmit={handleSearch} style={s.searchForm}>
          <input style={s.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" />
          <button type="submit" style={s.searchBtn}>Search</button>
        </form>
      </div>

      {/* Category pills */}
      <div style={s.catRow}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => handleCat(c)}
            style={{ ...s.catPill, ...(category === c ? s.catActive : {}) }}>
            {c}
          </button>
        ))}
      </div>

      {/* Results summary */}
      <div style={s.resultBar}>
        {loading ? 'Loading…' : `${total} product${total !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}${category !== 'All' ? ` in ${category}` : ''}`}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.center}>Loading products…</div>
      ) : products.length === 0 ? (
        <div style={s.center}>No products found.</div>
      ) : (
        <div style={s.grid}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={s.pagination}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)}
              style={{ ...s.pageBtn, ...(page === n ? s.pageBtnActive : {}) }}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:        { minHeight:'100vh', background:'#f5f5f5' },
  hero:        { background:'linear-gradient(135deg,#1a1a2e,#16213e)', color:'#fff', padding:'3rem 2rem', textAlign:'center' },
  heroTitle:   { fontSize:'2.5rem', margin:0, fontWeight:800 },
  heroSub:     { color:'#aaa', marginTop:8 },
  searchForm:  { display:'flex', justifyContent:'center', marginTop:'1.5rem', maxWidth:500, margin:'1.5rem auto 0' },
  searchInput: { flex:1, padding:'0.65rem 1rem', border:'none', borderRadius:'4px 0 0 4px', fontSize:'0.95rem' },
  searchBtn:   { padding:'0.65rem 1.5rem', background:'#e94560', color:'#fff', border:'none', borderRadius:'0 4px 4px 0', cursor:'pointer', fontWeight:600 },
  catRow:      { display:'flex', gap:8, flexWrap:'wrap', padding:'1.2rem 2rem', background:'#fff', borderBottom:'1px solid #eee' },
  catPill:     { padding:'0.35rem 1rem', borderRadius:20, border:'1px solid #ddd', background:'#f8f8f8', cursor:'pointer', fontSize:'0.85rem' },
  catActive:   { background:'#1a1a2e', color:'#fff', border:'1px solid #1a1a2e' },
  resultBar:   { padding:'0.75rem 2rem', color:'#666', fontSize:'0.85rem' },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.2rem', padding:'0 2rem 2rem' },
  center:      { textAlign:'center', padding:'4rem', color:'#888' },
  pagination:  { display:'flex', justifyContent:'center', gap:8, padding:'1.5rem' },
  pageBtn:     { padding:'0.4rem 0.9rem', border:'1px solid #ddd', borderRadius:4, cursor:'pointer', background:'#fff' },
  pageBtnActive: { background:'#1a1a2e', color:'#fff', border:'1px solid #1a1a2e' },
};
