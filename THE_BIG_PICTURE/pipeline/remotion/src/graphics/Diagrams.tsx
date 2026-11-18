import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE, goldGradient} from '../brand';
import {outro, pop, prog} from '../anim';
import {Panel} from './Panel';

type Common = {kicker?: string; title?: string; source?: string; dur: number; transparent?: boolean};

/**
 * The AI value chain as a vertical stack: applications at the top, copper and steel at the bottom.
 * `focus` highlights one layer (re-used through the film as a "you are here" map).
 * `revealAll` shows everything immediately (for recap uses).
 */
export const ValueChain: React.FC<
  Common & {layers: {label: string; examples: string}[]; focus?: number; revealAll?: boolean; flow?: boolean}
> = ({layers, focus, revealAll, flow = true, ...p}) => {
  const frame = useCurrentFrame();
  const n = layers.length;
  const rowH = 84;
  const gap = 8;
  const top = 10;
  return (
    <Panel {...p}>
      <div style={{position: 'absolute', left: 0, right: 0, top}}>
        {/* spine */}
        <div style={{position: 'absolute', left: 39, top: rowH / 2, width: 2, height: (n - 1) * (rowH + gap), background: C.navyLine}} />
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: rowH / 2,
            width: 2,
            height: (n - 1) * (rowH + gap) * (revealAll ? 1 : prog(frame, 6, n * 9 + 10)),
            background: goldGradient,
          }}
        />
        {flow ? (
          <div
            style={{
              position: 'absolute',
              left: 33,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: C.goldHi,
              boxShadow: `0 0 24px ${C.goldHi}`,
              top: rowH / 2 - 7 + (((frame * 6) % ((n - 1) * (rowH + gap))) || 0),
              opacity: frame > n * 9 ? 0.9 : 0,
            }}
          />
        ) : null}
        {layers.map((l, i) => {
          const a = revealAll ? 1 : prog(frame, 6 + i * 9, 18);
          const isF = focus === i;
          const dimmed = focus !== undefined && !isF;
          return (
            <div key={l.label} style={{position: 'absolute', top: i * (rowH + gap), left: 0, right: 0, height: rowH, display: 'flex', alignItems: 'center', opacity: a * (dimmed ? 0.38 : 1), transform: `translateX(${(1 - a) * 30}px)`}}>
              <div style={{width: 80, display: 'flex', justifyContent: 'center'}}>
                <div style={{width: isF ? 30 : 22, height: isF ? 30 : 22, borderRadius: 20, background: isF ? C.goldHi : C.navy, border: `3px solid ${C.gold}`, boxShadow: isF ? `0 0 30px ${C.gold}` : 'none'}} />
              </div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, width: 70}}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{fontFamily: F.head, fontWeight: isF ? 800 : 700, fontSize: isF ? 50 : 44, color: isF ? C.goldHi : C.off, width: 820, letterSpacing: '-0.01em'}}>{l.label}</div>
              <div style={{fontFamily: F.body, fontWeight: 500, fontSize: 28, color: isF ? C.off : C.muted, flex: 1}}>{l.examples}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export type FlowNode = {id: string; x: number; y: number; w?: number; label: string; sub?: string; tag?: string; accent?: boolean; delay?: number};
export type FlowEdge = {from: string; to: string; label?: string; delay?: number; dashed?: boolean};

/**
 * General flow diagram on a 1700x720 canvas (inside the panel). Used for the semiconductor ecosystem,
 * the data-centre architecture and the electricity chain. Edges animate as moving gold dashes ("money/power flowing").
 */
export const Flow: React.FC<Common & {nodes: FlowNode[]; edges: FlowEdge[]; footnote?: string}> = ({nodes, edges, footnote, ...p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const NH = 128;
  return (
    <Panel {...p}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1700, height: 720}}>
        <svg width={1700} height={720} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={C.gold} />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const a = byId[e.from];
            const b = byId[e.to];
            if (!a || !b) return null;
            const aw = a.w ?? 300;
            const bw = b.w ?? 300;
            // connect nearest sides
            const ax = a.x + aw / 2;
            const ay = a.y + NH / 2;
            const bx = b.x + bw / 2;
            const by = b.y + NH / 2;
            const horiz = Math.abs(bx - ax) > Math.abs(by - ay);
            const x1 = horiz ? (bx > ax ? a.x + aw : a.x) : ax;
            const y1 = horiz ? ay : by > ay ? a.y + NH : a.y;
            const x2 = horiz ? (bx > ax ? b.x : b.x + bw) : bx;
            const y2 = horiz ? by : by > ay ? b.y : b.y + NH;
            const t = prog(frame, (e.delay ?? 20 + i * 8), 22);
            const len = Math.hypot(x2 - x1, y2 - y1);
            const mx = horiz ? (x1 + x2) / 2 : x1;
            const path = horiz ? `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` : `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
            return (
              <g key={i} opacity={t}>
                <path d={path} stroke={C.navyLine} strokeWidth={4} fill="none" />
                <path d={path} stroke={C.gold} strokeWidth={3} fill="none" strokeDasharray={e.dashed ? '4 14' : '18 16'} strokeDashoffset={-frame * 2.2} markerEnd="url(#arr)" pathLength={len} />
                {e.label ? (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 14} fill={C.goldHi} fontFamily={F.mono} fontSize={20} textAnchor="middle">
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        {nodes.map((n, i) => {
          const s = pop(frame, fps, n.delay ?? 6 + i * 6);
          return (
            <div
              key={n.id}
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                width: n.w ?? 300,
                height: NH,
                background: n.accent ? 'linear-gradient(180deg, rgba(201,163,91,0.22), rgba(10,22,38,0.95))' : 'rgba(16,35,59,0.92)',
                border: `2px solid ${n.accent ? C.gold : C.navyLine}`,
                padding: '14px 20px',
                opacity: s,
                transform: `translateY(${(1 - s) * 16}px)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {n.tag ? <div style={{fontFamily: F.mono, fontSize: 17, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase'}}>{n.tag}</div> : null}
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 34, color: C.off, lineHeight: 1.08}}>{n.label}</div>
              {n.sub ? <div style={{fontFamily: F.body, fontSize: 21, color: C.muted, marginTop: 4, lineHeight: 1.2}}>{n.sub}</div> : null}
            </div>
          );
        })}
        {footnote ? (
          <div style={{position: 'absolute', left: 0, top: 740, fontFamily: F.body, fontSize: 26, color: C.off, opacity: prog(frame, 60, 20)}}>{footnote}</div>
        ) : null}
      </div>
    </Panel>
  );
};

/** Opening title: the film's name revealed over footage. */
export const TitleCard: React.FC<{title: string; sub?: string; dur: number}> = ({title, sub, dur}) => {
  const frame = useCurrentFrame();
  const o = outro(frame, dur, 16);
  const lines = title.split('|');
  return (
    <AbsoluteFill style={{opacity: o, background: 'rgba(5,7,10,0.35)', justifyContent: 'center', padding: `0 ${SAFE.x + 40}px`}}>
      <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.42em', color: C.gold, opacity: prog(frame, 0, 16)}}>THE BIG PICTURE PRESENTS</div>
      <div style={{height: 3, width: 300 * prog(frame, 6, 24), background: goldGradient, margin: '30px 0'}} />
      {lines.map((l, i) => {
        const a = prog(frame, 14 + i * 8, 26);
        return (
          <div key={i} style={{overflow: 'hidden'}}>
            <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 150, lineHeight: 0.98, letterSpacing: '-0.035em', color: i === lines.length - 1 ? 'transparent' : C.off, background: i === lines.length - 1 ? goldGradient : undefined, WebkitBackgroundClip: i === lines.length - 1 ? 'text' : undefined, transform: `translateY(${(1 - a) * 100}%)`}}>
              {l}
            </div>
          </div>
        );
      })}
      {sub ? <div style={{fontFamily: F.body, fontSize: 36, color: C.off, marginTop: 34, opacity: prog(frame, 40, 20)}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/** End card: brand + tagline. */
export const EndCard: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const a = prog(frame, 10, 30);
  const b = prog(frame, 34, 30);
  const o = outro(frame, dur, 20);
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse at center, ${C.navy2} 0%, ${C.navy} 40%, ${C.black} 100%)`, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 150, letterSpacing: '0.06em', color: C.off, opacity: a, transform: `scale(${0.96 + 0.04 * a})`}}>
          THE BIG <span style={{background: goldGradient, WebkitBackgroundClip: 'text', color: 'transparent'}}>PICTURE</span>
        </div>
        <div style={{height: 3, width: 900 * b, background: goldGradient, margin: '34px auto'}} />
        <div style={{fontFamily: F.mono, fontSize: 40, letterSpacing: '0.38em', color: C.off, opacity: b}}>THE FORCES SHAPING OUR WORLD.</div>
      </div>
    </AbsoluteFill>
  );
};
