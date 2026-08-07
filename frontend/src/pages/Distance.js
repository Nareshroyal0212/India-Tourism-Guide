// src/pages/Distance.js
import React, { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaRoute, FaTrain, FaPlane, FaExchangeAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import ALL_PLACES from '../data/places';

// Haversine formula: straight-line ("as the crow flies") distance in km
// between two lat/lng points. Actual road distance will be longer —
// we clearly label this and provide a Google Maps link for the real
// driving distance/time.
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Rough travel-time estimates based on straight-line distance, purely
// to give the user a ballpark before they check real schedules.
function estimateTimes(km) {
  return {
    car: km / 55,      // ~55 km/h average incl. stops
    train: km / 60,     // ~60 km/h average incl. stops
    flight: km > 300 ? 1 + km / 700 : null // only realistic for longer hops
  };
}

function formatHours(h) {
  if (h == null) return null;
  const totalMin = Math.round(h * 60);
  const hrs = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  if (hrs === 0) return `${min}m`;
  return min === 0 ? `${hrs}h` : `${hrs}h ${min}m`;
}

export default function Distance() {
  const { t } = useLanguage();

  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  const sorted = useMemo(
    () => [...ALL_PLACES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const from = ALL_PLACES.find(p => String(p.id) === fromId);
  const to = ALL_PLACES.find(p => String(p.id) === toId);

  const result = useMemo(() => {
    if (!from || !to || from.id === to.id) return null;
    const km = haversineKm(from.lat, from.lng, to.lat, to.lng);
    return { km, times: estimateTimes(km) };
  }, [from, to]);

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const mapsDirectionsUrl = from && to
    ? `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=driving`
    : null;

  const trainSearchUrl = from && to
    ? `https://www.confirmtkt.com/trains-between-stations/${encodeURIComponent(from.city)}/${encodeURIComponent(to.city)}`
    : null;

  const flightSearchUrl = from && to
    ? `https://www.ixigo.com/search/result/flight?from=${encodeURIComponent(from.city)}&to=${encodeURIComponent(to.city)}&adults=1&class=E&source=Search+Form`
    : null;

  const selectSt = {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.distanceTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{t.distanceSubtitle}</p>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '6px' }}>
              {t.distanceFrom}
            </label>
            <select value={fromId} onChange={e => setFromId(e.target.value)} style={selectSt}>
              <option value="">{t.distanceSelectPlace}</option>
              {sorted.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <button
            onClick={swap}
            title={t.distanceSwap}
            style={{
              width: '42px', height: '42px', borderRadius: '50%',
              border: 'none', background: '#e8f5e9', color: '#1a6b3c',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            <FaExchangeAlt />
          </button>

          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#444', display: 'block', marginBottom: '6px' }}>
              {t.distanceTo}
            </label>
            <select value={toId} onChange={e => setToId(e.target.value)} style={selectSt}>
              <option value="">{t.distanceSelectPlace}</option>
              {sorted.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {from && to && from.id === to.id && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          {t.distanceSamePlace}
        </div>
      )}

      {result && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>

          <div style={{
            background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)', borderRadius: '14px',
            padding: '28px', textAlign: 'center', marginBottom: '24px', color: '#fff'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}>
              <FaMapMarkerAlt style={{ marginRight: '4px' }} />
              {from.name} → {to.name}
            </div>
            <div style={{ fontSize: '46px', fontWeight: '800' }}>
              {Math.round(result.km)} km
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '6px' }}>{t.distanceStraightLine}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <FaRoute size={20} color="#1a6b3c" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{t.distanceByCar}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>{formatHours(result.times.car)}</div>
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <FaTrain size={20} color="#1a6b3c" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{t.distanceByTrain}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>{formatHours(result.times.train)}</div>
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <FaPlane size={20} color="#1a6b3c" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{t.distanceByFlight}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>
                {result.times.flight ? formatHours(result.times.flight) : t.distanceNotApplicable}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '20px', textAlign: 'center' }}>
            {t.distanceEstimateNote}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', background: '#1a6b3c', color: '#fff', borderRadius: '12px',
                textDecoration: 'none', fontWeight: '700', fontSize: '14px'
              }}>
              <FaRoute /> {t.distanceOpenDirections} <FaExternalLinkAlt size={11} />
            </a>
            <a
              href={trainSearchUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', background: '#f0f7f0', color: '#1a6b3c', border: '2px solid #1a6b3c',
                borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px'
              }}>
              <FaTrain /> {t.distanceSearchTrains} <FaExternalLinkAlt size={11} />
            </a>
            {result.times.flight && (
              <a
                href={flightSearchUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px', background: '#f0f7f0', color: '#1a6b3c', border: '2px solid #1a6b3c',
                  borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px'
                }}>
                <FaPlane /> {t.distanceSearchFlights} <FaExternalLinkAlt size={11} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}