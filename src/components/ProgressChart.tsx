import React from 'react';
import {ProgressChart as RnckProgressChart} from 'react-native-chart-kit';
import {useChartConfig} from '../theme';
import {getGraphHeight, getGraphWidth} from '../utils';
import {withAdaptiveView} from './hoc';

export interface ProgressChartProps {
  data: RnckProgressChart['props']['data'];
  width?: number;
  height?: number;
}

const ProgressChart = ({
  data,
  width = getGraphWidth(),
  height = getGraphHeight(),
}: ProgressChartProps) => {
  const config = useChartConfig();
  return (
    <RnckProgressChart
      data={data}
      width={width}
      height={height}
      chartConfig={config}
    />
  );
};

export default withAdaptiveView(ProgressChart);
