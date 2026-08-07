// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaEye, FaEyeSlash, FaMapMarkerAlt,
  FaUser, FaPhone, FaEnvelope, FaIdCard, FaLock
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    govt_id_type: 'Aadhaar', govt_id: '',
    password: '', confirm_password: ''
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.full_name.trim())  return t.fullNameRequired;
    if (!/^\d{10}$/.test(form.phone)) return t.invalidPhone;
    if (!form.email.includes('@')) return t.invalidEmail;
    if (!form.govt_id.trim())    return t.govtIdRequired;
    if (form.password.length < 6) return t.passwordMinLength;
    if (form.password !== form.confirm_password) return t.passwordsDontMatchErr;
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess(t.accountCreatedSuccess);
      setTimeout(() => { navigate('/'); window.location.reload(); }, 2000);
    } catch (e) {
      setError(e.response?.data?.message || t.registrationFailed);
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
        padding: '36px 32px', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
      }}>

        {/* Header */}
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
            {t.createAccount}
          </h1>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            {t.joinFree}
          </p>
        </div>

        {/* Messages */}
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
        {success && (
          <div style={{
            background: '#f0fff4', color: '#1a6b3c',
            padding: '11px 14px', borderRadius: '10px',
            marginBottom: '14px', fontSize: '13px',
            textAlign: 'center', border: '1px solid #b2dfdb'
          }}>
            {success}
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.fullName}</label>
          <div style={{ position: 'relative' }}>
            <FaUser style={iconSt} />
            <input
              placeholder={t.enterFullName}
              value={form.full_name}
              onChange={e => set('full_name', e.target.value)}
              style={inputSt}
            />
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.phoneNumber}</label>
          <div style={{ position: 'relative' }}>
            <FaPhone style={iconSt} />
            <input
              placeholder={t.mobileNumberPlaceholder}
              value={form.phone}
              maxLength={10}
              onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
              style={inputSt}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.emailId}</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={iconSt} />
            <input
              type="email"
              placeholder={t.enterEmail}
              value={form.email}
              onChange={e => set('email', e.target.value)}
              style={inputSt}
            />
          </div>
        </div>

        {/* Govt ID Type */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.govtIdType}</label>
          <select
            value={form.govt_id_type}
            onChange={e => set('govt_id_type', e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              borderRadius: '10px', border: '2px solid #e0e0e0',
              fontSize: '14px', outline: 'none',
              background: '#fff', boxSizing: 'border-box'
            }}>
            <option>Aadhaar</option>
            <option>Voter ID</option>
            <option>PAN Card</option>
            <option>Passport</option>
            <option>Driving Licence</option>
          </select>
        </div>

        {/* Govt ID Number */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.govtIdNumber}</label>
          <div style={{ position: 'relative' }}>
            <FaIdCard style={iconSt} />
            <input
              placeholder={`${t.enterGovtId} ${form.govt_id_type} ${t.idNumberSuffix}`}
              value={form.govt_id}
              onChange={e => set('govt_id', e.target.value)}
              style={inputSt}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelSt}>{t.password}</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={iconSt} />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder={t.minSixChars}
              value={form.password}
              onChange={e => set('password', e.target.value)}
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
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelSt}>{t.confirmPassword}</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={iconSt} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder={t.reenterPassword}
              value={form.confirm_password}
              onChange={e => set('confirm_password', e.target.value)}
              style={{
                ...inputSt, paddingRight: '44px',
                border: `2px solid ${
                  form.confirm_password && form.confirm_password !== form.password
                    ? '#e74c3c' : '#e0e0e0'
                }`
              }}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute', right: '13px',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#bbb', fontSize: '15px'
              }}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {form.confirm_password && form.confirm_password !== form.password && (
            <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px' }}>
              {t.passwordsMismatch}
            </p>
          )}
          {form.confirm_password && form.confirm_password === form.password && (
            <p style={{ color: '#27ae60', fontSize: '12px', marginTop: '5px' }}>
              {t.passwordsMatch}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#aaa' : '#1a6b3c',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}>
          {loading ? t.creatingAccount : t.createAccountBtn}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {t.alreadyHaveAccount}{' '}
          <Link to="/login" style={{ color: '#1a6b3c', fontWeight: '700' }}>
            {t.signInHere}
          </Link>
        </p>
      </div>
    </div>
  );
}