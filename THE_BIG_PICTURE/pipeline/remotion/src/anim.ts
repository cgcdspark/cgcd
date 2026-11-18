import {Easing, interpolate, spring} from 'remotion';

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 over `dur` frames starting at `start`, eased. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Fade-out multiplier for the last `dur` frames of a shot of length `total`. */
export const outro = (frame: number, total: number, dur = 10) =>
  interpolate(frame, [total - dur, total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}});

export const fmtNum = (v: number, decimals = 0) =>
  v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
