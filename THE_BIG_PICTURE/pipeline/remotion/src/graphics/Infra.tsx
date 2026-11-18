import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../brand';
import {pop, prog} from '../anim';
import {Panel} from './Panel';

type Common = {kicker?: string; title?: string; source?: string; dur: number; transparent?: boolean};

const G = C.gold;
const line = {fill: 'none', stroke: G, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

/* ---------- line-art icons (drawn, original) ---------- */
const Icon: React.FC<{kind: string; s?: number}> = ({kind, s = 1}) => {
  const p = {...line, strokeWidth: 3 / s};
  switch (kind) {
    case 'plant':
      return (
        <g {...p}>
          <path d="M10 110 L10 60 L40 75 L40 60 L70 75 L70 40 L85 40 L85 110 Z" />
          <path d="M95 110 C 98 70, 112 60, 110 30 L 140 30 C 138 60, 152 70, 155 110 Z" />
          <path d="M118 22 C 112 12, 128 8, 124 -2" opacity={0.6} />
          <path d="M0 110 L165 110" />
        </g>
      );
    case 'transformer':
      return (
        <g {...p}>
          <rect x="20" y="40" width="110" height="70" rx="4" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M${45 + i * 30} 40 L${45 + i * 30} 8`} />
              {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} cx={45 + i * 30} cy={14 + k * 6} rx="7" ry="2.5" />
              ))}
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${30 + i * 18} 50 L${30 + i * 18} 100`} opacity={0.5} />
          ))}
          <path d="M0 110 L150 110" />
        </g>
      );
    case 'pylon':
      return (
        <g {...p}>
          <path d="M75 0 L50 110 M75 0 L100 110 M58 75 L92 75 M62 50 L88 50 M66 28 L84 28" />
          <path d="M30 28 L120 28 M38 50 L112 50" />
          <path d="M58 75 L88 50 M92 75 L62 50 M62 50 L84 28 M88 50 L66 28" opacity={0.6} />
          <path d="M30 28 L30 36 M120 28 L120 36 M38 50 L38 58 M112 50 L112 58" />
          <path d="M0 110 L150 110" />
        </g>
      );
    case 'substation':
      return (
        <g {...p}>
          <path d="M10 30 L140 30 M20 30 L20 110 M130 30 L130 110 M75 30 L75 110" />
          <rect x="30" y="70" width="34" height="40" />
          <rect x="86" y="70" width="34" height="40" />
          <path d="M40 30 L40 55 M54 30 L54 55 M96 30 L96 55 M110 30 L110 55" />
          <circle cx="47" cy="58" r="5" />
          <circle cx="103" cy="58" r="5" />
          <path d="M0 110 L150 110" />
        </g>
      );
    case 'switchgear':
      return (
        <g {...p}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={10 + i * 34} y="20" width="30" height="90" />
              <rect x={16 + i * 34} y="30" width="18" height="14" />
              <circle cx={25 + i * 34} cy="62" r="5" />
              <path d={`M${16 + i * 34} 80 L${34 + i * 34} 80`} />
            </g>
          ))}
          <path d="M0 110 L150 110" />
        </g>
      );
    case 'datacentre':
      return (
        <g {...p}>
          <rect x="10" y="40" width="130" height="70" />
          <path d="M10 40 L30 20 L120 20 L140 40" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={20 + i * 24} y="55" width="16" height="45" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${24 + i * 24} 63 L${32 + i * 24} 63 M${24 + i * 24} 72 L${32 + i * 24} 72`} opacity={0.6} />
          ))}
          <path d="M0 110 L150 110" />
        </g>
      );
    default:
      return null;
  }
};

/**
 * The electricity value chain: generation → step-up → transmission → substation → switchgear → data centre.
 * Each stage has who-gets-paid examples and an optional verified bottleneck tag.
 */
export const PowerChain: React.FC<
  Common & {stages: {icon: string; label: string; who: string; tag?: string}[]; flowLabel?: string}
> = ({stages, flowLabel, ...p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = stages.length;
  const W = 1700;
  const colW = W / n;
  const lineY = 300;
  return (
    <Panel {...p}>
      <div style={{position: 'absolute', left: 0, top: 90, width: W, height: 620}}>
        <svg width={W} height={620} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {/* the power line connecting all stages, drawn on progressively */}
          <path d={`M${colW / 2} ${lineY} L${W - colW / 2} ${lineY}`} stroke={C.navyLine} strokeWidth={6} />
          <path
            d={`M${colW / 2} ${lineY} L${W - colW / 2} ${lineY}`}
            stroke={G}
            strokeWidth={4}
            strokeDasharray="22 14"
            strokeDashoffset={-frame * 3}
            pathLength={W}
            opacity={prog(frame, 8, n * 10)}
            style={{clipPath: `inset(0 ${100 - prog(frame, 8, n * 10 + 10) * 100}% 0 0)`}}
          />
          {stages.map((s, i) => {
            const a = pop(frame, fps, 6 + i * 10);
            const cx = colW * i + colW / 2;
            return (
              <g key={s.label} transform={`translate(${cx - 75}, ${lineY - 150})`} opacity={a}>
                <Icon kind={s.icon} />
                <circle cx={75} cy={150} r={9} fill={C.goldHi} stroke={C.navy} strokeWidth={3} />
              </g>
            );
          })}
        </svg>
        {stages.map((s, i) => {
          const a = prog(frame, 14 + i * 10, 16);
          return (
            <div key={s.label} style={{position: 'absolute', left: colW * i + 8, width: colW - 16, top: lineY + 34, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 12}px)`}}>
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 31, color: C.off, lineHeight: 1.1}}>{s.label}</div>
              <div style={{fontFamily: F.body, fontSize: 21, color: C.muted, marginTop: 8, lineHeight: 1.25}}>{s.who}</div>
              {s.tag ? (
                <div style={{display: 'inline-block', marginTop: 14, padding: '6px 12px', border: `2px solid ${G}`, fontFamily: F.mono, fontSize: 19, color: C.goldHi, lineHeight: 1.2}}>{s.tag}</div>
              ) : null}
            </div>
          );
        })}
        {flowLabel ? (
          <div style={{position: 'absolute', left: colW / 2, top: lineY - 196, fontFamily: F.mono, fontSize: 20, letterSpacing: '0.2em', color: G, opacity: prog(frame, 30, 20)}}>{flowLabel}</div>
        ) : null}
      </div>
    </Panel>
  );
};

/**
 * Data-centre cross-section: power path (gold) from the grid through transformer, switchgear and UPS into the racks;
 * heat path (red → blue) out through the liquid-cooling loop to chillers on the roof. Supplier callouts per system.
 */
export const DataCentre: React.FC<Common & {callouts: {x: number; y: number; label: string; who: string; at?: number}[]}> = ({callouts, ...p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (s: number, d = 18) => prog(frame, s, d);
  const dash = -frame * 3;
  const racks = Array.from({length: 6}, (_, i) => i);
  return (
    <Panel {...p}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1700, height: 720}}>
        <svg width={1700} height={720} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {/* ground */}
          <path d="M0 640 L1700 640" stroke={C.navyLine} strokeWidth={3} />
          {/* building shell */}
          <g opacity={t(0, 20)}>
            <rect x={520} y={250} width={1060} height={390} fill="rgba(16,35,59,0.55)" stroke={C.muted} strokeWidth={2} />
            <path d="M520 250 L1580 250" stroke={C.muted} strokeWidth={4} />
          </g>
          {/* grid feed: pylon + transformer + switchgear outside */}
          <g transform="translate(20 490) scale(1)" opacity={t(4)}>
            <Icon kind="pylon" />
          </g>
          <g transform="translate(200 530)" opacity={t(10)}>
            <Icon kind="transformer" />
          </g>
          <g transform="translate(360 530)" opacity={t(16)}>
            <Icon kind="switchgear" />
          </g>
          {/* UPS / batteries */}
          <g opacity={t(22)}>
            <rect x={560} y={480} width={150} height={150} fill="none" stroke={G} strokeWidth={3} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={575 + i * 45} y={505} width={32} height={100} fill="none" stroke={G} strokeWidth={2} opacity={0.7} />
            ))}
          </g>
          {/* racks */}
          {racks.map((i) => {
            const a = t(28 + i * 4, 14);
            const glow = 0.55 + 0.45 * Math.sin((frame + i * 9) / 6);
            return (
              <g key={i} opacity={a}>
                <rect x={780 + i * 120} y={400} width={84} height={230} fill="rgba(5,7,10,0.85)" stroke={C.off} strokeWidth={2} />
                {Array.from({length: 9}, (_, k) => (
                  <rect key={k} x={792 + i * 120} y={414 + k * 24} width={60} height={14} fill="none" stroke={C.muted} strokeWidth={1.5} />
                ))}
                {Array.from({length: 9}, (_, k) => (
                  <circle key={k} cx={858 + i * 120} cy={421 + k * 24} r={2.5} fill={k % 3 === 0 ? C.goldHi : '#5FB0FF'} opacity={glow} />
                ))}
              </g>
            );
          })}
          {/* power path */}
          <path d="M95 530 L95 600 L225 600 L225 590 M330 590 L380 590 M500 590 L560 590 M710 560 L780 560 L1500 560"
            fill="none" stroke={G} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={dash} opacity={t(40, 20)} />
          {/* cooling loop: hot (red) up from racks to roof chillers, cold (blue) back down */}
          <path d="M1490 400 L1490 300 L1510 300 L1510 190" fill="none" stroke="#D2553F" strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={dash} opacity={t(56, 20)} />
          <path d="M1390 190 L1390 300 L780 300 L780 400" fill="none" stroke="#4FA3E8" strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={dash} opacity={t(60, 20)} />
          {/* roof chillers */}
          <g opacity={t(52)}>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={1360 + i * 0} y={120 + 0} width={180} height={70} fill="none" stroke={C.off} strokeWidth={2} />
                <circle cx={1400 + i * 50} cy={155} r={20} fill="none" stroke={C.off} strokeWidth={2} />
                <path d={`M${1400 + i * 50} 135 L${1400 + i * 50} 175 M${1380 + i * 50} 155 L${1420 + i * 50} 155`} stroke={C.off} strokeWidth={2}
                  transform={`rotate(${frame * 12} ${1400 + i * 50} 155)`} />
              </g>
            ))}
          </g>
        </svg>
        {callouts.map((c, i) => {
          const a = pop(frame, fps, c.at ?? 30 + i * 12);
          return (
            <div key={c.label} style={{position: 'absolute', left: c.x, top: c.y, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, maxWidth: 330}}>
              <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: '0.12em', color: C.gold, textTransform: 'uppercase'}}>{c.label}</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 27, color: C.off, lineHeight: 1.15, marginTop: 4}}>{c.who}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 40, top: 20, display: 'flex', gap: 34, fontFamily: F.mono, fontSize: 20, color: C.off, opacity: t(60, 20)}}>
          <span><span style={{display: 'inline-block', width: 34, height: 5, background: G, verticalAlign: 'middle', marginRight: 10}} />POWER</span>
          <span><span style={{display: 'inline-block', width: 34, height: 5, background: '#D2553F', verticalAlign: 'middle', marginRight: 10}} />HEAT</span>
          <span><span style={{display: 'inline-block', width: 34, height: 5, background: '#4FA3E8', verticalAlign: 'middle', marginRight: 10}} />COOLANT</span>
        </div>
      </div>
    </Panel>
  );
};
