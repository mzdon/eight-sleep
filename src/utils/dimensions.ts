import {Dimensions} from 'react-native';

export const getGraphWidth = () => {
  return Dimensions.get('window').width;
};

export const getGraphHeight = () => {
  return getGraphWidth() * 0.7;
};
