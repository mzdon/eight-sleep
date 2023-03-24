import chroma from 'chroma-js';
import {useTheme} from '.';

export const useChartConfig = () => {
  const {colors} = useTheme();
  const [r, g, b] = chroma(colors.primary).rgba();
  return {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(${r}, ${g}, ${b}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
};
