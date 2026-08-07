// src/pages/FuelStations.js
import React, { useState, useMemo } from 'react';
import {
  FaGasPump, FaBolt, FaSearch, FaTimes, FaMapMarkerAlt,
  FaClock, FaChargingStation, FaExclamationTriangle
} from 'react-icons/fa';
import FUEL_STATIONS, { STATION_TYPES, FUEL_STATES } from '../data/fuelStations';

export default function FuelStations() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return FUEL_STATIONS.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.highway.toLowerCase().includes(search.toLowerCase());
      const matchType = type === 'All' || s.type === type;
      const matchState = selectedState === 'All States' || s.state === selectedState;
      return matchSearch && matchType && matchState;
    });
  }, [search, type, selectedState]);

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1200px', margin: '0 auto' }}>

      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        Fuel & EV Charging Stations
      </h1>
      <p style={{ color: '#888', marginBottom: '4px' }}>
        {filtered.length} stations along major highways
      </p>
      <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>
        Sample data for planning purposes — always confirm live availability and pricing at the pump/charger before relying on it for a trip.
      </p>

      <div style={{ background: '#fff8e6', border: '1px solid #f4dda0', borderRadius: '14px', padding: '18px 20px', marginBottom: '24px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#8a6d1f', marginBottom: '10px', fontSize: '14px' }}>
          <FaExclamationTriangle /> Road trip safety — must and should:
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b5b1f', fontSize: '13.5px', lineHeight: 1.9 }}>
          <li><strong>Must:</strong> Never let your fuel tank or EV battery drop below 25% on long highway stretches — stations can be far apart in rural areas.</li>
          <li><strong>Must:</strong> Turn off your engine while refueling at petrol stations — it's a legal requirement and a fire-safety rule.</li>
          <li><strong>Must:</strong> Never smoke or use your phone while actively fueling.</li>
          <li><strong>Should:</strong> Plan EV charging stops in advance on long routes — fast chargers are still sparse outside major highways.</li>
          <li><strong>Should:</strong> Keep a physical map or offline route saved — mobile signal can drop on remote highway stretches.</li>
        </ul>
      </div>

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          placeholder="Search station, city, or highway..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: '30px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
        <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
          style={{ flex: '1 1 200px', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e0e0e0', fontSize: '14px', background: '#fff', outline: 'none' }}>
          {FUEL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {STATION_TYPES.map(st => (
          <button key={st} onClick={() => setType(st)} style={{
            padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
            background: type === st ? '#1a6b3c' : '#e8f5e9',
            color: type === st ? '#fff' : '#1a6b3c'
          }}>
            {st === 'Petrol' && <FaGasPump size={12} />}
            {st === 'EV' && <FaBolt size={12} />}
            {st}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '48px' }}>⛽</p>
          <p style={{ fontSize: '18px' }}>No stations found for "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(s => (
            <div key={s.id} onClick={() => setSelected(s)}
              style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}>
              <div style={{ padding: '16px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: s.type === 'EV' ? '#e8f5e9' : '#fff3e0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {s.type === 'EV'
                      ? <FaBolt size={18} color="#2d9e5c" />
                      : <FaGasPump size={18} color="#f4a61d" />}
                  </div>
                  <span style={{
                    background: s.type === 'EV' ? '#e8f5e9' : '#fff3e0',
                    color: s.type === 'EV' ? '#1a6b3c' : '#c07f0a',
                    padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700'
                  }}>
                    {s.type}
                  </span>
                </div>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 6px', color: '#1a1a2e' }}>{s.name}</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaMapMarkerAlt size={11} /> {s.city}, {s.state} • {s.highway}
                </p>
                <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaClock size={11} /> {s.hours}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {s.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{ background: '#f5f5f5', color: '#666', padding: '3px 10px', borderRadius: '10px', fontSize: '11px' }}>
                      {a}
                    </span>
                  ))}
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
              height: '160px', background: selected.type === 'EV' ? 'linear-gradient(135deg, #1a6b3c, #2d9e5c)' : 'linear-gradient(135deg, #c07f0a, #f4a61d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {selected.type === 'EV'
                ? <FaBolt size={54} color="rgba(255,255,255,0.9)" />
                : <FaGasPump size={54} color="rgba(255,255,255,0.9)" />}
            </div>

            <div style={{ padding: '24px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{
                    background: selected.type === 'EV' ? '#e8f5e9' : '#fff3e0',
                    color: selected.type === 'EV' ? '#1a6b3c' : '#c07f0a',
                    padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700'
                  }}>
                    {selected.type}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 4px', color: '#1a1a2e' }}>{selected.name}</h2>
                  <p style={{ color: '#888', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaMapMarkerAlt size={13} color="#1a6b3c" /> {selected.city}, {selected.state} • {selected.highway}
                  </p>
                </div>
                <div style={{ background: '#f8f9fa', color: '#1a1a2e', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><FaClock size={12} /> {selected.hours}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ color: '#1a6b3c', marginBottom: '6px' }}><FaGasPump /></div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Fuels Available</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{selected.fuels.join(', ')}</div>
                </div>
                {selected.type === 'EV' && (
                  <>
                    <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ color: '#1a6b3c', marginBottom: '6px' }}><FaChargingStation /></div>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Charger Type</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{selected.chargerType || '—'}</div>
                    </div>
                    <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ color: '#1a6b3c', marginBottom: '6px' }}><FaBolt /></div>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Power Output</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{selected.power || '—'}</div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>
                  Amenities
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selected.amenities.map(a => (
                    <span key={a} style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '600' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + ' ' + selected.city)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'block', marginTop: '16px', padding: '14px', background: '#1a6b3c', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
              >
                Open in Google Maps
              </a>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}