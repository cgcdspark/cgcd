import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, goldGradient} from '../brand';
import {fmtNum, pop, prog} from '../anim';
import {Panel} from './Panel';

type Common = {kicker?: string; title?: string; source?: string; dur: number; transparent?: boolean};

/** Horizontal bars. `display` overrides the printed value (e.g. "$88.1bn"). */
export const BarChart: React.FC<
  Common & {unit?: string; bars: {label: string; value: number; display?: string; highlight?: boolean; note?: string}[]; max?: number; stagger?: number}
> = ({bars, max, unit, stagger = 7, ...p}) => {
  const frame = useCurrentFrame();
  const m = max ?? Math.max(...bars.map((b) => b.value)) * 1.25;
  const rowH = Math.min(150, 600 / bars.length);
  return (
    <Panel {...p}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: rowH * 0.22, height: '100%', paddingBottom: 40}}>
        {bars.map((b, i) => {
          const a = prog(frame, 10 + i * stagger, 28);
          const w = (b.value / m) * 100 * a;
          return (
            <div key={b.label} style={{display: 'grid', gridTemplateColumns: '430px 1fr', alignItems: 'center', gap: 28, height: rowH * 0.78}}>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: Math.min(46, rowH * 0.4), color: b.highlight ? C.goldHi : C.off, textAlign: 'right', opacity: a}}>
                {b.label}
                {b.note ? <div style={{fontFamily: F.mono, fontWeight: 400, fontSize: 21, color: C.muted}}>{b.note}</div> : null}
              </div>
              <div style={{position: 'relative', height: '62%'}}>
                <div style={{position: 'absolute', inset: 0, width: `${w}%`, background: b.highlight ? goldGradient : `linear-gradient(90deg, ${C.navyLine}, #5B616B)`, borderRight: `3px solid ${b.highlight ? C.goldHi : C.muted}`}} />
                <div style={{position: 'absolute', left: `calc(${w}% + 18px)`, top: '50%', transform: 'translateY(-50%)', fontFamily: F.head, fontWeight: 800, fontSize: Math.min(52, rowH * 0.42), color: C.off, whiteSpace: 'nowrap', opacity: a}}>
                  {b.display ?? `${fmtNum(b.value * a, b.value % 1 ? 1 : 0)}${unit ?? ''}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

/** Vertical columns with optional projection styling (hatched) — e.g. TWh 2024 vs 2030. */
export const ColumnChart: React.FC<
  Common & {unit?: string; cols: {label: string; value: number; display?: string; projection?: boolean; highlight?: boolean}[]; max?: number}
> = ({cols, max, unit, ...p}) => {
  const frame = useCurrentFrame();
  const m = max ?? Math.max(...cols.map((c) => c.value)) * 1.1;
  const H = 560;
  return (
    <Panel {...p}>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: Math.max(40, 260 - cols.length * 30), height: H + 90, marginTop: 10}}>
        {cols.map((c, i) => {
          const a = prog(frame, 12 + i * 10, 32);
          const h = (c.value / m) * H * a;
          return (
            <div key={c.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: Math.min(220, 1400 / cols.length)}}>
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 54, color: c.highlight ? C.goldHi : C.off, marginBottom: 14, opacity: a}}>
                {c.display ?? `${fmtNum(c.value * a)}${unit ?? ''}`}
              </div>
              <div
                style={{
                  width: '100%',
                  height: h,
                  background: c.projection
                    ? `repeating-linear-gradient(135deg, ${C.gold}55 0 10px, transparent 10px 20px)`
                    : c.highlight
                      ? goldGradient
                      : `linear-gradient(180deg, #5B616B, ${C.navyLine})`,
                  border: c.projection ? `2px dashed ${C.gold}` : 'none',
                }}
              />
              <div style={{fontFamily: F.mono, fontSize: 26, color: C.off, marginTop: 16}}>{c.label}</div>
              {c.projection ? <div style={{fontFamily: F.mono, fontSize: 18, color: C.gold, marginTop: 4}}>PROJECTION</div> : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

/** One huge number counting up. */
export const BigStat: React.FC<
  Common & {value: number; decimals?: number; prefix?: string; suffix?: string; label: string; sublabel?: string}
> = ({value, decimals = 0, prefix = '', suffix = '', label, sublabel, ...p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = prog(frame, 6, 40);
  const s = pop(frame, fps, 4);
  return (
    <Panel {...p} transparent={p.transparent}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 230, letterSpacing: '-0.04em', lineHeight: 1, background: goldGradient, WebkitBackgroundClip: 'text', color: 'transparent', transform: `scale(${0.92 + 0.08 * s})`}}>
          {prefix}
          {fmtNum(value * a, decimals)}
          {suffix}
        </div>
        <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 52, color: C.off, marginTop: 26, textAlign: 'center', maxWidth: 1400, opacity: prog(frame, 18, 20)}}>{label}</div>
        {sublabel ? <div style={{fontFamily: F.body, fontSize: 32, color: C.muted, marginTop: 14, opacity: prog(frame, 26, 20)}}>{sublabel}</div> : null}
      </div>
    </Panel>
  );
};

/** Range bars: durations with min–max (e.g. lead times in years). */
export const RangeBars: React.FC<Common & {unit: string; max: number; rows: {label: string; min: number; max: number; display: string; highlight?: boolean}[]}> = ({rows, unit, max, ...p}) => {
  const frame = useCurrentFrame();
  return (
    <Panel {...p}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 60, height: '100%', paddingBottom: 40}}>
        {rows.map((r, i) => {
          const a = prog(frame, 10 + i * 12, 30);
          return (
            <div key={r.label} style={{display: 'grid', gridTemplateColumns: '520px 1fr 230px', alignItems: 'center', gap: 30}}>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: r.highlight ? C.goldHi : C.off, textAlign: 'right', opacity: a}}>{r.label}</div>
              <div style={{position: 'relative', height: 44, background: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${C.muted}`}}>
                <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(r.min / max) * 100 * a}%`, background: r.highlight ? goldGradient : '#5B616B'}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(r.min / max) * 100 * a}%`, width: `${((r.max - r.min) / max) * 100 * a}%`, background: r.highlight ? `repeating-linear-gradient(135deg, ${C.gold}aa 0 8px, transparent 8px 16px)` : 'repeating-linear-gradient(135deg, #5B616B 0 8px, transparent 8px 16px)'}} />
              </div>
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 42, color: C.off, opacity: a}}>{r.display}</div>
            </div>
          );
        })}
        <div style={{display: 'grid', gridTemplateColumns: '520px 1fr 230px', gap: 30}}>
          <div />
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 20, color: C.muted}}>
            {Array.from({length: max + 1}, (_, k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.muted}}>{unit}</div>
        </div>
      </div>
    </Panel>
  );
};

/** Comparison matrix for "who actually wins". Cells: text values; `rating` 0–3 draws gold pips. */
export const Matrix: React.FC<
  Common & {cols: string[]; rows: {name: string; sub?: string; cells: {text?: string; rating?: number; tone?: 'good' | 'bad' | 'neutral'}[]}[]}
> = ({cols, rows, ...p}) => {
  const frame = useCurrentFrame();
  const colW = Math.floor(1240 / cols.length);
  return (
    <Panel {...p}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingBottom: 30}}>
        <div style={{display: 'grid', gridTemplateColumns: `420px repeat(${cols.length}, ${colW}px)`, borderBottom: `2px solid ${C.gold}`, paddingBottom: 12}}>
          <div />
          {cols.map((c) => (
            <div key={c} style={{fontFamily: F.mono, fontSize: 21, color: C.gold, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center'}}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => {
          const a = prog(frame, 12 + i * 8, 22);
          return (
            <div key={r.name} style={{display: 'grid', gridTemplateColumns: `420px repeat(${cols.length}, ${colW}px)`, alignItems: 'center', minHeight: 104, borderBottom: `1px solid ${C.navyLine}`, opacity: a, transform: `translateX(${(1 - a) * -20}px)`}}>
              <div>
                <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.off}}>{r.name}</div>
                {r.sub ? <div style={{fontFamily: F.mono, fontSize: 18, color: C.muted}}>{r.sub}</div> : null}
              </div>
              {r.cells.map((cell, j) => (
                <div key={j} style={{textAlign: 'center', fontFamily: F.head, fontWeight: 700, fontSize: 34, color: cell.tone === 'good' ? C.goldHi : cell.tone === 'bad' ? C.red : C.off}}>
                  {cell.rating !== undefined ? (
                    <span style={{letterSpacing: 8}}>
                      {[0, 1, 2].map((k) => (
                        <span key={k} style={{display: 'inline-block', width: 20, height: 20, borderRadius: 10, margin: '0 4px', background: k < (cell.rating ?? 0) ? C.gold : 'transparent', border: `2px solid ${C.gold}`}} />
                      ))}
                    </span>
                  ) : (
                    cell.text
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

/** A verified quotation with attribution (only use quotes logged in the source sheet). */
export const Quote: React.FC<Common & {quote: string; who: string; role: string}> = ({quote, who, role, ...p}) => {
  const frame = useCurrentFrame();
  const words = quote.split(' ');
  const shown = Math.ceil(words.length * prog(frame, 8, Math.max(30, words.length * 2.2)));
  return (
    <Panel {...p}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px'}}>
        <div style={{fontFamily: F.head, fontSize: 200, lineHeight: 0.6, color: C.gold, height: 90}}>“</div>
        <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 64, lineHeight: 1.22, color: C.off, maxWidth: 1500}}>
          {words.map((w, i) => (
            <span key={i} style={{opacity: i < shown ? 1 : 0.12}}>{w} </span>
          ))}
        </div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.goldHi, marginTop: 40}}>{who}</div>
        <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, marginTop: 6}}>{role}</div>
      </div>
    </Panel>
  );
};
