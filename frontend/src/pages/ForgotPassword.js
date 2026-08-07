// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px',
        padding: '36px 32px', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center'
      }}>
        <div style={{
          background: '#1a6b3c', width: '58px', height: '58px',
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <FaMapMarkerAlt size={22} color="#fff" />
        </div>

        {done ? (
          <>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '10px' }}>
              Check your email
            </h1>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              If <strong>{email}</strong> is registered, we've sent a password reset link.
              It expires in 1 hour.
            </p>
            <Link to="/login" style={{ color: '#1a6b3c', fontWeight: '700', fontSize: '14px' }}>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>
              Forgot Password?
            </h1>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              Enter your email and we'll send you a reset link
            </p>

            {error && (
              <div style={{ background: '#fff0f0', color: '#c0392b', padding: '11px 14px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px', border: '1px solid #fcc' }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <FaEnvelope style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
              <input
                type="email"
                placeholder="Your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#aaa' : '#1a6b3c',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link to="/login" style={{ color: '#1a6b3c', fontWeight: '600', fontSize: '13px' }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}