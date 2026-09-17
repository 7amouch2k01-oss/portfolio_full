'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { amber } from '@mui/material/colors';

// Universal Warm Accent
export const ORANGE = '#E07A28';
export const ORANGE_BRIGHT = '#E88B3D';
export const ORANGE_DIM = '#B85E18';

// Dark tokens
export const BG_DEFAULT = '#0c0d0e';
export const BG_PAPER = '#141517';
export const BG_ELEVATED = '#1b1d20';
export const BORDER_SUBTLE = 'rgba(255,255,255,0.08)';
export const BORDER_ORANGE = 'rgba(224,122,40,0.30)';

export const ORANGE_GRADIENT = `linear-gradient(135deg, ${ORANGE} 0%, #D46A1A 100%)`;
export const HERO_GRADIENT = `linear-gradient(90deg, rgba(12,13,14,0.98) 0%, rgba(12,13,14,0.90) 45%, rgba(12,13,14,0.65) 80%, rgba(12,13,14,0.5) 100%)`;

export function getAppTheme(mode = 'dark') {
  const isDark = mode === 'dark';

  const bgDefault = isDark ? '#0c0d0e' : '#F9FAFB';
  const bgPaper = isDark ? '#141517' : '#FFFFFF';
  const bgElevated = isDark ? '#1b1d20' : '#F3F4F6';
  const textPrimary = isDark ? '#FFFFFF' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#4B5563';
  const borderSubtle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderOrange = isDark ? 'rgba(224,122,40,0.30)' : 'rgba(224,122,40,0.40)';

  let t = createTheme({
    palette: {
      mode,
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
        default: bgDefault,
        paper: bgPaper,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider: borderSubtle,
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
          body: {
            backgroundColor: bgDefault,
            color: textPrimary,
            transition: 'background-color 0.25s ease, color 0.25s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.04em',
            borderRadius: 4,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: bgPaper,
            border: `1px solid ${borderSubtle}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 4 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', backgroundColor: bgPaper },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: bgElevated,
              '& fieldset': { borderColor: borderSubtle },
              '&:hover fieldset': { borderColor: borderOrange },
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
            backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          },
          bar: { borderRadius: 2 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: borderSubtle },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });

  return responsiveFontSizes(t);
}

const theme = getAppTheme('dark');
export default theme;
