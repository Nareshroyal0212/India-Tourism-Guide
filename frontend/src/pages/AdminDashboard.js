// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUsers,
  FaUser,
  FaMapMarkerAlt,
  FaStar,
  FaPlus,
  FaSignOutAlt,
  FaEnvelope,
  FaPhone,
  FaIdCard
} from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  'Historical','Temple','Beach','Hill Station',
  'Wildlife','National Park','Nature',
  'Adventure','Religious','Waterfall'
];

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem('token');
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const headers   = { Authorization: `Bearer ${token}` };

  const [tab,      setTab]      = useState('users');
  const [users,    setUsers]    = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [placeMsg, setPlaceMsg] = useState('');

  const [place, setPlace] = useState({
    name: '', city: '', state: '', category: 'Historical',
    description: '', rating: '4.5', entry_fee: '0',
    best_time: '', duration: '', image: '',
    lat: '', lng: '', tags: ''
  });

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      navigate('/admin/login'); return;
    }
    loadUsers();
    loadFeedback();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/admin/users`, { headers });
      setUsers(r.data.data || []);
    } catch {
      navigate('/admin/login');
    }
    setLoading(false);
  };

  const loadFeedback = async () => {
    try {
      const r = await axios.get(`${API}/admin/feedback`, { headers });
      setFeedback(r.data.data || []);
    } catch {}
  };

  const submitPlace = async () => {
    if (!place.name || !place.city || !place.state) {
      setPlaceMsg('Name, city and state are required!'); return;
    }
    try {
      const payload = {
        ...place,
        tags: place.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const r = await axios.post(`${API}/admin/places`, payload, { headers });
      setPlaceMsg(r.data.message);
      setPlace({
        name: '', city: '', state: '', category: 'Historical',
        description: '', rating: '4.5', entry_fee: '0',
        best_time: '', duration: '', image: '',
        lat: '', lng: '', tags: ''
      });
    } catch (e) {
      setPlaceMsg('Error: ' + (e.response?.data?.message || e.message));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const avgRating = feedback.length
    ? (feedback.reduce((a, f) => a + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : 'N/A';

  const TABS = [
    { id: 'users',    label: `Users (${users.length})`,        icon: <FaUsers /> },
    { id: 'feedback', label: `Feedback (${feedback.length})`,  icon: <FaStar /> },
    { id: 'addplace', label: 'Add Place',                       icon: <FaPlus /> },
  ];

  const inSt = {
    width: '100%', padding: '10px 12px',
    borderRadius: '8px', border: '2px solid #e8e8e8',
    fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '10px',
    background: '#fafafa'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>

      {/* Top Bar */}
      <div style={{
        background: '#1a1a2e', height: '60px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
          <FaMapMarkerAlt color="#f4a61d" size={18} />
          <span style={{ fontWeight: '700', fontSize: '16px' }}>
            India Tourism — Admin Dashboard
          </span>
        </div>
        <button
          onClick={logout}
          style={{
            background: '#e74c3c', color: '#fff',
            border: 'none', padding: '8px 18px',
            borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '28px auto', padding: '0 20px' }}>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: '16px', marginBottom: '28px'
        }}>
          {[
            { label: 'Total Users',    val: users.length,   color: '#3498db', icon: <FaUsers size={20}/> },
            { label: 'Total Feedback', val: feedback.length, color: '#f4a61d', icon: <FaStar size={20}/> },
            { label: 'Average Rating', val: avgRating,       color: '#27ae60', icon: <FaStar size={20}/> },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '14px',
              padding: '20px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <div style={{
                background: s.color + '18', color: s.color,
                padding: '12px', borderRadius: '12px'
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a2e', lineHeight: 1 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px', borderRadius: '10px',
                border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
                background: tab === t.id ? '#1a1a2e' : '#fff',
                color: tab === t.id ? '#fff' : '#555',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
              All Registered Users
            </h2>

            {loading ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading users...</p>
            ) : users.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>
                No users registered yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      {['#','Full Name','Email','Phone','ID Type','ID Number','Joined'].map(h => (
                        <th key={h} style={{
                          padding: '12px 10px', textAlign: 'left',
                          fontWeight: '700', color: '#555',
                          borderBottom: '2px solid #eee',
                          whiteSpace: 'nowrap'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} style={{
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'background 0.15s'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 10px', color: '#aaa' }}>{i + 1}</td>
                        <td style={{ padding: '12px 10px', fontWeight: '600', color: '#1a1a2e' }}>
                          <FaUser size={10} style={{ marginRight: '6px', color: '#1a6b3c' }} />
                          {u.full_name}
                        </td>
                        <td style={{ padding: '12px 10px', color: '#3498db' }}>
                          <FaEnvelope size={10} style={{ marginRight: '5px' }} />
                          {u.email}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <FaPhone size={10} style={{ marginRight: '5px', color: '#888' }} />
                          {u.phone}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            background: '#e8f5e9', color: '#1a6b3c',
                            padding: '3px 8px', borderRadius: '8px',
                            fontSize: '11px', fontWeight: '700'
                          }}>
                            {u.govt_id_type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#555' }}>
                          <FaIdCard size={10} style={{ marginRight: '5px', color: '#888' }} />
                          {u.govt_id}
                        </td>
                        <td style={{ padding: '12px 10px', color: '#aaa', fontSize: '12px' }}>
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── FEEDBACK TAB ── */}
        {tab === 'feedback' && (
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
              User Feedback
            </h2>

            {feedback.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>
                No feedback received yet.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {feedback.map((f, i) => (
                  <div key={i} style={{
                    background: '#f8f9fa', borderRadius: '12px',
                    padding: '16px 18px',
                    borderLeft: '4px solid #f4a61d'
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '8px',
                      flexWrap: 'wrap', gap: '8px'
                    }}>
                      <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>
                        {f.name || 'Anonymous'}
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} size={14}
                            color={s <= f.rating ? '#f4a61d' : '#e0e0e0'} />
                        ))}
                        <span style={{ marginLeft: '6px', fontSize: '13px', color: '#888' }}>
                          {f.rating}/5
                        </span>
                      </div>
                    </div>
                    {f.email && (
                      <p style={{ fontSize: '12px', color: '#3498db', marginBottom: '6px' }}>
                        <FaEnvelope size={10} style={{ marginRight: '4px' }} />
                        {f.email}
                      </p>
                    )}
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, marginBottom: '8px' }}>
                      {f.comment || <em style={{ color: '#bbb' }}>No comment provided</em>}
                    </p>
                    <p style={{ fontSize: '11px', color: '#bbb' }}>
                      {new Date(f.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD PLACE TAB ── */}
        {tab === 'addplace' && (
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#1a1a2e' }}>
              Add New Tourist Place
            </h2>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              Place will be saved directly to MongoDB database
            </p>

            {placeMsg && (
              <div style={{
                background: placeMsg.startsWith('Error') ? '#fff0f0' : '#f0fff4',
                color: placeMsg.startsWith('Error') ? '#c0392b' : '#1a6b3c',
                padding: '12px 16px', borderRadius: '10px',
                marginBottom: '18px', fontSize: '14px',
                border: `1px solid ${placeMsg.startsWith('Error') ? '#fcc' : '#b2dfdb'}`
              }}>
                {placeMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              {[
                ['Place Name *', 'name',      'e.g. Taj Mahal'],
                ['City *',       'city',      'e.g. Agra'],
                ['State *',      'state',     'e.g. Uttar Pradesh'],
                ['Best Time',    'best_time', 'e.g. Oct - Mar'],
                ['Duration',     'duration',  'e.g. 2-3 hours'],
                ['Rating',       'rating',    '4.5'],
                ['Entry Fee (₹)','entry_fee', '0 for free'],
                ['Latitude',     'lat',       'e.g. 27.1751'],
                ['Longitude',    'lng',       'e.g. 78.0421'],
              ].map(([lbl, key, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                    {lbl}
                  </label>
                  <input
                    placeholder={ph}
                    value={place[key]}
                    onChange={e => setPlace(p => ({ ...p, [key]: e.target.value }))}
                    style={inSt}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={place.category}
                  onChange={e => setPlace(p => ({ ...p, category: e.target.value }))}
                  style={inSt}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Image URL
              </label>
              <input
                placeholder="https://images.unsplash.com/..."
                value={place.image}
                onChange={e => setPlace(p => ({ ...p, image: e.target.value }))}
                style={inSt}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Tags (comma separated)
              </label>
              <input
                placeholder="heritage, history, architecture, UNESCO"
                value={place.tags}
                onChange={e => setPlace(p => ({ ...p, tags: e.target.value }))}
                style={inSt}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                placeholder="Describe this place in detail..."
                value={place.description}
                onChange={e => setPlace(p => ({ ...p, description: e.target.value }))}
                rows={4}
                style={{ ...inSt, resize: 'vertical' }}
              />
            </div>

            <button
              onClick={submitPlace}
              style={{
                width: '100%', padding: '14px',
                background: '#1a6b3c', color: '#fff',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                marginTop: '6px'
              }}>
              Save Place to Database
            </button>
          </div>
        )}
      </div>
    </div>
  );
}