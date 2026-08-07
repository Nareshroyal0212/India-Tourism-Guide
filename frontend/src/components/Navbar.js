import React, { useState, useRef } from 'react';

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import axios from 'axios';
import {
  FaMapMarkerAlt,
  FaStar,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaMoon,
  FaSun,
  FaGlobe,
  FaBars,
  FaUserShield
} from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const API =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

export default function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();

  const { dark, setDark, theme } = useTheme();
  const { lang, setLang, t, LANGUAGES } = useLanguage();

  const [fb, setFb] = useState(false);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);

  const [fbName, setFbName] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbMsg, setFbMsg] = useState('');

  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  const NAV = [
    { path: '/', label: t.home },
    { path: '/places', label: t.explore },
    { path: '/recommend', label: t.recommend },
    { path: '/budget', label: t.budget },
    { path: '/weather', label: t.weather },
    { path: '/chat', label: t.aiChat }
  ];

  const currentLangObj =
    LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
    window.location.reload();
  };

  const startVoiceSearch = () => {
    setShowMenu(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Voice search needs Google Chrome (or another Chromium-based browser).');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (err) {
        // ignore - instance may already be dead
      }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    recognition.onerror = (e) => {
      setListening(false);
      console.error('Speech recognition error:', e.error);

      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        alert('Microphone access was blocked. Please allow mic access in your browser settings and try again.');
      } else if (e.error === 'no-speech') {
        alert('No speech detected. Click the mic and start speaking right away (it stops listening quickly). If this keeps happening, check your microphone input device in your OS sound settings.');
      } else if (e.error === 'network') {
        alert('Voice recognition needs an internet connection to transcribe speech (it uses Google\'s speech service). Please check your connection and try again.');
      } else if (e.error === 'aborted') {
        // Silent - this happens when we intentionally abort a stale instance above.
      } else {
        alert(`Voice search error: ${e.error}`);
      }
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      navigate(`/places?q=${encodeURIComponent(transcript)}`);
    };

    setTimeout(() => {
      try {
        recognition.start();
      } catch (err) {
        console.error('Could not start recognition:', err);
        setListening(false);
      }
    }, 100);
  };

  const submitFeedback = async () => {
    if (!stars) {
      alert(t.selectRating);
      return;
    }

    setSaving(true);

    try {
      const response = await axios.post(`${API}/feedback`, {
        name: fbName || 'Anonymous',
        email: fbEmail || '',
        rating: stars,
        comment: fbMsg || ''
      });

      alert(t.feedbackSuccess);
      setDone(true);

      setTimeout(() => {
        setFb(false);
        setDone(false);
        setStars(0);
        setFbName('');
        setFbEmail('');
        setFbMsg('');
      }, 2500);
    } catch (err) {
      alert(
        err.response?.data?.error ||
        err.message ||
        t.feedbackFail
      );
    }

    setSaving(false);
  };

  const inputSt = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `2px solid ${theme.border}`,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '10px',
    background: theme.input,
    color: theme.text
  };

  return (
    <>
      <nav
        style={{
          background: theme.nav,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '62px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          flexWrap: 'wrap',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowMenu(!showMenu);
                setShowLang(false);
              }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaBars />
            </button>

            {showMenu && (
              <div
              style={{
                position: 'absolute',
                left: 0,
                top: '110%',
                background: theme.card,
                borderRadius: '10px',
                minWidth: '180px',
                zIndex: 9999,
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
            >
              <div
                onClick={() => setDark(!dark)}
                style={{ padding: '10px', cursor: 'pointer', color: theme.text }}
              >
                {dark ? <FaSun /> : <FaMoon />} {t.theme}
              </div>

              <Link
                to="/distance"
                onClick={() => setShowMenu(false)}
                style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
              >
                <FaMapMarkerAlt /> {t.distance}
              </Link>

              <Link
                to="/nearby"
                onClick={() => setShowMenu(false)}
                style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
              >
                <FaGlobe /> {t.nearby}
              </Link>

              <div
                onClick={() => setFb(true)}
                style={{ padding: '10px', cursor: 'pointer', color: theme.text }}
              >
                <FaStar /> {t.feedback}
              </div>

              <div style={{ borderTop: `1px solid ${theme.border || '#eee'}` }}>
                <div
                  onClick={startVoiceSearch}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {listening ? '🔴' : '🎙️'} {t.voiceSearch}
                </div>

                <Link
                  to="/badges"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  🏅 {t.travelBadges}
                </Link>

                <Link
                  to="/festivals"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  📅 {t.festivalCalendar}
                </Link>

                <Link
                  to="/image-recognition"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  📸 {t.photoSearch}
                </Link>

                <Link
                  to="/restaurants"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  🍽️ {t.restaurants || 'Restaurants'}
                </Link>

                <Link
                  to="/fuel-stations"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  ⛽ {t.fuelStationsMenu || 'Fuel & EV Stations'}
                </Link>

                <Link
                  to="/toll-plaza"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  🛣️ {t.tollPlazaMenu || 'Toll Plaza Estimator'}
                </Link>

                <Link
                  to="/group-trip"
                  onClick={() => setShowMenu(false)}
                  style={{ padding: '10px', cursor: 'pointer', color: theme.text, display: 'block', textDecoration: 'none' }}
                >
                  👥 {t.groupTripsSoon}
                </Link>
              </div>
            </div>
          )}
          </div>

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '17px',
              textDecoration: 'none'
            }}
          >
            <FaMapMarkerAlt />
            {t.appName}
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap'
          }}
        >
          {NAV.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              onMouseEnter={(e) => {
                if (loc.pathname !== n.path) {
                  e.target.style.background =
                    'linear-gradient(135deg,#00c853,#00e676)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow =
                    '0 6px 18px rgba(0,200,83,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (loc.pathname !== n.path) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              style={{
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all .3s ease',
                background:
                  loc.pathname === n.path
                    ? 'linear-gradient(135deg,#00c853,#00e676)'
                    : 'transparent',
                boxShadow:
                  loc.pathname === n.path
                    ? '0 6px 18px rgba(0,200,83,0.4)'
                    : 'none'
              }}
            >
              {n.label}
            </Link>
          ))}

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowLang(!showLang);
                setShowMenu(false);
              }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <FaGlobe /> {currentLangObj.flag} {currentLangObj.label}
            </button>

            {showLang && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: theme.card,
                  borderRadius: '10px',
                  minWidth: '160px',
                  zIndex: 9999,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  overflow: 'hidden'
                }}
              >
                {LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLang(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: theme.text,
                      background:
                        lang === l.code
                          ? 'rgba(0,200,83,0.15)'
                          : 'transparent',
                      fontWeight: lang === l.code ? '700' : '500'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <div
                style={{
                  background:
                    'rgba(255,255,255,0.18)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '20px'
                }}
              >
                <FaUser />{' '}
                {user.full_name?.split(' ')[0]}
              </div>

              <button
                onClick={logout}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                <FaSignOutAlt /> {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  background:
                    'rgba(255,255,255,0.15)',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px'
                }}
              >
                <FaSignInAlt /> {t.login}
              </Link>

              <Link
                to="/register"
                style={{
                  background: '#fff',
                  color: '#1a6b3c',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontWeight: '700'
                }}
              >
                {t.register}
              </Link>

              <Link
                to="/admin/login"
                title="Admin Login"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px'
                }}
              >
                <FaUserShield /> Admin
              </Link>
            </>
          )}
        </div>
      </nav>

      {fb && (
        <div
          onClick={() => setFb(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.card,
              width: '420px',
              maxWidth: '95%',
              padding: '30px',
              borderRadius: '18px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setFb(false)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>

            <h2 style={{ textAlign: 'center', color: theme.text }}>
              {t.rateThisApp}
            </h2>

            <input
              placeholder={t.yourName}
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
              style={inputSt}
            />

            <input
              placeholder={t.yourEmail}
              value={fbEmail}
              onChange={(e) => setFbEmail(e.target.value)}
              style={inputSt}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '15px',
                marginTop: '10px'
              }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar
                  key={s}
                  size={35}
                  color={(hover || stars) >= s ? '#FFD700' : '#d3d3d3'}
                  style={{
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(s)}
                />
              ))}
            </div>

            {stars > 0 && (
              <p
                style={{
                  textAlign: 'center',
                  color: '#1a6b3c',
                  fontWeight: '700',
                  marginBottom: '15px'
                }}
              >
                {
                  ['', t.poor, t.fair, t.good, t.veryGood, t.excellent][stars]
                }
              </p>
            )}

            <textarea
              rows="3"
              value={fbMsg}
              onChange={(e) => setFbMsg(e.target.value)}
              placeholder={t.shareExperience}
              style={inputSt}
            />

            <button
              onClick={submitFeedback}
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                background: '#1a6b3c',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              {saving ? t.saving : t.submitFeedback}
            </button>
          </div>
        </div>
      )}
    </>
  );
}