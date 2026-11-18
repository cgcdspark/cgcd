import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE} from '../brand';
import {outro, pop, prog} from '../anim';
import {Panel} from './Panel';

type Common = {kicker?: string; title?: string; dur: number; transparent?: boolean};
const A = C.gold; // accent (signal red in palette A)

/** Kinetic typography: one to three short lines slammed in, accent word in red. Use for beats like "GONE." */
export const BigWords: React.FC<{lines: string[]; accent?: string; dur: number; sub?: string}> = ({lines, accent, dur, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = outro(frame, dur, 10);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.navy2} 0%, ${C.navy} 45%, ${C.black} 100%)`, justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center'}}>
        {lines.map((l, i) => {
          const s = i === 0 ? Math.max(0.55, pop(frame, fps, 0)) : pop(frame, fps, 2 + i * 8);
          return (
            <div key={i} style={{fontFamily: F.head, fontWeight: 800, fontSize: lines.length > 2 ? 120 : 170, lineHeight: 0.95, letterSpacing: '-0.035em', color: accent && l.includes(accent) ? A : C.off, opacity: s, transform: `scale(${1.08 - 0.08 * s})`}}>
              {l}
            </div>
          );
        })}
        {sub ? <div style={{fontFamily: F.mono, fontSize: 28, letterSpacing: '0.3em', color: C.muted, marginTop: 34, opacity: prog(frame, 20, 15)}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** A dark email window; body lines type on, one line highlighted in the accent colour. */
export const EmailReveal: React.FC<Common & {from: string; to: string; subject: string; date: string; lines: string[]; highlight?: number}> = ({from, to, subject, date, lines, highlight, dur}) => {
  const frame = useCurrentFrame();
  const o = outro(frame, dur, 12);
  const box = prog(frame, 0, 18);
  let budget = Math.max(0, (frame - 22) * 1.6); // characters revealed
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.navy2}, ${C.black} 75%)`, justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{width: 1340, background: '#141619', border: `1px solid ${C.navyLine}`, boxShadow: '0 40px 120px rgba(0,0,0,.6)', opacity: box, transform: `translateY(${(1 - box) * 30}px) scale(${0.97 + 0.03 * box})`}}>
        <div style={{display: 'flex', gap: 10, padding: '16px 22px', borderBottom: `1px solid ${C.navyLine}`}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: '#2E3238'}} />
          ))}
        </div>
        <div style={{padding: '26px 44px', borderBottom: `1px solid ${C.navyLine}`, fontFamily: F.body, fontSize: 26, color: C.muted, lineHeight: 1.7}}>
          <div><span style={{color: C.off}}>From:</span> {from}</div>
          <div><span style={{color: C.off}}>To:</span> {to}</div>
          <div><span style={{color: C.off}}>Date:</span> {date}</div>
          <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 40, color: C.off, marginTop: 8}}>{subject}</div>
        </div>
        <div style={{padding: '34px 44px 44px', minHeight: 260}}>
          {lines.map((l, i) => {
            const n = Math.min(l.length, Math.floor(budget));
            budget -= l.length + 8;
            const hi = highlight === i;
            return (
              <div key={i} style={{fontFamily: F.body, fontSize: hi ? 50 : 34, fontWeight: hi ? 600 : 400, color: hi ? C.off : '#B9BEC6', lineHeight: 1.35, marginBottom: 18, background: hi && n === l.length ? `linear-gradient(transparent 62%, ${A}66 62%)` : 'none', display: 'inline-block'}}>
                {l.slice(0, n)}
                {n > 0 && n < l.length ? <span style={{color: A}}>▍</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Stylised regulatory filing page with one sentence marked in red. Not a facsimile: a typographic recreation. */
export const DocumentCard: React.FC<Common & {header: string; meta: string; paragraphs: string[]; mark?: number}> = ({header, meta, paragraphs, mark, dur}) => {
  const frame = useCurrentFrame();
  const o = outro(frame, dur, 12);
  const a = prog(frame, 0, 20);
  const m = prog(frame, 28, 26);
  const push = interpolate(frame, [0, dur], [1, 1.06]);
  return (
    <AbsoluteFill style={{background: C.black, justifyContent: 'center', alignItems: 'center', opacity: o, overflow: 'hidden'}}>
      <div style={{width: 1300, background: '#ECEAE4', color: '#16181B', padding: '64px 84px', transform: `scale(${push}) rotate(-1.2deg)`, opacity: a, boxShadow: '0 50px 140px rgba(0,0,0,.7)'}}>
        <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.2em', color: '#55595F'}}>{meta}</div>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 64, margin: '14px 0 30px'}}>{header}</div>
        {paragraphs.map((p, i) => (
          <div key={i} style={{fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 33, lineHeight: 1.55, marginBottom: 24, position: 'relative'}}>
            {mark === i ? (
              <span style={{backgroundImage: `linear-gradient(${A}55, ${A}55)`, backgroundRepeat: 'no-repeat', backgroundSize: `${m * 100}% 100%`, backgroundPosition: '0 0', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', padding: '0 4px'}}>{p}</span>
            ) : (
              <span style={{opacity: 0.55}}>{p}</span>
            )}
          </div>
        ))}
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Case-file timeline: dated cards stack up; the newest one is lit. Re-used beat by beat with a growing `upTo`. */
export const CaseTimeline: React.FC<Common & {entries: {date: string; text: string}[]; upTo: number}> = ({entries, upTo, dur}) => {
  const frame = useCurrentFrame();
  const o = outro(frame, dur, 10);
  const shown = entries.slice(0, upTo + 1);
  const visible = shown.slice(-5);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.navy}, ${C.black})`, opacity: o}}>
      <AbsoluteFill style={{opacity: 0.18, backgroundImage: `linear-gradient(${C.navyLine} 1px, transparent 1px), linear-gradient(90deg, ${C.navyLine} 1px, transparent 1px)`, backgroundSize: '60px 60px'}} />
      <div style={{position: 'absolute', left: SAFE.x, top: SAFE.y, fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: A}}>CASE FILE · FIFTEEN DAYS</div>
      <div style={{position: 'absolute', left: SAFE.x + 30, top: 190, bottom: 120, width: 3, background: C.navyLine}} />
      <div style={{position: 'absolute', left: SAFE.x, top: 170, right: SAFE.x, display: 'flex', flexDirection: 'column', gap: 26}}>
        {visible.map((e, i) => {
          const isNew = i === visible.length - 1;
          const s = isNew ? prog(frame, 2, 14) : 1;
          return (
            <div key={e.date + e.text} style={{display: 'grid', gridTemplateColumns: '64px 330px 1fr', alignItems: 'center', opacity: isNew ? s : 0.42, transform: `translateX(${(1 - s) * 40}px)`}}>
              <div style={{width: 22, height: 22, borderRadius: 11, marginLeft: 20, background: isNew ? A : C.navyLine, boxShadow: isNew ? `0 0 26px ${A}` : 'none'}} />
              <div style={{fontFamily: F.mono, fontSize: isNew ? 40 : 30, color: isNew ? A : C.muted, letterSpacing: '0.04em'}}>{e.date}</div>
              <div style={{fontFamily: F.head, fontWeight: isNew ? 800 : 600, fontSize: isNew ? 50 : 34, color: C.off, lineHeight: 1.12}}>{e.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Horizontal history timeline 1993 → 2026 with milestone labels drawing on. */
export const HistoryTimeline: React.FC<Common & {start: number; end: number; points: {year: number; label: string; up?: boolean; hot?: boolean}[]}> = ({start, end, points, kicker, title, dur}) => {
  const frame = useCurrentFrame();
  const W = 1640;
  const x = (y: number) => ((y - start) / (end - start)) * W;
  const draw = prog(frame, 6, 60);
  return (
    <Panel kicker={kicker} title={title} dur={dur}>
      <div style={{position: 'absolute', left: 20, top: 330, width: W, height: 4, background: C.navyLine}} />
      <div style={{position: 'absolute', left: 20, top: 330, width: W * draw, height: 4, background: A}} />
      {points.map((p, i) => {
        const t = (p.year - start) / (end - start);
        const a = draw >= t ? prog(frame, 6 + t * 60, 12) : 0;
        const up = p.up ?? i % 2 === 0;
        return (
          <div key={i} style={{position: 'absolute', left: 20 + x(p.year) - 110, width: 220, top: up ? 130 : 352, height: 190, display: 'flex', flexDirection: up ? 'column-reverse' : 'column', alignItems: 'center', opacity: a}}>
            <div style={{width: 2, height: 46, background: p.hot ? A : C.muted}} />
            <div style={{fontFamily: F.mono, fontSize: 26, color: p.hot ? A : C.off, margin: '8px 0'}}>{p.year}</div>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 25, color: C.off, textAlign: 'center', lineHeight: 1.15}}>{p.label}</div>
          </div>
        );
      })}
    </Panel>
  );
};

/** Abstract region map from lon/lat: graticule, glowing city nodes, animated links. */
export const RegionMap: React.FC<Common & {nodes: {id: string; name: string; lon: number; lat: number; hot?: boolean; left?: boolean}[]; links: {from: string; to: string; label?: string; dashed?: boolean}[]; bbox: [number, number, number, number]}> = ({nodes, links, bbox, kicker, title, dur}) => {
  const frame = useCurrentFrame();
  const [lon0, lat0, lon1, lat1] = bbox;
  const W = 1700;
  const H = 760;
  const px = (lon: number) => ((lon - lon0) / (lon1 - lon0)) * W;
  const py = (lat: number) => ((lat1 - lat) / (lat1 - lat0)) * H;
  const by = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <Panel kicker={kicker} title={title} dur={dur}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: -40, overflow: 'visible'}}>
        {Array.from({length: Math.floor((lon1 - lon0) / 5) + 1}, (_, i) => lon0 + i * 5).map((l) => (
          <line key={'x' + l} x1={px(l)} x2={px(l)} y1={0} y2={H} stroke={C.navyLine} strokeWidth={1} opacity={0.6} />
        ))}
        {Array.from({length: Math.floor((lat1 - lat0) / 5) + 1}, (_, i) => lat0 + i * 5).map((l) => (
          <line key={'y' + l} y1={py(l)} y2={py(l)} x1={0} x2={W} stroke={C.navyLine} strokeWidth={1} opacity={0.6} />
        ))}
        {links.map((l, i) => {
          const a = by[l.from];
          const b = by[l.to];
          const t = prog(frame, 20 + i * 14, 24);
          const x1 = px(a.lon), y1 = py(a.lat), x2 = px(b.lon), y2 = py(b.lat);
          const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 80;
          const path = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
          return (
            <g key={i} opacity={t}>
              <path d={path} fill="none" stroke={l.dashed ? C.muted : A} strokeWidth={3} strokeDasharray={l.dashed ? '10 12' : '0'} pathLength={1} style={{strokeDasharray: l.dashed ? '0.02 0.025' : `${t} 1`}} />
              {l.label ? (
                <text x={mx} y={my + 24} fill={l.dashed ? C.muted : C.off} fontFamily={F.mono} fontSize={22} textAnchor="middle">{l.label}</text>
              ) : null}
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const a = prog(frame, 4 + i * 6, 14);
          const pulse = 1 + 0.5 * ((frame / 30 + i * 0.3) % 1);
          return (
            <g key={n.id} opacity={a} transform={`translate(${px(n.lon)}, ${py(n.lat)})`}>
              {n.hot ? <circle r={18 * pulse} fill="none" stroke={A} strokeWidth={2} opacity={2 - pulse} /> : null}
              <circle r={9} fill={n.hot ? A : C.off} />
              <text x={n.left ? -20 : 20} y={10} fill={C.off} fontFamily={F.head} fontWeight={700} fontSize={40} textAnchor={n.left ? 'end' : 'start'}>{n.name}</text>
            </g>
          );
        })}
      </svg>
    </Panel>
  );
};

/** Two columns: what is alleged/reported vs what is established. */
export const AllegedVsKnown: React.FC<Common & {left: string[]; right: string[]; leftTitle?: string; rightTitle?: string}> = ({left, right, leftTitle = 'REPORTED / ALLEGED', rightTitle = 'ON THE RECORD', kicker, title, dur}) => {
  const frame = useCurrentFrame();
  const col = (items: string[], start: number, hot: boolean) =>
    items.map((t, i) => {
      const a = prog(frame, start + i * 16, 14);
      return (
        <div key={i} style={{display: 'flex', gap: 18, alignItems: 'baseline', opacity: a, transform: `translateY(${(1 - a) * 12}px)`, marginBottom: 26}}>
          <span style={{width: 14, height: 14, flex: '0 0 14px', background: hot ? A : C.off, transform: 'translateY(-4px)'}} />
          <span style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.off, lineHeight: 1.2}}>{t}</span>
        </div>
      );
    });
  return (
    <Panel kicker={kicker} title={title} dur={dur}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 30}}>
        <div>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.25em', color: A, borderBottom: `2px solid ${A}`, paddingBottom: 12, marginBottom: 30}}>{leftTitle}</div>
          {col(left, 10, true)}
        </div>
        <div>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.25em', color: C.off, borderBottom: `2px solid ${C.off}`, paddingBottom: 12, marginBottom: 30}}>{rightTitle}</div>
          {col(right, 10 + left.length * 16, false)}
        </div>
      </div>
    </Panel>
  );
};

/** Three scenario paths branching from one point. */
export const ScenarioTree: React.FC<Common & {paths: {name: string; line: string}[]; focus?: number}> = ({paths, focus, kicker, title, dur}) => {
  const frame = useCurrentFrame();
  const ys = [140, 340, 540];
  return (
    <Panel kicker={kicker} title={title} dur={dur}>
      <svg width={1700} height={700} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={80} cy={340} r={14} fill={A} />
        {paths.map((p, i) => {
          const t = prog(frame, 8 + i * 12, 26);
          const on = focus === undefined || focus === i;
          return <path key={i} d={`M80,340 C300,340 300,${ys[i]} 560,${ys[i]}`} fill="none" stroke={on ? A : C.navyLine} strokeWidth={on ? 5 : 3} pathLength={1} style={{strokeDasharray: `${t} 1`}} />;
        })}
      </svg>
      {paths.map((p, i) => {
        const a = prog(frame, 22 + i * 12, 16);
        const on = focus === undefined || focus === i;
        return (
          <div key={i} style={{position: 'absolute', left: 600, top: ys[i] - 60, width: 1080, opacity: a * (on ? 1 : 0.35)}}>
            <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.2em', color: A}}>SCENARIO {i + 1}</div>
            <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 52, color: C.off, lineHeight: 1.05}}>{p.name}</div>
            <div style={{fontFamily: F.body, fontSize: 28, color: C.muted, marginTop: 6}}>{p.line}</div>
          </div>
        );
      })}
    </Panel>
  );
};

/** Line chart with event markers (e.g. share price through the scandal). */
export const EventLine: React.FC<Common & {points: {label: string; value: number}[]; events: {index: number; text: string}[]; min: number; max: number; unit: string; note?: string}> = ({points, events, min, max, unit, note, kicker, title, dur}) => {
  const frame = useCurrentFrame();
  const W = 1560, H = 520, X0 = 110;
  const x = (i: number) => X0 + (i / (points.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * H;
  const t = prog(frame, 8, 70);
  const n = Math.max(2, Math.ceil(t * points.length));
  const d = points.slice(0, n).map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  const ticks = [min, (min + max) / 2, max];
  return (
    <Panel kicker={kicker} title={title} dur={dur}>
      <svg width={1720} height={640} style={{position: 'absolute', left: 0, top: 10, overflow: 'visible'}}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={X0} x2={X0 + W} y1={y(v)} y2={y(v)} stroke={C.navyLine} strokeWidth={1} />
            <text x={X0 - 16} y={y(v) + 8} fill={C.muted} fontFamily={F.mono} fontSize={22} textAnchor="end">{unit}{Math.round(v)}</text>
          </g>
        ))}
        <path d={`${d} L${x(n - 1)},${H} L${X0},${H} Z`} fill={A} opacity={0.12} />
        <path d={d} fill="none" stroke={A} strokeWidth={5} strokeLinejoin="round" />
        {points.map((p, i) =>
          i < n ? (
            <g key={i}>
              <circle cx={x(i)} cy={y(p.value)} r={i === n - 1 ? 9 : 5} fill={i === n - 1 ? C.off : A} />
              <text x={x(i)} y={H + 40} fill={C.muted} fontFamily={F.mono} fontSize={19} textAnchor="middle">{p.label}</text>
            </g>
          ) : null,
        )}
        {events.map((e, k) =>
          e.index < n ? (
            <g key={k} opacity={prog(frame, 8 + (e.index / points.length) * 70, 12)}>
              <line x1={x(e.index)} x2={x(e.index)} y1={y(points[e.index].value) - 18} y2={y(points[e.index].value) - 70 - (k % 2) * 60} stroke={C.off} strokeWidth={1.5} />
              <text x={x(e.index)} y={y(points[e.index].value) - 80 - (k % 2) * 60} fill={C.off} fontFamily={F.head} fontWeight={700} fontSize={24} textAnchor="middle">{e.text}</text>
            </g>
          ) : null,
        )}
        <text x={x(points.length - 1)} y={y(points[points.length - 1].value) + 44} fill={C.off} fontFamily={F.head} fontWeight={800} fontSize={40} textAnchor="end" opacity={t > 0.98 ? 1 : 0}>
          {unit}{points[points.length - 1].value.toFixed(2)}
        </text>
      </svg>
      {note ? <div style={{position: 'absolute', left: X0, top: 640, fontFamily: F.mono, fontSize: 22, color: C.muted}}>{note}</div> : null}
    </Panel>
  );
};
