import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F, SAFE, goldGradient} from '../brand';
import {outro, prog} from '../anim';

/** Shared frame for every data graphic: kicker, headline, body, and a source line with period + units. */
export const Panel: React.FC<{
  kicker?: string;
  title?: string;
  source?: string;
  dur: number;
  transparent?: boolean;
  children: React.ReactNode;
}> = ({kicker, title, source, dur, transparent, children}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 0, 18);
  const o = outro(frame, dur, 12);
  return (
    <AbsoluteFill style={{opacity: o}}>
      {!transparent ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${C.navy2} 0%, ${C.navy} 45%, ${C.black} 100%)`,
          }}
        />
      ) : (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,10,.78) 0%, rgba(10,22,38,.72) 100%)'}} />
      )}
      {/* faint engineering grid */}
      <AbsoluteFill
        style={{
          opacity: 0.22,
          backgroundImage: `linear-gradient(${C.navyLine} 1px, transparent 1px), linear-gradient(90deg, ${C.navyLine} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        }}
      />
      <AbsoluteFill style={{padding: `${SAFE.y}px ${SAFE.x}px`, display: 'flex', flexDirection: 'column'}}>
        {kicker || title ? (
          <div style={{opacity: a, transform: `translateY(${(1 - a) * 12}px)`}}>
            {kicker ? (
              <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.28em', color: C.gold, textTransform: 'uppercase'}}>{kicker}</div>
            ) : null}
            {title ? (
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 64, color: C.off, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.05, maxWidth: 1500}}>{title}</div>
            ) : null}
            <div style={{height: 3, width: 160 * a, background: goldGradient, marginTop: 22}} />
          </div>
        ) : null}
        <div style={{flex: 1, position: 'relative', marginTop: 24}}>{children}</div>
        {source ? (
          <div style={{fontFamily: F.mono, fontSize: 21, color: C.muted, opacity: prog(frame, 14, 20), lineHeight: 1.4}}>
            {source}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
