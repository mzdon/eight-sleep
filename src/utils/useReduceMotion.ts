import {useLayoutEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

export const useReduceMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  // use useLayoutEffect to call this as early as possible
  useLayoutEffect(() => {
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reduceMotionSetting => setReduceMotion(reduceMotionSetting),
    );
    return () => listener.remove();
  }, []);
  return reduceMotion;
};
