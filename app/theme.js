'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { amber } from '@mui/material/colors';

// Color tokens for a refined, eye-friendly warm amber / soft orange aesthetic
export const ORANGE = '#E07A28'; // Softer, warmer amber-orange (less harsh saturation)
export const ORANGE_BRIGHT = '#E88B3D';
export const ORANGE_DIM = '#B85E18';
export const BG_DEFAULT = '#0c0d0e'; // Slightly softer deep slate dark background
export const BG_PAPER = '#141517';
export const BG_ELEVATED = '#1b1d20';
export const BORDER_SUBTLE = 'rgba(255,255,255,0.07)';
export const BORDER_ORANGE = 'rgba(224,122,40,0.28)';

export const ORANGE_GRADIENT = `linear-gradient(135deg, ${ORANGE} 0%, #D46A1A 100%)`;
// Softened dark overlay so the neon tech circuit image doesn't blind the eyes
export const HERO_GRADIENT = `linear-gradient(90deg, rgba(12,13,14,0.98) 0%, rgba(12,13,14,0.90) 45%, rgba(12,13,14,0.65) 80%, rgba(12,13,14,0.5) 100%)`;

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ORANGE,
      light: ORANGE_BRIGHT,
      dark: ORANGE_DIM,
      contrastText: '#ffffff',
    },
    secondary: {
      main: amber[600],
      light: amber[400],
      dark: amber[800],
      contrastText: '#000000',
    },
    background: {
      default: BG_DEFAULT,
      paper: BG_PAPER,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9CA3AF',
    },
    divider: BORDER_SUBTLE,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    overline: { letterSpacing: '0.18em', fontWeight: 600, fontSize: '0.72rem' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG_DEFAULT },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          letterSpacing: '0.04em',
          borderRadius: 2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: BG_PAPER,
          border: `1px solid ${BORDER_SUBTLE}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 2 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: BG_ELEVATED,
            '& fieldset': { borderColor: BORDER_SUBTLE },
            '&:hover fieldset': { borderColor: BORDER_ORANGE },
            '&.Mui-focused fieldset': { borderColor: ORANGE },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: ORANGE },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.07)',
        },
        bar: { borderRadius: 2 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER_SUBTLE },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

