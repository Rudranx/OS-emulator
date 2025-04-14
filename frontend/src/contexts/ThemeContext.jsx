import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has previously set a preference
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return JSON.parse(savedPreference);
    }
    // Otherwise, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Initial check on mount to ensure correct state
    const htmlElement = document.documentElement;
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      (localStorage.getItem('darkMode') === null && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Update the html class when theme changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Force a repaint to ensure all styles update
    const root = document.documentElement;
    root.style.display = 'none';
    setTimeout(() => {
      root.style.display = '';
    }, 10);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 