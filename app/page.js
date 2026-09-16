'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SecretDashboardModal from './components/SecretDashboardModal';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [secretModalOpen, setSecretModalOpen] = useState(false);

  // Synchronize hash in URL for intuitive navigation & reload
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'skills', 'projects', 'contact'].includes(hash)) {
        setActiveSection(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    window.location.hash = sectionId === 'home' ? '' : sectionId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Sticky Navbar with Active Tab Highlighting and 4-click Secret Easter Egg */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onTriggerSecret={() => setSecretModalOpen(true)}
      />

      {/* Dynamic Viewport Section (Loaded directly under Navbar) */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {activeSection === 'home' && (
          <Fade in timeout={350} key="home">
            <Box>
              <Hero onNavigate={handleSelectSection} />
            </Box>
          </Fade>
        )}

        {activeSection === 'about' && (
          <Fade in timeout={350} key="about">
            <Box sx={{ pt: { xs: 2, md: 4 }, pb: 8 }}>
              <About />
            </Box>
          </Fade>
        )}

        {activeSection === 'skills' && (
          <Fade in timeout={350} key="skills">
            <Box sx={{ pt: { xs: 2, md: 4 }, pb: 8 }}>
              <Skills />
            </Box>
          </Fade>
        )}

        {activeSection === 'projects' && (
          <Fade in timeout={350} key="projects">
            <Box sx={{ pt: { xs: 2, md: 4 }, pb: 8 }}>
              <Projects />
            </Box>
          </Fade>
        )}

        {activeSection === 'contact' && (
          <Fade in timeout={350} key="contact">
            <Box sx={{ pt: { xs: 2, md: 4 }, pb: 8 }}>
              <Contact />
            </Box>
          </Fade>
        )}
      </Box>

      {/* Persistent Footer */}
      <Footer />

      {/* Secret Password & Contacts Management Dashboard Modal */}
      <SecretDashboardModal
        open={secretModalOpen}
        onClose={() => setSecretModalOpen(false)}
      />
    </Box>
  );
}