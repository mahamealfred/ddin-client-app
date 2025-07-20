import React, { createContext, useContext, useState } from 'react';
import { LightTheme, DarkTheme } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ Default to DarkTheme
  const [theme, setTheme] = useState(DarkTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.mode === 'light' ? DarkTheme : LightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
