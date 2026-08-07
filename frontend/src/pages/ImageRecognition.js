// src/pages/ImageRecognition.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaCamera, FaUpload, FaMapMarkerAlt, FaCheckCircle,
  FaExclamationTriangle, FaRedo, FaSearch
} from 'react-icons/fa';
import ALL_PLACES from '../data/places';
import { useLanguage } from '../context/LanguageContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CONFIDENCE_COLORS = {
  high: '#1a6b3c',
  medium: '#f4a61d',
  low: '#c0392b'
};

export default function ImageRecognition() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const reset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setError('');
    setResult(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const identify = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('photo', file);
    // Ask the model to choose only from names that actually exist in our
    // data, so a match always corresponds to a real place in the app.
    formData.append('labels', JSON.stringify(ALL_PLACES.map(p => p.name)));

    try {
      const res = await axios.post(`${API}/recognize`, formData);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Something went wrong while identifying this photo. Please try again.'
      );
    }

    setLoading(false);
  };

  // The backend only ever returns a name we sent it (from ALL_PLACES),
  // so an exact match should always be found when result.name is set.
  const matchedPlace = result?.name
    ? ALL_PLACES.find(p => p.name === result.name)
    : null;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <FaCamera size={40} color="#1a6b3c" style={{ marginBottom: '14px' }} />
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
          {t.imgRecTitle}
        </h1>
        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>
          {t.imgRecSubtitle}
        </p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>

        {!preview ? (
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              border: '2px dashed #c9e6d3',
              borderRadius: '16px',
              padding: '50px 20px',
              cursor: 'pointer',
              background: '#f8fdf9',
              color: '#1a6b3c'
            }}
          >
            <FaUpload size={26} />
            <span style={{ fontWeight: '700', fontSize: '15px' }}>{t.imgRecChoosePhoto}</span>
            <span style={{ fontSize: '12px', color: '#999' }}>{t.imgRecFileTypes}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </label>
        ) : (
          <div>
            <img
              src={preview}
              alt="Uploaded preview"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                borderRadius: '14px',
                marginBottom: '16px'
              }}
            />

            {!result && !loading && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={identify}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#1a6b3c',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <FaSearch size={13} /> {t.imgRecIdentifyBtn}
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    background: '#fff',
                    color: '#888',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <FaTimesLike />
                </button>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '10px 0', color: '#1a6b3c', fontWeight: '600', fontSize: '14px' }}>
                {t.imgRecAnalyzing}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '14px',
            background: '#fdecea',
            color: '#c0392b',
            borderRadius: '12px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <FaExclamationTriangle style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '18px' }}>
            {result.name ? (
              <div style={{
                background: '#f8fdf9',
                border: '2px solid #c9e6d3',
                borderRadius: '14px',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaCheckCircle color="#1a6b3c" />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: CONFIDENCE_COLORS[result.confidence] || '#1a6b3c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {result.confidence || 'medium'} {t.imgRecConfidenceLabel}
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px' }}>
                  {result.name}
                </h2>

                {matchedPlace && (matchedPlace.city || matchedPlace.state) && (
                  <p style={{ color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px' }}>
                    <FaMapMarkerAlt size={11} color="#1a6b3c" />
                    {[matchedPlace.city, matchedPlace.state].filter(Boolean).join(', ')}
                  </p>
                )}

                {matchedPlace?.description && (
                  <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                    {matchedPlace.description.slice(0, 160)}
                    {matchedPlace.description.length > 160 ? '...' : ''}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  {matchedPlace && (
                    <button
                      onClick={() => navigate(`/places?q=${encodeURIComponent(matchedPlace.name)}`)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#1a6b3c',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {t.imgRecViewPlace}
                    </button>
                  )}
                  <button
                    onClick={reset}
                    style={{
                      flex: matchedPlace ? 'none' : 1,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      background: '#fff',
                      color: '#666',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaRedo size={11} /> {t.imgRecTryAnother}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#fff8ea',
                border: '2px solid #f4dea1',
                borderRadius: '14px',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaExclamationTriangle color="#f4a61d" />
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>
                    {t.imgRecNoMatchTitle}
                  </span>
                </div>
                {result.description && (
                  <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, marginBottom: '14px' }}>
                    {result.description}
                  </p>
                )}
                <button
                  onClick={reset}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    background: '#fff',
                    color: '#666',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FaRedo size={11} /> {t.imgRecTryAnotherPhoto}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Small inline "x" icon so we don't need to add a new react-icons import
// just for the cancel button.
function FaTimesLike() {
  return <span style={{ fontSize: '14px', fontWeight: '700' }}>✕</span>;
}