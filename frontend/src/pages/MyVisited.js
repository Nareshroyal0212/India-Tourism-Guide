// src/pages/MyVisited.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkedAlt, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MyVisited() {
  const { t } = useLanguage();
  const token = localStorage.getItem('token');

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/visited`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPlaces(res.data.places || []))
      .finally(() => setLoading(false));
  }, [token]);

  const remove = async (placeId) => {
    try {
      await axios.delete(`${API}/visited/${placeId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPlaces(p => p.filter(pl => String(pl.place_id) !== String(placeId)));
    } catch {
      // ignore
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '16px' }}>{t.myVisitedLoginRequired}</p>
        <Link to="/login" style={{ background: '#1a6b3c', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>
          {t.login}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>{t.myVisitedTitle}</h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{t.myVisitedSubtitle}</p>

      {loading ? (
        <p style={{ color: '#888' }}>{t.loading}</p>
      ) : places.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <FaMapMarkedAlt size={40} color="#ccc" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#888', fontSize: '14px', maxWidth: '360px', margin: '0 auto' }}>{t.myVisitedEmpty}</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {places.map((p, i) => (
            <div key={p.id} style={{
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              borderBottom: i < places.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e8f5e9', color: '#1a6b3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaMapMarkedAlt size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{p.place_name}</div>
                {p.visited_at && (
                  <div style={{ fontSize: '12px', color: '#aaa' }}>
                    {new Date(p.visited_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(p.place_id)}
                style={{ background: '#fee', color: '#c0392b', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer' }}
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}