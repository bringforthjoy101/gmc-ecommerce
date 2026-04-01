import React from 'react';
export default function Footer() {
  return (
    <footer style={{ background:'#1a1a2e', color:'#aaa', textAlign:'center', padding:'1.2rem', fontSize:'0.82rem', marginTop:'auto' }}>
      © {new Date().getFullYear()} GMC Shop · MERN Stack · Deployed on Azure
    </footer>
  );
}
