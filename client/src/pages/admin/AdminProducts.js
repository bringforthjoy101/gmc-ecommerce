import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api';

const EMPTY = { name:'', description:'', price:'', category:'Electronics', imageUrl:'', stock:'' };
const CATS  = ['Electronics','Clothing','Books','Kitchen','Sports','Other'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const load = async () => {
    const r = await fetchProducts({ limit: 100 });
    setProducts(r.data.data);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit   = (p)  => { setEditing(p); setForm({ name:p.name, description:p.description, price:p.price, category:p.category, imageUrl:p.imageUrl, stock:p.stock }); setError(''); setModal(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await updateProduct(editing._id, payload);
      else          await createProduct(payload);
      setModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>⚙️ Product Management</h1>
        <button style={s.addBtn} onClick={openCreate}>+ Add Product</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>{['Image','Name','Category','Price','Stock','Actions'].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} style={s.tr}>
              <td style={s.td}><img src={p.imageUrl} alt={p.name} style={s.thumb} /></td>
              <td style={{ ...s.td, maxWidth:200 }}>{p.name}</td>
              <td style={s.td}>{p.category}</td>
              <td style={s.td}>${p.price.toFixed(2)}</td>
              <td style={{ ...s.td, color: p.stock < 10 ? '#dc3545' : '#28a745' }}>{p.stock}</td>
              <td style={s.td}>
                <button style={s.editBtn}   onClick={() => openEdit(p)}>Edit</button>
                <button style={s.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</h2>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={s.form}>
              {[
                { name:'name',        label:'Name',        type:'text' },
                { name:'imageUrl',    label:'Image URL',   type:'url' },
                { name:'price',       label:'Price ($)',   type:'number' },
                { name:'stock',       label:'Stock',       type:'number' },
              ].map((f) => (
                <div key={f.name} style={s.field}>
                  <label style={s.label}>{f.label}</label>
                  <input style={s.input} name={f.name} type={f.type} required min={f.type==='number'?0:undefined}
                    step={f.name==='price'?'0.01':undefined}
                    value={form[f.name]} onChange={handleChange} />
                </div>
              ))}
              <div style={s.field}>
                <label style={s.label}>Category</label>
                <select style={s.input} name="category" value={form.category} onChange={handleChange}>
                  {CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea style={{ ...s.input, height:80, resize:'vertical' }} name="description" required
                  value={form.description} onChange={handleChange} />
              </div>
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" style={s.saveBtn} disabled={loading}>
                  {loading ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:         { maxWidth:1100, margin:'0 auto', padding:'2rem' },
  header:       { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  title:        { margin:0, color:'#1a1a2e' },
  addBtn:       { padding:'0.6rem 1.4rem', background:'#28a745', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700 },
  table:        { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' },
  th:           { padding:'0.8rem 1rem', background:'#1a1a2e', color:'#fff', textAlign:'left', fontSize:'0.85rem' },
  tr:           { borderBottom:'1px solid #f0f0f0' },
  td:           { padding:'0.7rem 1rem', fontSize:'0.88rem', verticalAlign:'middle' },
  thumb:        { width:50, height:50, objectFit:'cover', borderRadius:4 },
  editBtn:      { marginRight:6, padding:'0.3rem 0.7rem', background:'#17a2b8', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:'0.8rem' },
  deleteBtn:    { padding:'0.3rem 0.7rem', background:'#dc3545', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:'0.8rem' },
  overlay:      { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  modal:        { background:'#fff', borderRadius:12, padding:'2rem', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' },
  modalTitle:   { margin:'0 0 1rem', color:'#1a1a2e' },
  error:        { background:'#f8d7da', color:'#721c24', padding:'0.6rem', borderRadius:4, marginBottom:'1rem', fontSize:'0.85rem' },
  form:         { display:'flex', flexDirection:'column', gap:12 },
  field:        { display:'flex', flexDirection:'column', gap:4 },
  label:        { fontSize:'0.82rem', fontWeight:600, color:'#444' },
  input:        { padding:'0.55rem 0.8rem', border:'1px solid #ddd', borderRadius:4, fontSize:'0.9rem' },
  modalActions: { display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 },
  cancelBtn:    { padding:'0.6rem 1.2rem', background:'#6c757d', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' },
  saveBtn:      { padding:'0.6rem 1.4rem', background:'#e94560', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontWeight:700 },
};
