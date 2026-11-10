// src/App.tsx
import React, { useEffect } from 'react';
import { HashRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppRoutes from './AppRoutes';
import ViewportWarning from './components/ViewportWarning/ViewportWarning';

// The package prints #/resume?print=1. That file is always sleek, even when the saved theme is retro.
const isSleekExport = (pathname: string, search: string) =>
  pathname === '/resume' && new URLSearchParams(search).get('print') === '1';

// AppContent component that handles theme body class
const AppContent: React.FC = () => {
  const { theme } = useTheme()!;
  const { pathname, search } = useLocation();
  const sleekExport = isSleekExport(pathname, search);

  useEffect(() => {
    document.body.classList.remove('work', 'play');
    document.body.classList.add(sleekExport ? 'work' : theme);
  }, [theme, sleekExport]);
  
  return (
    <>
      <ViewportWarning />
      <AppRoutes />
    </>
  );
};

// App component that wraps the AppContent with ThemeProvider and Router
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;