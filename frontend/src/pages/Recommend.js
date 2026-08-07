// src/pages/Recommend.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { useLanguage, toLocalNumber } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';

const INTERESTS = [
  'nature', 'beach', 'trekking', 'wildlife', 'spiritual',
  'history', 'adventure', 'photography', 'family', 'heritage',
  'offbeat', 'relaxation', 'pilgrimage', 'scenic', 'national park'
];

export default function Recommend() {
  const { t, lang } = useLanguage();

  const [sel,     setSel]     = useState([]);
  const [budget,  setBudget]  = useState('any');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const BUDGETS = [
    ['any',    t.anyBudget],
    ['budget', t.budgetOption],
    ['mid',    t.midOption],
    ['luxury', t.luxuryOption],
  ];

  const toggle = i =>
    setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);

  const go = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/recommend`, {
        interests: sel,
        budget_type: budget
      });
      setResults(res.data.data);
      setDone(true);
    } catch {
      alert(t.budgetBackendError);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '32px auto', padding: '0 16px' }}>

      <h1 style={{
        fontSize: '30px', fontWeight: '700',
        color: '#1a6b3c', marginBottom: '4px'
      }}>
        {t.recTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px', fontSize: '15px' }}>
        {t.recSubtitle}
      </p>

      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '28px', marginBottom: '24px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>

        <h3 style={{
          fontWeight: '700', marginBottom: '14px',
          fontSize: '15px', color: '#1a1a2e'
        }}>
          {t.interests}
        </h3>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: '9px', marginBottom: '24px'
        }}>
          {INTERESTS.map(i => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                padding: '8px 16px', borderRadius: '20px',
                border: `2px solid ${sel.includes(i) ? '#1a6b3c' : '#e0e0e0'}`,
                background: sel.includes(i) ? '#1a6b3c' : '#fff',
                color: sel.includes(i) ? '#fff' : '#555',
                cursor: 'pointer', fontWeight: '600',
                fontSize: '13px', textTransform: 'capitalize',
                transition: 'all 0.15s'
              }}>
              {sel.includes(i) ? '✓ ' : ''}{t.interestLabels?.[i] || i}
            </button>
          ))}
        </div>

        <h3 style={{
          fontWeight: '700', marginBottom: '12px',
          fontSize: '15px', color: '#1a1a2e'
        }}>
          {t.budgetPref}
        </h3>
        <div style={{
          display: 'flex', gap: '8px',
          flexWrap: 'wrap', marginBottom: '24px'
        }}>
          {BUDGETS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => setBudget(v)}
              style={{
                padding: '8px 18px', borderRadius: '16px',
                border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '13px',
                background: budget === v ? '#1a6b3c' : '#e8f5e9',
                color: budget === v ? '#fff' : '#1a6b3c',
                transition: 'all 0.15s'
              }}>
              {l}
            </button>
          ))}
        </div>

        <button
          onClick={go}
          disabled={loading || sel.length === 0}
          style={{
            width: '100%', padding: '14px',
            background: sel.length === 0 ? '#ccc' : '#1a6b3c',
            color: '#fff', border: 'none',
            borderRadius: '12px', fontSize: '15px',
            fontWeight: '700',
            cursor: sel.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}>
          {loading
            ? `⏳ ${t.finding}`
            : sel.length === 0
              ? t.selectOne
              : `🤖 ${t.recBtn}`}
        </button>
      </div>

      {done && (
        <>
          <h2 style={{
            fontSize: '20px', fontWeight: '700',
            marginBottom: '16px', color: '#1a1a2e'
          }}>
            {results.length} {t.matched}
          </h2>

          {results.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px',
              color: '#888', background: '#fff',
              borderRadius: '16px'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</p>
              <p style={{ fontSize: '16px' }}>{t.selectOne}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
              gap: '18px'
            }}>
              {results.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff', borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

                  <div style={{ position: 'relative' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      onError={e => {
                        e.target.src = `https://via.placeholder.com/400x160/1a6b3c/fff?text=${encodeURIComponent(p.name)}`;
                      }}
                    />
                    {p.match_percent && (
                      <span style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: '#1a6b3c', color: '#fff',
                        padding: '3px 10px', borderRadius: '10px',
                        fontSize: '11px', fontWeight: '700'
                      }}>
                        {p.match_percent}% {t.matchScore}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '14px' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        background: '#e8f5e9', color: '#1a6b3c',
                        padding: '2px 9px', borderRadius: '10px',
                        fontSize: '11px', fontWeight: '700'
                      }}>
                        {p.category}
                      </span>
                      <span style={{
                        color: '#f4a61d', fontWeight: '700',
                        fontSize: '13px', display: 'flex',
                        alignItems: 'center', gap: '3px'
                      }}>
                        <FaStar size={11}/>{p.rating}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '15px', fontWeight: '700',
                      margin: '6px 0 4px', color: '#1a1a2e'
                    }}>
                      {p.name}
                    </h3>

                    <p style={{
                      color: '#888', fontSize: '12px',
                      display: 'flex', alignItems: 'center',
                      gap: '4px', marginBottom: '10px'
                    }}>
                      <FaMapMarkerAlt size={10}/>
                      {p.city}, {p.state}
                    </p>

                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px', color: '#1a6b3c', fontWeight: '700'
                      }}>
                        {p.entry_fee === 0
                          ? t.freeEntry
                          : `${t.entry}: ₹${toLocalNumber(p.entry_fee, lang)}`}
                      </span>
                      <FaHeart size={14} color="#e74c3c" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}