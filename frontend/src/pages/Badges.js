// src/pages/Badges.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMedal, FaLock } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Badges() {
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const BADGE_DEFS = [
    { id: 'first_step', name: t.badgeFirstStepName, desc: t.badgeFirstStepDesc, min: 1, icon: '🥾' },
    { id: 'explorer', name: t.badgeExplorerName, desc: t.badgeExplorerDesc, min: 5, icon: '🧭' },
    { id: 'adventurer', name: t.badgeAdventurerName, desc: t.badgeAdventurerDesc, min: 10, icon: '🏕️' },
    { id: 'wanderer', name: t.badgeWandererName, desc: t.badgeWandererDesc, min: 20, icon: '🗺️' },
    { id: 'legend', name: t.badgeLegendName, desc: t.badgeLegendDesc, min: 35, icon: '👑' },
  ];

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/visited`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCount(res.data.total || 0))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '16px' }}>{t.badgesLoginPrompt}</p>
        <Link to="/login" style={{ background: '#1a6b3c', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>
          {t.login}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.badgesTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        {loading ? t.badgesLoading : `${t.badgesVisitedPrefix} ${count} ${count === 1 ? t.badgesVisitedSuffixSingle : t.badgesVisitedSuffixPlural}`}
      </p>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {BADGE_DEFS.map(b => {
            const unlocked = count >= b.min;
            return (
              <div key={b.id} style={{
                background: unlocked ? '#fff' : '#f5f5f5',
                borderRadius: '16px', padding: '20px', textAlign: 'center',
                boxShadow: unlocked ? '0 4px 15px rgba(0,0,0,0.08)' : 'none',
                border: unlocked ? '2px solid #f4a61d' : '2px dashed #ddd',
                opacity: unlocked ? 1 : 0.6
              }}>
                <div style={{ fontSize: '42px', marginBottom: '10px', filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {unlocked ? b.icon : <FaLock size={28} color="#bbb" />}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>{b.name}</h3>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{b.desc}</p>
                {unlocked ? (
                  <span style={{ fontSize: '11px', color: '#f4a61d', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <FaMedal size={11} /> {t.badgeUnlocked}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#aaa' }}>
                    {b.min - count} {t.badgeMoreToUnlock}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}