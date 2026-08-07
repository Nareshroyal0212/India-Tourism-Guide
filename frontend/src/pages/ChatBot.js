import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaMicrophone } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';
// Keep the underlying query in English so the backend's keyword matching
// still works correctly — only the visible label is translated.
const QUICK_EN = ['Places in Rajasthan', 'Kerala backwaters', 'Trekking in Himalayas', 'Budget for 5 days', 'Best beaches in India', 'Wildlife sanctuaries', 'Food in Goa'];

export default function ChatBot() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([
    { from: 'bot', text: t.chatWelcome }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) send(q, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (queryOverride, displayOverride) => {
    const queryText = (queryOverride ?? input).trim();
    if (!queryText) return;
    const displayText = (displayOverride ?? queryText).trim();
    setInput('');
    setMessages(p => [...p, { from: 'user', text: displayText }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, { message: queryText, lang });
      setMessages(p => [...p, { from: 'bot', text: res.data.botResponse }]);
    } catch {
      setMessages(p => [...p, { from: 'bot', text: t.chatServerError }]);
    }
    setLoading(false);
  };

  const voice = () => {
    if (!('webkitSpeechRecognition' in window)) return alert(t.chatVoiceError);
    const r = new window.webkitSpeechRecognition();
    r.lang = 'en-IN';
    r.onresult = e => setInput(e.results[0][0].transcript);
    r.start();
  };

  return (
    <div style={{ maxWidth: '720px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>{t.chatTitle}</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>{t.chatSubtitle}</p>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ background: '#1a6b3c', padding: '14px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaRobot size={18} />
          <span style={{ fontWeight: '700' }}>{t.chatGuideTitle}</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#2d9e5f', padding: '3px 10px', borderRadius: '10px' }}>{t.chatOnline}</span>
        </div>

        <div style={{ height: '400px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
              {m.from === 'bot' && (
                <div style={{ background: '#1a6b3c', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaRobot size={13} />
                </div>
              )}
              <div style={{ maxWidth: '78%', padding: '11px 15px', borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.from === 'user' ? '#1a6b3c' : '#f0f7f0', color: m.from === 'user' ? '#fff' : '#333', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {m.text}
              </div>
              {m.from === 'user' && (
                <div style={{ background: '#f4a61d', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaUser size={13} />
                </div>
              )}
            </div>
          ))}
          {loading && <div style={{ color: '#1a6b3c', fontSize: '13px', padding: '4px 8px' }}>{t.chatTyping}</div>}
          <div ref={bottom} />
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_EN.map((q, i) => (
            <button key={q} onClick={() => send(q, t.quickSuggestions[i])}
              style={{ padding: '5px 11px', background: '#e8f5e9', color: '#1a6b3c', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
              {t.quickSuggestions[i] || q}
            </button>
          ))}
        </div>

        <div style={{ padding: '14px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '8px' }}>
          <button onClick={voice} style={{ background: '#e8f5e9', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', color: '#1a6b3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaMicrophone />
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={t.chatPlaceholder}
            style={{ flex: 1, padding: '11px 16px', borderRadius: '24px', border: '2px solid #e0e0e0', fontSize: '14px', outline: 'none' }} />
          <button onClick={() => send()} style={{ background: '#1a6b3c', color: '#fff', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}