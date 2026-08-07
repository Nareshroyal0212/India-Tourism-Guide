// src/pages/GroupTrip.js
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function GroupTrip() {
  const { t } = useLanguage();

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <FaUsers size={40} color="#ccc" style={{ marginBottom: '16px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' }}>
        {t.groupTripTitle}
      </h1>
      <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
        {t.groupTripDesc}
      </p>
    </div>
  );
}