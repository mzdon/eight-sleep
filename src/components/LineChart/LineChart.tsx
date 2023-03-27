import React, {useCallback, useState} from 'react';
import {Dimensions, GestureResponderEvent} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import {Circle, G, Path, PathProps, Svg} from 'react-native-svg';
import {CurveFactory, curveNatural, line, scaleLinear, scaleTime} from 'd3';
import {PADDING} from '../../theme';
import {useTheme} from 'react-native-paper';
import {withAdaptiveView} from '../hoc';
import {DataPoint, MinMaxes, Scales, TooltipData} from './types';

export interface LineChartProps {
  height?: number;
  width?: number;
  data: DataPoint[][];
  colors?: string[];
  drawExtras?: (scales: Scales) => JSX.Element[];
  drawTooltip?: (
    tooltipData: TooltipData[] | null,
    scales: Scales,
  ) => JSX.Element;
  curveFactory?: CurveFactory;
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
    .range([height - PADDING * 3, PADDING * 3]);

  const x = scaleTime()
    .domain([new Date(minX), new Date(maxX)])
    .range([PADDING * 4, width - PADDING * 4]);

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

const noop = () => undefined;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Curve = ({d, ...rest}: PathProps) => {
  const animatedProps = useAnimatedProps(() => ({d}));
  return <AnimatedPath animatedProps={animatedProps} {...rest} />;
};

const LineChart = ({
  height = Dimensions.get('window').width * 0.7,
  width = Dimensions.get('window').width,
  data,
  colors,
  drawExtras,
  drawTooltip,
  curveFactory = curveNatural,
}: LineChartProps) => {
  const {colors: themeColors} = useTheme();
  const minMaxes = getMinMax(data);
  const scales = getScales(minMaxes, height, width);
  const curves = data.map(d => makeCurve(d, scales, curveFactory));

  // tooltip handling
  const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);
  const showTooltip = useCallback(
    (event: GestureResponderEvent) => {
      const {locationX} = event.nativeEvent;
      const nearestData = data.map((d, i) =>
        d.reduce(
          (curr, next) => {
            const currX = scales.x(curr.data.ts);
            const nextX = scales.x(next.ts);
            if (Math.abs(locationX - currX) > Math.abs(locationX - nextX)) {
              return {
                data: next,
                color: colors ? colors[i] : themeColors.primary,
              };
            }
            return curr;
          },
          {data: {value: 0, ts: 0}, color: ''} as TooltipData,
        ),
      );
      setTooltipData(nearestData);
    },
    [colors, data, scales, themeColors.primary],
  );
  const hideTooltip = useCallback(() => setTooltipData(null), []);

  return (
    <Animated.View>
      <Svg
        width={width}
        height={height}
        onPressIn={drawTooltip ? showTooltip : noop}
        onPressOut={drawTooltip ? hideTooltip : noop}>
        <G y={-PADDING}>
          {!!drawExtras && drawExtras(scales)}
          {!!drawTooltip && drawTooltip(tooltipData, scales)}
          {data.map((d, i) =>
            d.map(({ts, value}, j) => (
              <Circle
                key={`circle-${i}-${j}`}
                x={scales.x(ts)}
                y={scales.y(value)}
                fill={colors ? colors[i] : themeColors.primary}
                r={2}
              />
            )),
          )}
          {curves.map((curve, i) => (
            <Curve
              key={`curve-${i}`}
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
