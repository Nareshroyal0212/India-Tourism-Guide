// src/pages/Nearby.js
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaShieldAlt, FaHospital, FaLocationArrow, FaDirections, FaPhoneAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// Uses the free OpenStreetMap Overpass API — no API key required.
// Searches for amenity=police and amenity=hospital within a radius
// (metres) of the user's current location.
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RADIUS_M = 5000;

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

function buildQuery(lat, lng, amenity) {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="${amenity}"](around:${RADIUS_M},${lat},${lng});
      way["amenity"="${amenity}"](around:${RADIUS_M},${lat},${lng});
    );
    out center 15;
  `;
}

export default function Nearby() {
  const { t } = useLanguage();

  const [coords, setCoords] = useState(null);
  const [police, setPolice] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const fetchNearby = async (lat, lng) => {
    setLoading(true);
    setError('');
    try {
      const [policeRes, hospitalRes] = await Promise.all([
        fetch(OVERPASS_URL, { method: 'POST', body: buildQuery(lat, lng, 'police') }),
        fetch(OVERPASS_URL, { method: 'POST', body: buildQuery(lat, lng, 'hospital') })
      ]);
      const policeData = await policeRes.json();
      const hospitalData = await hospitalRes.json();

      const parse = (data) => data.elements
        .map(el => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          if (!elLat || !elLng) return null;
          return {
            id: el.id,
            name: el.tags?.name || (el.tags?.amenity === 'police' ? t.nearbyUnnamedPolice : t.nearbyUnnamedHospital),
            phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
            lat: elLat,
            lng: elLng,
            distanceKm: haversineKm(lat, lng, elLat, elLng)
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 8);

      setPolice(parse(policeData));
      setHospitals(parse(hospitalData));
    } catch (e) {
      setError(t.nearbyFetchError);
    }
    setLoading(false);
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError(t.nearbyGeoUnsupported);
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocating(false);
        fetchNearby(latitude, longitude);
      },
      () => {
        setLocating(false);
        setError(t.nearbyGeoDenied);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const cardSt = {
    background: '#fff', borderRadius: '12px', padding: '14px 16px',
    marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', alignItems: 'center', gap: '12px'
  };

  const renderList = (items, icon, color, emptyText) => {
    if (items.length === 0) {
      return <p style={{ color: '#aaa', fontSize: '13px', padding: '10px 0' }}>{emptyText}</p>;
    }
    return items.map(item => (
      <div key={item.id} style={cardSt}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', background: color,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {item.distanceKm.toFixed(1)} km {item.phone && <> · <FaPhoneAlt size={9} /> {item.phone}</>}
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#e8f5e9', color: '#1a6b3c', borderRadius: '8px', padding: '8px 10px',
            display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0
          }}>
          <FaDirections />
        </a>
      </div>
    ));
  };

  return (
    <div style={{ maxWidth: '640px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.nearbyTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{t.nearbySubtitle}</p>

      {!coords && (
        <button
          onClick={locate}
          disabled={locating}
          style={{
            width: '100%', padding: '16px', background: '#1a6b3c', color: '#fff',
            border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
          <FaLocationArrow /> {locating ? t.nearbyLocating : t.nearbyUseLocation}
        </button>
      )}

      {error && (
        <div style={{ background: '#fee', color: '#c0392b', padding: '14px', borderRadius: '10px', marginTop: '16px', textAlign: 'center', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {coords && (
        <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '12px' }}>
          <FaMapMarkerAlt />
          {t.nearbyShowingNear} {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          <button onClick={locate} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6b3c', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
            {t.nearbyRefresh}
          </button>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>{t.nearbyLoading}</div>}

      {coords && !loading && (
        <>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '20px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaShieldAlt color="#2c3e8c" /> {t.nearbyPoliceStations}
          </h3>
          {renderList(police, <FaShieldAlt size={16} />, '#2c3e8c', t.nearbyNonePolice)}

          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '20px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaHospital color="#c0392b" /> {t.nearbyHospitals}
          </h3>
          {renderList(hospitals, <FaHospital size={16} />, '#c0392b', t.nearbyNoneHospital)}
        </>
      )}
    </div>
  );
}