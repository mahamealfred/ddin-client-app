import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { ThemeProvider } from './themes/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { isTokenValid } from './utils/auth';
import eventBus from './utils/eventBus';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isTokenValid();
      setIsAuthenticated(valid);
    };

    checkAuth();

    // Listen for login event
    eventBus.on('LOGIN_SUCCESS', () => setIsAuthenticated(true));
    eventBus.on('LOGOUT', () => setIsAuthenticated(false));

    return () => {
      eventBus.removeAllListeners(); // Clean up
    };
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <NavigationContainer>
      <ThemeProvider>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </ThemeProvider>
    </NavigationContainer>
  );
}
