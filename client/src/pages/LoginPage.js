import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirect  = location.state?.from || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await loginUser(form);
      login(r.data.token, r.data.user);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.sub}>Login to your GMC Shop account</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" name="email" required
            value={form.email} onChange={handleChange} placeholder="you@example.com" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" name="password" required
            value={form.password} onChange={handleChange} placeholder="••••••••" />
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={s.footer}>
          Don't have an account? <Link to="/register" style={s.link}>Register</Link>
        </p>
        <p style={s.demo}>Demo: <code>admin@gmc.com</code> / <code>admin123</code></p>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5' },
  card:  { background:'#fff', borderRadius:12, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { margin:0, color:'#1a1a2e', fontSize:'1.6rem' },
  sub:   { color:'#888', marginBottom:'1.5rem', marginTop:4 },
  error: { background:'#f8d7da', color:'#721c24', padding:'0.6rem 1rem', borderRadius:4, marginBottom:'1rem', fontSize:'0.9rem' },
  form:  { display:'flex', flexDirection:'column', gap:10 },
  label: { fontSize:'0.85rem', fontWeight:600, color:'#444' },
  input: { padding:'0.65rem 0.9rem', border:'1px solid #ddd', borderRadius:4, fontSize:'0.95rem' },
  btn:   { padding:'0.8rem', background:'#e94560', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:'1rem', marginTop:4 },
  footer:{ textAlign:'center', marginTop:'1.2rem', fontSize:'0.9rem', color:'#666' },
  link:  { color:'#e94560', fontWeight:600 },
  demo:  { textAlign:'center', fontSize:'0.78rem', color:'#aaa', marginTop:8 },
};
