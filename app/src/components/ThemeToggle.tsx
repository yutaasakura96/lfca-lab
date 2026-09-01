'use client';

import { useEffect, useState } from 'react';
import { applyTheme, currentTheme, type Theme } from './theme.ts';

/**
 * The theme toggle.
 *
 * Renders its label from the document's actual state rather than from stored
 * state, and only after mounting — before that, the server and the browser
 * genuinely disagree about which theme is active, because the inline script
 * has run in one and not the other. Rendering a neutral label until mounted is
 * the honest way to say "not known yet".
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="btn btn--quiet"
      // Announced rather than inferred from a glyph: the control's meaning
      // should not depend on reading a symbol.
      aria-label={theme === null ? 'Switch theme' : `Switch to ${next} theme`}
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
    >
      {theme === null ? 'Theme' : next === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
