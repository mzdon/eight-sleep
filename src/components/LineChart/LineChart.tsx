import React, {useCallback, useEffect, useState} from 'react';
import {GestureResponderEvent} from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Circle, G, Path, PathProps, Svg} from 'react-native-svg';
import {mixPath, parse, serialize} from 'react-native-redash';
import {CurveFactory, curveNatural, line, scaleLinear, scaleTime} from 'd3';
import {PADDING} from '../../theme';
import {useTheme} from 'react-native-paper';
import {withAdaptiveView} from '../hoc';
import {DataPoint, MinMaxes, Scales, TooltipData} from './types';
import {getGraphHeight, getGraphWidth, throttle} from '../../utils';

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

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Curve = ({d, ...rest}: Omit<PathProps, 'd'> & {d: string}) => {
  const p1 = useSharedValue(parse(d));
  const p2 = useSharedValue(parse(d));
  const animComplete = useSharedValue(true);
  const progress = useSharedValue(1);
  const a = useAnimatedProps(() => {
    let nextD = serialize(p1.value);
    if (p2.value.curves.length <= p1.value.curves.length) {
      nextD = mixPath(progress.value, p2.value, p1.value);
    }
    return {
      d: nextD,
    };
  });
  useEffect(() => {
    if (animComplete.value) {
      animComplete.value = false;
      progress.value = 0;
      p1.value = parse(d);
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
  height = getGraphHeight(),
  width = getGraphWidth(),
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
  const handleTooltipGesutre = useCallback(
    (eventX: number) => {
      const nearestData = data.map((d, i) =>
        d.reduce(
          (curr, next) => {
            const currX = scales.x(curr.data.ts);
            const nextX = scales.x(next.ts);
            if (Math.abs(eventX - currX) > Math.abs(eventX - nextX)) {
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
  const showTooltip = useCallback(
    (event: GestureResponderEvent) => {
      if (!drawTooltip) {
        return false;
      }
      const {locationX} = event.nativeEvent;
      handleTooltipGesutre(locationX);
      return true;
    },
    [drawTooltip, handleTooltipGesutre],
  );
  const hideTooltip = useCallback(() => setTooltipData(null), []);
  const updateTooltip = useCallback(
    (event: GestureResponderEvent) => {
      const throttledFn = throttle((e: GestureResponderEvent) => {
        handleTooltipGesutre(e.nativeEvent.locationX);
      }, 500);
      throttledFn(event);
    },
    [handleTooltipGesutre],
  );

  return (
    <Animated.View>
      <Svg
        width={width}
        height={height}
        onStartShouldSetResponder={showTooltip}
        onResponderMove={updateTooltip}
        onResponderRelease={hideTooltip}
        onResponderTerminate={hideTooltip}>
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
                r={4}
              />
            )),
          )}
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
