import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import type {Motion} from '../types';

const motionTransform = (motion: Motion | undefined, t: number) => {
  // Deliberately small moves: enough to give life, never a "slideshow zoom".
  switch (motion) {
    case 'push':
      return `scale(${1.0 + 0.045 * t})`;
    case 'pull':
      return `scale(${1.045 - 0.045 * t})`;
    case 'driftL':
      return `scale(1.06) translateX(${1.6 - 3.2 * t}%)`;
    case 'driftR':
      return `scale(1.06) translateX(${-1.6 + 3.2 * t}%)`;
    default:
      return 'none';
  }
};

export const MediaLayer: React.FC<{
  src: string;
  kind: 'footage' | 'still';
  dur: number;
  startFrom?: number;
  motion?: Motion;
  dim?: number;
}> = ({src, kind, dur, startFrom = 0, motion, dim = 0}) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, frame / Math.max(1, dur)));
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: motionTransform(motion ?? (kind === 'still' ? 'push' : 'none'), t),
  };
  return (
    <AbsoluteFill style={{backgroundColor: C.black, overflow: 'hidden'}}>
      {kind === 'footage' ? (
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={style} />
      ) : (
        <Img src={staticFile(src)} style={style} />
      )}
      {dim > 0 ? <AbsoluteFill style={{backgroundColor: `rgba(5,7,10,${dim})`}} /> : null}
    </AbsoluteFill>
  );
};

/** Cinematic finishing: vignette + fine animated grain + optional letterbox. */
export const Finish: React.FC<{letterbox?: boolean}> = ({letterbox}) => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)'}}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='" +
            seed +
            "'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {letterbox ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 138, background: C.black}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 138, background: C.black}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const XFade: React.FC<{frames?: number; children: React.ReactNode}> = ({frames = 0, children}) => {
  const frame = useCurrentFrame();
  const o = frames > 0 ? interpolate(frame, [0, frames], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
