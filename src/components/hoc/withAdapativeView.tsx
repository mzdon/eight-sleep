import React, {useState, useCallback} from 'react';
import {LayoutChangeEvent, View} from 'react-native';

export interface AdaptiveChildProps {
  width: number;
}

export interface OptionalAdaptiveChildProps {
  width?: number;
}

const withAdaptiveView = <P extends object>(
  Component: ({width}: P & AdaptiveChildProps) => JSX.Element,
) => {
  const AdpativeView = (props: P & OptionalAdaptiveChildProps) => {
    const [width, setWidth] = useState(200);
    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setWidth(event.nativeEvent.layout.width);
    }, []);
    return (
      <View onLayout={onLayout}>
        <Component width={width} {...props} />
      </View>
    );
  };
  return AdpativeView;
};

export default withAdaptiveView;
