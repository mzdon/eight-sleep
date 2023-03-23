import React from 'react';
import {PieChart as RnckPieChart} from 'react-native-chart-kit';
import {SPACING, useChartConfig} from '../theme';
import {withAdaptiveView} from './hoc';

export interface PieChartProps {
  data: RnckPieChart['props']['data'];
  accessor: string;
  width?: number;
  height?: number;
}

const PieChart = ({
  data,
  accessor,
  width = 200,
  height = 200,
}: PieChartProps) => {
  const config = useChartConfig();
  return (
    <RnckPieChart
      data={data}
      accessor={accessor}
      width={width}
      height={height}
      chartConfig={config}
      backgroundColor={'transparent'}
      paddingLeft={`${SPACING}`}
    />
  );
};

export default withAdaptiveView(PieChart);
