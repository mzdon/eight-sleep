import React from 'react';
import chroma from 'chroma-js';
import {StageEnum} from '../../api';
import {Theme, useTheme} from '../../theme';
import PieChart from '../PieChart';
import {SleepStagesChartData} from './types';

export interface SleepStagesPieChartProps {
  data: SleepStagesChartData;
}

const getPieChartData = (
  data: SleepStagesChartData,
  colors: Theme['colors'],
) => {
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
      duration: dataMap.get(StageEnum.OUT) ?? 0,
      color: `rgba(${r},${g},${b},0.2)`,
      legendFontColor,
    },
    {
      name: 'Awake',
      duration: dataMap.get(StageEnum.AWAKE) ?? 0,
      color: `rgba(${r},${g},${b},0.4)`,
      legendFontColor,
    },
    {
      name: 'Light',
      duration: dataMap.get(StageEnum.LIGHT) ?? 0,
      color: `rgba(${r},${g},${b},0.6)`,
      legendFontColor,
    },
    {
      name: 'Deep',
      duration: dataMap.get(StageEnum.DEEP) ?? 0,
      color: `rgba(${r},${g},${b},0.8)`,
      legendFontColor,
    },
  ];
};

const SleepStagesPieChart = ({data}: SleepStagesPieChartProps) => {
  const {colors} = useTheme();
  const pieData = getPieChartData(data, colors);
  return <PieChart data={pieData} accessor={'duration'} />;
};

export default SleepStagesPieChart;
