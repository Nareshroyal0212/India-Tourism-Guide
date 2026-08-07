// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaMapMarkerAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.includes('@')) return t.loginEmailRequired;
    if (!password) return t.loginPasswordRequired;
    return null;
  };

  const handleLogin = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (e) {
      setError(e.response?.data?.message || t.invalidCredentials);
    }
    setLoading(false);
  };

  const labelSt = {
    fontSize: '13px', fontWeight: '600',
    color: '#444', display: 'block', marginBottom: '5px'
  };
  const inputSt = {
    width: '100%', padding: '12px 12px 12px 40px',
    borderRadius: '10px', border: '2px solid #e0e0e0',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };
  const iconSt = {
    position: 'absolute', left: '13px',
    top: '50%', transform: 'translateY(-50%)', color: '#bbb'
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
        padding: '36px 32px', width: '100%', maxWidth: '440px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: '#1a6b3c', width: '58px', height: '58px',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <FaMapMarkerAlt size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' }}>
            {t.loginTitle}
          </h1>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            {t.loginSubtitle}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0', color: '#c0392b',
            padding: '11px 14px', borderRadius: '10px',
            marginBottom: '14px', fontSize: '13px',
            textAlign: 'center', border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.emailId}</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={iconSt} />
            <input
              type="email"
              placeholder={t.enterEmail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={inputSt}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelSt}>{t.password}</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={iconSt} />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder={t.password}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ ...inputSt, paddingRight: '44px' }}
            />
            <button
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: 'absolute', right: '13px',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#bbb', fontSize: '15px'
              }}>
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px' }}>
            <Link to="/forgot-password" style={{ color: '#1a6b3c', fontSize: '12px', fontWeight: '600' }}>
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#aaa' : '#1a6b3c',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}>
          {loading ? t.loggingIn : t.loginBtn}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {t.dontHaveAccount}{' '}
          <Link to="/register" style={{ color: '#1a6b3c', fontWeight: '700' }}>
            {t.registerHere}
          </Link>
        </p>
      </div>
    </div>
  );
}