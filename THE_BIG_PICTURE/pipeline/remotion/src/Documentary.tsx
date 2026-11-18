import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './brand';
import type {Timeline, Shot, Overlay} from './types';
import {Finish, MediaLayer, XFade} from './components/Media';
import {Bug, CaptionLine, ChapterCard, CornerStat, LowerThird, SourceTag} from './components/Overlays';
import {DataCentre, PowerChain} from './graphics/Infra';
import {BarChart, BigStat, ColumnChart, Matrix, Quote, RangeBars} from './graphics/Charts';
import {EndCard, Flow, TitleCard, ValueChain} from './graphics/Diagrams';

// Registry: storyboard component names → React components. Add new graphics here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REG: Record<string, React.FC<any>> = {
  ValueChain,
  Flow,
  BarChart,
  ColumnChart,
  BigStat,
  RangeBars,
  Matrix,
  Quote,
  TitleCard,
  EndCard,
  LowerThird,
  ChapterCard,
  CornerStat,
  Bug,
  SourceTag,
  DataCentre,
  PowerChain,
};

const ShotView: React.FC<{s: Shot}> = ({s}) => {
  if (s.type === 'graphic') {
    const G = REG[s.component];
    if (!G) throw new Error(`Unknown graphic component "${s.component}" in shot ${s.id}`);
    return (
      <XFade frames={s.xfade}>
        {s.bg ? <MediaLayer src={s.bg} kind="footage" dur={s.dur} startFrom={s.bgStartFrom} dim={0.25} /> : null}
        <G {...s.props} dur={s.dur} transparent={Boolean(s.bg)} />
        <Finish />
      </XFade>
    );
  }
  return (
    <XFade frames={s.xfade}>
      <MediaLayer src={s.src} kind={s.type} dur={s.dur} startFrom={s.startFrom} motion={s.motion} dim={s.dim} />
      <Finish letterbox={s.letterbox} />
    </XFade>
  );
};

const OverlayView: React.FC<{o: Overlay}> = ({o}) => {
  const G = REG[o.component];
  if (!G) throw new Error(`Unknown overlay component "${o.component}" in ${o.id}`);
  return <G {...o.props} dur={o.dur} />;
};

export const Documentary: React.FC<{timeline: Timeline}> = ({timeline}) => {
  return (
    <AbsoluteFill style={{backgroundColor: C.black}}>
      {timeline.shots.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <ShotView s={s} />
        </Sequence>
      ))}
      {timeline.overlays.map((o) => (
        <Sequence key={o.id} from={o.from} durationInFrames={o.dur} name={o.id}>
          <OverlayView o={o} />
        </Sequence>
      ))}
      {timeline.showCaptions
        ? timeline.captions.map((c, i) => (
            <Sequence key={`cap${i}`} from={c.from} durationInFrames={c.dur}>
              <CaptionLine text={c.text} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
