import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return setError('Passwords do not match');
    setLoading(true); setError('');
    try {
      const r = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(r.data.token, r.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Join GMC Shop today</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          {[
            { name:'name',     type:'text',     label:'Full Name',        ph:'Alice Johnson' },
            { name:'email',    type:'email',    label:'Email',            ph:'alice@example.com' },
            { name:'password', type:'password', label:'Password',         ph:'Min. 6 characters' },
            { name:'confirm',  type:'password', label:'Confirm Password', ph:'••••••••' },
          ].map((f) => (
            <div key={f.name}>
              <label style={s.label}>{f.label}</label>
              <input style={s.input} type={f.type} name={f.name} required minLength={f.name === 'password' ? 6 : undefined}
                value={form[f.name]} onChange={handleChange} placeholder={f.ph} />
            </div>
          ))}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={s.footer}>
          Already have an account? <Link to="/login" style={s.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5', padding:'2rem' },
  card:  { background:'#fff', borderRadius:12, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { margin:0, color:'#1a1a2e', fontSize:'1.6rem' },
  sub:   { color:'#888', marginBottom:'1.5rem', marginTop:4 },
  error: { background:'#f8d7da', color:'#721c24', padding:'0.6rem 1rem', borderRadius:4, marginBottom:'1rem', fontSize:'0.9rem' },
  form:  { display:'flex', flexDirection:'column', gap:10 },
  label: { display:'block', fontSize:'0.85rem', fontWeight:600, color:'#444', marginBottom:4 },
  input: { width:'100%', padding:'0.65rem 0.9rem', border:'1px solid #ddd', borderRadius:4, fontSize:'0.95rem', boxSizing:'border-box' },
  btn:   { padding:'0.8rem', background:'#28a745', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:'1rem', marginTop:4 },
  footer:{ textAlign:'center', marginTop:'1.2rem', fontSize:'0.9rem', color:'#666' },
  link:  { color:'#e94560', fontWeight:600 },
};
