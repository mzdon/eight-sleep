import React, {useEffect} from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {G, Path, PathProps, Svg} from 'react-native-svg';
import {
  CurveFactory,
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
import {mixPath, parse} from 'react-native-redash';

export interface DataPoint {
  ts: number;
  value: number;
}

export interface LineChartProps {
  height?: number;
  width?: number;
  data: DataPoint[][];
  colors?: string[];
  drawExtras?: (scales: Scales) => JSX.Element[];
  curveFactory?: CurveFactory;
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

const getMinMax = (data: DataPoint[][]): MinMaxes => {
  const allData = [...data.flat()];
  const allTs = [...allData.map(d => d.ts)];
  const minX = Math.min(...allTs);
  const maxX = Math.max(...allTs);
  const allVal = [...allData.map(d => d.value)];
  const minY = Math.min(...allVal);
  const maxY = Math.max(...allVal);
  return {
    minX,
    maxX,
    minY,
    maxY,
  };
};

const getScales = (minMax: MinMaxes, height: number, width: number) => {
  const {minX, maxX, minY, maxY} = minMax;
  const y = scaleLinear()
    .domain([minY, maxY])
    .range([height - PADDING * 3, PADDING * 2]);

  const x = scaleTime()
    .domain([new Date(minX), new Date(maxX)])
    .range([PADDING * 4, width - PADDING * 2]);

  return {x, y, height, width};
};

const makeCurve = (
  data: DataPoint[],
  scales: Scales,
  curveFactory: CurveFactory,
): string => {
  const {x, y} = scales;
  const curvedLine = line<DataPoint>()
    .x(d => x(new Date(d.ts)))
    .y(d => y(d.value))
    .curve(curveFactory)(data);

  return curvedLine!;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Curve = ({d, ...rest}: Omit<PathProps, 'd'> & {d: string}) => {
  const p1 = useSharedValue(parse(d));
  const p2 = useSharedValue(parse(d));
  const animComplete = useSharedValue(true);
  const progress = useSharedValue(1);
  const a = useAnimatedProps(() => {
    return {
      d: mixPath(progress.value, p2.value, p1.value),
    };
  });
  useEffect(() => {
    if (animComplete.value) {
      animComplete.value = false;
      progress.value = 0;
      p1.value = parse(d);
      if (p2.value.curves.length !== p1.value.curves.length) {
        if (p2.value.curves.length > p1.value.curves.length) {
          p2.value = {
            ...p2.value,
            curves: p2.value.curves.slice(0, p1.value.curves.length - 1),
          };
        } else {
          p1.value = {
            ...p1.value,
            curves: p1.value.curves.slice(0, p2.value.curves.length - 1),
          };
        }
      }
      progress.value = withTiming(1, {}, () => {
        p2.value = p1.value;
        animComplete.value = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);
  return <AnimatedPath animatedProps={a} {...rest} />;
};

const LineChart = ({
  height = 200,
  width = 200,
  data,
  colors,
  drawExtras,
  curveFactory = curveNatural,
}: LineChartProps) => {
  const {colors: themeColors} = useTheme();
  const minMaxes = getMinMax(data);
  const scales = getScales(minMaxes, height, width);
  const curves = data.map(d => makeCurve(d, scales, curveFactory));
  return (
    <Animated.View>
      <Svg width={width} height={height}>
        <G y={-PADDING}>
          {!!drawExtras && drawExtras(scales)}
          {curves.map((curve, i) => (
            <Curve
              key={`curve-${width}-${i}`}
              d={curve}
              strokeWidth="2"
              stroke={colors ? colors[i] : themeColors.primary}
              fill={'none'}
            />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
};

export default withAdaptiveView(LineChart);
