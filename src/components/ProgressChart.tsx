import React from 'react';
import {ProgressChart as RnckProgressChart} from 'react-native-chart-kit';
import {useChartConfig} from '../theme';
import {withAdaptiveView} from './hoc';

export interface ProgressChartProps {
  data: RnckProgressChart['props']['data'];
  width?: number;
  height?: number;
}

const ProgressChart = ({
  data,
  width = 200,
  height = 100,
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
