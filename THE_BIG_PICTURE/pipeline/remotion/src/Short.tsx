import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './brand';
import {prog} from './anim';

export type ShortWord = {t: number; w: string}; // seconds from segment start
export type ShortProps = {
  src: string; // public/ path of the 16:9 segment (with audio)
  hook: string; // headline at the top, '|' for line breaks, *word* for accent
  words: ShortWord[];
  durationInFrames: number;
  cta?: string;
};

const Hook: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 0, 12);
  return (
    <div style={{position: 'absolute', top: 150, left: 70, right: 70, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
      <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 30, letterSpacing: '0.24em', color: C.gold, marginBottom: 18}}>THE BIG PICTURE</div>
      {text.split('|').map((line, i) => (
        <div key={i} style={{fontFamily: F.head, fontWeight: 800, fontSize: 84, lineHeight: 1.0, letterSpacing: '-0.025em', color: C.off}}>
          {line.split(/(\*[^*]+\*)/).map((part, j) =>
            part.startsWith('*') ? (
              <span key={j} style={{color: C.gold}}>{part.slice(1, -1)}</span>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

/** Word-by-word captions in groups of up to 4 words; the current word is lit in the accent colour. */
const Captions: React.FC<{words: ShortWord[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < words.length; i++) if (words[i].t <= t) idx = i;
  if (idx < 0) return null;
  // group boundaries: every 4 words or at sentence punctuation
  const groups: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, i) => {
    cur.push(i);
    if (cur.length >= 4 || /[.!?…:]$/.test(w.w)) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) groups.push(cur);
  const g = groups.find((gr) => gr.includes(idx)) ?? [];
  const last = words[g[g.length - 1]];
  const next = words[g[g.length - 1] + 1];
  if (next && t > last.t + 1.6 && t < next.t) return null; // hide during long pauses
  return (
    <div style={{position: 'absolute', top: 1290, left: 60, right: 60, textAlign: 'center'}}>
      {g.map((i) => (
        <span key={i} style={{display: 'inline-block', margin: '0 12px', fontFamily: F.head, fontWeight: 800, fontSize: 82, lineHeight: 1.12, color: i === idx ? C.gold : C.off, textShadow: '0 4px 24px rgba(0,0,0,.9)', transform: i === idx ? 'scale(1.06)' : 'none'}}>
          {words[i].w.replace(/[“”"]/g, '')}
        </span>
      ))}
    </div>
  );
};

export const Short: React.FC<ShortProps> = ({src, hook, words, durationInFrames, cta = 'Full story on THE BIG PICTURE'}) => {
  const frame = useCurrentFrame();
  const end = interpolate(frame, [durationInFrames - 45, durationInFrames - 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.black}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(38px) brightness(0.35) saturate(0.8)', transform: 'scale(1.2)'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 640, left: 0, width: 1080, height: 608, boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
        <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%'}} />
      </div>
      <div style={{position: 'absolute', top: 636, left: 0, width: 1080 * (frame / durationInFrames), height: 4, background: C.gold}} />
      <Hook text={hook} />
      <Captions words={words} />
      <AbsoluteFill style={{background: `rgba(5,7,10,${0.85 * end})`, justifyContent: 'center', alignItems: 'center', opacity: end}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 70, color: C.off, textAlign: 'center', lineHeight: 1.1, padding: '0 80px'}}>
          {cta.split('THE BIG PICTURE')[0]}
          <span style={{color: C.gold}}>THE BIG PICTURE</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
