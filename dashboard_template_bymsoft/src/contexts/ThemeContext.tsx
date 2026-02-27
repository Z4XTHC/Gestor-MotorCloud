import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, ScaleSize } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  scale: ScaleSize;
  toggleTheme: () => void;
  setScale: (scale: ScaleSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const SCALE_VALUES = {
  small: 0.9,
  normal: 1.0,
  large: 1.1,
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as ThemeMode) || 'light';
  });

  const [scale, setScaleState] = useState<ScaleSize>(() => {
    const stored = localStorage.getItem('scale');
    return (stored as ScaleSize) || 'normal';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const scaleValue = SCALE_VALUES[scale];
    root.style.fontSize = `${scaleValue * 16}px`;

    localStorage.setItem('scale', scale);
  }, [scale]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setScale = (newScale: ScaleSize) => {
    setScaleState(newScale);
  };

  return (
    <ThemeContext.Provider value={{ theme, scale, toggleTheme, setScale }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
