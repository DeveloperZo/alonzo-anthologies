import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './ViewportWarning.css';

const ViewportWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const { theme } = useTheme()!;
  // Never on the resume: recruiters open that link on phones, and the resume reads fine there.
  // This also keeps the overlay off #/resume?print=1, which the application package prints.
  const onResume = useLocation().pathname === '/resume';

  useEffect(() => {
    const checkViewport = () => {
      setShowWarning(window.innerWidth < 768);
    };

    // Initial check
    checkViewport();

    // Add event listener
    window.addEventListener('resize', checkViewport);

    // Cleanup
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handleClose = () => {
    setShowWarning(false);
  };

  if (!showWarning || onResume) return null;

  if (theme === 'play') {
    return (
      <div className="viewport-warning play">
        <div className="pixel-icon">🐉</div>
        <h2>There be dragons here!</h2>
        <p>This portfolio is best viewed on larger screens.</p>
        <button className="close-button" onClick={handleClose}>
          Continue Anyway
        </button>
      </div>
    );
  }

  return (
    <div className="viewport-warning work">
      <h2>Viewport Warning</h2>
      <p>This portfolio is optimized for larger screens.</p>
      <button className="close-button" onClick={handleClose}>
        Continue Anyway
      </button>
    </div>
  );
};

export default ViewportWarning; 