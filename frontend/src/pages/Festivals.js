// src/pages/Festivals.js
import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { FESTIVAL_META, FESTIVAL_TRANSLATIONS } from '../data/festivals';

const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Festivals() {
  const { t, lang } = useLanguage();
  const [monthFilter, setMonthFilter] = useState('All');

  const translations = FESTIVAL_TRANSLATIONS[lang] || FESTIVAL_TRANSLATIONS.en;

  // Merge canonical month-filter keys with this language's translated text.
  const festivals = FESTIVAL_META.map(meta => ({
    id: meta.id,
    monthKeys: meta.monthKeys,
    ...translations[meta.id],
  }));

  const filtered = monthFilter === 'All'
    ? festivals
    : festivals.filter(f => f.monthKeys.includes(monthFilter));

  const monthLabel = (m) => (t.monthsFull && t.monthsFull[m]) || m;

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.festTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        {t.festSubtitle}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {MONTHS.map(m => (
          <button
            key={m}
            onClick={() => setMonthFilter(m)}
            style={{
              padding: '7px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '12px',
              background: monthFilter === m ? '#1a6b3c' : '#e8f5e9',
              color: monthFilter === m ? '#fff' : '#1a6b3c'
            }}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {filtered.map(f => (
          <div key={f.id} style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>{f.name}</h3>
              <span style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaCalendarAlt size={11} /> {f.monthDisplay}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <FaMapMarkerAlt size={11} /> {f.state}
            </p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}