// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/reset-password`, { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
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
              Password Reset!
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Redirecting you to login...</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>
              Set New Password
            </h1>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              Choose a new password for your account
            </p>

            {error && (
              <div style={{ background: '#fff0f0', color: '#c0392b', padding: '11px 14px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px', border: '1px solid #fcc' }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <FaLock style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 44px 12px 40px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />

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
              {loading ? 'Resetting...' : 'Reset Password'}
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