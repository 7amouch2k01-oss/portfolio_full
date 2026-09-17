'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useServerInsertedHTML } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { getAppTheme } from './theme';
import { ColorModeContext } from './ColorModeContext';

export default function MuiThemeProvider({ children }) {
  const mode = 'dark';
  const colorMode = useMemo(
    () => ({
      mode: 'dark',
      toggleColorMode: () => {},
    }),
    []
  );

  const activeTheme = useMemo(() => getAppTheme('dark'), []);

  const [{ cache }] = useState(() => {
    const emotionCache = createCache({ key: 'mui' });
    emotionCache.compat = true;
    return { cache: emotionCache };
  });

  useServerInsertedHTML(() => {
    const styles = Object.values(cache.inserted).join('');
    if (!styles) return null;
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={activeTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
