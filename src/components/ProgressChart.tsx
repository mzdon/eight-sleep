import React from 'react';
import {Dimensions} from 'react-native';
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
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').width * 0.7,
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
