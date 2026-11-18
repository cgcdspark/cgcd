export type Motion = 'none' | 'push' | 'pull' | 'driftL' | 'driftR';

export type FootageShot = {
  id: string;
  type: 'footage';
  from: number; // frame on the master timeline
  dur: number; // frames
  src: string; // path under public/, already graded + conformed to 1920x1080/25fps by prep_footage.py
  startFrom?: number; // frames into the clip
  motion?: Motion;
  xfade?: number; // frames of dissolve INTO this shot (overlaps the previous shot)
  letterbox?: boolean;
  dim?: number; // 0..1 extra darkening (used under text)
};

export type StillShot = Omit<FootageShot, 'type'> & {type: 'still'};

export type GraphicShot = {
  id: string;
  type: 'graphic';
  from: number;
  dur: number;
  component: string;
  props: Record<string, unknown>;
  bg?: string; // optional footage under the graphic (darkened)
  bgStartFrom?: number;
  xfade?: number;
};

export type Shot = FootageShot | StillShot | GraphicShot;

export type Overlay = {
  id: string;
  from: number;
  dur: number;
  component: string;
  props: Record<string, unknown>;
};

export type Caption = {from: number; dur: number; text: string};

export type Timeline = {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  shots: Shot[];
  overlays: Overlay[];
  captions: Caption[];
  showCaptions: boolean;
};
