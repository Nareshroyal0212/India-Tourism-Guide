// src/pages/TollPlaza.js
import React, { useState, useMemo } from 'react';
import {
  FaRoad, FaSearch, FaMapMarkerAlt, FaExclamationTriangle,
  FaCar, FaTruck, FaCheckSquare, FaInfoCircle, FaTimes
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import TOLL_PLAZAS, { VEHICLE_TYPES } from '../data/tollPlazas';

export default function TollPlaza() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [selected, setSelected] = useState([]);
  const [detailPlaza, setDetailPlaza] = useState(null);

  const VEHICLE_LABELS = {
    car: t.vehicleCar,
    suv: t.vehicleSuv,
    bus_truck: t.vehicleBusTruck,
  };

  const filtered = useMemo(() => {
    return TOLL_PLAZAS.filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.highway.toLowerCase().includes(search.toLowerCase()) ||
      p.nearCity.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };

  const selectedPlazas = TOLL_PLAZAS.filter(p => selected.includes(p.id));
  const totalCost = selectedPlazas.reduce((sum, p) => sum + p.rates[vehicleType], 0);

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1100px', margin: '0 auto' }}>

      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.tollPlazaTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '4px' }}>
        {t.tollPlazaSubtitle}
      </p>
      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '20px' }}>
        {t.tollPlazaNote}
      </p>

      <div style={{
        background: '#fff8ea', border: '2px solid #f4dea1', borderRadius: '14px',
        padding: '16px 18px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start'
      }}>
        <FaExclamationTriangle color="#f4a61d" style={{ marginTop: '3px', flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '14px', color: '#1a1a2e' }}>{t.tollSafetyTitle}</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px', color: '#555', lineHeight: 1.8 }}>
            <li>{t.tollSafety1}</li>
            <li>{t.tollSafety2}</li>
            <li>{t.tollSafety3}</li>
            <li>{t.tollSafety4}</li>
            <li>{t.tollSafety5}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', display: 'block' }}>
          {t.vehicleTypeLabel}
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {VEHICLE_TYPES.map(v => (
            <button key={v.key} onClick={() => setVehicleType(v.key)} style={{
              padding: '10px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
              background: vehicleType === v.key ? '#1a6b3c' : '#e8f5e9',
              color: vehicleType === v.key ? '#fff' : '#1a6b3c'
            }}>
              {v.key === 'bus_truck' ? <FaTruck size={11} /> : <FaCar size={11} />}
              {VEHICLE_LABELS[v.key] || v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          placeholder={t.searchToll}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: '30px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {selectedPlazas.length > 0 && (
        <div style={{
          background: '#e8f5e9', border: '2px solid #1a6b3c', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '20px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#1a6b3c', fontWeight: '600' }}>
              {selectedPlazas.length} {t.tollsSelected}
            </div>
            <div style={{ fontSize: '12px', color: '#4a7c59' }}>
              {selectedPlazas.map(p => p.name).join(', ')}
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a6b3c' }}>
            ₹{totalCost}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '10px' }}>
        {filtered.map(p => {
          const isSelected = selected.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              style={{
                background: '#fff', borderRadius: '12px', padding: '14px 18px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: isSelected ? '2px solid #1a6b3c' : '2px solid transparent', flexWrap: 'wrap', gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaCheckSquare color={isSelected ? '#1a6b3c' : '#ddd'} size={18} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaRoad size={10} /> {p.highway} • <FaMapMarkerAlt size={10} /> {p.nearCity}, {p.state}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setDetailPlaza(p); }}
                  title="View details"
                  style={{
                    background: '#f8f9fa', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#1a6b3c', flexShrink: 0
                  }}
                >
                  <FaInfoCircle size={15} />
                </button>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f4a61d' }}>
                  ₹{p.rates[vehicleType]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '28px', background: '#f8f9fa', borderRadius: '14px',
        padding: '16px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start'
      }}>
        <FaInfoCircle color="#888" style={{ marginTop: '3px', flexShrink: 0 }} />
        <p style={{ fontSize: '12px', color: '#777', lineHeight: 1.7, margin: 0 }}>
          {t.tollFooterNote}
        </p>
      </div>

      {detailPlaza && (
        <div onClick={() => setDetailPlaza(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', maxWidth: '500px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>

            <button onClick={() => setDetailPlaza(null)} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaTimes />
            </button>

            <div style={{
              height: '130px', background: 'linear-gradient(135deg, #1a6b3c, #2d9e5c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FaRoad size={46} color="rgba(255,255,255,0.9)" />
            </div>

            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#1a1a2e' }}>{detailPlaza.name}</h2>
              <p style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <FaMapMarkerAlt size={12} color="#1a6b3c" /> {detailPlaza.nearCity}, {detailPlaza.state} • {detailPlaza.highway}
              </p>

              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>
                Toll Rates (One-Way)
              </h3>
              <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                {VEHICLE_TYPES.map(v => (
                  <div key={v.key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: v.key === vehicleType ? '#e8f5e9' : '#f8f9fa',
                    border: v.key === vehicleType ? '2px solid #1a6b3c' : '2px solid transparent',
                    borderRadius: '10px', padding: '10px 14px'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {v.key === 'bus_truck' ? <FaTruck size={12} /> : <FaCar size={12} />}
                      {VEHICLE_LABELS[v.key] || v.label}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#f4a61d' }}>
                      ₹{detailPlaza.rates[v.key]}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(detailPlaza.name + ' ' + detailPlaza.nearCity)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'block', padding: '14px', background: '#1a6b3c', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
              >
                {t.openMaps || 'Open in Google Maps'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}