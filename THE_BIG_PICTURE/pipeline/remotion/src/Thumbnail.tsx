import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, goldGradient} from './brand';

// Three concepts. Background frames are pulled from licensed footage by pipeline/make_thumbnails.py
// into public/thumbs/ (left = data centre, right = power infrastructure).
const VARIANTS: Record<number, {top: string; big: string; layout: 'split' | 'full' | 'diag'}> = {
  1: {top: 'WHO REALLY PROFITS?', big: 'THE HIDDEN|AI BOOM', layout: 'split'},
  2: {top: 'NOT THE CHIPS.', big: 'THE GRID.', layout: 'full'},
  3: {top: 'BEHIND THE', big: 'AI|REVOLUTION', layout: 'diag'},
};

export const Thumbnail: React.FC<{variant: number}> = ({variant}) => {
  const v = VARIANTS[variant] ?? VARIANTS[1];
  const lines = v.big.split('|');
  const img = {width: '100%', height: '100%', objectFit: 'cover' as const};
  return (
    <AbsoluteFill style={{background: C.black}}>
      {v.layout === 'split' ? (
        <AbsoluteFill style={{flexDirection: 'row'}}>
          <div style={{width: '50%', height: '100%', overflow: 'hidden'}}>
            <Img src={staticFile('thumbs/left.jpg')} style={{...img, filter: 'saturate(0.8) contrast(1.15) brightness(0.8)'}} />
          </div>
          <div style={{width: 6, background: goldGradient}} />
          <div style={{flex: 1, height: '100%', overflow: 'hidden'}}>
            <Img src={staticFile('thumbs/right.jpg')} style={{...img, filter: 'saturate(0.8) contrast(1.15) brightness(0.8)'}} />
          </div>
        </AbsoluteFill>
      ) : v.layout === 'full' ? (
        <Img src={staticFile('thumbs/right.jpg')} style={{...img, filter: 'contrast(1.2) brightness(0.75)'}} />
      ) : (
        <AbsoluteFill>
          <Img src={staticFile('thumbs/left.jpg')} style={{...img, filter: 'contrast(1.2) brightness(0.7)'}} />
          <AbsoluteFill style={{clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 38% 100%)'}}>
            <Img src={staticFile('thumbs/right.jpg')} style={{...img, filter: 'contrast(1.2) brightness(0.75)'}} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,7,10,0.88) 0%, rgba(5,7,10,0.35) 55%, rgba(5,7,10,0) 100%)'}} />
      <AbsoluteFill style={{padding: '70px 70px', justifyContent: 'center'}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 54, color: C.goldHi, letterSpacing: '0.02em'}}>{v.top}</div>
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: F.head, fontWeight: 800, fontSize: 150, lineHeight: 0.92, letterSpacing: '-0.035em', color: C.off, textShadow: '0 6px 40px rgba(0,0,0,.7)'}}>
            {l}
          </div>
        ))}
        <div style={{height: 8, width: 260, background: goldGradient, marginTop: 26}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: F.head, fontWeight: 800, fontSize: 26, letterSpacing: '0.2em', color: C.off}}>
        THE BIG <span style={{color: C.gold}}>PICTURE</span>
      </div>
    </AbsoluteFill>
  );
};
