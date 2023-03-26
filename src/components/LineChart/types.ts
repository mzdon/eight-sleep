import {ScaleLinear, ScaleTime} from 'd3';

export interface DataPoint {
  ts: number;
  value: number;
}

export interface MinMaxes {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Scales {
  x: ScaleTime<number, number, never>;
  y: ScaleLinear<number, number, never>;
  height: number;
  width: number;
}

export interface TooltipData {
  color: string;
  data: DataPoint;
  format?: (d: number) => string | null;
}
