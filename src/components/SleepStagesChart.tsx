import chroma from 'chroma-js';
import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import {Stage, StageEnum} from '../api';
import {Theme} from '../theme/types';
import {Duration, DurationType} from '../utils';
import NoData from './NoData';
import PieChart from './PieChart';

type Data = [string, Stage[]][];

export interface SleepStagesChartProps {
  data: Data;
  duration: Duration;
  durationType: DurationType;
}

const getPieChartData = (data: Data, colors: Theme['colors']) => {
  const dataMap = new Map<StageEnum, number>();
  for (const d of data) {
    for (const {stage, duration} of d[1]) {
      const mapValue = dataMap.get(stage);
      if (mapValue) {
        dataMap.set(stage, mapValue + duration);
      } else {
        dataMap.set(stage, duration);
      }
    }
  }
  const legendFontColor = colors.onSurface;
  const [r, g, b] = chroma(colors.primary).rgb();
  return [
    {
      name: 'Out',
      duration: dataMap.get(StageEnum.OUT),
      color: `rgba(${r},${g},${b},0.2)`,
      legendFontColor,
    },
    {
      name: 'Awake',
      duration: dataMap.get(StageEnum.AWAKE),
      color: `rgba(${r},${g},${b},0.4)`,
      legendFontColor,
    },
    {
      name: 'Light',
      duration: dataMap.get(StageEnum.LIGHT),
      color: `rgba(${r},${g},${b},0.6)`,
      legendFontColor,
    },
    {
      name: 'Deep',
      duration: dataMap.get(StageEnum.DEEP),
      color: `rgba(${r},${g},${b},0.8)`,
      legendFontColor,
    },
  ];
};

const SleepStagesChart = ({data, durationType}: SleepStagesChartProps) => {
  const {colors} = useTheme();
  if (!data.length) {
    return <NoData />;
  }
  if (durationType === DurationType.DAY) {
    return (
      <Text variant="bodyMedium">
        {'// TODO: implement d3 line chart for this'}
      </Text>
    );
  }
  if (durationType === DurationType.WEEK) {
    const pieData = getPieChartData(data, colors);
    console.log(pieData);
    return <PieChart data={pieData} accessor={'duration'} />;
  }
  return <Text variant="bodyMedium">{JSON.stringify(data)}</Text>;
};

export default SleepStagesChart;
