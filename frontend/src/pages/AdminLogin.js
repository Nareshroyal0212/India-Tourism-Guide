// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError('Please fill all fields'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px',
        padding: '40px', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: '#1a1a2e', width: '68px', height: '68px',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <FaUserShield size={30} color="#f4a61d" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            India Tourism Guide — Owner Login
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0', color: '#c0392b',
            padding: '11px', borderRadius: '10px',
            marginBottom: '16px', fontSize: '13px',
            textAlign: 'center', border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            fontSize: '13px', fontWeight: '600',
            color: '#444', display: 'block', marginBottom: '6px'
          }}>
            Admin Username
          </label>
          <input
            autoComplete="off"
            placeholder="Enter admin username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '10px', border: '2px solid #e0e0e0',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '26px' }}>
          <label style={{
            fontSize: '13px', fontWeight: '600',
            color: '#444', display: 'block', marginBottom: '6px'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <FaLock style={{
              position: 'absolute', left: '13px',
              top: '50%', transform: 'translateY(-50%)', color: '#bbb'
            }} />
            <input
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '13px 44px 13px 40px',
                borderRadius: '10px', border: '2px solid #e0e0e0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button
              onClick={() => setShow(!show)}
              style={{
                position: 'absolute', right: '13px',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#bbb', fontSize: '15px'
              }}>
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#aaa' : '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}>
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>

        <p style={{ textAlign: 'center' }}>
          <Link to="/login" style={{
            color: '#1a6b3c', fontSize: '13px', textDecoration: 'none'
          }}>
            ← Back to User Login
          </Link>
        </p>
      </div>
    </div>
  );
}