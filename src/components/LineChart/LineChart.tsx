import React from 'react';
import Animated from 'react-native-reanimated';
import {G, Path, Svg} from 'react-native-svg';
import {
  curveNatural,
  line,
  ScaleLinear,
  scaleLinear,
  ScaleTime,
  scaleTime,
} from 'd3';
import {PADDING} from '../../theme';
import {useTheme} from 'react-native-paper';
import {withAdaptiveView} from '../hoc';

export interface DataPoint {
  ts: number;
  value: number;
}

export interface LineChartProps {
  height?: number;
  width?: number;
  data: DataPoint[];
  drawExtras?: (scales: Scales) => JSX.Element[];
}

export interface Scales {
  x: ScaleTime<number, number, never>;
  y: ScaleLinear<number, number, never>;
  height: number;
  width: number;
}

const getScales = (data: DataPoint[], height: number, width: number) => {
  const max = Math.max(...data.map(val => val.value));
  const y = scaleLinear()
    .domain([0, max + 1])
    .range([height, 0]);

  const maxDate = Math.max(...data.map(val => val.ts));
  const minDate = Math.min(...data.map(val => val.ts));
  const x = scaleTime()
    .domain([new Date(minDate), new Date(maxDate)])
    .range([40, width - 10]);

  return {x, y, height, width};
};

const makeCurve = (data: DataPoint[], scales: Scales): string => {
  const {x, y} = scales;
  const curvedLine = line<DataPoint>()
    .x(d => x(new Date(d.ts)))
    .y(d => y(d.value))
    .curve(curveNatural)(data);

  return curvedLine!;
};

const LineChart = ({
  height = 200,
  width = 200,
  data,
  drawExtras,
}: LineChartProps) => {
  const {colors} = useTheme();
  const scales = getScales(data, height, width);
  const curve = makeCurve(data, scales);
  return (
    <Animated.View>
      <Svg width={width} height={height}>
        <G y={-PADDING}>
          {!!drawExtras && drawExtras(scales)}
          <Path
            key={'curve'}
            d={curve}
            strokeWidth="2"
            stroke={colors.primary}
            fill={'none'}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default withAdaptiveView(LineChart);
