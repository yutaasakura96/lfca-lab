import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/screens.css';
import { ThemeToggle } from '../components/ThemeToggle.tsx';
import { THEME_INIT_SCRIPT } from '../components/theme.ts';

export const metadata: Metadata = {
  title: 'LFCA Practice',
  description: 'Sit the sixteen practice papers under a real clock.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // `suppressHydrationWarning` because the script below sets `data-theme` on
    // this element before React sees it. The mismatch is intended: the whole
    // point is that the attribute is already correct when the first paint
    // happens.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          The fonts the tokens name. Loaded the same way the design prototype
          loads them, so `--font-ui` and friends resolve to the real families
          without editing the token file — which is copied verbatim and must
          stay that way.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap"
        />
        {/*
          Runs before first paint, so a dark-theme reader never sees a white
          flash. Deliberately inline and tiny: anything that has to happen
          before paint cannot be a component.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <div className="app">
          <header className="bar">
            <span className="brandmark">LFCA Practice</span>
            <ThemeToggle />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
