import React, { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.body.style.background = dark ? '#0f0f1a' : '#f5f5f5';
    document.body.style.color      = dark ? '#e0e0e0' : '#333333';
    document.body.style.transition = 'background 0.3s, color 0.3s';
  }, [dark]);

  const theme = {
    dark,
    bg:      dark ? '#0f0f1a' : '#f5f5f5',
    card:    dark ? '#1a1a2e' : '#ffffff',
    text:    dark ? '#e0e0e0' : '#1a1a2e',
    subtext: dark ? '#aaaaaa' : '#666666',
    border:  dark ? '#2a2a3e' : '#e0e0e0',
    input:   dark ? '#16213e' : '#ffffff',
    nav:     dark ? '#0d1117' : '#1a6b3c',
    green:   '#1a6b3c',
    gold:    '#f4a61d',
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}