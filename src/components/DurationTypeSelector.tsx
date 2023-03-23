import React from 'react';
import {SegmentedButtons} from 'react-native-paper';
import {DurationType} from '../utils';

export interface DurationTypeSelectorProps {
  durationType: DurationType;
  selectDurationType: (durationType: DurationType) => void;
}

const DurationTypeSelector = ({
  durationType,
  selectDurationType,
}: DurationTypeSelectorProps) => {
  return (
    <SegmentedButtons
      value={durationType}
      onValueChange={value => selectDurationType(value as DurationType)}
      buttons={[
        {
          value: DurationType.DAY,
          label: 'Day',
        },
        {
          value: DurationType.WEEK,
          label: 'Week',
        },
      ]}
    />
  );
};

export default DurationTypeSelector;
