import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkedAlt,
  FaRobot,
  FaWallet,
  FaCloudSun,
  FaStar,
  FaCompass
} from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: <FaMapMarkedAlt size={30} />,
      title: t.featureExplore,
      desc: t.featureExploreDesc,
      link: '/places',
      color: '#1a6b3c'
    },
    {
      icon: <FaStar size={30} />,
      title: t.featureRecommend,
      desc: t.featureRecommendDesc,
      link: '/recommend',
      color: '#8e44ad'
    },
    {
      icon: <FaWallet size={30} />,
      title: t.featureBudget,
      desc: t.featureBudgetDesc,
      link: '/budget',
      color: '#d68910'
    },
    {
      icon: <FaCloudSun size={30} />,
      title: t.featureWeather,
      desc: t.featureWeatherDesc,
      link: '/weather',
      color: '#1a6b8a'
    },
    {
      icon: <FaRobot size={30} />,
      title: t.featureChatbot,
      desc: t.featureChatbotDesc,
      link: '/chat',
      color: '#c0392b'
    },
    {
      icon: <FaCompass size={30} />,
      title: t.featureAllStates,
      desc: t.featureAllStatesDesc,
      link: '/places',
      color: '#27ae60'
    }
  ];

  const STATS = [
    ['28', t.statStates],
    ['200+', t.statPlaces],
    ['7', t.statAIFeatures],
    ['24/7', t.statAISupport]
  ];

  const heroImages = [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
    'https://images.unsplash.com/photo-1514222134-b57cbb8ce073',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245',
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <div
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {heroImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)'
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            color: '#fff',
            padding: '20px'
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: '900',
              marginBottom: '20px',
              textShadow: '0 5px 25px rgba(0,0,0,0.6)'
            }}
          >
            {t.heroTitle}
          </h1>

          <p
            style={{
              fontSize: '24px',
              maxWidth: '900px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
              textShadow: '0 3px 10px rgba(0,0,0,0.5)'
            }}
          >
            {t.heroSubtitle}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            <Link
              to="/places"
              style={{
                background: '#ffffff',
                color: '#1a6b3c',
                padding: '15px 35px',
                borderRadius: '35px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '16px'
              }}
            >
              {t.explorePlaces}
            </Link>

            <Link
              to="/recommend"
              style={{
                border: '2px solid white',
                color: '#fff',
                padding: '15px 35px',
                borderRadius: '35px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '16px'
              }}
            >
              {t.getRecommend}
            </Link>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div
        style={{
          background: '#1a1a2e',
          padding: '40px 20px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            flexWrap: 'wrap',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {STATS.map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: '#f4a61d'
                }}
              >
                {n}
              </div>
              <div
                style={{
                  color: '#fff',
                  opacity: 0.8
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        style={{
          background: theme.bg,
          padding: '60px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {FEATURES.map(f => (
          <Link
            key={f.title}
            to={f.link}
            style={{
              flex: '1 1 250px',
              background: '#fff',
              borderRadius: '15px',
              padding: '25px',
              textDecoration: 'none',
              color: '#333',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s',
              textAlign: 'center'
            }}
          >
            <div style={{ color: f.color, marginBottom: '15px' }}>{f.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}