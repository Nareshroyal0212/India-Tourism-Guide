import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaWind, FaTint, FaThermometerHalf, FaEye } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Jaipur', 'Ahmedabad', 'Pune', 'Visakhapatnam', 'Kochi', 'Srinagar', 'Shimla', 'Manali', 'Guwahati'];

export default function Weather() {
  const { t } = useLanguage();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (c) => {
    const target = c || city;
    if (!target) return;
    setLoading(true); setError(''); setWeather(null);
    try {
      const res = await axios.get(`${API}/weather?city=${target}`);
      setWeather(res.data.data);
      setCity(target);
    } catch (e) {
      setError(e.response?.data?.message || t.weatherError);
    }
    setLoading(false);
  };

  const getWeatherBg = (desc = '') => {
    if (desc.includes('rain') || desc.includes('drizzle')) return 'linear-gradient(135deg,#2c3e50,#3498db)';
    if (desc.includes('cloud')) return 'linear-gradient(135deg,#636e72,#b2bec3)';
    if (desc.includes('snow')) return 'linear-gradient(135deg,#74b9ff,#dfe6e9)';
    if (desc.includes('thunder')) return 'linear-gradient(135deg,#2d3436,#6c5ce7)';
    return 'linear-gradient(135deg,#1a6b3c,#f4a61d)';
  };

  return (
    <div style={{ maxWidth: '720px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>{t.weatherTitle}</h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{t.weatherSubtitle}</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchWeather()}
          placeholder={t.weatherPlaceholder}
          style={{ flex: 1, padding: '13px 18px', borderRadius: '12px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none' }} />
        <button onClick={() => fetchWeather()} style={{ padding: '13px 22px', background: '#1a6b3c', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
          <FaSearch />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CITIES.map(c => (
          <button key={c} onClick={() => fetchWeather(c)}
            style={{ padding: '6px 13px', background: '#e8f5e9', color: '#1a6b3c', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
            {t.placeNames?.[c] || c}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>{t.fetchingWeather}</div>}
      {error && <div style={{ background: '#fee', color: '#c0392b', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>{error}</div>}

      {weather && (
        <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ background: getWeatherBg(weather.description.toLowerCase()), padding: '36px 24px', color: '#fff', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{weather.city}</h2>
            <p style={{ opacity: 0.8, marginBottom: '16px', fontSize: '14px' }}>India</p>
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" style={{ width: '80px', filter: 'brightness(1.2)' }} />
            <div style={{ fontSize: '68px', fontWeight: '800', lineHeight: 1 }}>{weather.temperature}°C</div>
            <div style={{ fontSize: '18px', marginTop: '8px', textTransform: 'capitalize', opacity: 0.9 }}>{weather.description}</div>
            <div style={{ fontSize: '13px', marginTop: '6px', opacity: 0.75 }}>{t.feelsLike} {weather.feels_like}°C · H:{weather.max_temp}° L:{weather.min_temp}°</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {[
              { icon: <FaTint />, label: t.humidity, val: `${weather.humidity}%`, color: '#3498db' },
              { icon: <FaWind />, label: t.wind, val: `${weather.wind_speed} m/s`, color: '#2ecc71' },
              { icon: <FaEye />, label: t.visibility, val: `${weather.visibility} km`, color: '#9b59b6' },
              { icon: <FaThermometerHalf />, label: t.feelsLike, val: `${weather.feels_like}°C`, color: '#e74c3c' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ color: item.color, fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{item.val}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}