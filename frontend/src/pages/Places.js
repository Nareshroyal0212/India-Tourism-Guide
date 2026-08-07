// src/pages/Places.js
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkerAlt, FaSearch, FaTimes, FaMapMarked,
  FaRupeeSign, FaClock, FaThermometerHalf, FaInfoCircle, FaImage,
  FaCamera, FaUpload, FaUserCircle, FaCheckCircle, FaMapMarkerAlt as FaMarkVisited
} from 'react-icons/fa';
import { useLanguage, toLocalNumber } from '../context/LanguageContext';
import ALL_PLACES from '../data/places';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const CATEGORIES_KEYS = [
  'All','Temple','Beach','Hill Station','Historical',
  'Nature','Wildlife','National Park','Adventure','Religious','Waterfall'
];

const STATES = ['All States', ...Array.from(new Set(ALL_PLACES.map(p => p.state))).sort()];

const imageCache = {};

function PhotoGallery({ placeId, t }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios.get(`${API}/photos/${placeId}`)
      .then(res => { if (!cancelled) setPhotos(res.data.photos || []); })
      .catch(() => { if (!cancelled) setPhotos([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [placeId]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('place_id', String(placeId));
    formData.append('uploaded_by', uploaderName || 'Anonymous');

    try {
      const res = await axios.post(`${API}/photos`, formData);
      setPhotos(p => [res.data.photo, ...p]);
    } catch (err) {
      setError(err.response?.data?.message || t.photoUploadError);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm(t.photoDeleteConfirm)) return;
    try {
      await axios.delete(`${API}/photos/${photoId}`);
      setPhotos(p => p.filter(ph => ph.id !== photoId));
    } catch {
      alert(t.photoDeleteError);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a2e' }}>
        <FaCamera color="#1a6b3c" /> {t.photosTitle} {photos.length > 0 && `(${photos.length})`}
      </h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          placeholder={t.photoYourName}
          value={uploaderName}
          onChange={e => setUploaderName(e.target.value)}
          style={{ flex: 1, minWidth: '140px', padding: '9px 12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
        />
        <label style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
          background: uploading ? '#ccc' : '#1a6b3c', color: '#fff', borderRadius: '8px',
          fontSize: '13px', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer'
        }}>
          <FaUpload size={12} /> {uploading ? t.photoUploading : t.photoAddPhoto}
          <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

      {loading ? (
        <p style={{ color: '#aaa', fontSize: '13px' }}>{t.loading}</p>
      ) : photos.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '13px' }}>{t.photoNoneYet}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
          {photos.map(p => (
            <div key={p.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', background: '#f0f0f0' }}>
              <img
                src={`${API.replace('/api', '')}${p.url}`}
                alt={p.caption || t.photosTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => handleDelete(p.id)}
                title={t.photoDelete}
                style={{
                  position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                }}
              >
                <FaTimes size={10} />
              </button>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px',
                padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '3px'
              }}>
                <FaUserCircle size={10} /> {p.uploaded_by}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceImage({ title, name, style }) {
  const [state, setState] = useState(() =>
    imageCache[title] ? { status: 'loaded', src: imageCache[title] } : { status: 'loading', src: null }
  );

  useEffect(() => {
    let cancelled = false;

    if (imageCache[title]) {
      setState({ status: 'loaded', src: imageCache[title] });
      return;
    }

    setState({ status: 'loading', src: null });

    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=thumbnail&pithumbsize=700&redirects=1&format=json&origin=*`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        const pages = data && data.query && data.query.pages;
        const page = pages ? Object.values(pages)[0] : null;
        const src = page && page.thumbnail && page.thumbnail.source;
        if (src) {
          imageCache[title] = src;
          setState({ status: 'loaded', src });
        } else {
          setState({ status: 'error', src: null });
        }
      })
      .catch(() => { if (!cancelled) setState({ status: 'error', src: null }); });

    return () => { cancelled = true; };
  }, [title]);

  if (state.status === 'loading') {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f5e9', color: '#1a6b3c' }}>
        <FaImage size={26} />
      </div>
    );
  }

  if (state.status === 'error' || !state.src) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a6b3c', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', padding: '8px' }}>
        {name}
      </div>
    );
  }

  return (
    <img
      src={state.src}
      alt={name}
      style={style}
      onError={() => setState({ status: 'error', src: null })}
    />
  );
}

export default function Places() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  // Translates data strings like "2-3 hours" or "Oct - Mar" into the
  // selected language using the months/timeUnits dictionaries, without
  // needing every place's raw string manually translated.
  const localizeTime = (str) => {
    if (!str) return str;
    let out = str;
    if (t.timeUnits) {
      out = out.replace(/\bHalf day\b/gi, t.timeUnits.halfDay);
      out = out.replace(/\bFull day\b/gi, t.timeUnits.fullDay);
      out = out.replace(/\bAll year\b/gi, t.timeUnits.allYear);
      out = out.replace(/\bhours\b/g, t.timeUnits.hours);
      out = out.replace(/\bhour\b/g, t.timeUnits.hour);
      out = out.replace(/\bdays\b/g, t.timeUnits.days);
      out = out.replace(/\bday\b/g, t.timeUnits.day);
    }
    if (t.months) {
      Object.keys(t.months).forEach(m => {
        out = out.replace(new RegExp(m, 'g'), t.months[m]);
      });
    }
    return out;
  };

  const localizePlace = (name) => t.placeNames?.[name] || name;

  // Initialize search box from ?q= (set by voice search) so the grid
  // filters immediately on load.
  const [search,        setSearch]        = useState(() => searchParams.get('q') || '');
  const [category,      setCategory]      = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [selected,      setSelected]      = useState(null);
  const [voiceNotice,   setVoiceNotice]   = useState(null);

  // Tracks which place IDs the logged-in user has already marked as
  // visited, so the button reflects the right state and Travel Badges
  // stays in sync.
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [markingVisited, setMarkingVisited] = useState(false);
  const [visitedMsg, setVisitedMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/visited`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const ids = new Set((res.data.places || []).map(p => String(p.place_id)));
        setVisitedIds(ids);
      })
      .catch(() => { /* silently ignore — badges page already surfaces this error */ });
  }, [token]);

  const handleMarkVisited = async (place) => {
    if (!token) {
      setVisitedMsg(t.badgesLoginPrompt || 'Please log in to track visited places.');
      return;
    }
    setMarkingVisited(true);
    setVisitedMsg('');
    try {
      await axios.post(
        `${API}/visited`,
        { place_id: String(place.id), place_name: place.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitedIds(prev => new Set(prev).add(String(place.id)));
      setVisitedMsg(`Marked "${place.name}" as visited!`);
    } catch (err) {
      setVisitedMsg(err.response?.data?.message || 'Could not mark this place as visited. Try again.');
    }
    setMarkingVisited(false);
  };

  const filtered = useMemo(() => {
    return ALL_PLACES.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchCat   = category === 'All' || p.category === category;
      const matchState = selectedState === 'All States' || p.state === selectedState;
      return matchSearch && matchCat && matchState;
    });
  }, [search, category, selectedState]);

  // When arriving with ?q= (from voice search), try to find one specific
  // best-matching place and open its detail modal automatically.
  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;

    const query = q.toLowerCase().trim();

    const exact = ALL_PLACES.find(p => p.name.toLowerCase() === query);
    const partial = ALL_PLACES.find(p =>
      p.name.toLowerCase().includes(query) || query.includes(p.name.toLowerCase())
    );
    const cityMatch = !exact && !partial
      ? ALL_PLACES.find(p => p.city.toLowerCase().includes(query) || query.includes(p.city.toLowerCase()))
      : null;

    const match = exact || partial || cityMatch;

    if (match) {
      setSelected(match);
      setVoiceNotice(null);
    } else {
      setVoiceNotice(`No exact place found for "${q}". Showing closest matches below.`);
    }

    // Clear the q param so refreshing/closing doesn't keep re-triggering it,
    // while keeping the typed search text in the box.
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catLabel = cat => ({
    'All': t.allCategories, 'Temple': t.temple, 'Beach': t.beach,
    'Hill Station': t.hillStation, 'Historical': t.historical,
    'Nature': t.nature, 'Wildlife': t.wildlife,
    'National Park': t.nationalPark, 'Adventure': t.adventure,
    'Religious': t.religious, 'Waterfall': t.waterfall
  }[cat] || cat);

  // Translates duration strings like "2-3 hours", "1 day", "Half day"
  // into the selected language's units, without needing per-place data.
  const formatDuration = (d) => {
    if (d === 'Half day') return t.halfDay;
    if (d === 'Full day') return t.fullDay;
    const hourMatch = d.match(/^([\d-]+)\s*hours?$/i);
    if (hourMatch) {
      const n = hourMatch[1];
      const isPlural = n.includes('-') || parseInt(n, 10) !== 1;
      return `${n} ${isPlural ? t.unitHours : t.unitHour}`;
    }
    const dayMatch = d.match(/^([\d-]+)\s*days?$/i);
    if (dayMatch) {
      const n = dayMatch[1];
      const isPlural = n.includes('-') || parseInt(n, 10) !== 1;
      return `${n} ${isPlural ? t.unitDays : t.unitDay}`;
    }
    return d;
  };

  const formatBestTime = (bt) => (bt === 'All year' ? t.allYear : bt);

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1200px', margin: '0 auto' }}>

      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>
        {t.exploreTitle}
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        {filtered.length} {t.exploreSubtitle}
      </p>

      {voiceNotice && (
        <div style={{
          background: '#fff3cd', color: '#856404', padding: '12px 16px',
          borderRadius: '10px', marginBottom: '16px', fontSize: '13px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'
        }}>
          <span>{voiceNotice}</span>
          <button
            onClick={() => setVoiceNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#856404', fontSize: '14px' }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          placeholder={t.searchPlace}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: '30px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e0e0e0', fontSize: '14px', marginBottom: '16px', background: '#fff', outline: 'none' }}>
        <option value="All States">{t.allStates}</option>
        {STATES.filter(s => s !== 'All States').map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CATEGORIES_KEYS.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
            background: category === cat ? '#1a6b3c' : '#e8f5e9',
            color: category === cat ? '#fff' : '#1a6b3c'
          }}>
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '48px' }}>🔍</p>
          <p style={{ fontSize: '18px' }}>{t.noPlaces} "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(place => (
            <div key={place.id} onClick={() => { setSelected(place); setVisitedMsg(''); }}
              style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}>
              <div style={{ position: 'relative' }}>
                <PlaceImage
                  title={place.wikiTitle || place.name}
                  name={place.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                  {localizePlace(place.state)}
                </span>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#f4a61d', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                  ★ {place.rating}
                </span>
                {visitedIds.has(String(place.id)) && (
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#1a6b3c', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCheckCircle size={11} /> Visited
                  </span>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <span style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                  {catLabel(place.category)}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '8px 0 4px', color: '#1a1a2e' }}>{place.name}</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaMapMarkerAlt size={11} /> {place.city}, {place.state}
                </p>
                <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, margin: '0 0 10px' }}>
                  {place.description.slice(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#1a6b3c', fontWeight: '700' }}>
                    {t.entry}: {place.entry_fee === 0 ? t.entryFree : `₹${toLocalNumber(place.entry_fee, lang)}`}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888' }}>🕐 {localizeTime(place.duration)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', maxWidth: '750px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>

            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaTimes />
            </button>

            <PlaceImage
              title={selected.wikiTitle || selected.name}
              name={selected.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />

            <div style={{ padding: '24px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{catLabel(selected.category)}</span>
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

              {/* ── Mark as Visited ── */}
              <div style={{ marginBottom: '20px' }}>
                {visitedIds.has(String(selected.id)) ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px', background: '#e8f5e9', color: '#1a6b3c', borderRadius: '12px',
                    fontWeight: '700', fontSize: '14px', border: '2px solid #1a6b3c'
                  }}>
                    <FaCheckCircle /> Visited — nice work!
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkVisited(selected)}
                    disabled={markingVisited}
                    style={{
                      width: '100%', padding: '13px', background: markingVisited ? '#aaa' : '#f4a61d',
                      color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px',
                      cursor: markingVisited ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    <FaMarkVisited /> {markingVisited ? 'Marking...' : 'Mark as Visited'}
                  </button>
                )}
                {visitedMsg && (
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', textAlign: 'center' }}>{visitedMsg}</p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: <FaRupeeSign />, label: t.entryFeeLabel, val: selected.entry_fee === 0 ? t.entryFree : `₹${toLocalNumber(selected.entry_fee, lang)}` },
                  { icon: <FaClock />, label: t.duration, val: localizeTime(selected.duration) },
                  { icon: <FaThermometerHalf />, label: t.bestTime, val: localizeTime(selected.best_time) },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#1a6b3c', marginBottom: '6px' }}>{item.icon}</div>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a2e' }}>
                  <FaInfoCircle color="#1a6b3c" /> {t.aboutPlace}
                </h3>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7 }}>{selected.description}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>{t.tagsLabel}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selected.tags.map(tag => (
                    <span key={tag} style={{ background: '#e8f5e9', color: '#1a6b3c', padding: '5px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '600' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <PhotoGallery placeId={selected.id} t={t} />

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a2e' }}>
                  <FaMapMarked color="#1a6b3c" /> {t.locationMap}
                </h3>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
                  <iframe
                    title={`Map of ${selected.name}`}
                    width="100%" height="280" frameBorder="0"
                    src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=13&output=embed`}
                    allowFullScreen
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + ' ' + selected.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, padding: '14px', background: '#1a6b3c', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
                >
                  {t.openMaps}
                </a>
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.wikiTitle || selected.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, padding: '14px', background: '#f0f7f0', color: '#1a6b3c', border: '2px solid #1a6b3c', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
                >
                  {t.readWiki}
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}