import React from 'react';
import {BarChart as RnckBarChart} from 'react-native-chart-kit';
import {useChartConfig} from '../theme';
import {getGraphHeight, getGraphWidth} from '../utils';
import {withAdaptiveView} from './hoc';

export interface BarChartProps {
  data: RnckBarChart['props']['data'];
  yAxisLabel: string;
  yAxisSuffix: string;
  width?: number;
  height?: number;
}

const BarChart = ({
  data,
  yAxisLabel,
  yAxisSuffix,
  width = getGraphWidth(),
  height = getGraphHeight(),
}: BarChartProps) => {
  const config = useChartConfig();
  return (
    <RnckBarChart
      data={data}
      width={width}
      height={height}
      chartConfig={config}
      yAxisLabel={yAxisLabel}
      yAxisSuffix={yAxisSuffix}
    />
  );
};

export default withAdaptiveView(BarChart);
