import React, { useState } from 'react';
import axios from 'axios';
import { FaBed, FaUtensils, FaBus, FaCamera, FaPlane, FaShoppingBag } from 'react-icons/fa';
import { useLanguage, toLocalNumber } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';

export default function Budget() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ days: 5, people: 2, travel_type: 'mid', transport: 'train', places: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const PLACE_OPTIONS = ['Delhi', 'Rajasthan', 'Goa', 'Kerala', 'Himachal', 'Uttarakhand', 'Kashmir', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Andaman'];

  const togglePlace = p => setForm(f => ({ ...f, places: f.places.includes(p) ? f.places.filter(x => x !== p) : [...f.places, p] }));

  const calc = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/budget`, form);
      setResult(res.data);
    } catch { alert(t.budgetBackendError); }
    setLoading(false);
  };

  const BREAKDOWN = result ? [
    { icon: <FaBed />, label: t.accommodation, val: result.breakdown.accommodation, color: '#3498db' },
    { icon: <FaUtensils />, label: t.food, val: result.breakdown.food, color: '#e74c3c' },
    { icon: <FaBus />, label: t.localTransport, val: result.breakdown.local_transport, color: '#2ecc71' },
    { icon: <FaPlane />, label: t.intercityTravel, val: result.breakdown.intercity_travel, color: '#9b59b6' },
    { icon: <FaCamera />, label: t.activities, val: result.breakdown.activities, color: '#f39c12' },
    { icon: <FaShoppingBag />, label: t.miscellaneous, val: result.breakdown.miscellaneous, color: '#1abc9c' },
  ] : [];

  return (
    <div style={{ maxWidth: '820px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>{t.budgetTitle}</h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{t.budgetSubtitle}</p>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '6px' }}>{t.days}</label>
            <input type="number" min="1" max="30" value={form.days} onChange={e => setForm(f => ({ ...f, days: +e.target.value }))}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '15px' }} />
          </div>
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '6px' }}>{t.people}</label>
            <input type="number" min="1" max="20" value={form.people} onChange={e => setForm(f => ({ ...f, people: +e.target.value }))}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '15px' }} />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '10px' }}>{t.travelStyle}</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[['budget', '🎒 ' + t.budgetOption, `₹${toLocalNumber(1200, lang)}/day`], ['mid', '🏨 ' + t.midOption, `₹${toLocalNumber(3500, lang)}/day`], ['luxury', '💎 ' + t.luxuryOption, `₹${toLocalNumber(8000, lang)}/day`]].map(([v, l, p]) => (
              <div key={v} onClick={() => setForm(f => ({ ...f, travel_type: v }))}
                style={{ flex: 1, minWidth: '120px', padding: '12px', borderRadius: '12px', border: `2px solid ${form.travel_type === v ? '#1a6b3c' : '#e0e0e0'}`, background: form.travel_type === v ? '#e8f5e9' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '18px' }}>{l.split(' ')[0]}</div>
                <div style={{ fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>{l.split(' ').slice(1).join(' ')}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{p}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '10px' }}>{t.transport}</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[['flight', '✈️ ' + (t.transportModes?.flight || 'Flight')], ['train', '🚆 ' + (t.transportModes?.train || 'Train')], ['bus', '🚌 ' + (t.transportModes?.bus || 'Bus')], ['car', '🚗 ' + (t.transportModes?.car || 'Car')]].map(([v, l]) => (
              <button key={v} onClick={() => setForm(f => ({ ...f, transport: v }))}
                style={{ padding: '9px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', background: form.transport === v ? '#1a6b3c' : '#e8f5e9', color: form.transport === v ? '#fff' : '#1a6b3c' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '10px' }}>{t.destinations}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PLACE_OPTIONS.map(p => (
              <button key={p} onClick={() => togglePlace(p)}
                style={{ padding: '7px 14px', borderRadius: '18px', border: `2px solid ${form.places.includes(p) ? '#1a6b3c' : '#e0e0e0'}`, background: form.places.includes(p) ? '#1a6b3c' : '#fff', color: form.places.includes(p) ? '#fff' : '#555', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                {form.places.includes(p) ? '✓ ' : ''}{t.placeNames?.[p] || p}
              </button>
            ))}
          </div>
        </div>

        <button onClick={calc} disabled={loading}
          style={{ width: '100%', padding: '15px', background: '#1a6b3c', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          {loading ? t.calculating : '🤖 ' + t.calcBtn}
        </button>
      </div>

      {result && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <div style={{ background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '24px', color: '#fff' }}>
            <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}>{t.totalBudget}</div>
            <div style={{ fontSize: '52px', fontWeight: '800' }}>₹{toLocalNumber(result.total_estimate, lang)}</div>
            <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '8px' }}>{result.tip}</div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
              <div><div style={{ fontWeight: '700', fontSize: '18px' }}>₹{toLocalNumber(result.per_person, lang)}</div><div style={{ fontSize: '11px', opacity: 0.8 }}>{t.perPerson}</div></div>
              <div><div style={{ fontWeight: '700', fontSize: '18px' }}>₹{toLocalNumber(result.per_day, lang)}</div><div style={{ fontSize: '11px', opacity: 0.8 }}>{t.perDay}</div></div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>{t.breakdown}</h3>
          {BREAKDOWN.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ color: item.color, fontSize: '20px', width: '28px' }}>{item.icon}</div>
              <span style={{ flex: 1, fontWeight: '600', fontSize: '14px' }}>{item.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', color: item.color, fontSize: '16px' }}>₹{toLocalNumber(item.val, lang)}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{Math.round((item.val / result.total_estimate) * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}