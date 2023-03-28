import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export enum Orientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

export const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export const isLandscape = () => {
  return !isPortrait();
};

export const getGraphWidth = () => {
  return Dimensions.get('screen').width;
};

export const getGraphHeight = (orientation = getOrientation()) => {
  const graphWidth = getGraphWidth();
  return orientation === Orientation.PORTRAIT
    ? graphWidth * 0.7
    : Dimensions.get('screen').height * 0.6;
};

export const getOrientation = () =>
  isPortrait() ? Orientation.PORTRAIT : Orientation.LANDSCAPE;

export const useOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());
  // TODO: figure out why this is necessary for Jest tests to pass...
  const addEventListener = Dimensions.addEventListener;
  useEffect(() => {
    const listener = addEventListener('change', () => {
      setOrientation(getOrientation());
    });
    return () => listener.remove();
  });
  return orientation;
};
