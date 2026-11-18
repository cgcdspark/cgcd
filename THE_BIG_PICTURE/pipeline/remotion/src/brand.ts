// THE BIG PICTURE — brand tokens. Every graphic reads from here so the look stays consistent.
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter-tight/700.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

export const C = {
  // Palette A — "Graphite & Signal Red" (chosen for THE BIG PICTURE, Nov 2026).
  // Token names are kept for compatibility: navy* = graphite surfaces, gold* = the signal-red accent.
  navy: '#0E0F11',
  navy2: '#1C1E22',
  navyLine: '#2C2F35',
  black: '#08090A',
  gold: '#E5484D',
  goldHi: '#FF6B6F',
  goldLo: '#B3343A',
  off: '#F1EFEA',
  muted: '#8A8F98',
  red: '#E5484D',
  steel: '#5B616B',
};

export const F = {
  head: '"Inter Tight", "Helvetica Neue", Arial, sans-serif',
  body: 'Inter, "Helvetica Neue", Arial, sans-serif',
  mono: '"IBM Plex Mono", Consolas, monospace',
};

export const goldGradient = `linear-gradient(100deg, ${C.goldLo} 0%, ${C.gold} 55%, ${C.goldHi} 100%)`;

// Safe area: graphics keep text inside 5% margins so they read on phones and survive YouTube UI overlays.
export const SAFE = {x: 110, y: 80};
