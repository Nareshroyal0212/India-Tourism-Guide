// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaUsers, FaCamera, FaTrash, FaLock, FaSignOutAlt } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getAdminKey() {
  return sessionStorage.getItem('adminKey') || '';
}

function authHeaders() {
  return { headers: { 'X-Admin-Key': getAdminKey() } };
}

// ---------------------------------------------------------------------
// Login gate
// ---------------------------------------------------------------------
function AdminLoginGate({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/verify`, { email, password });
      sessionStorage.setItem('adminKey', res.data.adminKey);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', textAlign: 'center' }}>
        <div style={{ background: '#1a6b3c', width: '54px', height: '54px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <FaLock size={20} color="#fff" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: '#1a1a2e' }}>Admin Login</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Sign in with your admin email and password</p>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Admin email"
          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Admin password"
          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
        />
        {error && <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button
          onClick={submit}
          disabled={loading || !email || !password}
          style={{ width: '100%', padding: '13px', background: '#1a6b3c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Ratings / Feedback tab
// ---------------------------------------------------------------------
function RatingsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get(`${API}/admin/feedback`, authHeaders())
      .then(res => setData(res.data))
      .catch(err => {
        const status = err.response?.status;
        const serverMsg = err.response?.data?.message;
        setError(
          status
            ? `Error ${status}: ${serverMsg || 'request rejected by server'}`
            : `Network error: ${err.message} — is Flask running on port 5000?`
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#888', padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ color: '#c0392b', padding: '20px' }}>{error}</p>;
  if (!data) return <p style={{ color: '#c0392b', padding: '20px' }}>Could not load feedback.</p>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a6b3c' }}>{data.total}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>Total Ratings</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f4a61d' }}>{data.average_rating} ★</div>
          <div style={{ fontSize: '12px', color: '#888' }}>Average Rating</div>
        </div>
        {[5, 4, 3, 2, 1].map(star => (
          <div
            key={star}
            onClick={() => setExpanded(expanded === star ? null : star)}
            style={{
              background: expanded === star ? '#e8f5e9' : '#fff', borderRadius: '12px', padding: '14px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer',
              border: expanded === star ? '2px solid #1a6b3c' : '2px solid transparent'
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e' }}>{data.star_counts[star]}</div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              {star} <FaStar size={9} color="#f4a61d" />
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
        Click a star count above to see who gave that rating.
      </p>

      {data.feedback
        .filter(f => expanded === null || f.rating === expanded)
        .map(f => (
          <div key={f.id} style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{f.name}</span>
              <span style={{ color: '#f4a61d', fontWeight: '700', fontSize: '13px' }}>
                {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
              </span>
            </div>
            {f.email && <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{f.email}</div>}
            {f.comment && <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>{f.comment}</div>}
            {f.created_at && (
              <div style={{ fontSize: '11px', color: '#bbb' }}>
                {new Date(f.created_at).toLocaleString()}
              </div>
            )}
          </div>
        ))}

      {data.feedback.filter(f => expanded === null || f.rating === expanded).length === 0 && (
        <p style={{ color: '#aaa', fontSize: '13px', padding: '10px 0' }}>No ratings in this category yet.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Registrations tab
// ---------------------------------------------------------------------
function RegistrationsTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [visitedCache, setVisitedCache] = useState({});
  const [visitedLoading, setVisitedLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/admin/users`, authHeaders())
      .then(res => setUsers(res.data.users || []))
      .catch(err => {
        const status = err.response?.status;
        const serverMsg = err.response?.data?.message;
        setError(
          status
            ? `Error ${status}: ${serverMsg || 'request rejected by server'}`
            : `Network error: ${err.message} — is Flask running on port 5000?`
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (userId) => {
    if (expandedId === userId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(userId);
    if (!visitedCache[userId]) {
      setVisitedLoading(true);
      try {
        const res = await axios.get(`${API}/admin/users/${userId}/visited`, authHeaders());
        setVisitedCache(c => ({ ...c, [userId]: res.data.places || [] }));
      } catch {
        setVisitedCache(c => ({ ...c, [userId]: [] }));
      }
      setVisitedLoading(false);
    }
  };

  if (loading) return <p style={{ color: '#888', padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ color: '#c0392b', padding: '20px' }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        {users.length} registered {users.length === 1 ? 'user' : 'users'} — click a name to see their visited places
      </p>
      {users.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '13px' }}>No registrations yet.</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {users.map((u, i) => (
            <div key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div
                onClick={() => toggleExpand(u.id)}
                style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e8f5e9', color: '#1a6b3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', flex: 1 }}>{u.name}</span>
                <span style={{ fontSize: '11px', color: '#888', background: '#f5f5f5', padding: '3px 10px', borderRadius: '10px' }}>
                  {u.visited_count} visited
                </span>
              </div>
              {expandedId === u.id && (
                <div style={{ padding: '0 18px 14px 62px' }}>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', fontSize: '12px', color: '#444', lineHeight: 1.8 }}>
                    <div><strong>Phone:</strong> {u.phone || '—'}</div>
                    <div><strong>Email:</strong> {u.email || '—'}</div>
                    <div><strong>{u.govt_id_type || 'Govt ID'}:</strong> {u.govt_id || '—'}</div>
                    {u.created_at && <div><strong>Registered:</strong> {new Date(u.created_at).toLocaleString()}</div>}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' }}>Visited places:</div>
                  {visitedLoading && !visitedCache[u.id] ? (
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Loading...</p>
                  ) : (visitedCache[u.id] || []).length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#aaa' }}>No places marked as visited yet.</p>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {visitedCache[u.id].map(p => (
                        <li key={p.id} style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                          {p.place_name}
                          {p.visited_at && <span style={{ color: '#aaa', fontSize: '11px' }}> — {new Date(p.visited_at).toLocaleDateString()}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Photos moderation tab
// ---------------------------------------------------------------------
function PhotosTab() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    axios.get(`${API}/admin/photos`, authHeaders())
      .then(res => setPhotos(res.data.photos || []))
      .catch(() => setError('Could not load photos. Please log out and log in again.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Remove this photo permanently?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/admin/photos/${id}`, authHeaders());
      setPhotos(p => p.filter(ph => ph.id !== id));
    } catch {
      alert('Could not delete photo.');
    }
    setDeletingId(null);
  };

  if (loading) return <p style={{ color: '#888', padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ color: '#c0392b', padding: '20px' }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded across all places — visible to all site visitors.
      </p>
      {photos.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '13px' }}>No photos uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px' }}>
          {photos.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <img
                src={`${API.replace('/api', '')}${p.url}`}
                alt={p.uploaded_by}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a2e', marginBottom: '2px' }}>{p.uploaded_by}</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>Place ID: {p.place_id}</div>
                <button
                  onClick={() => remove(p.id)}
                  disabled={deletingId === p.id}
                  style={{
                    width: '100%', padding: '7px', background: '#fee', color: '#c0392b', border: 'none',
                    borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                  }}
                >
                  <FaTrash size={10} /> {deletingId === p.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------
export default function AdminPanel() {
  const [authed, setAuthed] = useState(!!getAdminKey());
  const [tab, setTab] = useState('ratings');

  const logout = () => {
    sessionStorage.removeItem('adminKey');
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLoginGate onSuccess={() => setAuthed(true)} />;
  }

  const tabs = [
    { id: 'ratings', label: 'Ratings', icon: <FaStar /> },
    { id: 'registrations', label: 'Registrations', icon: <FaUsers /> },
    { id: 'photos', label: 'Photos', icon: <FaCamera /> },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a6b3c' }}>Admin Panel</h1>
        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '10px', padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #eee' }}>
        {tabs.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            style={{
              padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              color: tab === tb.id ? '#1a6b3c' : '#999',
              borderBottom: tab === tb.id ? '3px solid #1a6b3c' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {tab === 'ratings' && <RatingsTab />}
      {tab === 'registrations' && <RegistrationsTab />}
      {tab === 'photos' && <PhotosTab />}
    </div>
  );
}