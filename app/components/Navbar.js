'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ORANGE, ORANGE_GRADIENT, BORDER_ORANGE } from '../theme';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ activeSection = 'home', onSelectSection, onTriggerSecret }) {
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Silent 4-click Easter egg — no visual feedback at all
  const handleTitleClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 4) {
        if (clickTimer) clearTimeout(clickTimer);
        setClickTimer(null);
        if (onTriggerSecret) onTriggerSecret();
        return 0;
      }
      if (clickTimer) clearTimeout(clickTimer);
      const t = setTimeout(() => setClickCount(0), 1500);
      setClickTimer(t);
      return next;
    });
  };

  const handleNavClick = (sectionId) => {
    if (onSelectSection) onSelectSection(sectionId);
    setOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: (t) =>
            t.palette.mode === 'dark' ? 'rgba(12,13,14,0.92)' : 'rgba(255,255,255,0.92)',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          backdropFilter: 'blur(16px)',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            width: '100%',
            px: { xs: 2, md: 5 },
            minHeight: { xs: 64, md: 72 },
          }}
        >
          {/* Brand Logo — 4-click Easter egg */}
          <Box
            onClick={handleTitleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: ORANGE,
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  letterSpacing: '0.12em',
                  color: 'text.primary',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                MA. RZEIGUI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: '0.08em',
                  fontSize: '0.62rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                FULL-STACK ENGINEER
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      color: isActive ? '#fff' : 'text.secondary',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      fontWeight: isActive ? 800 : 600,
                      px: 2,
                      py: 0.8,
                      position: 'relative',
                      bgcolor: isActive ? 'rgba(224,122,40,0.12)' : 'transparent',
                      border: isActive ? `1px solid ${BORDER_ORANGE}` : '1px solid transparent',
                      borderRadius: 1,
                      '&:hover': {
                        color: ORANGE,
                        bgcolor: 'rgba(255,255,255,0.03)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          left: '20%',
                          right: '20%',
                          height: 2,
                          bgcolor: ORANGE,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Button>
                );
              })}

              <Button
                variant="outlined"
                onClick={() => handleNavClick('contact')}
                sx={{
                  ml: 2,
                  borderColor: ORANGE,
                  color: ORANGE,
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  px: 2.5,
                  py: 0.8,
                  '&:hover': { bgcolor: 'rgba(224,122,40,0.1)', borderColor: ORANGE },
                }}
              >
                HIRE ME
              </Button>
            </Box>
          )}

          {/* Mobile Right Controls: Menu Toggle */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: 'background.paper',
              borderLeft: (t) => `1px solid ${t.palette.divider}`,
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            onClick={handleTitleClick}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'default', userSelect: 'none' }}
          >
            <Box sx={{ width: 8, height: 8, bgcolor: ORANGE, transform: 'rotate(45deg)' }} />
            <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.8rem' }}>
              MA. RZEIGUI
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: isActive ? 'rgba(224,122,40,0.1)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${ORANGE}` : '3px solid transparent',
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: isActive ? 800 : 600,
                          letterSpacing: '0.12em',
                          fontSize: '0.82rem',
                          color: isActive ? ORANGE : 'text.secondary',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          <ListItem sx={{ px: 3, pt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNavClick('contact')}
              sx={{
                background: ORANGE_GRADIENT,
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
                py: 1.2,
              }}
            >
              HIRE ME
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
