import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE, goldGradient} from '../brand';
import {outro, prog} from '../anim';

/** Lower third: place / company / role labels over footage. */
export const LowerThird: React.FC<{title: string; sub?: string; dur: number}> = ({title, sub, dur}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 0, 16);
  const o = outro(frame, dur, 12);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: SAFE.x, bottom: SAFE.y + 40, display: 'flex', gap: 22, alignItems: 'stretch'}}>
        <div style={{width: 5, background: goldGradient, transform: `scaleY(${a})`, transformOrigin: 'bottom'}} />
        <div style={{clipPath: `inset(0 ${100 - a * 100}% 0 0)`}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, color: C.off, letterSpacing: '-0.01em', textShadow: '0 2px 18px rgba(0,0,0,.6)'}}>{title}</div>
          {sub ? (
            <div style={{fontFamily: F.mono, fontSize: 22, color: C.goldHi, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, textShadow: '0 2px 12px rgba(0,0,0,.7)'}}>{sub}</div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Chapter card: act number + title, laid over (darkened) footage. */
export const ChapterCard: React.FC<{act: string; title: string; dur: number}> = ({act, title, dur}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 4, 20);
  const b = prog(frame, 12, 24);
  const o = outro(frame, dur, 14);
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center', background: `rgba(5,7,10,${0.45 * o})`}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.42em', color: C.gold, opacity: a, transform: `translateY(${(1 - a) * 14}px)`}}>{act}</div>
        <div style={{height: 2, width: 420 * b, margin: '26px auto', background: goldGradient}} />
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 104, color: C.off, letterSpacing: '-0.02em', opacity: b, transform: `translateY(${(1 - b) * 20}px)`, textShadow: '0 4px 40px rgba(0,0,0,.6)'}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Small kinetic stat placed in a corner over footage (e.g. "$4.1bn · Q3 2025"). */
export const CornerStat: React.FC<{value: string; label: string; source: string; dur: number; side?: 'left' | 'right'}> = ({value, label, source, dur, side = 'right'}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 0, 18);
  const o = outro(frame, dur, 12);
  const pos: React.CSSProperties = side === 'right' ? {right: SAFE.x} : {left: SAFE.x};
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: SAFE.y + 40, ...pos, textAlign: side, background: 'rgba(5,7,10,0.62)', padding: '26px 34px', borderTop: `3px solid ${C.gold}`, transform: `translateY(${(1 - a) * 16}px)`, opacity: a, maxWidth: 720}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 92, color: C.off, lineHeight: 1, letterSpacing: '-0.02em'}}>{value}</div>
        <div style={{fontFamily: F.body, fontWeight: 500, fontSize: 30, color: C.off, marginTop: 10}}>{label}</div>
        <div style={{fontFamily: F.mono, fontSize: 18, color: C.muted, marginTop: 12}}>{source}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Burned-in caption (off by default; YouTube gets the SRT). */
export const CaptionLine: React.FC<{text: string}> = ({text}) => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70}}>
    <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 40, color: C.off, background: 'rgba(5,7,10,0.72)', padding: '10px 22px', maxWidth: 1500, textAlign: 'center', lineHeight: 1.3}}>{text}</div>
  </AbsoluteFill>
);

/** Brand bug: small wordmark top-left during the documentary body. */
export const Bug: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = interpolate(frame, [0, fps, dur - fps, dur], [0, 0.85, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 56, right: 70, fontFamily: F.head, fontWeight: 800, fontSize: 22, letterSpacing: '0.22em', color: C.off}}>
        THE BIG <span style={{color: C.gold}}>PICTURE</span>
      </div>
    </AbsoluteFill>
  );
};

/** Source tag: names what identifiable footage actually shows, and its source (honesty + attribution). */
export const SourceTag: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const frame = useCurrentFrame();
  const o = Math.min(prog(frame, 0, 10), outro(frame, dur, 10));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: SAFE.x, top: 56, fontFamily: F.mono, fontSize: 19, letterSpacing: '0.1em', color: C.off, textTransform: 'uppercase', background: 'rgba(5,7,10,0.55)', padding: '6px 12px', borderLeft: `3px solid ${C.gold}`}}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
