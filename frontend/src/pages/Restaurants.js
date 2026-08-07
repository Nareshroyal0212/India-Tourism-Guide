// src/pages/Restaurants.js
import React, { useState, useMemo } from 'react';
import {
  FaUtensils, FaSearch, FaTimes, FaMapMarkerAlt,
  FaStar, FaRupeeSign, FaConciergeBell
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import RESTAURANTS, { CUISINES, CATEGORIES, STATES } from '../data/restaurants';

export default function Restaurants() {
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [category, setCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase()) ||
        r.state.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
        r.mustTry.toLowerCase().includes(search.toLowerCase());
      const matchCuisine = cuisine === 'All' || r.cuisine === cuisine;
      const matchCategory = category === 'All' || r.category === category;
      const matchState = selectedState === 'All States' || r.state === selectedState;
      return matchSearch && matchCuisine && matchCategory && matchState;
    });
  }, [search, cuisine, category, selectedState]);

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1200px', margin: '0 auto' }}>

      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.restaurantsTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        {filtered.length} {t.restaurantsSubtitle}
      </p>

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          placeholder={t.searchRestaurant}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: '30px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
          style={{ flex: '1 1 200px', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e0e0e0', fontSize: '14px', background: '#fff', outline: 'none' }}>
          <option value="All States">{t.allStates}</option>
          {STATES.filter(s => s !== 'All States').map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={cuisine} onChange={e => setCuisine(e.target.value)}
          style={{ flex: '1 1 200px', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e0e0e0', fontSize: '14px', background: '#fff', outline: 'none' }}>
          <option value="All">{t.allCuisines}</option>
          {CUISINES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
            background: category === cat ? '#1a6b3c' : '#e8f5e9',
            color: category === cat ? '#fff' : '#1a6b3c'
          }}>
            {cat === 'All' ? t.allCategories : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '48px' }}>🍽️</p>
          <p style={{ fontSize: '18px' }}>{t.noRestaurants} "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(r => (
            <div key={r.id} onClick={() => setSelected(r)}
              style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}>
              <div style={{
                height: '90px', background: 'linear-gradient(135deg, #1a6b3c, #2d9e5c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                <FaUtensils size={30} color="rgba(255,255,255,0.9)" />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.35)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                  {r.state}
                </span>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#f4a61d', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                  ★ {r.rating}
                </span>
              </div>
              <div style={{ padding: '14px' }}>
                <span style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                  {r.category}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '8px 0 4px', color: '#1a1a2e' }}>{r.name}</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaMapMarkerAlt size={11} /> {r.city}, {r.state}
                </p>
                <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: '0 0 10px' }}>
                  {r.desc.slice(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#1a6b3c', fontWeight: '700' }}>
                    {r.cuisine}
                  </span>
                  <span style={{ fontSize: '13px', color: '#f4a61d', fontWeight: '700' }}>{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', maxWidth: '650px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>

            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaTimes />
            </button>

            <div style={{
              height: '160px', background: 'linear-gradient(135deg, #1a6b3c, #2d9e5c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FaUtensils size={54} color="rgba(255,255,255,0.9)" />
            </div>

            <div style={{ padding: '24px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{selected.category}</span>
                  <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 4px', color: '#1a1a2e' }}>{selected.name}</h2>
                  <p style={{ color: '#888', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaMapMarkerAlt size={13} color="#1a6b3c" /> {selected.city}, {selected.state}
                  </p>
                </div>
                <div style={{ background: '#f4a61d', color: '#fff', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800' }}>★ {selected.rating}</div>
                  <div style={{ fontSize: '11px' }}>{t.ratingLabel}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: <FaUtensils />, label: t.cuisineLabel, val: selected.cuisine },
                  { icon: <FaRupeeSign />, label: t.priceRangeLabel, val: selected.price },
                  { icon: <FaConciergeBell />, label: t.mustTryLabel, val: selected.mustTry },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#1a6b3c', marginBottom: '6px' }}>{item.icon}</div>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>
                  {t.aboutPlace}
                </h3>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7 }}>{selected.desc}</p>
              </div>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + ' ' + selected.city)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'block', marginTop: '16px', padding: '14px', background: '#1a6b3c', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
              >
                {t.openMaps}
              </a>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}