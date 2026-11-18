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
  navy: '#0A1626',
  navy2: '#10233B',
  navyLine: '#24384F',
  black: '#05070A',
  gold: '#C9A35B',
  goldHi: '#E6C887',
  goldLo: '#8E6E33',
  off: '#F2EEE6',
  muted: '#8D98A6',
  red: '#C8553D',
};

export const F = {
  head: '"Inter Tight", "Helvetica Neue", Arial, sans-serif',
  body: 'Inter, "Helvetica Neue", Arial, sans-serif',
  mono: '"IBM Plex Mono", Consolas, monospace',
};

export const goldGradient = `linear-gradient(100deg, ${C.goldLo} 0%, ${C.goldHi} 45%, ${C.gold} 70%, ${C.goldLo} 100%)`;

// Safe area: graphics keep text inside 5% margins so they read on phones and survive YouTube UI overlays.
export const SAFE = {x: 110, y: 80};
