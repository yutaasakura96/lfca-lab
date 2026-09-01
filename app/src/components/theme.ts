// The theme, and the one piece of client state that outlives a page load.
//
// Light is the default, because that is what the token file's bare `:root`
// defines; dark is `[data-theme="dark"]`, which redefines the semantic aliases
// only. Nothing here invents a colour — it only decides which of the two the
// document is in.

export const THEME_STORAGE_KEY = 'lfca-theme';

export type Theme = 'light' | 'dark';

/**
 * Runs inline in `<head>`, before first paint.
 *
 * It must be a string rather than a module: anything that needs to happen
 * before the browser paints cannot wait for a bundle to load, and a
 * dark-theme reader getting a white flash on every navigation is the kind of
 * defect that is obvious to the person using it and invisible in a test.
 *
 * With JavaScript disabled this never runs and the page renders light, which
 * is the correct fallback rather than an accident — light is what the tokens
 * define with no attribute set.
 *
 * A stored choice always wins. With nothing stored, the system preference is
 * honoured for the first visit; the moment the reader picks, that becomes the
 * answer and the system stops being consulted.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Private browsing can make localStorage throw on read. Light is a correct
    // page, so failing silently is better than failing visibly.
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`.trim();

/** Read the theme the document is actually in, rather than what was stored. */
export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Apply a theme and remember it. Storage failure must never break the toggle. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The toggle still worked for this page. Remembering it is the bonus.
  }
}
