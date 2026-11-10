// src/AppRoutes.tsx
import React, { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import MainMenu from './components/MainMenu/MainMenu';
import Accomplishments from './components/Accomplishments/Accomplishments';
import QuestSwitcher from './components/QuestSwitcher/QuestSwitcher';
import QuestDetail from './components/QuestDetail/QuestDetail';
import NotFound from './components/NotFound/NotFound';
import quests from './data/quests.data';
import CareerTimeline from './components/CareerTimeline/CareerTimeline';
import ResumeView from './components/ResumeView/ResumeView';
import Factory from './components/Factory/Factory';
import QuestMachine from './components/QuestMachine/QuestMachine';
import { useTheme } from './context/ThemeContext';

// ScrollToTop component to reset scroll position when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// QuestDetailWrapper component for individual quest pages
const QuestDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parsedId = parseInt(id || '-1', 10);
  
  // Check if quest exists
  const questExists = useMemo(() => {
    return quests.some(quest => quest.id === parsedId);
  }, [parsedId]);
  
  // Redirect to NotFound if quest doesn't exist
  useEffect(() => {
    if (!questExists && parsedId !== -1) {
      navigate('/not-found', { replace: true });
    }
  }, [questExists, parsedId, navigate]);
  
  return questExists ? <QuestScreen id={parsedId} /> : null;
};

// Play mode opens a quest as a factory machine window, full screen with no
// frame. Work mode keeps the plain quest page inside its frame. Keyed by id so
// each machine opens fresh (scroll, focus and the bar animation reset).
const QuestScreen = ({ id }: { id: number }) => {
  const { theme } = useTheme()!;
  if (theme === 'play') {
    return (
      <>
        <Navbar />
        <QuestMachine key={id} id={id} />
      </>
    );
  }
  return (
    <QuestSwitcher>
      <Navbar />
      <QuestDetail id={id} />
    </QuestSwitcher>
  );
};

// Play mode opens on the career factory, full screen with no TV frame.
// Work mode keeps the plain menu inside its frame.
// Both modes share one achievements page. Play mode shows it full screen in
// the factory's skin with no TV frame; work mode keeps it inside its frame.
const AccomplishmentsScreen = () => {
  const { theme } = useTheme()!;
  if (theme === 'play') {
    return (
      <>
        <Navbar />
        <div className="factory-stage">
          <Accomplishments />
        </div>
      </>
    );
  }
  return (
    <QuestSwitcher type="career">
      <Navbar />
      <Accomplishments />
    </QuestSwitcher>
  );
};

// Play mode has no timeline; the factory is its home.
const TimelineScreen = () => {
  const { theme } = useTheme()!;
  if (theme === 'play') return <Navigate to="/main-menu" replace />;
  return (
    <QuestSwitcher type="career">
      <Navbar />
      <CareerTimeline />
    </QuestSwitcher>
  );
};

const HomeScreen = () => {
  const { theme } = useTheme()!;
  if (theme === 'play') {
    return (
      <>
        <Navbar />
        <div className="factory-stage">
          <Factory />
        </div>
      </>
    );
  }
  return (
    <QuestSwitcher>
      <Navbar />
      <MainMenu />
    </QuestSwitcher>
  );
};

// The application package prints #/resume?print=1 headlessly: the resume alone, in its print layout.
// Any other visit gets the normal framed page.
const ResumeRoute = () => {
  const { search } = useLocation();
  if (new URLSearchParams(search).get('print') === '1') return <ResumeView printMode />;
  return (
    <QuestSwitcher type="career">
      <Navbar />
      <ResumeView />
    </QuestSwitcher>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Default route redirects to main menu */}
        <Route path="/" element={<Navigate to="/main-menu" replace />} />
        
        {/* Main Menu */}
        <Route path="/main-menu" element={<HomeScreen />} />
                
        {/* Individual Quest Detail */}
        <Route path="/quests/:id" element={<QuestDetailWrapper />} />
        
        {/* Accomplishments */}
        <Route path="/accomplishments" element={<AccomplishmentsScreen />} />

        {/* Timelines */}
        <Route path="/timeline" element={<TimelineScreen />} />
        
        <Route path="/resume" element={<ResumeRoute />} />

        {/* 404 Not Found */}
        <Route path="/not-found" element={
          <QuestSwitcher>
            <Navbar />
            <NotFound />
          </QuestSwitcher>
        } />
        
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;